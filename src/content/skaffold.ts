import { Yaml } from "./base/yaml";

interface BuildSyncOptions {
  src: string;
  dest: string;
}

export interface BuildOptions {
  image: string;
  context: string;
  docker: { dockerfile: string };
  sync: BuildSyncOptions[];
}

export class Skaffold extends Yaml {
  constructor(manifestsPaths: string[]) {
    super();

    this.content = {
      apiVersion: "skaffold/v2beta22",
      kind: "Config",
      deploy: {
        kubectl: {
          manifests: manifestsPaths,
        },
      },
      build: {
        local: {
          push: false,
        },
        artifacts: [],
      },
    };
  }

  addArtifact(buildOptions: BuildOptions) {
    this.content.build.artifacts.push(buildOptions);
  }
}
