import fs from "fs";
import YAML from "yaml";

export class Yaml<T> {
  content!: T;
  filePath: string;
  readonly fileExt = "yaml";

  constructor(filePath: string) {
    this.filePath = filePath.concat(".", this.fileExt);
  }

  load(): T {
    const content = fs.readFileSync(this.filePath, "utf8");
    this.content = YAML.parse(content);
    return this.content;
  }

  persist() {
    if (!this.content) {
      throw new Error("The content must be set!");
    }

    const stringifiedContent = YAML.stringify(this.content);
    fs.writeFileSync(this.filePath, stringifiedContent);
  }
}
