import path from "path";
import { Resource } from "../git/resource";

export interface RepositoryOptions {
  name: string;
  repoPath: string;
  localPath: string;
}

export class Repository {
  private resource: Resource;

  constructor(repositoryOptions: RepositoryOptions, workingDir?: string) {
    const localPath = workingDir
      ? path.join(workingDir, repositoryOptions.localPath)
      : repositoryOptions.localPath;

    this.resource = new Resource(repositoryOptions.repoPath, localPath);
  }

  init() {
    return this.resource.clone();
  }
}
