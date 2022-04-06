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

export class Workspace {
  constructor(
    private workspaceOptions: WorkspaceOptions,
    private appsOptions: AppOptions[],
    private workingDir: string
  ) {
    this.workingDir = path.join(process.cwd(), workingDir);
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

    manifestContainer.synth();
    skaffold.persist(`${this.workingDir}/skaffold.yaml`);
  }

  private getWorkspaceAppsOptions() {
    const appsOptionsObject = this.appsOptions.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: AppOptions });

    const workspaceAppsOptions: AppOptions[] = [];

    this.workspaceOptions.apps.forEach((workspaceApp) => {
      const foundApp = Object.keys(appsOptionsObject).find((appName) => {
        return workspaceApp.name === appName;
      });

      if (!foundApp) {
        throw new Error(
          `No application defined with the specified application name: ${workspaceApp.name}`
        );
      }

      workspaceAppsOptions.push(appsOptionsObject[foundApp]);
    });

    return workspaceAppsOptions;
  }

  private getAppWorkspaceOptions(appName: string) {
    return this.workspaceOptions.apps.find(
      (workspaceAppOptions) => appName === workspaceAppOptions.name
    ) as WorkspaceAppOptions;
  }
}
