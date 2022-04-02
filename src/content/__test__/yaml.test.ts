import path from "path";
import { Yaml } from "../yaml";
import mockFs from "mock-fs";

const filePath = path.join(process.cwd(), "lokal.yaml");

describe("Yaml tests", () => {
  beforeEach(() => {
    mockFs({
      [filePath]: "[ true, false, maybe, null ]\n",
    });
  });

  describe("#parse", () => {
    it("should parse the yaml content", () => {
      const yaml = new Yaml(filePath);
      const content = yaml.parse();

      expect(content).toEqual([true, false, "maybe", null]);
    });
  });
});
