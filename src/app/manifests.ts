import * as k from "cdk8s";
import { KubeNamespace } from "cdk8s-plus-22/lib/imports/k8s";

export class ManifestContainer {
  name: string;
  chart: k.Chart;

  constructor(name: string, chart: k.Chart) {
    this.name = name;
    this.chart = chart;

    this.addNamespace(this.chart.namespace!);
  }

  private addNamespace(namespace: string) {
    const kubeNamespace = new KubeNamespace(this.chart, namespace, {
      metadata: {
        name: namespace,
      },
    });

    this.chart.addDependency(kubeNamespace);
  }
}
