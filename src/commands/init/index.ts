import { Workspace } from "../../modules/workspace";
import BaseCommand from "../../base-command";

export default class Init extends BaseCommand {
  static examples = ["$ lkl init --workspace WORKSPACE"];

  async run(): Promise<void> {
    const { workspaces, apps } = this.lokalConfig;

    const filteredWorkspace = this.selectedWorkspace
      ? workspaces.filter(
          (workspace) => workspace.name === this.selectedWorkspace
        )
      : workspaces;

    await Promise.all(
      filteredWorkspace.map((workspace) => {
        return new Workspace(workspace, apps).initApps();
      })
    );
  }
}
