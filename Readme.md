# 🚨 Currently a draft 🚨
This plugin is not in a usable state at the moment. We are trying to figure out a way to maintain a clean dependency tree without using too much resources.

ESLint wrapper for ts-prune

## Installation

This plugin requires your project to use TypeScript (>=4.1.3).

```sh
yarn add eslint-plugin-ts-exports --dev
```

## Example Configuration

The plugin relies on TypeScript compiler services to resolve types.
You need to set your `tsconfig.json` file in your eslint configuration via `parserOptions`.

```json
{
  "plugins": ["ts-exports"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "ts-exports/unused-exports": 2,
  }
}
```

## Rules
* [unused-exports](./docs/unused-exports.md)
