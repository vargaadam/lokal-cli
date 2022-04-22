import * as k from "cdk8s";
import { KubeNamespace } from "cdk8s-plus-22/lib/imports/k8s";
import { BaseK8s } from "./base";

export interface NamespaceOptions {
  name: string;
}

export class Namespace extends BaseK8s<KubeNamespace, NamespaceOptions> {
  constructor(chart: k.Chart) {
    super(chart);
  }

  create(options: NamespaceOptions) {
    const kubeNamespace = new KubeNamespace(this.chart, options.name, {
      metadata: {
        name: options.name,
      },
    });

    this.chart.addDependency(kubeNamespace);

    return kubeNamespace;
  }
}
