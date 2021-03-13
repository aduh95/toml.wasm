import NodeJsAPI from "./nodejs/toml2js";
import BrowserAPI from "./web/toml2js";

declare const exports: typeof NodeJsAPI | typeof BrowserAPI;

export default exports;
export * from "./nodejs/toml2js";
export * from "./web/toml2js";
