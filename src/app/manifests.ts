import * as k from "cdk8s";
import { ConfigMap, ConfigMapOptions } from "../content/k8s/config-map";
import { Deployment, DeploymentOptions } from "../content/k8s/deployment";
import { Namespace, NamespaceOptions } from "../content/k8s/namespace";
import { Service, ServiceOptions } from "../content/k8s/service";

export class ManifestContainer {
  name: string;
  chart: k.Chart;
  namespace: Namespace;
  deployment: Deployment;
  configMap: ConfigMap;
  service: Service;

  constructor(name: string, chart: k.Chart) {
    this.name = name;
    this.chart = chart;
    this.namespace = new Namespace(this.chart);
    this.deployment = new Deployment(this.chart);
    this.service = new Service(this.chart);
    this.configMap = new ConfigMap(this.chart);
  }

  addNamespace(options: NamespaceOptions) {
    return this.namespace.create(options);
  }

  addDeployment(options: DeploymentOptions) {
    return this.deployment.create(options);
  }

  addService(options: ServiceOptions) {
    return this.service.create(options);
  }

  addConfigMap(options: ConfigMapOptions) {
    return this.configMap.create(options);
  }
}
