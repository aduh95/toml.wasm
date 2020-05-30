#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..", "nodejs");

const pkgPackageConfigFile = path.join(PACKAGE_ROOT, "package.json");
const pkg = require(pkgPackageConfigFile);

const { main } = pkg;
const esmMain = main.replace(/\.js$/, ".mjs");

const cjs = fs.readFileSync(path.join(PACKAGE_ROOT, main), "utf8");

const esm =
  "const module = {exports:{}};" +
  cjs
    .replace(
      "const { TextDecoder } = require(String.raw`util`)",
      "import{TextDecoder}from'util'"
    )
    .replace(
      /const path = require\('path'\)\.join\(__dirname,(.+)\)/,
      (_, $1) => `const path = new URL(${$1}, import.meta.url)`
    )
    .replace(
      "const bytes = require('fs').readFileSync",
      "import{readFileSync}from'fs';const bytes=readFileSync"
    ) +
  ";export default module.exports;\n" +
  [...getExports(cjs)]
    .map((name) => `export const {${name}} = module.exports;`)
    .join("\n") +
  "\n";

function* getExports(input) {
  const reg = /module\.exports\.([^_][^=]+)=/g;
  let results;
  while ((results = reg.exec(input)) !== null) {
    yield results[1];
  }
}

fs.writeFileSync(path.join(PACKAGE_ROOT, esmMain), esm);

// Mutate package.json
pkg.module = esmMain;
if (!pkg.files.includes(esmMain)) {
  pkg.files.push(esmMain);
}
fs.writeFileSync(pkgPackageConfigFile, JSON.stringify(pkg));
