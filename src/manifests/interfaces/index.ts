export interface DeploymentEnv {
  [key: string]: any;
}

export interface ManifestDeployment {
  enabled: boolean;
  port: number;
  protForward: number;
  env?: DeploymentEnv;
}

export interface AppManifests {
  deployment?: ManifestDeployment;
}
