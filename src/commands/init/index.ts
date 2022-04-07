import { Workspace } from "../../modules/workspace";
import BaseCommand from "../../base-command";
import { Flags } from "@oclif/core";

export default class Init extends BaseCommand {
  static examples = ["$ lkl init DIRECTORY --workspace WORKSPACE"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
    pull: Flags.boolean({ default: false }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Init);
    const { workspaces, apps } = this.lokalConfig;

    const filteredWorkspace = flags.workspace
      ? workspaces.filter((workspace) => workspace.name === flags.workspace)
      : workspaces;

    await Promise.all(
      filteredWorkspace.map((workspace) => {
        return new Workspace(workspace, apps, this.selectedWorkingDir).initApps(
          flags.pull
        );
      })
    );
  }
}
