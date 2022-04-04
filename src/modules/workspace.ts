import { Manifests } from "../manifests";
import { App, AppOptions } from "./app";

export interface WorkspaceOptions {
  name: string;
  apps: { name: string }[];
}

export class Workspace {
  constructor(
    private workspace: WorkspaceOptions,
    private apps: AppOptions[]
  ) {}

  async initApps() {
    const workspaceApps = this.getWorkspaceApps();

    await Promise.all(
      workspaceApps.map((workspaceApp) =>
        new App(workspaceApp).initRepositories()
      )
    );
  }

  async generateManifests() {
    const workspaceApps = this.getWorkspaceApps();

    const manifest = new Manifests(this.workspace.name);

    await Promise.all(
      workspaceApps
        .filter((workspaceApp) => workspaceApp.manifests)
        .map((filteredWorkspaceApp) =>
          manifest.synth(
            filteredWorkspaceApp.name,
            filteredWorkspaceApp.manifests
          )
        )
    );
  }

  private getWorkspaceApps() {
    const appsObject = this.apps.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: AppOptions });

    const workspaceApps = Object.keys(appsObject)
      .filter((appName) =>
        this.workspace.apps.find((app) => app.name === appName)
      )
      .map((workspaceApp) => appsObject[workspaceApp]);

    return workspaceApps;
  }
}
