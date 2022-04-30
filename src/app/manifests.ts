import * as k from "cdk8s";
import { ConfigMap, ConfigMapOptions } from "../content/k8s/config-map";
import { Deployment, DeploymentOptions } from "../content/k8s/deployment";
import { Namespace, NamespaceOptions } from "../content/k8s/namespace";
import { Service, ServiceOptions } from "../content/k8s/service";

export class ManifestContainer {
  name: string;
  chart: k.Chart;

  constructor(name: string, chart: k.Chart) {
    this.name = name;
    this.chart = chart;
  }

  addNamespace(options: NamespaceOptions) {
    const namespace = new Namespace(this.chart);
    return namespace.create(options);
  }

  addDeployment(options: DeploymentOptions) {
    const deployment = new Deployment(this.chart);
    return deployment.create(options);
  }

  addService(options: ServiceOptions) {
    const service = new Service(this.chart);
    return service.create(options);
  }

  addConfigMap(options: ConfigMapOptions) {
    const configMap = new ConfigMap(this.chart);
    return configMap.create(options);
  }
}
