import * as kplus from "cdk8s-plus-22";
import { ImagePullPolicy } from "cdk8s-plus-22";
import { ManifestContainer } from "../../app/manifests";

export interface DeploymentOptions {
  appName: string;
  image: string;
  port: number;
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
      containers: [
        {
          image: options.image,
          port: options.port,
          imagePullPolicy: ImagePullPolicy.NEVER,
        },
      ],
    });

    deployment.exposeViaService({
      name: options.appName,
      port: options.port,
    });

    return deployment;
  }
}
