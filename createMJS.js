const fs = require("fs");

const pkgPackageConfigFile = "./pkg/package.json";
const pkg = require(pkgPackageConfigFile);
const { name } = require("./package.json");

const { main } = pkg;
const esmMain = main.replace(".js", ".mjs");

const cjs = fs.readFileSync(`./pkg/${main}`, "utf8");

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
    )
    .replace(/module\.exports\.([^_])/g, (_, $1) => "export const " + $1) +
  ";export default module.exports;\n";

fs.writeFileSync(`./pkg/${esmMain}`, esm);
pkg.files.push(esmMain);

fs.writeFileSync(
  pkgPackageConfigFile,
  JSON.stringify({
    ...pkg,
    name,
    exports: { ".": { require: `./${main}`, import: `./${esmMain}` } },
  })
);
