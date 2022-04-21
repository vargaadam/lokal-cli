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

    console.log(`Cloning ${this.name}`);

    await this.git.clone(repoUrl, this.localPath);
  }

  async checkoutBranch(branchName: string) {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    console.log(`Checking out ${this.name} ${branchName} branch`);

    const branch = await this.git.branchLocal();

    try {
      if (!branch.all.includes(branchName)) {
        await this.git.checkoutLocalBranch(branchName);
      } else {
        await this.git.checkout(branchName);
      }
    } catch (error) {
      if (error instanceof GitError) {
        console.log(
          `An Error occurred when checking out ${this.name} service branch: ${error.message}`
        );
        return;
      }

      throw error;
    }
  }

  async pull() {
    const isGitRepo = await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);

    if (!isGitRepo) {
      return;
    }

    console.log(`Pulling ${this.name}`);

    try {
      await this.git.pull();
    } catch (error) {
      if (error instanceof GitError) {
        console.log(
          `An Error occurred when pulling ${this.name}: ${error.message}`
        );
        return;
      }

      throw error;
    }
  }
}
