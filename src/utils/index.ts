import { WorkspaceAppOptions } from "../modules/workspace";

export const getAppName = (workspaceAppOptions: WorkspaceAppOptions) => {
  return workspaceAppOptions.alias || workspaceAppOptions.name;
};
