import mockFs from "mock-fs";

afterEach(() => {
  jest.clearAllMocks();
  mockFs.restore();
});
