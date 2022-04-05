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
    const appsOptions = this.getWorkspaceApps();

    await Promise.all(
      appsOptions
        .filter((appOptions) => appOptions.repository)
        .map((appOptions) => {
          const additionalAppOptions = this.workspaceOptions.apps.find(
            (workspaceAppOptions) =>
              appOptions.name === workspaceAppOptions.name
          );

          return new App(appOptions, additionalAppOptions!).initRepository(
            this.workingDir
          );
        })
    );
  }

  async generateManifests() {
    const appsOptions = this.getWorkspaceApps();
    const manifestFileExtension = ".k8s.yaml";
    const manifestContainer = new ManifestContainer(
      this.workspaceOptions.name,
      { outdir: this.workingDir, outputFileExtension: manifestFileExtension }
    );
    const skaffold = new Skaffold([
      `${this.workingDir}/${this.workspaceOptions.name}${manifestFileExtension}`,
    ]);

    await Promise.all(
      appsOptions
        .filter((appOptions) => appOptions.manifests)
        .map((appOptions) => {
          const additionalAppOptions = this.workspaceOptions.apps.find(
            (workspaceAppOptions) =>
              workspaceAppOptions.name === appOptions.name
          );

          const appName = additionalAppOptions?.alias || appOptions.name;

          skaffold.addArtifact(appOptions.build);

          if (additionalAppOptions && additionalAppOptions.portForward) {
            skaffold.addPortForward({
              resourceName: appName,
              port: appOptions.manifests!.deployment!.port,
              localPort: additionalAppOptions.portForward,
              namespace: "default",
            });
          }

          return new App(appOptions, additionalAppOptions!).initManifests(
            appName,
            manifestContainer
          );
        })
    );

    manifestContainer.synth();
    skaffold.persist(`${this.workingDir}/skaffold.yaml`);
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
