import child_process from "child_process";
import path, { join } from "path";
import * as k from "cdk8s";
import { App } from "../app";
import { Repository } from "./repository";
import { Yaml } from "../content/base/yaml";
import { ManifestContainer } from "../app/manifests";
import { Skaffold } from "../content/skaffold";
import { HelmRelease, HelmReleaseOptions } from "./helm";

export interface WorkspaceAppOptions {
  name: string;
  lokalFile?: string;
  env?: Record<string, string>;
  repository: {
    localPath: string;
    repoUrl?: string;
    branch?: string;
  };
  portForward?: number;
}

export interface WorkspaceOptions {
  version: string;
  kind: string;
  name: string;
  namespace: string;
  apps?: WorkspaceAppOptions[];
  helmReleases?: HelmReleaseOptions[];
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
    for (const workspaceAppOptions of this.options.apps || []) {
      const repositoryOptions = workspaceAppOptions.repository;
      const repoDir = path.join(this.workingDir, repositoryOptions.localPath);
      const repository = new Repository(repoDir, workspaceAppOptions.name);

      if (repositoryOptions.repoUrl) {
        await repository.clone(repositoryOptions.repoUrl);
      }

      if (repositoryOptions.branch) {
        await repository.checkoutBranch(repositoryOptions.branch);
      }

      if (isPull) {
        await repository.pull();
      }
    }
  }

  async initApps(): Promise<App[]> {
    const apps = [];

    for (const workspaceAppOptions of this.options.apps || []) {
      const appConfigFilePath = path.join(
        this.workingDir,
        workspaceAppOptions.repository.localPath,
        workspaceAppOptions.lokalFile || ".lokal"
      );

      const app = new App(
        this.workingDir,
        appConfigFilePath,
        workspaceAppOptions
      );
      apps.push(app);
    }

    return apps;
  }

  async generateManifests(outDir: string) {
    const apps = await this.initApps();

    const kApp = new k.App({
      outdir: outDir,
    });
    const chart = new k.Chart(kApp, this.options.name, {
      namespace: this.options.namespace,
    });

    const manifestContainer = new ManifestContainer(this.options.name, chart);
    manifestContainer.addNamespace({ name: this.options.namespace });

    for (const helmReleaseOptions of this.options.helmReleases || []) {
      let chartPath = helmReleaseOptions.chartPath
        ? join(this.workingDir, helmReleaseOptions.chartPath)
        : undefined;

      const valuesFiles = helmReleaseOptions.valuesFiles?.map((valuesFile) =>
        path.join(this.workingDir, valuesFile)
      );

      const helmRelease = new HelmRelease(this.options.namespace, {
        ...helmReleaseOptions,
        chartPath,
        valuesFiles,
      });

      helmRelease.initSkaffold(this.skaffold);
    }

    for (const app of apps) {
      app.initManifests(manifestContainer);
      app.initSkaffold(this.options.namespace, this.skaffold);
    }

    const appManifestFile = path.join(
      kApp.outdir,
      this.options.name.concat(kApp.outputFileExtension)
    );
    this.skaffold.addManifestPath(appManifestFile);

    kApp.synth();
    this.skaffold.persist();
  }

  dev() {
    child_process.execSync(`skaffold dev -f ${this.skaffold.filePath}`, {
      stdio: "inherit",
    });
  }

  delete() {
    child_process.execSync(`skaffold delete -f ${this.skaffold.filePath}`, {
      stdio: "inherit",
    });
  }
}
