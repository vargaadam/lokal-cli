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
    const { workspaces: workspacesOptions, apps: appsOptions } =
      this.lokalConfig;

    const filteredWorkspaceOptions = workspacesOptions.filter(
      (workspaceOptions) =>
        flags.workspaces.find(
          (workspace) => workspace === workspaceOptions.name
        )
    );

    await Promise.all(
      filteredWorkspaceOptions.map((workspaceOptions) => {
        return new Workspace(
          workspaceOptions,
          appsOptions,
          this.selectedWorkingDir
        ).initApps(flags.pull);
      })
    );
  }
}
