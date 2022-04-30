import { Skaffold } from "../content/skaffold";

export interface HelmReleaseOptions {
  namespace?: string;
  createNamespace?: boolean;
  repo?: string;
  remoteChart?: string;
  chartPath?: string;
  valuesFiles?: string[];
}

export class HelmRelease {
  name: string;
  namespace: string;
  options: HelmReleaseOptions;

  constructor(name: string, namespace: string, options: HelmReleaseOptions) {
    this.name = name;
    this.namespace = namespace;
    this.options = options;
  }

  initSkaffold(skaffold: Skaffold) {
    skaffold.addHelmRelease(this.namespace, {
      ...this.options,
      name: this.name,
    });
  }
}
