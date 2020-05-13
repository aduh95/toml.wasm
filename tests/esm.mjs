import assert from "assert";
import { readFileSync } from "fs";
import { toml2json } from "@aduh95/toml2json";

assert.deepStrictEqual(
  toml2json(readFileSync(new URL("input.toml", import.meta.url), "utf8")),
  readFileSync(new URL("output.json", import.meta.url), "utf8").trim()
);
