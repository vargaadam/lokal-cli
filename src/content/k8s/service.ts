import * as k from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { BaseK8s } from "./base";

export interface ServiceOptions {
  name: string;
  deployment: kplus.Deployment;
}

export class Service extends BaseK8s<kplus.Service, ServiceOptions> {
  constructor(chart: k.Chart) {
    super(chart);
  }

  create(options: ServiceOptions) {
    const service = new kplus.Service(this.chart, options.name, {
      metadata: { name: options.name },
    });
    service.addDeployment(options.deployment);

    return service;
  }
}
