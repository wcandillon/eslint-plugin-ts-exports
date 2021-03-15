import { Project } from "ts-morph";
export const analyze = (tsConfigFilePath: string) => {
  const project = new Project({
    tsConfigFilePath,
  });
  project.getSourceFiles().map((file) => {
    const symbols = file.getExportSymbols();
  });
};
