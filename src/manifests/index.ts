import * as k from "cdk8s";
import { AppProps } from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { AppManifests } from "./interfaces";

export class Manifest {
  private app: k.App;
  private chart: k.Chart;

  constructor(private workspaceName: string, private synthOptions?: AppProps) {
    this.app = new k.App(this.synthOptions);
    this.chart = new k.Chart(this.app, this.workspaceName);
  }

  generate(appName: string, manifestOptions: AppManifests) {
    if (manifestOptions.deployment?.enabled) {
      this.createDeployment(this.chart, appName);
    }

    this.app.synth();
  }

  private createDeployment(chart: k.Chart, appName: string) {
    new kplus.Deployment(chart, appName, {
      containers: [{ image: "node" }],
    });
  }
}
