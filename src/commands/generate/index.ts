import { OutputFlags } from "@oclif/core/lib/interfaces";
import BaseCommand from "../../base-command";
import { Workspace } from "../../modules/workspace";

export default class Generate extends BaseCommand {
  static examples = ["$ lkl generate DIRECTORY --workspace WORKSPACE"];

  static args = [...BaseCommand.args];

  static flags = {
    ...BaseCommand.flags,
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(Generate);

    const { workspaces, apps } = this.lokalConfig;

    const filteredWorkspace = flags.workspace
      ? workspaces.filter((workspace) => workspace.name === flags.workspace)
      : workspaces;

    await Promise.all(
      filteredWorkspace.map((workspace) =>
        new Workspace(
          workspace,
          apps,
          this.selectedWorkingDir
        ).generateManifests()
      )
    );
  }
}
