import fs from "fs";
import path from "path";
import simpleGit, { CheckRepoActions, SimpleGit } from "simple-git";

export interface RepositoryOptions {
  repoPath?: string;
}

export class Repository {
  git: SimpleGit;
  repositoryOptions: RepositoryOptions;
  repoDir: string;

  constructor(
    workingDir: string,
    name: string,
    repositoryOptions: RepositoryOptions
  ) {
    this.repositoryOptions = repositoryOptions;
    this.repoDir = path.join(workingDir, name);
    if (!fs.existsSync(this.repoDir)) {
      fs.mkdirSync(this.repoDir);
    }

    this.git = simpleGit(this.repoDir);
  }

  async clone() {
    if (!this.repositoryOptions.repoPath) {
      return;
    }

    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (isGitRepo) {
      return;
    }

    await this.git.clone(this.repositoryOptions.repoPath, this.repoDir);
  }

  async pull() {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    await this.git.pull();
  }
}
