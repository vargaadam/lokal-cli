import { Skaffold } from "../content/skaffold";

export interface HelmReleaseOptions {
  name: string;
  namespace?: string;
  createNamespace?: string;
  repo: string;
  remoteChart: string;
  valuesFiles?: string[];
}

export class HelmRelease {
  options: HelmReleaseOptions;
  namespace: string;

  constructor(namespace: string, options: HelmReleaseOptions) {
    this.options = options;
    this.namespace = namespace;
  }

  initSkaffold(skaffold: Skaffold) {
    skaffold.addHelmRelease(this.namespace, this.options);
  }
}
