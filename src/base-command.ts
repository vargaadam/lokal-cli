import { Command, Flags } from "@oclif/core";
import { AppOptions } from "./modules/app";
import { WorkspaceOptions } from "./modules/workspace";

export interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

export default abstract class BaseCommand extends Command {
  static strict = false;

  static args = [{ name: "workingDir", required: true }];

  static flags = {
    workspaces: Flags.string({ char: "w", multiple: true, required: true }),
  };
}
