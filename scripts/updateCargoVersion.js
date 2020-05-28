const fs = require("fs");
const { join } = require("path");

const TOML = require("@aduh95/toml");

const PACKAGE_ROOT = join(__dirname, "..");
const CARGO_FILE = join(PACKAGE_ROOT, "Cargo.toml");

const data = TOML.parse(fs.readFileSync(CARGO_FILE, "utf8"));

data.package.version = require(join(PACKAGE_ROOT, "package.json")).version;

fs.writeFileSync(CARGO_FILE, TOML.stringify(data));
