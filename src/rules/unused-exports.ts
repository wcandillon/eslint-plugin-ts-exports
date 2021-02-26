import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { Scope } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import {
  Node,
  isFunctionDeclaration,
  isBlock,
  isExpressionStatement,
  CallExpression,
  isFunctionTypeNode,
  getJSDocTags,
  isArrowFunction,
  isMethodSignature,
  isModuleBlock,
  isSourceFile,
} from "typescript";
import analyzeTsConfig, { ExportNameAndLocation } from "ts-unused-exports";

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
    // console.log({ result, context });
    return {
      Program: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const analysis = analyzeTsConfig(config, [tsNode.fileName]);
        const files = Object.values(analysis);
        files.forEach((file) => {
          file.forEach(({ exportName }) => {
            context.report({
              messageId: "UnusedExportsMessage",
              node,
              data: {
                name: exportName,
              },
            });
          });
        });
      },
    };
  },
});
