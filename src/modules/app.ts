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

  async initRepository(workingDir: string, isPull: boolean) {
    if (!this.appOptions.repository) {
      return;
    }

    const repository = new Repository(this.appOptions.repository, workingDir);

    await repository.clone();

    if (isPull) {
      await repository.pull();
    }
  }

  async initManifests(manifestContainer: ManifestContainer) {
    if (!this.appOptions.manifests || !this.appOptions.build) {
      return;
    }

    const appName = this.workspaceAppOptions.alias || this.appOptions.name;
    const deploymentOptions = this.appOptions.manifests.deployment;

    if (deploymentOptions && deploymentOptions.enabled) {
      manifestContainer.createDeployment({
        appName,
        image: this.appOptions.build.image,
        port: deploymentOptions.port,
      });
    }
  }
}
