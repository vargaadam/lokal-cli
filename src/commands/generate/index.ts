import BaseCommand from "../../base-command";
import { Workspace } from "../../workspace";

export default class Generate extends BaseCommand {
  static examples = ["$ lkl generate WORKING_DIR"];

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

    await workspace.generateManifests();
  }
}
