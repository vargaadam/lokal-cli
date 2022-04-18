import * as k from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { KubeNamespace } from "cdk8s-plus-22/lib/imports/k8s";
import { ConfigMap, ConfigMapOptions } from "../content/k8s/config-map";
import { Deployment, DeploymentOptions } from "../content/k8s/deployment";

export class ManifestContainer {
  name: string;
  chart: k.Chart;

  constructor(name: string, chart: k.Chart) {
    this.name = name;
    this.chart = chart;
  }

  addNamespace(namespace: string) {
    const kubeNamespace = new KubeNamespace(this.chart, namespace, {
      metadata: {
        name: namespace,
      },
    });

    this.chart.addDependency(kubeNamespace);

    return kubeNamespace;
  }

  addDeployment(options: DeploymentOptions): kplus.Deployment {
    return new Deployment(this.chart).create(options);
  }

  addConfigMap(options: ConfigMapOptions): kplus.ConfigMap {
    return new ConfigMap(this.chart).create(options);
  }
}
