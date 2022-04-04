import path from "path";
import { Yaml } from "../../content/yaml";
import { Command, Flags } from "@oclif/core";
import { Manifest } from "../../manifests";
import { WorkspaceOptions } from "../../modules/workspace";
import { AppOptions } from "../../modules/app";

interface LokalConfig {
  name: string;
  workspaces: WorkspaceOptions[];
  apps: AppOptions[];
}

const CONFIG_FILE_NAME = "lokal.yaml";

export default class Generate extends Command {
  static examples = ["$ lkl generate"];

  async run(): Promise<void> {
    const configFilePath = path.join(process.cwd(), CONFIG_FILE_NAME);
    const { workspaces, apps } = new Yaml<LokalConfig>(configFilePath).parse();

    const appsObject = apps.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: any });

    const workspaceMap = new Map<string, string[]>();

    workspaces.forEach((workspace) => {
      const workspaceApps = Object.keys(appsObject).filter((appName) =>
        workspace.apps.find((app) => app.name === appName)
      );

      workspaceMap.set(workspace.name, workspaceApps);
    });

    for await (const entry of workspaceMap.entries()) {
      const workspaceName = entry[0];
      const workspaceApps = entry[1];

      const manifest = new Manifest(workspaceName);

      workspaceApps.forEach((appName, i) => {
        const app = appsObject[appName] as AppOptions;
        manifest.generate(appName, app.manifests);
      });
    }
  }
}
