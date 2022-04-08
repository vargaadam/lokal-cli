import BaseCommand from "../../base-command";
import { Flags } from "@oclif/core";
import { Lokal } from "../../modules/lokal";

export default class Init extends BaseCommand {
  static examples = ["$ lkl init DIRECTORY --workspaces WORKSPACE"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run() {
    const { flags, args } = await this.parse(Init);

    this.log("Initializing!");

    await new Lokal(args.workingDir).init(flags.workspaces, flags.pull);

    this.log("Initialization is complete!");
  }
}
