import { Command, Flags } from "@oclif/core";
import path from "path";

const CONFIG_FILE_NAME = ".lokal";
const OUTPUT_DIR_NAME = ".lokal";

export default abstract class BaseCommand extends Command {
  workingDir!: string;
  workspaceConfigFilePath!: string;
  outDir!: string;

  static strict = false;

  static args = [{ name: "workingDir", required: true }];

  static flags = {
    workspace: Flags.string({
      char: "w",
      default: CONFIG_FILE_NAME,
      required: false,
      description: "The workspace config file name",
    }),
    outDir: Flags.string({
      char: "o",
      default: OUTPUT_DIR_NAME,
      required: false,
      description: "The directory of the generated manifests",
    }),
  };

  async init() {
    const { flags, args } = await this.parse(BaseCommand);

    this.workingDir = path.join(process.cwd(), args.workingDir);
    this.workspaceConfigFilePath = path.join(this.workingDir, flags.workspace);
    this.outDir = path.join(this.workingDir, flags.outDir);
  }
}
