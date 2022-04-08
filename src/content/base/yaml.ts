import fs from "fs";
import YAML from "yaml";

export class Yaml {
  content: any;

  constructor(public filePath: string) {}

  load() {
    const content = fs.readFileSync(this.filePath, "utf8");
    this.content = YAML.parse(content);

    return this.content;
  }

  persist() {
    const content = YAML.stringify(this.content);
    fs.writeFileSync(this.filePath, content);
  }
}
