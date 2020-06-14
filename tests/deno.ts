import * as TOML from "../web/toml2js.js";

const PROJECT_ROOT = new URL("..", import.meta.url);

await TOML.default(
  await Deno.readFile(new URL("web/toml2js_bg.wasm", PROJECT_ROOT))
);

Deno.test({
  name: "simpleTranscription",
  async fn(): Promise<void> {
    const [actual, expected] = await Promise.all([
      Deno.readTextFile(new URL("tests/input.toml", PROJECT_ROOT)).then(
        TOML.parse
      ),
      Deno.readTextFile(new URL("tests/output.json", PROJECT_ROOT)).then(
        JSON.parse
      ),
    ]);
    if (!isDeepEqual(actual, expected))
      return Promise.reject(new Error("ASSERTION ERROR: test data mismatch."));
  },
});

function isDeepEqual(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (!(key in actual) || !isDeepEqual(actual[key], expectedValue))
      return false;
  }

  return true;
}
