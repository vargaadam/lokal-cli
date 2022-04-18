import * as k from "cdk8s";

export class BaseK8s<T> {
  chart: k.Chart;

  constructor(chart: k.Chart) {
    this.chart = chart;
  }
}
