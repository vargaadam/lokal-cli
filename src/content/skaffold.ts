import { Yaml } from "./base/yaml";

interface BuildSyncOptions {
  src: string;
  dest: string;
}

export interface BuildOptions {
  image: string;
  context?: string;
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
  name?: string;
  namespace?: string;
  createNamespace?: string;
  repo: string;
  remoteChart: string;
  valuesFiles?: string[];
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

  addManifestsPath(manifestPath: string) {
    this.content.deploy.kubectl.manifests.push(manifestPath);
  }

  addArtifact(buildOptions: BuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }

  addPortForward(portForwardOptions: PortForwardOptions) {
    this.content.portForward.push({
      resourceType: "Service",
      ...portForwardOptions,
    });
  }

  addHelmRelease(
    releaseName: string,
    namespace: string,
    helmReleaseOptions: HelmReleaseOptions
  ) {
    this.content.deploy.helm.releases.push({
      name: releaseName,
      namespace,
      createNamespace: true,
      ...helmReleaseOptions,
    });
  }
}
