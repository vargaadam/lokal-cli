import fs from "fs";
import simpleGit, { CheckRepoActions, SimpleGit } from "simple-git";

export class Repository {
  git: SimpleGit;
  localPath: string;

  constructor(localPath: string) {
    this.localPath = localPath;
    if (!fs.existsSync(this.localPath)) {
      fs.mkdirSync(this.localPath, { recursive: true });
    }

    this.git = simpleGit(this.localPath);
  }

  async clone(repoUrl: string) {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (isGitRepo) {
      return;
    }

    await this.git.clone(repoUrl, this.localPath);
  }

  async pull() {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    await this.git.pull();
  }
}
