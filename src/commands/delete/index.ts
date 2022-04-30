import BaseCommand from "../../base-command";
import { SKAFFOLD_COMMANDS } from "../../content/skaffold";
import { Workspace } from "../../workspace";

export default class Delete extends BaseCommand {
  static examples = ["$ lkl delete WORKING_DIR"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [...BaseCommand.args];

  async run() {
    const workspace = new Workspace(
      this.workingDir,
      this.outDir,
      this.workspaceConfigFilePath
    );

    this.log("Generating manifests...");

    await workspace.generateManifests(this.outDir);

    this.log("Starting to delete...");

    await workspace.runSkaffold(SKAFFOLD_COMMANDS.DELETE);
  }
}
