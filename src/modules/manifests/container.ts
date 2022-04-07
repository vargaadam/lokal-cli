import * as k from "cdk8s";
import { ApiObject, AppProps, JsonPatch } from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { ImagePullPolicy } from "cdk8s-plus-22";
import { KubeNamespace } from "cdk8s-plus-22/lib/imports/k8s";
import { DeploymentOptions } from "./interfaces/deployment";

export class ManifestContainer {
  public app: k.App;
  public chart: k.Chart;
  public namespace: KubeNamespace;

  constructor(
    private workspaceName: string,
    namespaceName: string,
    private synthOptions?: AppProps
  ) {
    this.app = new k.App(this.synthOptions);
    this.chart = new k.Chart(this.app, this.workspaceName);
    this.namespace = new KubeNamespace(this.chart, namespaceName, {
      metadata: {
        name: namespaceName,
      },
    });

    this.chart.addDependency(this.namespace);
  }

  createDeployment(options: DeploymentOptions) {
    const deployment = new kplus.Deployment(this.chart, options.appName, {
      metadata: {
        name: options.appName,
        namespace: this.namespace.name,
      },
      containers: [
        {
          image: options.image,
          port: options.port,
          imagePullPolicy: ImagePullPolicy.NEVER,
        },
      ],
    });

    const service = deployment.exposeViaService({
      name: options.appName,
      port: options.port,
    });

    const kubeService = ApiObject.of(service);
    kubeService.addJsonPatch(
      JsonPatch.add("/metadata/namespace", this.namespace.name)
    );

    return deployment;
  }
}
