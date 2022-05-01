import BaseCommand from "../../base-command";
import { Workspace } from "../../workspace";
import { CliUx } from "@oclif/core";
import color from "@oclif/color";
import path from "path";

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

    CliUx.ux.config.action.start("Generating manifests");

    await workspace.generateManifests();

    CliUx.ux.action.stop("done");

    const relativeSkaffoldFilePath = path.relative(
      process.cwd(),
      workspace.skaffold.filePath
    );

    CliUx.ux.log(
      color.gray("To start your local deployment run the following command:")
    );
    CliUx.ux.log(
      color.blueBright(`skaffold dev -f ${relativeSkaffoldFilePath}`)
    );
    CliUx.ux.log(color.grey("Or you can deploy your resources with:"));
    CliUx.ux.log(
      color.blueBright(
        `skaffold deploy -f ${relativeSkaffoldFilePath} --port-forward=user`
      )
    );
    CliUx.ux.log(color.gray("More Info:", "https://skaffold.dev/docs/"));
  }
}
