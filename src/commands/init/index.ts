import { Workspace } from "../../modules/workspace";
import { WorkspaceCommand } from "../../base-command";
import { Flags } from "@oclif/core";

export default class Init extends WorkspaceCommand {
  static examples = ["$ lkl init DIRECTORY --workspaces WORKSPACE"];

  static args = [...WorkspaceCommand.args];

  static flags = {
    ...WorkspaceCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run() {
    const { flags } = await this.parse(Init);
    const { apps: appsOptions } = this.lokalConfig;

    for (const workspaceOptions of this.selectedWorkspacesOptions) {
      const workspace = new Workspace(
        workspaceOptions,
        appsOptions,
        this.workingDirPath
      );

      await workspace.initApps(flags.pull);
    }
  }
}
