import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import analyzeTsConfig from "ts-unused-exports";

export type Options = [];
export type MessageIds = "UnusedExportsMessage";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-ts-exports/blob/master/docs/${name}.md`;
});

const UnusedExportsMessage = "{{name}} is unused";

export default createRule<Options, MessageIds>({
  name: "js-function-in-worklet",
  meta: {
    type: "problem",
    docs: {
      description:
        "non-worklet functions should be invoked via runOnJS. Use runOnJS() or workletlize instead.",
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
    return {
      Program: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const analysis = analyzeTsConfig(config, [tsNode.fileName]);
        const files = Object.values(analysis);
        files.forEach((file) => {
          file.forEach(({ exportName, location }) => {
            if (location) {
              context.report({
                messageId: "UnusedExportsMessage",
                loc: { line: location.line, column: location.character },
                data: {
                  name: exportName,
                },
              });
            }
          });
        });
      },
    };
  },
});
