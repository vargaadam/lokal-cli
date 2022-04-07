import { Repository, RepositoryOptions } from "./repository";
import { ManifestOptions } from "./manifests/interfaces/manifest";
import { ManifestContainer } from "./manifests/container";
import { WorkspaceAppOptions } from "./workspace";
import { BuildOptions, HelmReleaseOptions } from "../content/skaffold";

export interface AppOptions {
  name: string;
  repository?: RepositoryOptions;
  manifests?: ManifestOptions;
  build?: BuildOptions;
  helm?: HelmReleaseOptions;
}

export class App {
  constructor(
    private appOptions: AppOptions,
    private workspaceAppOptions: WorkspaceAppOptions
  ) {}

  async initRepository(workingDir: string, pull: boolean) {
    if (!this.appOptions.repository) {
      return;
    }

    const repository = new Repository(this.appOptions.repository, workingDir);

    await repository.clone();

    if (pull) {
      await repository.pull();
    }
  }

  async initManifests(appName: string, manifestContainer: ManifestContainer) {
    if (!this.appOptions.manifests || !this.appOptions.build) {
      return;
    }

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
