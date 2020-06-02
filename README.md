# toml

This package contains methods for parsing
[TOML](https://github.com/toml-lang/toml) documents and converting JS objects to
TOML.

## Usage

### Node.js

```js
import * as TOML from "@aduh95/toml";

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
import * as TOML from "@aduh95/toml";

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

> If you are not using ECMAScript modules, you can use `require` instead of
> `import`:
>
> ```js
> const TOML = require("@aduh95/toml");
> TOML.parse('Hello = "World!"');
> ```

#### Web browser

_Works great on workers!_

Main difference with Node.js API is that the WASM fetching and compilation
happen asynchronously. You must call the `TOML.default` function before using
the `parse` and `stringify` methods.

```js
import * as TOML from "https://unpkg.com/@aduh95/toml/web/toml2js.js";

// Init the module
await TOML.default();
// Optionally, you can provide the absolute path to the WASM file
// await TOML.default("https://unpckg.com/@aduh95/toml/web/toml2js_bg.wasm");

const tomlString = TOML.stringify({
  hello: "world!",
});
const jsObject = TOML.parse(`pi=3.1415`);
```

#### Deno

Works same as the browser API.

If you are using the CDN version, you need to pass the `allow-net` flag in order
for `TOML.default` to download the WASM file.

If you are working from your local file system, you can pass the WASM file
directly to the `TOML.default` function in addition with the `--allow-read` CLI
flag.

```js
import * as TOML from "/path/to/toml2js.js";
// Init the module when the wasm file is on the file system
await TOML.default(await Deno.readFile("/path/to/toml2js_bg.wasm"));
```

### Limitations

No support for dates.

## Build

You need [NodeJS](https://nodejs.org) and
[wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).

```console
$ npm run build
$ npm run test
```
