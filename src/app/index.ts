import path from "path";
import { ManifestContainer, ManifestOptions } from "./manifests";
import { SkaffoldBuildOptions, Skaffold } from "../content/skaffold";
import { Yaml } from "../content/base/yaml";
import { Deployment } from "../content/k8s/deployment";
import { WorkspaceAppOptions } from "../workspace";

export interface AppOptions {
  name: string;
  manifests?: ManifestOptions;
  build?: SkaffoldBuildOptions;
}

export class App extends Yaml<AppOptions> {
  workingDir: string;
  appName: string;
  options: AppOptions;
  workspaceAppOptions: WorkspaceAppOptions;

  constructor(
    workingDir: string,
    appConfigFilePath: string,
    workspaceAppOptions: WorkspaceAppOptions
  ) {
    super(appConfigFilePath);
    this.options = this.load();
    this.workingDir = workingDir;
    this.appName = workspaceAppOptions.name || this.options.name;
    this.workspaceAppOptions = workspaceAppOptions;
  }

  initManifests(manifestContainer: ManifestContainer) {
    if (!this.options.manifests || !this.options.build) {
      return;
    }

    const deploymentOptions = this.options.manifests.deployment;

    if (deploymentOptions) {
      const deployment = new Deployment(manifestContainer);
      deployment.create({
        appName: this.appName,
        image: this.appName,
        port: deploymentOptions.port,
      });
    }
  }

  initSkaffold(namespace: string, skaffold: Skaffold) {
    if (this.options.build) {
      const context = path.join(this.workingDir, this.appName);
      skaffold.addArtifact({
        ...this.options.build,
        context,
        image: this.appName,
      });
    }

    if (
      this.options.manifests?.deployment &&
      this.workspaceAppOptions.portForward
    ) {
      skaffold.addPortForward({
        resourceName: this.appName,
        port: this.options.manifests.deployment.port,
        localPort: this.workspaceAppOptions.portForward,
        namespace,
      });
    }
  }
}
