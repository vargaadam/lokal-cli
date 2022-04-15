import { Yaml } from "./base/yaml";

interface SkaffoldBuildSyncOptions {
  src: string;
  dest: string;
}

export interface SkaffoldBuildOptions {
  image: string;
  context?: string;
  docker: { dockerfile: string };
  sync: SkaffoldBuildSyncOptions[];
}

export interface SkaffoldPortForwardOptions {
  resourceType?: string;
  resourceName: string;
  namespace: string;
  port: number;
  localPort: number;
}

export interface SkaffoldHelmReleaseOptions {
  name: string;
  namespace?: string;
  createNamespace?: string;
  repo: string;
  remoteChart: string;
  valuesFiles?: string[];
}

export class Skaffold extends Yaml<any> {
  constructor(skaffoldFilePath: string) {
    super(skaffoldFilePath);

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

  addManifestPath(manifestPath: string) {
    this.content.deploy.kubectl.manifests.push(manifestPath);
  }

  addArtifact(buildOptions: SkaffoldBuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }

  addPortForward(portForwardOptions: SkaffoldPortForwardOptions) {
    this.content.portForward.push({
      resourceType: "Service",
      ...portForwardOptions,
    });
  }

  addHelmRelease(
    namespace: string,
    helmReleaseOptions: SkaffoldHelmReleaseOptions
  ) {
    this.content.deploy.helm.releases.push({
      namespace,
      createNamespace: true,
      ...helmReleaseOptions,
    });
  }
}
