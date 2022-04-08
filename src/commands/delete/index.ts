import BaseCommand from "../../base-command";
import { Skaffold } from "../../content/skaffold";
import { Lokal } from "../../modules/lokal";

export default class Delete extends BaseCommand {
  static examples = [
    "$ lkl delete DIRECTORY --workspaces WORKSPACE1 WORKSPACE2",
  ];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [...BaseCommand.args];

  async run() {
    const { flags, args } = await this.parse(Delete);

    const lokal = new Lokal(args.workingDir);

    this.log("Initializing");

    await lokal.init(flags.workspaces, false);

    this.log("Generating manifests");

    await lokal.generate(flags.workspaces);

    const skaffold = new Skaffold(lokal.resourcesFilePath);

    this.log("Starting to delete");

    skaffold.runDelete();
  }
}
