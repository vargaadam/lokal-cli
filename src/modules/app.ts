import { Repository, RepositoryOptions } from "./repository";
import { AppManifests } from "../manifests/interfaces";

export interface AppOptions {
  name: string;
  repository: RepositoryOptions;
  manifests: AppManifests;
}

export class App {
  constructor(private appOptions: AppOptions) {}

  async initRepositories() {
    await new Repository(this.appOptions.repository).init();
  }

  build() {}

  deploy() {}
}
