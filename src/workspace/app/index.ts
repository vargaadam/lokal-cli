import path from "path";
import { App } from "../../app";
import { Repository } from "./repository";

const APP_LOKAL_FILE_NAME = ".lokal.yaml";

export interface WorkspaceAppOptions {
  env?: Record<string, string>;
  repository: {
    localPath: string;
    repoUrl?: string;
    branch?: string;
  };
}

export class WorkspaceApp {
  name: string;
  namespace: string;
  workingDir: string;
  options: WorkspaceAppOptions;
  lokalFile: string;

  constructor(
    name: string,
    namespace: string,
    workingDir: string,
    options: WorkspaceAppOptions,
    lokalFile: string = APP_LOKAL_FILE_NAME
  ) {
    this.name = name;
    this.namespace = namespace;
    this.workingDir = workingDir;
    this.options = options;
    this.lokalFile = lokalFile;
  }

  async cloneApp(isPull: boolean) {
    const repositoryOptions = this.options.repository;
    const repoDir = path.join(this.workingDir, repositoryOptions.localPath);
    const repository = new Repository(repoDir, this.name);

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

  initApp() {
    const appConfigFilePath = path.join(
      this.workingDir,
      this.options.repository.localPath,
      this.lokalFile
    );

    const app = new App(
      this.name,
      this.namespace,
      this.workingDir,
      appConfigFilePath,
      this.options
    );
    return app;
  }
}
