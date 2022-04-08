import child_process from "child_process";
import path from "path";
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

const SKAFFOLD_FILE_NAME = "skaffold.yaml";

export class Skaffold extends Yaml {
  constructor(resourcesFilePath: string) {
    const skaffoldFilePath = path.join(resourcesFilePath, SKAFFOLD_FILE_NAME);

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

  runDev() {
    child_process.execSync(`skaffold dev -f ${this.filePath}`, {
      stdio: "inherit",
    });
  }

  runDelete() {
    child_process.execSync(`skaffold delete -f ${this.filePath}`, {
      stdio: "inherit",
    });
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
