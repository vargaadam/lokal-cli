import fs from "fs";
import path from "path";
import YAML from "yaml";

export class Yaml<T> {
  content?: T;
  filePath: string;

  constructor(filePath: string, content?: T) {
    this.filePath = filePath;
    this.content = content;
  }

  load(): T {
    const content = fs.readFileSync(this.filePath, "utf8");
    this.content = YAML.parse(content) as T;
    return this.content;
  }

  persist() {
    if (!this.content) {
      throw new Error("The content must be set!");
    }

    const stringifiedContent = YAML.stringify(this.content);

    const dirname = path.dirname(this.filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(this.filePath, stringifiedContent);
  }

  remove(path?: string) {
    const currPath = path || this.filePath;
    if (!fs.existsSync(currPath)) {
      return;
    }

    fs.rmSync(path || this.filePath, { recursive: true });
  }
}
