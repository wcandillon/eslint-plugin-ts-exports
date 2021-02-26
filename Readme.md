ESLint wrapper for ts-unused-exports

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
