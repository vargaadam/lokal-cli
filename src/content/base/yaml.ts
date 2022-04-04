import fs from "fs";
import YAML from "yaml";

export class Yaml {
  content: any;

  load(path: string) {
    const content = fs.readFileSync(path, "utf8");
    this.content = YAML.parse(content);

    return this.content;
  }

  persist(path: string) {
    const content = YAML.stringify(this.content);
    fs.writeFileSync(path, content);
  }
}
