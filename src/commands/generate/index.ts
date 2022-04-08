import path from "path";
import BaseCommand from "../../base-command";
import { Skaffold } from "../../content/skaffold";
import { Workspace } from "../../modules/workspace";
import { getAppName } from "../../utils";

export default class Generate extends BaseCommand {
  static examples = [
    "$ lkl generate DIRECTORY --workspace WORKSPACE1 WORKSPACE2",
  ];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
  };

  async run(): Promise<void> {
    const { apps: appsOptions } = this.lokalConfig;

    const manifestsDir = path.join(this.workingDir, ".lokal");

    const skaffold = new Skaffold();
    const inUsedApps = new Set<string>();

    await Promise.all(
      this.selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspace = new Workspace(
          workspaceOptions,
          appsOptions,
          manifestsDir
        );

        workspaceOptions.apps.forEach((workspaceAppOptions) => {
          inUsedApps.add(workspaceAppOptions.name);

          const foundAppOption = appsOptions.find(
            (appOption) => appOption.name === workspaceAppOptions.name
          );

          if (foundAppOption?.helm) {
            const valuesFiles = foundAppOption.helm.valuesFiles
              ? foundAppOption.helm.valuesFiles.map((valueFilePath) =>
                  path.join(this.workingDir, valueFilePath)
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

        const manifestPath = `${manifestsDir}/${workspaceOptions.name}${manifestContainer.app.outputFileExtension}`;
        skaffold.addManifestsPath(manifestPath);
      })
    );

    inUsedApps.forEach((inUsedApp) => {
      const foundAppOption = appsOptions.find(
        (appOption) => appOption.name === inUsedApp
      );

      if (foundAppOption && foundAppOption.build) {
        const context = foundAppOption.repository?.localPath
          ? path.join(this.workingDir, foundAppOption.repository.localPath)
          : foundAppOption.build.context;

        skaffold.addArtifact({
          ...foundAppOption.build,
          context,
        });
      }
    });

    const skaffoldPath = path.join(manifestsDir, "skaffold.yaml");
    skaffold.persist(skaffoldPath);
  }
}
