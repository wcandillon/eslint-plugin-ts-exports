import path from "path";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { run } from "ts-prune/lib/runner";

export type Options = [
  {
    ignoreUsedInModule?: boolean;
    ignoreTests?: boolean;
    ignoreIndex?: boolean;
    ignoreFiles?: string;
  }
];
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
const normalizePath = (filePath: string) =>
  process.platform === "darwin" ? filePath.toLowerCase() : filePath;

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
    schema: [
      {
        type: "object",
        properties: {
          ignoreUsedInModule: {
            type: "boolean",
          },
          ignoreTests: {
            type: "boolean",
          },
          ignoreIndex: {
            type: "boolean",
          },
          ignoreFiles: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      UnusedExportsMessage,
    },
  },
  defaultOptions: [
    { ignoreTests: false, ignoreIndex: true, ignoreUsedInModule: false },
  ],
  create: (context) => {
    const { ignoreUsedInModule, ignoreTests, ignoreIndex, ignoreFiles } = {
      ignoreTests: false,
      ignoreIndex: true,
      ignoreUsedInModule: false,
      ...context.options[0],
    };
    const parserServices = ESLintUtils.getParserServices(context);
    const config = parserServices.program.getCompilerOptions()
      .configFilePath as string;
    const analysis: Analysis = {};
    run(
      {
        project: config.substring(process.cwd().length),
        format: false,
      },
      (result: { file: string; symbol: ResultSymbol }) => {
        if (ignoreIndex && result.file.match("/index\\.(ts|tsx)$")) {
          return;
        }
        if (ignoreTests && result.file.match("(spec|test|Test)")) {
          return;
        }
        if (ignoreUsedInModule && result.symbol.usedInModule) {
          return;
        }
        if (ignoreFiles && result.file.match(ignoreFiles)) {
          return;
        }
        const nonNormalizedFile = path.join(process.cwd(), result.file);
        const file = normalizePath(nonNormalizedFile);
        if (analysis !== null && analysis[file] === undefined) {
          analysis[file] = [result.symbol];
        } else if (analysis !== null) {
          (analysis[file] as ResultSymbol[]).push(result.symbol);
        }
      }
    );
    return {
      Program: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const { fileName } = tsNode;
        if (!analysis) {
          return;
        }
        const errors = analysis[normalizePath(fileName)];
        if (errors) {
          errors.forEach(({ name, start, end }) => {
            context.report({
              messageId: "UnusedExportsMessage",
              loc: {
                start: {
                  line: start.line,
                  column: start.column - 1,
                },
                end: {
                  line: end.line,
                  column: end.column - 1,
                },
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
