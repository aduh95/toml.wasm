# toml2json

Parses TOML documents and outputs JSON.

## Usage

```js
import { toml2json } from "@aduh95/toml2json";

console.log(
  toml2json(`
[package]
name = "@aduh95/toml2json"
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
    "name": "@aduh95/toml2json",
    "version": "0.1.0"
  }
}
```

## Build

You need [NodeJS](https://nodejs.org) and
[wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).

```console
$ npm run build
```
