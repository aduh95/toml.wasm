const assert = require("assert");
const { readFileSync } = require("fs");
const { join } = require("path");
const { toml2json } = require("@aduh95/toml2json");

assert.deepStrictEqual(
  toml2json(readFileSync(join(__dirname, "input.toml"), "utf8")),
  readFileSync(join(__dirname, "output.json"), "utf8").trim()
);
