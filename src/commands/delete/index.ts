import child_process from "child_process";
import { BaseCommand } from "../../base-command";

export default class Delete extends BaseCommand {
  static examples = ["$ lkl delete DIRECTORY"];

  async run() {
    child_process.execSync(`skaffold delete -f ${this.skaffoldFilePath}`, {
      stdio: "inherit",
    });
  }
}
