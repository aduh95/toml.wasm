const assert = require("assert");
const { readFileSync } = require("fs");
const { join } = require("path");
const TOML = require("@aduh95/toml");

assert.deepStrictEqual(
  TOML.parse(readFileSync(join(__dirname, "input.toml"), "utf8")),
  JSON.parse(readFileSync(join(__dirname, "output.json")))
);
