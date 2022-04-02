import mockFs from "mock-fs";

import { Resource } from "../resource";

const mockClone = jest.fn().mockResolvedValue({});

jest.mock("simple-git", () => () => ({
  clone: mockClone,
}));

describe("Resource tests", () => {
  describe("#init", () => {
    it("should clone the given repo", async () => {
      const repoPath = "git@github.com:vargaadam/ticketing-system.git";
      const localPath = "test";

      const resource = new Resource(repoPath, localPath);
      await resource.clone();

      expect(mockClone).toHaveBeenCalledWith(repoPath, localPath);
    });

    it("should skip the cloning if the dir is already exists", async () => {
      const filePath = process.cwd();

      mockFs({
        [filePath]: {},
      });

      const repoPath = "git@github.com:vargaadam/ticketing-system.git";

      const resource = new Resource(repoPath, filePath);
      await resource.clone();

      expect(mockClone).not.toHaveBeenCalled();
    });
  });
});
