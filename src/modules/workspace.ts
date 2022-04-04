import { ManifestContainer } from "../manifests/container";
import { App, AppOptions } from "./app";

export interface WorkspaceAppOptions {
  name: string;
  alias?: string;
  portForward?: number;
}

export interface WorkspaceOptions {
  name: string;
  apps: WorkspaceAppOptions[];
}

export class Workspace {
  constructor(
    private workspaceOptions: WorkspaceOptions,
    private appsOptions: AppOptions[]
  ) {}

  async initApps() {
    const appsOptions = this.getWorkspaceApps();

    await Promise.all(
      appsOptions.map((appOptions) => {
        const additionalAppOptions = this.workspaceOptions.apps.find(
          (workspaceAppOptions) => appOptions.name === workspaceAppOptions.name
        );

        return new App(appOptions, additionalAppOptions!).initRepository();
      })
    );
  }

  async generateManifests() {
    const appsOptions = this.getWorkspaceApps();
    const manifestContainer = new ManifestContainer(this.workspaceOptions.name);

    await Promise.all(
      appsOptions
        .filter((appOptions) => appOptions.manifests)
        .map((appOptions) => {
          const additionalAppOptions = this.workspaceOptions.apps.find(
            (workspaceAppOptions) =>
              workspaceAppOptions.name === appOptions.name
          );

          return new App(appOptions, additionalAppOptions!).initManifests(
            manifestContainer
          );
        })
    );

    manifestContainer.synth();
  }

  private getWorkspaceApps() {
    const appsOptionsObject = this.appsOptions.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: AppOptions });

    const workspaceAppsOptions = Object.keys(appsOptionsObject)
      .filter((appName) =>
        this.workspaceOptions.apps.find((app) => app.name === appName)
      )
      .map((workspaceApp) => appsOptionsObject[workspaceApp]);

    return workspaceAppsOptions;
  }
}
