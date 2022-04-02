import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs";

export class Resource {
  private git: SimpleGit;

  constructor(private repoPath: string, private localPath: string) {
    this.git = simpleGit();
  }

  async clone() {
    if (fs.existsSync(this.localPath)) {
      return;
    }

    await this.git.clone(this.repoPath, this.localPath);
  }
}
