import child_process from "child_process";
import path from "path";
import * as k from "cdk8s";
import { App } from "../app";
import { Repository, RepositoryOptions } from "./repository";
import { Yaml } from "../content/base/yaml";
import { ManifestContainer } from "../app/manifests";
import { Skaffold } from "../content/skaffold";
import { HelmRelease, HelmReleaseOptions } from "./helm";

export interface WorkspaceAppOptions {
  name: string;
  lokalFile?: string;
  repository?: RepositoryOptions;
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

  async initApps(isPull: boolean): Promise<App[]> {
    const apps = [];

    for (const workspaceAppOptions of this.options.apps || []) {
      if (workspaceAppOptions.repository) {
        const repository = new Repository(
          this.workingDir,
          workspaceAppOptions.name,
          workspaceAppOptions.repository
        );

        await repository.clone();

        if (isPull) {
          await repository.pull();
        }
      }

      const appConfigFilePath = path.join(
        this.workingDir,
        workspaceAppOptions.name,
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
    const apps = await this.initApps(false);

    const kApp = new k.App({
      outdir: outDir,
    });
    const chart = new k.Chart(kApp, this.options.name, {
      namespace: this.options.namespace,
    });

    const manifestContainer = new ManifestContainer(this.options.name, chart);

    for (const helmReleaseOptions of this.options.helmReleases || []) {
      const helmRelease = new HelmRelease(
        this.options.namespace,
        helmReleaseOptions
      );

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