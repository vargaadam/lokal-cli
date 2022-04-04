import { App, AppOptions } from "./app";

export interface WorkspaceOptions {
  name: string;
  apps: { name: string }[];
}

export class Workspace {
  constructor(
    private workspaceOptions: WorkspaceOptions,
    private appOptions: AppOptions[]
  ) {}

  async initApps() {
    const appsObject = this.appOptions.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: any });

    const workspaceApps = Object.keys(appsObject).filter((appName) => {
      return this.workspaceOptions.apps.find((app) => app.name === appName);
    });

    await Promise.all(
      workspaceApps.map((workspaceApp) => {
        const app = appsObject[workspaceApp];
        return new App(app).initRepositories();
      })
    );
  }
}
