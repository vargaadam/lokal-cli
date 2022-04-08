import path from "path";
import { LokalConfig } from "../base-command";
import { Yaml } from "../content/base/yaml";
import { Skaffold } from "../content/skaffold";
import { getAppName } from "../utils";
import { AppOptions } from "./app";
import { Workspace, WorkspaceOptions } from "./workspace";

const CONFIG_FILE_NAME = "lokal.yaml";
const RESOURCES_FOLDER_NAME = ".lokal";

export class Lokal {
  private lokalConfig: LokalConfig;
  private skaffold: Skaffold;
  workingDirPath: string;
  resourcesFilePath: string;

  constructor(workingDir: string) {
    this.workingDirPath = path.join(process.cwd(), workingDir);

    const configFilePath = path.join(workingDir, CONFIG_FILE_NAME);
    this.lokalConfig = new Yaml(configFilePath).load();

    this.resourcesFilePath = path.join(
      this.workingDirPath,
      RESOURCES_FOLDER_NAME
    );

    this.skaffold = new Skaffold(this.resourcesFilePath);
  }

  async init(selectedWorkspaces: string[], isPull: boolean) {
    const [selectedWorkspacesOptions, selectedAppsOptions] =
      this.getSelectedOptions(selectedWorkspaces);

    for (const workspaceOptions of selectedWorkspacesOptions) {
      const workspace = new Workspace(workspaceOptions, selectedAppsOptions);

      await workspace.initApps(this.workingDirPath, isPull);
    }
  }

  async generate(selectedWorkspaces: string[]) {
    const [selectedWorkspacesOptions, selectedAppsOptions] =
      this.getSelectedOptions(selectedWorkspaces);

    await Promise.all(
      selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspace = new Workspace(workspaceOptions, selectedAppsOptions);

        const manifestContainer = await workspace.generateAppsManifests(
          this.resourcesFilePath
        );

        this.initWorkspaceAppsManifests(workspaceOptions, selectedAppsOptions);

        const manifestPath = `${this.resourcesFilePath}/${workspaceOptions.name}${manifestContainer.app.outputFileExtension}`;
        this.skaffold.addManifestsPath(manifestPath);
      })
    );

    this.initAppsManifests(selectedAppsOptions);

    this.skaffold.persist();
  }

  private initWorkspaceAppsManifests(
    workspaceOptions: WorkspaceOptions,
    appsOptions: AppOptions[]
  ) {
    workspaceOptions.apps.forEach((workspaceAppOptions) => {
      const foundAppOption = appsOptions.find(
        (appOption) => appOption.name === workspaceAppOptions.name
      );

      if (foundAppOption?.helm) {
        const valuesFiles = foundAppOption.helm.valuesFiles
          ? foundAppOption.helm.valuesFiles.map((valueFilePath) =>
              path.join(this.workingDirPath, valueFilePath)
            )
          : [];

        this.skaffold.addHelmRelease(
          getAppName(workspaceAppOptions),
          workspaceOptions.namespace,
          {
            ...foundAppOption.helm,
            valuesFiles,
          }
        );
      }

      if (
        foundAppOption?.manifests?.deployment &&
        workspaceAppOptions.portForward
      ) {
        this.skaffold.addPortForward({
          resourceName: getAppName(workspaceAppOptions),
          port: foundAppOption.manifests.deployment.port,
          localPort: workspaceAppOptions.portForward,
          namespace: workspaceOptions.namespace,
        });
      }
    });
  }

  private initAppsManifests(selectedAppsOptions: AppOptions[]) {
    selectedAppsOptions.forEach((usedAppOptions) => {
      if (usedAppOptions && usedAppOptions.build) {
        const context = usedAppOptions.repository?.localPath
          ? path.join(this.workingDirPath, usedAppOptions.repository.localPath)
          : usedAppOptions.build.context;

        this.skaffold.addArtifact({
          ...usedAppOptions.build,
          context,
        });
      }
    });
  }

  private getSelectedOptions(
    selectedWorkspaces: string[]
  ): [WorkspaceOptions[], AppOptions[]] {
    const { workspaces: workspacesOptions, apps: appsOptions } =
      this.lokalConfig;

    const selectedWorkspacesOptions = workspacesOptions.filter(
      (workspaceOptions) =>
        selectedWorkspaces.find(
          (workspace) => workspace === workspaceOptions.name
        )
    );

    const selectedWorkspaceAppsOptions = selectedWorkspacesOptions
      .map((workspaceOptions) => {
        return workspaceOptions.apps;
      })
      .flat();

    const selectedAppsOptions = appsOptions.filter(({ name: appName }) =>
      selectedWorkspaceAppsOptions.some(
        ({ name: workspaceAppName }) => appName === workspaceAppName
      )
    );

    return [selectedWorkspacesOptions, selectedAppsOptions];
  }
}
