import { App, AppOptions } from "./app";

export interface WorkspaceOptions {
  name: string;
  apps: AppOptions[];
}

export class Workspace {
  constructor(private workspaceOptions: WorkspaceOptions) {}

  async initApps() {
    await Promise.all(
      this.workspaceOptions.apps.map((appOptions) => {
        return new App(appOptions).initRepositories();
      })
    );
  }
}
