import { AppOptions } from "../modules/app";
import { WorkspaceAppOptions, WorkspaceOptions } from "../modules/workspace";
import { Yaml } from "./base/yaml";

interface BuildSyncOptions {
  src: string;
  dest: string;
}

export interface BuildOptions {
  image: string;
  context: string;
  docker: { dockerfile: string };
  sync: BuildSyncOptions[];
}

export interface PortForwardOptions {
  resourceType?: string;
  resourceName: string;
  namespace: string;
  port: number;
  localPort: number;
}

export interface HelmReleaseOptions {
  name: string;
  repo: string;
  remoteChart: string;
}

export class Skaffold extends Yaml {
  constructor(manifestsPaths: string[]) {
    super();

    this.content = {
      apiVersion: "skaffold/v2beta22",
      kind: "Config",
      deploy: {
        kubectl: {
          manifests: manifestsPaths,
        },
        helm: {
          releases: [],
        },
      },
      build: {
        local: {
          push: false,
        },
        artifacts: [],
      },
      portForward: [],
    };
  }

  init(
    appName: string,
    workspaceOptions: WorkspaceOptions,
    appOptions: AppOptions,
    workspaceAppOptions: WorkspaceAppOptions
  ) {
    if (appOptions.helm) {
      this.addHelmRelease(appOptions.helm);
    }

    if (appOptions.build) {
      this.addArtifact(appOptions.build);
    }

    if (
      appOptions.manifests &&
      appOptions.manifests.deployment &&
      workspaceAppOptions.portForward
    ) {
      this.addPortForward({
        resourceName: appName,
        port: appOptions.manifests.deployment.port,
        localPort: workspaceAppOptions.portForward,
        namespace: workspaceOptions.namespace,
      });
    }
  }

  private addArtifact(buildOptions: BuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }

  private addPortForward(portForwardOptions: PortForwardOptions) {
    this.content.portForward.push({
      resourceType: portForwardOptions.resourceType || "Service",
      ...portForwardOptions,
    });
  }

  private addHelmRelease(helmReleaseOptions: HelmReleaseOptions) {
    this.content.deploy.helm.releases.push(helmReleaseOptions);
  }
}
