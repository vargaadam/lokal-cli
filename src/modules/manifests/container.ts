import * as k from "cdk8s";
import { AppProps } from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { DeploymentOptions } from "./interfaces/deployment";

export class ManifestContainer {
  private app: k.App;
  private chart: k.Chart;

  constructor(private workspaceName: string, private synthOptions?: AppProps) {
    this.app = new k.App(this.synthOptions);
    this.chart = new k.Chart(this.app, this.workspaceName);
  }

  createDeployment(options: DeploymentOptions) {
    const deployment = new kplus.Deployment(this.chart, options.appName, {
      containers: [{ image: "", port: options.port }],
    });

    if (options.portForward) {
      deployment.exposeViaService({
        targetPort: options.portForward,
      });
    }
  }

  synth() {
    this.app.synth();
  }
}
