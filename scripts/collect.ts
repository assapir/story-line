// base on: https://github.com/cryptoeconomicslab/plasma-chamber/blob/master/scripts/collect.js
import * as fs from "fs";
import * as path from "path";
const lernaConfig = require("../lerna.json");

function logToConsoleWithColor(text: string) {
    console.log(`\x1b[34m`, text, `\x1b[0m`);
}

function getSourcePath(moduleName: string) {
    return path.join(__dirname, `../${moduleName}/coverage/coverage-final.json`);
}

function getDestinationPath(moduleName: string) {
    return path.join(__dirname, `../coverage/${moduleName}.json`);
}

logToConsoleWithColor(`Start collection coverage information`);
lernaConfig.packages.map((moduleName: string) => {
    logToConsoleWithColor(`Collecting coverage for ${moduleName}`);
    fs.copyFileSync(getSourcePath(moduleName), getDestinationPath(moduleName));
});
logToConsoleWithColor(`Finished collection coverage information`);