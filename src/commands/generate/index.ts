import BaseCommand from "../../base-command";
import { AppOptions } from "../../modules/app";
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
    const { flags } = await this.parse(Generate);

    const { workspaces: workspacesOptions, apps: appsOptions } =
      this.lokalConfig;

    const selectedWorkspacesOptions = workspacesOptions.filter(
      (workspaceOptions) =>
        flags.workspaces.find(
          (workspace) => workspace === workspaceOptions.name
        )
    );

    await Promise.all(
      selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspaceAppsOptions =
          this.getWorkspaceAppsOptions(workspaceOptions);

        const workspace = new Workspace(
          workspaceOptions,
          workspaceAppsOptions,
          this.selectedWorkingDir
        );

        await workspace.generateManifests();
      })
    );
  }
}
