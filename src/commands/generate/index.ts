import BaseCommand from "../../base-command";
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
    await Promise.all(
      this.selectedWorkspacesOptions.map(async (workspaceOptions) => {
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
