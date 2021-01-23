#!/usr/bin/env node
"use strict";

// This script patches the `wasm-pach` implementation to allow users to pass
// `TypedArray`s directly to `TOML.parse`, removing the need to convert them to
// strings first.

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const [, , folder, main] = process.argv;

const PACKAGE_ROOT = path.resolve(folder);

const pkgPackageConfigFile = path.join(PACKAGE_ROOT, "package.json");
const pkg = require(pkgPackageConfigFile);

const { types } = pkg;
{
  const cjs = fs.openSync(path.join(PACKAGE_ROOT, pkg[main]), "r+");

  const needle = `function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}`;
  const firstLineReturn = needle.indexOf("\n");
  const replaceStr = `${needle.slice(
    0,
    firstLineReturn
  )}if(ArrayBuffer.isView(arg)){const l=arg.byteLength,p=malloc(l);getUint8Memory0().set(arg,p);WASM_VECTOR_LEN=l;return p}${needle
    .slice(firstLineReturn)
    .replace(/\s*(\W)\s+/g, "$1")}`.padEnd(needle.length, " ");

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
