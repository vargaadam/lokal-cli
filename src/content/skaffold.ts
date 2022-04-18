import { Yaml } from "./base/yaml";

export interface SkaffoldBuildSyncOptions {
  src: string;
  dest: string;
}

export interface SkaffoldBuildArtifactsOptions {
  image: string;
  context: string;
  docker: { dockerfile: string };
  sync: {
    manual: SkaffoldBuildSyncOptions[];
  };
}

export interface SkaffoldHelmReleaseOptions {
  name: string;
  namespace?: string;
  createNamespace?: boolean;
  repo?: string;
  remoteChart?: string;
  chartPath?: string;
  valuesFiles?: string[];
}

export interface SkaffoldDeployOptions {
  kubectl: {
    manifests: string[];
  };
  helm: {
    releases: SkaffoldHelmReleaseOptions[];
  };
}

export interface SkaffoldPortForwardOptions {
  resourceType?: string;
  resourceName: string;
  namespace: string;
  port: number;
  localPort: number;
}

export interface SkaffoldOptions {
  apiVersion: string;
  kind: string;
  deploy: SkaffoldDeployOptions;
  build: {
    local: {
      push: boolean;
    };
    artifacts: SkaffoldBuildArtifactsOptions[];
  };
  portForward: SkaffoldPortForwardOptions[];
}

export class Skaffold extends Yaml<SkaffoldOptions> {
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

  addArtifact(buildOptions: SkaffoldBuildArtifactsOptions) {
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
