import path from "path";
import { Command, Flags } from "@oclif/core";
import { Yaml } from "./content/base/yaml";
import { AppOptions } from "./modules/app";
import { WorkspaceOptions } from "./modules/workspace";

export interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

const SKAFFOLD_FILE_NAME = "skaffold.yaml";
const CONFIG_FILE_NAME = "lokal.yaml";
const DIST_FOLDER_NAME = ".lokal";

export abstract class BaseCommand extends Command {
  protected lokalConfig!: LokalConfig;
  protected workingDirPath!: string;
  protected skaffoldFilePath!: string;
  protected distFilePath!: string;

  static strict = false;

  static args = [{ name: "workingDir", required: true }];

  async init() {
    const { args } = await this.parse(BaseCommand);

    this.workingDirPath = path.join(process.cwd(), args.workingDir);
    this.distFilePath = path.join(this.workingDirPath, DIST_FOLDER_NAME);
    this.skaffoldFilePath = path.join(this.distFilePath, SKAFFOLD_FILE_NAME);

    const configFilePath = path.join(this.workingDirPath, CONFIG_FILE_NAME);
    this.lokalConfig = new Yaml().load(configFilePath);
  }
}

export abstract class WorkspaceCommand extends BaseCommand {
  protected selectedWorkspacesOptions!: WorkspaceOptions[];

  static strict = false;

  static flags = {
    ...BaseCommand.flags,
    workspaces: Flags.string({ char: "w", multiple: true, required: true }),
  };

  async init() {
    await super.init();
    const { flags } = await this.parse(WorkspaceCommand);

    this.selectedWorkspacesOptions = this.getSelectedWorkspacesOptions(
      flags.workspaces
    );
  }

  private getSelectedWorkspacesOptions(workspaces: string[]) {
    const { workspaces: workspacesOptions } = this.lokalConfig;

    return workspacesOptions.filter((workspaceOptions) =>
      workspaces.find((workspace) => workspace === workspaceOptions.name)
    );
  }
}
