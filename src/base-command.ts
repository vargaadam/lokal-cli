import path from "path";
import { Command, Flags } from "@oclif/core";
import { Yaml } from "./content/base/yaml";
import { AppOptions } from "./modules/app";
import { WorkspaceOptions } from "./modules/workspace";

interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

const CONFIG_FILE_NAME = "lokal.yaml";

export default abstract class BaseCommand extends Command {
  protected selectedWorkspace!: string;
  protected lokalConfig!: LokalConfig;
  protected workingDir!: string;

  static flags = {
    workspace: Flags.string({ char: "w", required: true }),
  };

  static args = [{ name: "workingDir", required: true }];

  async init() {
    const { flags, args } = await this.parse(BaseCommand);

    this.workingDir = args.workingDir;

    const configFilePath = path.join(process.cwd(), CONFIG_FILE_NAME);
    this.lokalConfig = new Yaml().load(configFilePath);

    this.selectedWorkspace = flags.workspace;
  }
}
