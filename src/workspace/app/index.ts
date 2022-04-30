import path from "path";
import { App } from "../../app";
import { Repository } from "./repository";

export interface WorkspaceAppOptions {
  name: string;
  lokalFile?: string;
  env?: Record<string, string>;
  repository: {
    localPath: string;
    repoUrl?: string;
    branch?: string;
  };
  portForward?: number;
}

export class WorkspaceApp {
  workingDir: string;
  options: WorkspaceAppOptions;

  constructor(workingDir: string, options: WorkspaceAppOptions) {
    this.workingDir = workingDir;
    this.options = options;
  }

  async cloneApp(isPull: boolean) {
    const repositoryOptions = this.options.repository;
    const repoDir = path.join(this.workingDir, repositoryOptions.localPath);
    const repository = new Repository(repoDir, this.options.name);

    if (repositoryOptions.repoUrl) {
      await repository.clone(repositoryOptions.repoUrl);
    }

    if (repositoryOptions.branch) {
      await repository.checkoutBranch(repositoryOptions.branch);
    }

    if (isPull) {
      await repository.pull();
    }
  }

  async initApp(): Promise<App> {
    const appConfigFilePath = path.join(
      this.workingDir,
      this.options.repository.localPath,
      this.options.lokalFile || ".lokal"
    );

    const app = new App(this.workingDir, appConfigFilePath, this.options);
    return app;
  }
}
