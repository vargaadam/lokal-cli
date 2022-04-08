import path from "path";
import { WorkspaceCommand } from "../../base-command";
import { Skaffold } from "../../content/skaffold";
import { Workspace } from "../../modules/workspace";
import { getAppName } from "../../utils";

export default class Generate extends WorkspaceCommand {
  static examples = [
    "$ lkl generate DIRECTORY --workspaces WORKSPACE1 WORKSPACE2",
  ];

  static args = [...WorkspaceCommand.args];

  static flags = {
    ...WorkspaceCommand.flags,
  };

  async run() {
    const { apps: appsOptions } = this.lokalConfig;

    const skaffold = new Skaffold();
    const inUsedApps = new Set<string>();

    await Promise.all(
      this.selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspace = new Workspace(
          workspaceOptions,
          appsOptions,
          this.distFilePath
        );

        workspaceOptions.apps.forEach((workspaceAppOptions) => {
          inUsedApps.add(workspaceAppOptions.name);

          const foundAppOption = appsOptions.find(
            (appOption) => appOption.name === workspaceAppOptions.name
          );

          if (foundAppOption?.helm) {
            const valuesFiles = foundAppOption.helm.valuesFiles
              ? foundAppOption.helm.valuesFiles.map((valueFilePath) =>
                  path.join(this.workingDirPath, valueFilePath)
                )
              : [];

            skaffold.addHelmRelease(
              getAppName(workspaceAppOptions),
              workspaceOptions.namespace,
              {
                ...foundAppOption.helm,
                valuesFiles,
              }
            );

            if (
              foundAppOption?.manifests?.deployment &&
              workspaceAppOptions.portForward
            ) {
              skaffold.addPortForward({
                resourceName: getAppName(workspaceAppOptions),
                port: foundAppOption.manifests.deployment.port,
                localPort: workspaceAppOptions.portForward,
                namespace: workspaceOptions.namespace,
              });
            }
          }
        });

        const manifestContainer = await workspace.initAppsManifests();
        manifestContainer.app.synth();

        const manifestPath = `${this.distFilePath}/${workspaceOptions.name}${manifestContainer.app.outputFileExtension}`;
        skaffold.addManifestsPath(manifestPath);
      })
    );

    inUsedApps.forEach((inUsedApp) => {
      const foundAppOption = appsOptions.find(
        (appOption) => appOption.name === inUsedApp
      );

      if (foundAppOption && foundAppOption.build) {
        const context = foundAppOption.repository?.localPath
          ? path.join(this.workingDirPath, foundAppOption.repository.localPath)
          : foundAppOption.build.context;

        skaffold.addArtifact({
          ...foundAppOption.build,
          context,
        });
      }
    });

    skaffold.persist(this.skaffoldFilePath);
  }
}
