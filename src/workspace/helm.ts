import { WorkspacePortForwardOptions } from ".";
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

  initSkaffold(
    skaffold: Skaffold,
    portForwardOptions?: WorkspacePortForwardOptions[]
  ) {
    skaffold.addHelmRelease(this.namespace, {
      ...this.options,
      name: this.name,
    });

    for (const portForward of portForwardOptions || []) {
      if (!portForward.port) {
        throw new Error(
          "If you want to portForward a helm release, you must specify at least the port and the localPort param!"
        );
      }

      skaffold.addPortForward({
        resourceName: portForward.resourceName || this.name,
        resourceType: portForward.resourceType || "Service",
        port: portForward.port,
        localPort: portForward.localPort,
        namespace: this.namespace,
      });
    }
  }
}
