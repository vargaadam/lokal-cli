import { Repository, RepositoryOptions } from "./repository";
import { ManifestOptions } from "./manifests/interfaces/manifest";
import { ManifestContainer } from "./manifests/container";
import { WorkspaceAppOptions } from "./workspace";
import { BuildOptions } from "../content/skaffold";

export interface AppOptions {
  name: string;
  repository: RepositoryOptions;
  manifests: ManifestOptions;
  build: BuildOptions;
}

export class App {
  constructor(
    private appOptions: AppOptions,
    private workspaceAppOptions: WorkspaceAppOptions
  ) {}

  async initRepository(workingDir: string) {
    await new Repository(this.appOptions.repository, workingDir).init();
  }

  async initManifests(appName: string, manifestContainer: ManifestContainer) {
    const deployment = this.appOptions.manifests.deployment;

    if (deployment && deployment.enabled) {
      manifestContainer.createDeployment({
        appName,
        image: this.appOptions.build.image,
        port: deployment.port,
        portForward: this.workspaceAppOptions.portForward,
      });
    }
  }

  build() {}

  deploy() {}
}
