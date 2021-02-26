import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/unused-exports";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.join(__dirname, "fixtures"),
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const code = (name: string) =>
  fs.readFileSync(path.join(__dirname, name), "utf8");
const VALID = "fixtures/valid";
const files = fs.readdirSync(path.join(__dirname, VALID));
const valid = files.map((file) => ({
  filename: path.join("valid", file),
  code: code(path.join(VALID, file)),
}));

ruleTester.run("unused-exports", rule, {
  valid,
  invalid: [
    {
      code: code("fixtures/invalid/test1.ts"),
      filename: "invalid/test1.ts",
      errors: [
        {
          messageId: "UnusedExportsMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
  ],
});
