import { Flags } from "@oclif/core";
import BaseCommand from "../../base-command";
import { SKAFFOLD_COMMANDS } from "../../content/skaffold";
import { Workspace } from "../../workspace";

export default class Deploy extends BaseCommand {
  static examples = ["$ lkl deploy WORKING_DIR"];

  static flags = {
    ...BaseCommand.flags,
    "skip-generate": Flags.boolean({ default: false }),
  };

  static args = [...BaseCommand.args];

  async run() {
    const { flags } = await this.parse(Deploy);

    const workspace = new Workspace(
      this.workingDir,
      this.outDir,
      this.workspaceConfigFilePath
    );

    if (!flags["skip-generate"]) {
      this.log("Generating manifests...");

      await workspace.generateManifests(this.outDir);
    }

    this.log("Starting to deploy...");

    await workspace.runSkaffold(
      SKAFFOLD_COMMANDS.DEPLOY,
      "--port-forward=user",
      "--namespace=test"
    );
  }
}
