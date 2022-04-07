import { ManifestContainer } from "./manifests/container";
import { App, AppOptions } from "./app";

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

  async initApps(isPull: boolean) {
    const optionsMap = this.getOptionsMap();

    optionsMap.forEach(async (appOptions, workspaceAppOptions) => {
      const app = new App(appOptions, workspaceAppOptions);

      await app.initRepository(this.workingDir, isPull);
    });
  }

  async generateAppsManifests() {
    const MANIFEST_FILE_EXTENSION_NAME = ".k8s.yaml";

    const manifestContainer = new ManifestContainer(
      this.workspaceOptions.name,
      this.workspaceOptions.namespace,
      {
        outdir: this.workingDir,
        outputFileExtension: MANIFEST_FILE_EXTENSION_NAME,
      }
    );

    const optionsMap = this.getOptionsMap();

    optionsMap.forEach(async (appOptions, workspaceAppOptions) => {
      const app = new App(appOptions, workspaceAppOptions);

      await app.initManifests(manifestContainer);
    });

    return manifestContainer;
  }

  private getOptionsMap() {
    const appsOptionsObject = this.appsOptions.reduce((act, current) => {
      act[current.name] = current;
      return act;
    }, {} as { [kes: string]: AppOptions });

    const appOptionsMap = new Map<WorkspaceAppOptions, AppOptions>();

    this.workspaceOptions.apps.forEach((workspaceApp) => {
      const foundApp = Object.keys(appsOptionsObject).find((appName) => {
        return workspaceApp.name === appName;
      });

      if (!foundApp) {
        throw new Error(
          `No application defined with the specified application name: ${workspaceApp.name}`
        );
      }

      appOptionsMap.set(workspaceApp, appsOptionsObject[foundApp]);
    });

    return appOptionsMap;
  }
}
