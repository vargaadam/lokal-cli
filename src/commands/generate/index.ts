import path from "path";
import { Yaml } from "../../content/base/yaml";
import { Command, Flags } from "@oclif/core";
import { Manifests } from "../../manifests";
import { Workspace, WorkspaceOptions } from "../../modules/workspace";
import { AppOptions } from "../../modules/app";

interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

const CONFIG_FILE_NAME = "lokal.yaml";

export default class Generate extends Command {
  static examples = ["$ lkl generate --workspace"];

  static flags = {
    workspace: Flags.string({ char: "w" }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Generate);

    const configFilePath = path.join(process.cwd(), CONFIG_FILE_NAME);
    const { workspaces, apps } = new Yaml<LokalConfig>(configFilePath).parse();

    const filteredWorkspace = flags.workspace
      ? workspaces.filter((workspace) => workspace.name === flags.workspace)
      : workspaces;

    Promise.all(
      filteredWorkspace.map((workspace) =>
        new Workspace(workspace, apps).generateManifests()
      )
    );
  }
}
