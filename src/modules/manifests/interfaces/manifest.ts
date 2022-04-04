export interface ManifestDeploymentOptions {
  enabled: boolean;
  port: number;
}

export interface ManifestOptions {
  deployment?: ManifestDeploymentOptions;
}
