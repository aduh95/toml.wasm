#!/usr/bin/env node
"use strict";

// This script patches the `wasm-pach` implementation to allow users to pass
// `TypedArray`s directly to `TOML.parse`, removing the need to convert them to
// strings first.

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..", "nodejs");

const pkgPackageConfigFile = path.join(PACKAGE_ROOT, "package.json");
const pkg = require(pkgPackageConfigFile);

const { main, types } = pkg;
{
  const cjs = fs.openSync(path.join(PACKAGE_ROOT, main), "r+");

  const needle = `function passStringToWasm0(arg, malloc) {

    const len = Buffer.byteLength(arg);
    const ptr = malloc(len);
    getNodeBufferMemory0().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}`;
  const replaceStr = `function passStringToWasm0(a, malloc){const i=!ArrayBuffer.isView(a),l=i?Buffer.byteLength(a):a.byteLength,p=malloc(l),b=getNodeBufferMemory0();i?b.write(a,p,l):b.set(a,p);WASM_VECTOR_LEN=l;return p}`.padEnd(
    needle.length,
    " "
  );

  const index = fs.readFileSync(cjs).indexOf(needle);

  assert(index > 0);
  assert.strictEqual(needle.length, replaceStr.length);

  fs.writeSync(cjs, replaceStr, index, "utf8");
  fs.closeSync(cjs);
}

{
  const dts = fs.openSync(path.join(PACKAGE_ROOT, types), "r+");

  const needle = `/**
* @param {string} input 
* @returns {any} 
*/
export function parse(input: string): any;`;
  const replaceStr = needle.replaceAll(
    "string",
    "string | (ArrayBufferView & ArrayLike<number>)"
  );

  const dtsContent = fs.readFileSync(dts);
  const index = dtsContent.indexOf(needle);

  const offset = fs.writeSync(dts, replaceStr, index, "utf8");
  fs.writeSync(
    dts,
    dtsContent,
    index + needle.length,
    undefined,
    index + offset
  );
  fs.closeSync(dts);
}
