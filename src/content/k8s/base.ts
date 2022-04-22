import * as k from "cdk8s";
import { Construct } from "constructs";

export abstract class BaseK8s<T extends Construct, O> {
  chart: k.Chart;

  constructor(chart: k.Chart) {
    this.chart = chart;
  }

  abstract create(options: O): T;
}
