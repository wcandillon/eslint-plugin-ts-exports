import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import analyzeTsConfig from "ts-unused-exports";
import { Analysis } from "ts-unused-exports/lib/types";

export type Options = [];
export type MessageIds = "UnusedExportsMessage";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-ts-exports/blob/master/docs/${name}.md`;
});

const UnusedExportsMessage = "{{name}} is unused";

let analysis: Analysis | null = null;

export default createRule<Options, MessageIds>({
  name: "unused-exports",
  meta: {
    type: "problem",
    docs: {
      description:
        "Detects unused exports in TypeScript",
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
      analysis = analyzeTsConfig(config);
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
          errors.forEach(({ exportName, location }) => {
            const nodeOrLoc = location
              ? { loc: { line: location.line, column: location.character } }
              : node;
            context.report({
              messageId: "UnusedExportsMessage",
              ...nodeOrLoc,
              data: {
                name: exportName,
              },
            });
          });
        }
      },
    };
  },
});
