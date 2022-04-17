import path from "path";
import { ManifestContainer, ManifestOptions } from "./manifests";
import { Skaffold } from "../content/skaffold";
import { Yaml } from "../content/base/yaml";
import { Deployment } from "../content/k8s/deployment";
import { WorkspaceAppOptions } from "../workspace";

export interface BuildOptions {
  image: string;
  context: string;
  docker: { dockerfile: string };
  sync: Array<{
    src: string;
    dest: string;
  }>;
}

export interface AppOptions {
  name: string;
  manifests?: ManifestOptions;
  build?: BuildOptions;
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
    const buildOptions = this.options.build;
    if (buildOptions) {
      const context = path.join(this.workingDir, this.appName);
      skaffold.addArtifact({
        docker: { dockerfile: buildOptions.docker.dockerfile },
        sync: {
          manual: buildOptions.sync,
        },
        context,
        image: this.appName,
      });
    }

    const deploymentOptions = this.options.manifests?.deployment;
    if (deploymentOptions && this.workspaceAppOptions.portForward) {
      skaffold.addPortForward({
        resourceName: this.appName,
        port: deploymentOptions.port,
        localPort: this.workspaceAppOptions.portForward,
        namespace,
      });
    }
  }
}
