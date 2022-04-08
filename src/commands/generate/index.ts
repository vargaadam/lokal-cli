import BaseCommand from "../../base-command";
import { Lokal } from "../../modules/lokal";

export default class Generate extends BaseCommand {
  static examples = [
    "$ lkl generate DIRECTORY --workspaces WORKSPACE1 WORKSPACE2",
  ];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [...BaseCommand.args];

  async run() {
    const { flags, args } = await this.parse(Generate);

    this.log("Generating manifests!");

    await new Lokal(args.workingDir).generate(flags.workspaces);

    this.log("Generation is complete!");
  }
}
