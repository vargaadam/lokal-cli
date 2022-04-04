import path from "path";
import { File } from "../file";
import mockFs from "mock-fs";

const filePath = path.join(process.cwd(), "lokal.yaml");
const fileContent = "content";

describe("File tests", () => {
  beforeEach(() => {
    mockFs({
      [filePath]: fileContent,
    });
  });

  describe("#readFromFile", () => {
    it("should set the content to the red file content", () => {
      const file = new File(filePath);
      file.readFromFile();

      expect(file.content).toEqual(fileContent);
    });
  });
});
