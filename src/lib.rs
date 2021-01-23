mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse(input: &str) -> Result<JsValue, JsValue> {
    let val: toml::Value = toml::from_str(input)
      .map_err(|err| JsValue::from_str(&err.to_string()))?;
    let output = JsValue::from_serde(&val)
      .map_err(|err| JsValue::from_str(&err.to_string()))?;
    Ok(output)
}

#[wasm_bindgen]
pub fn stringify(input: &JsValue) -> Result<String, JsValue> {
  let val: toml::Value = input.into_serde()
    .map_err(|err| JsValue::from_str(&err.to_string()))?;
  let output = toml::to_string(&val)
    .map_err(|err| JsValue::from_str(&err.to_string()))?;
  Ok(output)
}
