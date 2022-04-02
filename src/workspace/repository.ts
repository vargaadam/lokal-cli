import { Resource } from "../git/resource";

export interface RepositoryOptions {
  name: string;
  repoPath: string;
  localPath: string;
}

export class Repository {
  private resource: Resource;

  constructor(repositoryOptions: RepositoryOptions) {
    this.resource = new Resource(
      repositoryOptions.repoPath,
      repositoryOptions.localPath
    );
  }

  init() {
    return this.resource.clone();
  }
}
