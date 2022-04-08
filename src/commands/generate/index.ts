import path from "path";
import BaseCommand from "../../base-command";
import { Skaffold } from "../../content/skaffold";
import { Workspace } from "../../modules/workspace";

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

    const skaffold = new Skaffold();
    const inUsedApps = new Set<string>();

    await Promise.all(
      this.selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspace = new Workspace(
          workspaceOptions,
          appsOptions,
          this.workingDir
        );

        workspaceOptions.apps.forEach((workspaceAppOptions) => {
          inUsedApps.add(workspaceAppOptions.name);

          const foundAppOption = appsOptions.find(
            (appOption) => appOption.name === workspaceAppOptions.name
          );

          if (foundAppOption) {
            skaffold.initApp(
              workspaceOptions.namespace,
              workspaceAppOptions,
              foundAppOption
            );
          }
        });

        const manifestContainer = await workspace.initAppsManifests();
        manifestContainer.app.synth();

        const manifestPath = `${this.workingDir}/${workspaceOptions.name}${manifestContainer.app.outputFileExtension}`;
        skaffold.addManifestsPath(manifestPath);
      })
    );

    inUsedApps.forEach((inUsedApp) => {
      const foundAppOption = appsOptions.find(
        (appOption) => appOption.name === inUsedApp
      );

      if (foundAppOption && foundAppOption.build) {
        skaffold.addArtifact({
          context: foundAppOption.repository?.localPath,
          ...foundAppOption.build,
        });
      }
    });

    const skaffoldPath = path.join(this.workingDir, "skaffold.yaml");
    skaffold.persist(skaffoldPath);
  }
}
