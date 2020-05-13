const fs = require("fs");

const p = "./pkg/package.json";
const pp = require(p);

const { main } = pp;
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
pp.files.push(esmMain);

fs.writeFileSync(
  p,
  JSON.stringify({
    ...pp,
    exports: { ".": { require: main, import: esmMain } },
  })
);
