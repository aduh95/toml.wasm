# toml

Parses TOML documents and outputs JS object.

## Usage

```js
import TOML from "@aduh95/toml";

console.log(
  TOML.parse(`
[package]
name = "@aduh95/toml"
version = "0.1.0"

[dependencies]
serde-transcode = "1.1.0"
serde_json = "1.0.40"
toml = "0.5.3"
wasm-bindgen = "0.2"
`)
);
```

This outputs:

```json
{
  "dependencies": {
    "serde-transcode": "1.1.0",
    "serde_json": "1.0.40",
    "toml": "0.5.3",
    "wasm-bindgen": "0.2"
  },
  "package": {
    "name": "@aduh95/toml",
    "version": "0.1.0"
  }
}
```

You can also use the `stringify` method that outputs a TOML string:

```js
import TOML from "@aduh95/toml";

console.log(
  TOML.stringify({
    dependencies: {
      "serde-transcode": "1.1.0",
      serde_json: "1.0.40",
      toml: "0.5.3",
      "wasm-bindgen": "0.2",
    },
    package: {
      name: "@aduh95/toml",
      version: "0.1.0",
    },
  })
);
```

### Limitations

No support for dates.

## Build

You need [NodeJS](https://nodejs.org) and
[wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).

```console
$ npm run build
```
