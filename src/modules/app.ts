import { Repository, RepositoryOptions } from "./repository";
import { ManifestOptions } from "./manifests/interfaces/manifest";
import { ManifestContainer } from "./manifests/container";
import { WorkspaceAppOptions } from "./workspace";

export interface AppOptions {
  name: string;
  repository: RepositoryOptions;
  manifests: ManifestOptions;
}

export class App {
  constructor(
    private appOptions: AppOptions,
    private workspaceAppOptions: WorkspaceAppOptions
  ) {}

  async initRepository() {
    await new Repository(this.appOptions.repository).init();
  }

  async initManifests(manifestContainer: ManifestContainer) {
    const deployment = this.appOptions.manifests.deployment;

    if (deployment && deployment.enabled) {
      manifestContainer.createDeployment({
        appName: this.appOptions.name,
        port: deployment.port,
        portForward: this.workspaceAppOptions.portForward,
      });
    }
  }

  build() {}

  deploy() {}
}
