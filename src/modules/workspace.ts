import path from "path";
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

const WORKING_DIR_NAME = ".lokal";

export class Workspace {
  private workingDir: string;

  constructor(
    private workspaceOptions: WorkspaceOptions,
    private appsOptions: AppOptions[]
  ) {
    this.workingDir = path.join(process.cwd(), WORKING_DIR_NAME);
  }

  async initApps() {
    const appsOptions = this.getWorkspaceAppsOptions();

    await Promise.all(
      appsOptions.map((appOptions) => {
        const workspaceAppOptions = this.getAppWorkspaceOptions(
          appOptions.name
        );

        return new App(appOptions, workspaceAppOptions).initRepository(
          this.workingDir
        );
      })
    );
  }

  async generateManifests() {
    const appsOptions = this.getWorkspaceAppsOptions();
    const manifestFileExtension = ".k8s.yaml";
    const manifestPath = `${this.workingDir}/${this.workspaceOptions.name}${manifestFileExtension}`;
    const manifestContainer = new ManifestContainer(
      this.workspaceOptions.name,
      { outdir: this.workingDir, outputFileExtension: manifestFileExtension }
    );
    const skaffold = new Skaffold([manifestPath]);

    await Promise.all(
      appsOptions.map(async (appOptions) => {
        const workspaceAppOptions = this.getAppWorkspaceOptions(
          appOptions.name
        );
        const appName = workspaceAppOptions.alias || appOptions.name;

        skaffold.init(
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

    manifestContainer.synth();
    skaffold.persist(`${this.workingDir}/skaffold.yaml`);
  }

  private getWorkspaceAppsOptions() {
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

  private getAppWorkspaceOptions(appName: string) {
    const workspaceAppOptions = this.workspaceOptions.apps.find(
      (workspaceAppOptions) => appName === workspaceAppOptions.name
    );

    if (!workspaceAppOptions) {
      throw new Error(
        `No application defined with the specified application name: ${appName}`
      );
    }

    return workspaceAppOptions;
  }
}
