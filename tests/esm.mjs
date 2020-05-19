import assert from "assert";
import { readFileSync } from "fs";
import TOML from "@aduh95/toml";

assert.deepStrictEqual(
  TOML.parse(readFileSync(new URL("input.toml", import.meta.url), "utf8")),
  JSON.parse(readFileSync(new URL("output.json", import.meta.url)))
);
