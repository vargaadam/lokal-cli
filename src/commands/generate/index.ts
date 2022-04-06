import BaseCommand from "../../base-command";
import { Workspace } from "../../modules/workspace";

export default class Generate extends BaseCommand {
  static examples = ["$ lkl generate DIRECTORY --workspace WORKSPACE"];

  async run(): Promise<void> {
    const { workspaces, apps } = this.lokalConfig;

    const filteredWorkspace = this.selectedWorkspace
      ? workspaces.filter(
          (workspace) => workspace.name === this.selectedWorkspace
        )
      : workspaces;

    await Promise.all(
      filteredWorkspace.map((workspace) =>
        new Workspace(workspace, apps, this.workingDir).generateManifests()
      )
    );
  }
}
