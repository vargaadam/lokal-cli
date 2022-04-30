import path, { join } from "path";
import * as k from "cdk8s";
import { Yaml } from "../content/base/yaml";
import { ManifestContainer } from "../app/manifests";
import { Skaffold } from "../content/skaffold";
import { HelmRelease, HelmReleaseOptions } from "./helm";
import { WorkspaceApp, WorkspaceAppOptions } from "./app";

export interface WorkspacePortForwardOptions {
  localPort: number;
  port?: number;
  resourceType?: string;
  resourceName?: string;
}

export interface CommonWorkspaceOptions<T> {
  name: string;
  groups?: string[];
  portForward?: WorkspacePortForwardOptions[];
  spec: T;
}

export interface WorkspaceHelmReleasesOptions
  extends CommonWorkspaceOptions<HelmReleaseOptions> {}

export interface WorkspaceAppsOptions
  extends CommonWorkspaceOptions<WorkspaceAppOptions> {
  lokalFile?: string;
}

export interface WorkspaceOptions {
  version: string;
  kind: string;
  name: string;
  namespace: string;
  apps?: WorkspaceAppsOptions[];
  helmReleases?: WorkspaceHelmReleasesOptions[];
}

const SKAFFOLD_FILE_NAME = "skaffold.yaml";

export class Workspace extends Yaml<WorkspaceOptions> {
  workingDir: string;
  outDir: string;
  options: WorkspaceOptions;
  skaffold: Skaffold;

  constructor(
    workingDir: string,
    outDir: string,
    workspaceConfigFilePath: string
  ) {
    super(workspaceConfigFilePath);
    this.workingDir = workingDir;
    this.outDir = outDir;
    this.options = this.load();
    const skaffoldFilePath = path.join(
      outDir,
      this.options.name.concat(".", SKAFFOLD_FILE_NAME)
    );
    this.skaffold = new Skaffold(skaffoldFilePath);
  }

  async cloneApps(isPull: boolean) {
    for (const workspaceAppsOptions of this.options.apps || []) {
      const workspaceApp = new WorkspaceApp(
        workspaceAppsOptions.name,
        this.options.namespace,
        this.workingDir,
        workspaceAppsOptions.spec,
        workspaceAppsOptions.lokalFile
      );
      await workspaceApp.cloneApp(isPull);
    }
  }

  async generateManifests() {
    if (this.options.apps) {
      this.addAppsManifests();
    }

    if (this.options.helmReleases) {
      this.addHelmsManifests();
    }

    this.skaffold.persist();
  }

  private addAppsManifests() {
    const kApp = new k.App({
      outdir: this.outDir,
    });

    const chart = new k.Chart(kApp, this.options.name, {
      namespace: this.options.namespace,
    });

    const manifestContainer = new ManifestContainer(this.options.name, chart);
    manifestContainer.addNamespace({ name: this.options.namespace });

    for (const workspaceAppsOptions of this.options.apps || []) {
      const workspaceApp = new WorkspaceApp(
        workspaceAppsOptions.name,
        this.options.namespace,
        this.workingDir,
        workspaceAppsOptions.spec,
        workspaceAppsOptions.lokalFile
      );

      const app = workspaceApp.initApp();
      app.initManifests(manifestContainer);
      app.initSkaffold(this.skaffold, workspaceAppsOptions.portForward);
    }

    const appManifestFile = path.join(
      kApp.outdir,
      this.options.name.concat(kApp.outputFileExtension)
    );
    this.skaffold.addManifestPath(appManifestFile);

    kApp.synth();
  }

  private addHelmsManifests() {
    for (const helmReleasesOptions of this.options.helmReleases || []) {
      let chartPath = helmReleasesOptions.spec.chartPath
        ? join(this.workingDir, helmReleasesOptions.spec.chartPath)
        : undefined;

      const valuesFiles = helmReleasesOptions.spec.valuesFiles?.map(
        (valuesFile) => path.join(this.workingDir, valuesFile)
      );

      const helmRelease = new HelmRelease(
        helmReleasesOptions.name,
        this.options.namespace,
        {
          ...helmReleasesOptions.spec,
          chartPath,
          valuesFiles,
        }
      );

      helmRelease.initSkaffold(this.skaffold, helmReleasesOptions.portForward);
    }
  }
}
