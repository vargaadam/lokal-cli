import fs from "fs";
import path from "path";
import simpleGit, { CheckRepoActions, SimpleGit } from "simple-git";

export interface RepositoryOptions {
  name: string;
  repoPath: string;
  localPath: string;
}

export class Repository {
  private git: SimpleGit;
  private repoDir: string;

  constructor(
    private repositoryOptions: RepositoryOptions,
    workingDir: string
  ) {
    this.repoDir = path.join(workingDir, this.repositoryOptions.localPath);
    if (!fs.existsSync(this.repoDir)) {
      fs.mkdirSync(this.repoDir);
    }

    this.git = simpleGit(this.repoDir);
  }

  async clone() {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (isGitRepo) {
      return;
    }

    await this.git.clone(this.repositoryOptions.repoPath, this.repoDir);
  }

  async pull() {
    await this.git.pull();
  }
}
