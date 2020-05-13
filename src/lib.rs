mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use serde_json::Deserializer;
// use serde_json::{Serializer, Deserializer};
use toml::ser::Serializer;
// use toml::de::Deserializer;

#[wasm_bindgen]
pub fn toml2json(input:&str) -> Result<String, JsValue>{
    let val: toml::Value = toml::from_str(input).map_err(|err| JsValue::from_str(&err.to_string()))?;
    let serde_json = serde_json::to_string_pretty(&val).map_err(|err| JsValue::from_str(&err.to_string()))?;
    Ok(serde_json)
}


#[test]
fn test_toml_to_json() {
    let input = r#"[Data]
is_cool = true
"#;

    let output = r#"{
  "Data": {
    "is_cool": true
  }
}"#;


    let conv = toml2json(input).unwrap();
    assert_eq!(conv, output);
}
