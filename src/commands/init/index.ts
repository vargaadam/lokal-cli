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
    const { apps: appsOptions } = this.lokalConfig;

    for (const workspaceOptions of this.selectedWorkspacesOptions) {
      const workspace = new Workspace(
        workspaceOptions,
        appsOptions,
        this.selectedWorkingDir
      );

      await workspace.initApps(flags.pull);
    }
  }
}
