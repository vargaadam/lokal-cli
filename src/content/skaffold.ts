import { AppOptions } from "../modules/app";
import { WorkspaceAppOptions } from "../modules/workspace";
import { getAppName } from "../utils";
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
  repo: string;
  remoteChart: string;
}

export class Skaffold extends Yaml {
  constructor() {
    super();

    this.content = {
      apiVersion: "skaffold/v2beta22",
      kind: "Config",
      deploy: {
        kubectl: {
          manifests: [],
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

  initApp(
    namespace: string,
    workspaceAppOptions: WorkspaceAppOptions,
    appOptions: AppOptions
  ) {
    if (appOptions.helm) {
      this.addHelmRelease(
        getAppName(workspaceAppOptions),
        namespace,
        appOptions.helm
      );
    }

    if (
      appOptions.manifests &&
      appOptions.manifests.deployment &&
      workspaceAppOptions.portForward
    ) {
      this.addPortForward({
        resourceName: getAppName(workspaceAppOptions),
        port: appOptions.manifests.deployment.port,
        localPort: workspaceAppOptions.portForward,
        namespace,
      });
    }
  }

  addManifestsPath(manifestPath: string) {
    this.content.deploy.kubectl.manifests.push(manifestPath);
  }

  addArtifact(buildOptions: BuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }

  addPortForward(portForwardOptions: PortForwardOptions) {
    this.content.portForward.push({
      ...portForwardOptions,
      resourceType: portForwardOptions.resourceType || "Service",
    });
  }

  addHelmRelease(
    releaseName: string,
    namespace: string,
    helmReleaseOptions: HelmReleaseOptions
  ) {
    this.content.deploy.helm.releases.push({
      ...helmReleaseOptions,
      name: releaseName,
      namespace,
      createNamespace: true,
    });
  }
}
