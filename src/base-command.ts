import path from "path";
import { Command, Flags } from "@oclif/core";
import { Yaml } from "./content/base/yaml";
import { AppOptions } from "./modules/app";
import { WorkspaceAppOptions, WorkspaceOptions } from "./modules/workspace";
import { string } from "@oclif/core/lib/flags";

export interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

const CONFIG_FILE_NAME = "lokal.yaml";

export default abstract class BaseCommand extends Command {
  protected lokalConfig!: LokalConfig;
  protected selectedWorkingDir!: string;
  protected selectedWorkspacesOptions!: WorkspaceOptions[];

  static strict = false;

  static flags = {
    workspaces: Flags.string({ char: "w", required: true, multiple: true }),
  };

  static args = [{ name: "workingDir", required: true }];

  async init() {
    const { args, flags } = await this.parse(BaseCommand);

    this.selectedWorkingDir = path.join(process.cwd(), args.workingDir);

    const configFilePath = path.join(this.selectedWorkingDir, CONFIG_FILE_NAME);
    this.lokalConfig = new Yaml().load(configFilePath);

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
