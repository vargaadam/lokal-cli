import child_process from "child_process";
import path, { join } from "path";
import * as k from "cdk8s";
import { Yaml } from "../content/base/yaml";
import { ManifestContainer } from "../app/manifests";
import { Skaffold, SKAFFOLD_COMMANDS } from "../content/skaffold";
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

export class Workspace extends Yaml<WorkspaceOptions> {
  workingDir: string;
  options: WorkspaceOptions;
  skaffold: Skaffold;

  constructor(
    workingDir: string,
    outDir: string,
    workspaceConfigFilePath: string
  ) {
    super(workspaceConfigFilePath);
    this.workingDir = workingDir;
    this.options = this.load();
    const skaffoldFilePath = path.join(outDir, "skaffold");
    this.skaffold = new Skaffold(skaffoldFilePath);
  }

  async cloneApps(isPull: boolean) {
    for (const { name, lokalFile, spec: workspaceAppOptions } of this.options
      .apps || []) {
      const workspaceApp = new WorkspaceApp(
        name,
        this.options.namespace,
        this.workingDir,
        workspaceAppOptions,
        lokalFile
      );
      await workspaceApp.cloneApp(isPull);
    }
  }

  async generateManifests(outDir: string) {
    const kApp = new k.App({
      outdir: outDir,
    });
    const chart = new k.Chart(kApp, this.options.name, {
      namespace: this.options.namespace,
    });

    const manifestContainer = new ManifestContainer(this.options.name, chart);
    manifestContainer.addNamespace({ name: this.options.namespace });

    for (const { name, spec: helmReleaseOptions } of this.options
      .helmReleases || []) {
      let chartPath = helmReleaseOptions.chartPath
        ? join(this.workingDir, helmReleaseOptions.chartPath)
        : undefined;

      const valuesFiles = helmReleaseOptions.valuesFiles?.map((valuesFile) =>
        path.join(this.workingDir, valuesFile)
      );

      const helmRelease = new HelmRelease(name, this.options.namespace, {
        ...helmReleaseOptions,
        chartPath,
        valuesFiles,
      });

      helmRelease.initSkaffold(this.skaffold);
    }

    for (const {
      name,
      lokalFile,
      spec: workspaceAppOptions,
      portForward,
    } of this.options.apps || []) {
      const workspaceApp = new WorkspaceApp(
        name,
        this.options.namespace,
        this.workingDir,
        workspaceAppOptions,
        lokalFile
      );

      const app = workspaceApp.initApp();
      app.initManifests(manifestContainer);
      app.initSkaffold(this.skaffold, portForward);
    }

    const appManifestFile = path.join(
      kApp.outdir,
      this.options.name.concat(kApp.outputFileExtension)
    );
    this.skaffold.addManifestPath(appManifestFile);

    kApp.synth();
    this.skaffold.persist();
  }

  runSkaffold(command: SKAFFOLD_COMMANDS) {
    child_process.execSync(`skaffold ${command} -f ${this.skaffold.filePath}`, {
      stdio: "inherit",
    });
  }
}
