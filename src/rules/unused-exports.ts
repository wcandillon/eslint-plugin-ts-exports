import path from "path";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { run } from "ts-prune/lib/runner";

export type Options = [];
export type MessageIds = "UnusedExportsMessage";

type ResultSymbol = {
  name: string;
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
  usedInModule: boolean;
};

interface Analysis {
  [file: string]: ResultSymbol[];
}

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-ts-exports/blob/master/docs/${name}.md`;
});

const UnusedExportsMessage = "export {{name}} is unused";
const isMacOS = process.platform === "darwin";

let analysis: Analysis | null = null;

export default createRule<Options, MessageIds>({
  name: "unused-exports",
  meta: {
    type: "problem",
    docs: {
      description: "Detects unused exports in TypeScript",
      category: "Possible Errors",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      UnusedExportsMessage,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const parserServices = ESLintUtils.getParserServices(context);
    const config = parserServices.program.getCompilerOptions()
      .configFilePath as string;
    if (!analysis) {
      analysis = {};
      run(
        {
          project: config.substring(process.cwd().length),
          format: false,
        },
        (result: { file: string; symbol: ResultSymbol }) => {
          const nonNormalizedFile = path.join(process.cwd(), result.file);
          const file = isMacOS
            ? nonNormalizedFile.toLowerCase()
            : nonNormalizedFile;
          if (analysis !== null && analysis[file] === undefined) {
            analysis[file] = [result.symbol];
          } else if (analysis !== null) {
            (analysis[file] as ResultSymbol[]).push(result.symbol);
          }
        }
      );
    }
    return {
      Program: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const { fileName } = tsNode;
        if (!analysis) {
          return;
        }
        const errors = analysis[fileName];
        if (errors) {
          errors.forEach(({ name, start, end }) => {
            context.report({
              messageId: "UnusedExportsMessage",
              loc: {
                start,
                end,
              },
              data: {
                name,
              },
            });
          });
        }
      },
    };
  },
});
