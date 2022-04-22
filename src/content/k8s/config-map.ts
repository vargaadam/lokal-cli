import dotenv from "dotenv";
import fs from "fs";
import * as k from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { BaseK8s } from "./base";

export interface ConfigMapOptions {
  name: string;
  fromFile?: string;
  env?: Record<string, string>;
}

export class ConfigMap extends BaseK8s<kplus.ConfigMap, ConfigMapOptions> {
  constructor(chart: k.Chart) {
    super(chart);
  }

  create(options: ConfigMapOptions) {
    const configMap = new kplus.ConfigMap(
      this.chart,
      options.name.concat("-cm"),
      {
        immutable: true,
      }
    );

    let envObject: Record<string, string> = {};
    if (options.fromFile) {
      envObject = this.loadEnvFromFile(options.fromFile);
    }

    if (options.env) {
      envObject = {
        ...envObject,
        ...options.env,
      };
    }

    for (const key in envObject) {
      const value = envObject[key];
      configMap.addData(key, value);
    }

    return configMap;
  }

  private loadEnvFromFile(fileName: string) {
    const envFile = fs.readFileSync(fileName);
    return dotenv.parse(envFile);
  }
}
