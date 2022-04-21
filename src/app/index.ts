import path from "path";
import { ManifestContainer } from "./manifests";
import { Skaffold } from "../content/skaffold";
import { Yaml } from "../content/base/yaml";
import { DeploymentSize } from "../content/k8s/deployment";
import { WorkspaceAppOptions } from "../workspace";

export interface AppBuildOptions {
  image: string;
  context: string;
  docker: { dockerfile: string };
  sync: {
    manual: Array<{
      src: string;
      dest: string;
    }>;
  };
}

export interface AppManifestsOptions {
  deployment?: {
    port: number;
    size?: DeploymentSize;
    replicas?: number;
  };
  configMap?: {
    fromFile?: string;
    env?: Record<string, string>;
  };
}

export interface AppOptions {
  name: string;
  manifests?: AppManifestsOptions;
  build?: AppBuildOptions;
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
    if (!this.options.manifests) {
      return;
    }

    let configMap;
    const configMapOptions = this.options.manifests.configMap;
    if (configMapOptions) {
      const fromFile = configMapOptions.fromFile
        ? path.join(
            this.workingDir,
            this.workspaceAppOptions.repository.localPath,
            configMapOptions.fromFile
          )
        : undefined;

      configMap = manifestContainer.addConfigMap({
        appName: this.appName,
        env: {
          ...configMapOptions.env,
          ...this.workspaceAppOptions.env,
        },
        fromFile,
      });
    }

    const deploymentOptions = this.options.manifests.deployment;
    if (deploymentOptions) {
      manifestContainer.addDeployment({
        appName: this.appName,
        image: this.appName,
        port: deploymentOptions.port,
        replicas: deploymentOptions.replicas,
        size: deploymentOptions.size,
        configMap: configMap,
      });
    }
  }

  initSkaffold(namespace: string, skaffold: Skaffold) {
    const buildOptions = this.options.build;
    if (buildOptions) {
      const context = path.join(
        this.workingDir,
        this.workspaceAppOptions.repository.localPath
      );
      skaffold.addArtifact({
        docker: { dockerfile: buildOptions.docker.dockerfile },
        sync: buildOptions.sync,
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
