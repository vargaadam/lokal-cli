import path from "path";
import { Repository as GitRepository } from "../git/repository";

export interface RepositoryOptions {
  name: string;
  repoPath: string;
  localPath: string;
}

export class Repository {
  private gitRepository: GitRepository;

  constructor(repositoryOptions: RepositoryOptions, workingDir?: string) {
    const localPath = workingDir
      ? path.join(workingDir, repositoryOptions.localPath)
      : repositoryOptions.localPath;

    this.gitRepository = new GitRepository(
      repositoryOptions.repoPath,
      localPath
    );
  }

  init() {
    return this.gitRepository.clone();
  }
}
