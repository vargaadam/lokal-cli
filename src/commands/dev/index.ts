import BaseCommand from "../../base-command";
import { Workspace } from "../../workspace";

export default class Dev extends BaseCommand {
  static examples = ["$ lkl dev WORKING_DIR"];

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

    this.log("Starting to deploy...");

    await workspace.dev();
  }
}
