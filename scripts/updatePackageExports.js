#!/usr/bin/env node
"use strict";

const fs = require("fs");
const pkg = require("../package.json");

const getFilesToDist = (folderName) =>
  require(`../${folderName}/package.json`).files.map(
    (filePath) => `${folderName}/${filePath}`
  );

pkg.files = [
  ...getFilesToDist("nodejs"),
  ...getFilesToDist("web"),
  "types.d.ts",
];
pkg.exports = {
  ".": {
    node: {
      require: `./nodejs/${require("../nodejs/package.json").main}`,
      import: `./nodejs/${require("../nodejs/package.json").module}`,
    },
    default: `./web/${require("../web/package.json").module}`,
  },
};
pkg.main = pkg.exports["."].node.require;
pkg.module = pkg.exports["."].default;
pkg.browser = pkg.exports["."].default;

fs.writeFileSync(
  require.resolve("../package.json"),
  JSON.stringify(pkg, null, 2) + "\n"
);

console.log("[INFO]: package.json exports have been updated.");
