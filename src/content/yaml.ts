import YAML from "yaml";
import { File } from "./file";

export class Yaml<T> extends File {
  constructor(filePath: string) {
    super(filePath);

    this.readFromFile();
  }

  parse(): T {
    return YAML.parse(this.content);
  }
}
