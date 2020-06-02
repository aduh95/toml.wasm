import * as TOML from "../web/toml2js.js";

const PROJECT_ROOT = ".";

await TOML.default(await Deno.readFile(PROJECT_ROOT + "/web/toml2js_bg.wasm"));

Deno.test({
  name: "simpleTranscription",
  async fn(): Promise<void> {
    const [actual, expected] = await Promise.all([
      readFile(PROJECT_ROOT + "/tests/input.toml").then(TOML.parse),
      readFile(PROJECT_ROOT + "/tests/output.json").then(JSON.parse),
    ]);
    if (!isDeepEqual(actual, expected))
      return Promise.reject(new Error("ASSERTION ERROR: test data mismatch."));
  },
});

const utf8Decoder = new TextDecoder("utf-8");
async function readFile(path: string) {
  const input = await Deno.open(path);
  const result = await Deno.readAll(input);
  input.close();
  return utf8Decoder.decode(result);
}

function isDeepEqual(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (!(key in actual) || !isDeepEqual(actual[key], expectedValue))
      return false;
  }

  return true;
}
