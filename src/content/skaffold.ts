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

  addArtifact(buildOptions: BuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }

  addPortForward(portForwardOptions: PortForwardOptions) {
    this.content.portForward.push({
      resourceType: portForwardOptions.resourceType || "Service",
      ...portForwardOptions,
    });
  }
}
