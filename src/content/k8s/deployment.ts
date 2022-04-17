import { Size } from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { Cpu, ImagePullPolicy, Resources } from "cdk8s-plus-22";
import { ManifestContainer } from "../../app/manifests";

export enum DeploymentSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  NO_LIMIT = "NO_LIMIT",
}
export interface DeploymentOptions {
  appName: string;
  image: string;
  port: number;
  replicas?: number;
  size?: DeploymentSize;
}

export class Deployment {
  manifestContainer: ManifestContainer;

  constructor(manifestContainer: ManifestContainer) {
    this.manifestContainer = manifestContainer;
  }

  create(options: DeploymentOptions) {
    const chart = this.manifestContainer.chart;

    const deployment = new kplus.Deployment(chart, options.appName, {
      metadata: {
        name: options.appName,
      },
      replicas: options.replicas || 1,
      containers: [
        {
          image: options.image,
          port: options.port,
          imagePullPolicy: ImagePullPolicy.NEVER,
          resources: this.getContainerResource(options.size),
        },
      ],
    });

    deployment.exposeViaService({
      name: options.appName,
      port: options.port,
    });

    return deployment;
  }

  private getContainerResource(deploymentSize?: DeploymentSize) {
    const convertedDeploymentSize = deploymentSize
      ? deploymentSize.toLocaleUpperCase()
      : deploymentSize;

    const smallResources: Resources = {
      memory: {
        request: Size.mebibytes(400),
        limit: Size.mebibytes(2000),
      },
      cpu: {
        request: Cpu.millis(200),
        limit: Cpu.millis(1000),
      },
    };

    const mediumResources: Resources = {
      memory: {
        request: Size.mebibytes(800),
        limit: Size.mebibytes(2500),
      },
      cpu: {
        request: Cpu.millis(400),
        limit: Cpu.millis(1200),
      },
    };

    const largeResources: Resources = {
      memory: {
        request: Size.mebibytes(1600),
        limit: Size.mebibytes(3000),
      },
      cpu: {
        request: Cpu.millis(800),
        limit: Cpu.millis(1400),
      },
    };

    switch (convertedDeploymentSize) {
      case DeploymentSize.SMALL:
        return smallResources;
      case DeploymentSize.MEDIUM:
        return mediumResources;
      case DeploymentSize.LARGE:
        return largeResources;
      case DeploymentSize.NO_LIMIT:
        return;
      default:
        return;
    }
  }
}
