import { Workspace } from "../../modules/workspace";
import BaseCommand from "../../base-command";
import { Flags } from "@oclif/core";

export default class Init extends BaseCommand {
  static examples = ["$ lkl init DIRECTORY --workspace WORKSPACE"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Init);

    await Promise.all(
      this.selectedWorkspacesOptions.map(async (workspaceOptions) => {
        const workspaceAppsOptions =
          this.getWorkspaceAppsOptions(workspaceOptions);

        const workspace = new Workspace(
          workspaceOptions,
          workspaceAppsOptions,
          this.selectedWorkingDir
        );

        await workspace.initApps(flags.pull);
      })
    );
  }
}
