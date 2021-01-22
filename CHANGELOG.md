# ChangeLog

### v0.4.0 (2021-01-22)

`TOML.parse`: Add support for `TypedArray` containing `UTF-8` strings. This is
useful to pass trusted data directly to the Rust backend without having to
decode it to a JavaScript string then encode it back to memory.

### v0.3.2 (2020-06-01)

Fix release script.

### v0.3.1 (2020-06-01)

Fix release script.

### v0.3.0 (2020-06-01)

- Add web version.
- Add tests for Deno.
- Add types (for TypeScript interop).

### v0.2.1 (2020-05-19)

Fix ESM exports.

### v0.2.0 (2020-05-19)

Use JS objects instead of JSON.
