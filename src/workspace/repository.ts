import fs from "fs";
import path from "path";
import simpleGit, { CheckRepoActions, GitError, SimpleGit } from "simple-git";

export class Repository {
  git: SimpleGit;
  localPath: string;
  name: string;

  constructor(localPath: string, name: string) {
    this.localPath = localPath;
    this.name = name;
    if (!fs.existsSync(this.localPath)) {
      fs.mkdirSync(this.localPath, { recursive: true });
    }

    this.git = simpleGit(this.localPath);
  }

  async clone(repoUrl: string) {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (isGitRepo) {
      await this.git.fetch(repoUrl);
      return;
    }

    await this.git.clone(repoUrl, this.localPath);
  }

  async checkoutBranch(branchName: string) {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    const branch = await this.git.branchLocal();

    if (!branch.all.includes(branchName)) {
      try {
        const originBranchName = path.join("origin", branchName);

        await this.git.checkoutBranch(branchName, originBranchName);
      } catch (error) {
        if (error instanceof GitError) {
          console.log(
            `An Error occurred when checking out ${this.name} service branch: ${error.message}`
          );
        }
      }
    }
  }

  async pull() {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    await this.git.pull();
  }
}
