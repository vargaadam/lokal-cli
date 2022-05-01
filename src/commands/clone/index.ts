import BaseCommand from "../../base-command";
import { CliUx, Flags } from "@oclif/core";
import { Workspace } from "../../workspace";

export default class Clone extends BaseCommand {
  static examples = ["$ lkl clone WORKING_DIR"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run() {
    const { flags } = await this.parse(Clone);

    this.log();

    const workspace = new Workspace(
      this.workingDir,
      this.outDir,
      this.workspaceConfigFilePath
    );

    CliUx.ux.config.action.start("Initializing repositories...");

    await workspace.cloneApps(flags.pull);

    CliUx.ux.config.action.stop("done");
  }
}
