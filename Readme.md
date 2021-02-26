The goal of this plugin is to help you when writing animation worklets with Reanimated.

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
  "extends": "react-native-wcandillon",
  "plugins": ["reanimated"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "reanimated/js-function-in-worklet": 2,
  }
}
```

## Rules
* [unused-exports](./docs/unused-exports.md)
