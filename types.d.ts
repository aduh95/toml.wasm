import NodeJsAPI from "./nodejs";
import BrowserAPI from "./web";

declare const exports: typeof NodeJsAPI | typeof BrowserAPI;

export default exports;
export * from "./nodejs";
export * from "./web";
