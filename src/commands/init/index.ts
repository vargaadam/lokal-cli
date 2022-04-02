import path from "path";
import { Yaml } from "../../content/yaml";
import { Workspace } from "../../workspace";
import { Command, Flags } from "@oclif/core";
import { WorkspaceOptions } from "../../workspace";

interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
}

const CONFIG_FILE_NAME = "lokal.yaml";

export default class Init extends Command {
  static description = "Say hello";

  static examples = ["$ lkl init --workspace"];

  static flags = {
    workspace: Flags.string({ char: "w" }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Init);

    const configFilePath = path.join(process.cwd(), CONFIG_FILE_NAME);
    const { workspaces } = new Yaml<LokalConfig>(configFilePath).parse();

    const filteredWorkspace = flags.workspace
      ? workspaces.filter((workspace) => workspace.name === flags.workspace)
      : workspaces;

    await Promise.all(
      filteredWorkspace.map((workspace) => {
        return new Workspace(workspace).initApps();
      })
    );
  }
}
