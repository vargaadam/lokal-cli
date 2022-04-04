export interface ManifestDeployment {
  enabled: boolean;
  port: number;
}

export interface AppManifests {
  deployment?: ManifestDeployment;
}
