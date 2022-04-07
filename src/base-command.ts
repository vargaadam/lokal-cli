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

const CONFIG_FILE_NAME = "lokal.yaml";

export default abstract class BaseCommand extends Command {
  protected lokalConfig!: LokalConfig;
  protected selectedWorkingDir!: string;

  static strict = false;

  static flags = {
    workspaces: Flags.string({ char: "w", required: true, multiple: true }),
  };

  static args = [{ name: "workingDir", required: true }];

  async init() {
    const { args } = await this.parse(BaseCommand);

    this.selectedWorkingDir = path.join(process.cwd(), args.workingDir);

    const configFilePath = path.join(this.selectedWorkingDir, CONFIG_FILE_NAME);
    this.lokalConfig = new Yaml().load(configFilePath);
  }

  protected getWorkspaceAppsOptions(workspace: WorkspaceOptions) {
    const { apps: appsOptions } = this.lokalConfig;

    const appsOptionsObject = appsOptions.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: AppOptions });

    const workspaceAppsOptions: AppOptions[] = [];

    workspace.apps.forEach((workspaceApp) => {
      const foundApp = Object.keys(appsOptionsObject).find((appName) => {
        return workspaceApp.name === appName;
      });

      if (!foundApp) {
        throw new Error(
          `No application defined with the specified application name: ${workspaceApp.name}`
        );
      }

      workspaceAppsOptions.push(appsOptionsObject[foundApp]);
    });

    return workspaceAppsOptions;
  }
}
