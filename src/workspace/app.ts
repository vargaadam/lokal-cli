import { Repository, RepositoryOptions } from "./repository";

export interface AppOptions {
  repository: RepositoryOptions;
}

export class App {
  constructor(private appOptions: AppOptions) {}

  async initRepositories() {
    await new Repository(this.appOptions.repository).init();
  }

  build() {}

  deploy() {}
}
