import path from "path";
import { ManifestContainer } from "./manifests";
import { Skaffold } from "../content/skaffold";
import { Yaml } from "../content/base/yaml";
import { DeploymentSize } from "../content/k8s/deployment";
import { WorkspaceAppOptions } from "../workspace/app";
import { WorkspacePortForwardOptions } from "../workspace";

export interface AppBuildOptions {
  image: string;
  context: string;
  docker: { dockerfile: string; buildArgs?: Record<string, string> };
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
  appName: string;
  namespace: string;
  workingDir: string;
  options: AppOptions;
  workspaceAppOptions: WorkspaceAppOptions;

  constructor(
    name: string,
    namespace: string,
    workingDir: string,
    appConfigFilePath: string,
    workspaceAppOptions: WorkspaceAppOptions
  ) {
    super(appConfigFilePath);
    this.options = this.load();
    this.appName = name || this.options.name;
    this.namespace = namespace;
    this.workingDir = workingDir;
    this.workspaceAppOptions = workspaceAppOptions;
  }

  initManifests(manifestContainer: ManifestContainer) {
    if (!this.options.manifests) {
      return;
    }

    let configMap;
    const configMapOptions = this.options.manifests.configMap;
    const workspaceEnv = this.workspaceAppOptions.env;
    if (workspaceEnv || configMapOptions) {
      const fromFile = configMapOptions?.fromFile
        ? path.join(
            this.workingDir,
            this.workspaceAppOptions.repository.localPath,
            configMapOptions.fromFile
          )
        : undefined;

      configMap = manifestContainer.addConfigMap({
        name: this.appName,
        env: {
          ...configMapOptions?.env,
          ...workspaceEnv,
        },
        fromFile,
      });
    }

    let service;
    const deploymentOptions = this.options.manifests.deployment;
    if (deploymentOptions) {
      const dp = manifestContainer.addDeployment({
        name: this.appName,
        image: this.appName,
        port: deploymentOptions.port,
        replicas: deploymentOptions.replicas,
        size: deploymentOptions.size,
        configMap: configMap,
      });

      service = manifestContainer.addService({
        name: this.appName,
        deployment: dp,
      });
    }
  }

  initSkaffold(
    skaffold: Skaffold,
    portForwardOptions?: WorkspacePortForwardOptions[]
  ) {
    const buildOptions = this.options.build;
    if (buildOptions) {
      const context = path.join(
        this.workingDir,
        this.workspaceAppOptions.repository.localPath
      );
      skaffold.addArtifact({
        docker: { ...buildOptions.docker },
        sync: buildOptions.sync,
        context,
        image: this.appName,
      });
    }

    const deploymentOptions = this.options.manifests?.deployment;
    if (deploymentOptions && portForwardOptions) {
      for (const portForward of portForwardOptions) {
        skaffold.addPortForward({
          resourceName: portForward.resourceName || this.appName,
          resourceType: portForward.resourceType || "Service",
          port: portForward.port || deploymentOptions.port,
          localPort: portForward.localPort,
          namespace: this.namespace,
        });
      }
    }
  }
}
