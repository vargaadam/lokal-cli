import * as k from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { BaseK8s } from "./base";

export enum DeploymentSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  NO_LIMIT = "NO_LIMIT",
}
export interface DeploymentOptions {
  name: string;
  image: string;
  port: number;
  replicas?: number;
  size?: DeploymentSize;
  configMap?: kplus.ConfigMap;
}

export class Deployment extends BaseK8s<kplus.Deployment, DeploymentOptions> {
  constructor(chart: k.Chart) {
    super(chart);
  }

  create(options: DeploymentOptions) {
    const deployment = new kplus.Deployment(
      this.chart,
      options.name.concat("-dp"),
      {
        replicas: options.replicas || 1,
        containers: [
          {
            image: options.image,
            port: options.port,
            imagePullPolicy: kplus.ImagePullPolicy.NEVER,
            resources: this.getContainerResource(options.size),
          },
        ],
      }
    );

    if (options.configMap) {
      const kubeDeployment = k.ApiObject.of(deployment);
      kubeDeployment.addDependency(options.configMap);
      k.ApiObject.of(kubeDeployment).addJsonPatch(
        k.JsonPatch.add("/spec/template/spec/containers/0/envFrom", [
          { configMapRef: { name: options.configMap.name } },
        ])
      );
    }

    return deployment;
  }

  private getContainerResource(deploymentSize?: DeploymentSize) {
    const convertedDeploymentSize = deploymentSize
      ? deploymentSize.toLocaleUpperCase()
      : undefined;

    const smallResources: kplus.Resources = {
      memory: {
        request: k.Size.mebibytes(400),
        limit: k.Size.mebibytes(2000),
      },
      cpu: {
        request: kplus.Cpu.millis(200),
        limit: kplus.Cpu.millis(1000),
      },
    };

    const mediumResources: kplus.Resources = {
      memory: {
        request: k.Size.mebibytes(800),
        limit: k.Size.mebibytes(2500),
      },
      cpu: {
        request: kplus.Cpu.millis(400),
        limit: kplus.Cpu.millis(1200),
      },
    };

    const largeResources: kplus.Resources = {
      memory: {
        request: k.Size.mebibytes(1600),
        limit: k.Size.mebibytes(3000),
      },
      cpu: {
        request: kplus.Cpu.millis(800),
        limit: kplus.Cpu.millis(1400),
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
