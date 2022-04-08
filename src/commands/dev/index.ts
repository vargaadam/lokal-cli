import child_process from "child_process";
import { BaseCommand } from "../../base-command";

export default class Dev extends BaseCommand {
  static examples = ["$ lkl dev DIRECTORY"];

  async run() {
    child_process.execSync(`skaffold dev -f ${this.skaffoldFilePath}`, {
      stdio: "inherit",
    });
  }
}
