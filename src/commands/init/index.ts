import BaseCommand from "../../base-command";
import { Flags } from "@oclif/core";
import { Workspace } from "../../workspace";

export default class Init extends BaseCommand {
  static examples = ["$ lkl init WORKING_DIR"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run() {
    const { flags } = await this.parse(Init);

    this.log("Initializing repositories...");

    const workspace = new Workspace(
      this.workingDir,
      this.outDir,
      this.workspaceConfigFilePath
    );
    await workspace.initApps(flags.pull);
  }
}
