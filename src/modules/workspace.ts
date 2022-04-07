import { ManifestContainer } from "./manifests/container";
import { App, AppOptions } from "./app";
import { Skaffold } from "../content/skaffold";

export interface WorkspaceAppOptions {
  name: string;
  alias?: string;
  portForward?: number;
}

export interface WorkspaceOptions {
  name: string;
  namespace: string;
  apps: WorkspaceAppOptions[];
}

export class Workspace {
  constructor(
    private workspaceOptions: WorkspaceOptions,
    private appsOptions: AppOptions[],
    private workingDir: string
  ) {}

  async initApps(fetch: boolean) {
    await Promise.all(
      this.appsOptions.map((appOptions) => {
        const workspaceAppOptions = this.getAppWorkspaceOptions(
          appOptions.name
        );

        return new App(appOptions, workspaceAppOptions).initRepository(
          this.workingDir,
          fetch
        );
      })
    );
  }

  async generateManifests() {
    const manifestFileExtension = ".k8s.yaml";
    const manifestPath = `${this.workingDir}/${this.workspaceOptions.name}${manifestFileExtension}`;
    const manifestContainer = new ManifestContainer(
      this.workspaceOptions.name,
      this.workspaceOptions.namespace,
      { outdir: this.workingDir, outputFileExtension: manifestFileExtension }
    );
    const skaffold = new Skaffold([manifestPath]);

    await Promise.all(
      this.appsOptions.map(async (appOptions) => {
        const workspaceAppOptions = this.getAppWorkspaceOptions(
          appOptions.name
        );
        const appName = workspaceAppOptions.alias || appOptions.name;

        skaffold.initApp(
          appName,
          this.workspaceOptions,
          appOptions,
          workspaceAppOptions
        );

        if (appOptions.manifests) {
          await new App(appOptions, workspaceAppOptions).initManifests(
            appName,
            manifestContainer
          );
        }
      })
    );

    manifestContainer.app.synth();
    skaffold.persist(`${this.workingDir}/skaffold.yaml`);
  }

  private getAppWorkspaceOptions(appName: string) {
    const foundWorkspaceAppOptions = this.workspaceOptions.apps.find(
      (workspaceAppOptions) => appName === workspaceAppOptions.name
    );

    if (!foundWorkspaceAppOptions) {
      throw new Error(
        `No application defined with the specified application name: ${appName}`
      );
    }

    return foundWorkspaceAppOptions;
  }
}
