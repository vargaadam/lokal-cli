export interface DeploymentOptions {
  appName: string;
  image: string;
  port: number;
  portForward?: number;
}
