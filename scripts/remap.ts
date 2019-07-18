// base on: https://github.com/cryptoeconomicslab/plasma-chamber/blob/master/scripts/remap.js
import * as remapIstanbul from "remap-istanbul";
import * as path from "path";

function logToConsoleWithColor(text: string) {
    console.log(`\x1b[34m`, text, `\x1b[0m`);
}

const input = path.join(__dirname, '../coverage/coverage.json');
const output = path.join(__dirname, '../coverage/lcov.info')
const collector = remapIstanbul.remap(remapIstanbul.loadCoverage(input), {
    warnMissingSourceMaps: false
});

logToConsoleWithColor(`Starting to remap reports`);
remapIstanbul.writeReport(collector, 'lcovonly', {}, output).then((report) => {
    console.log('remapping finished.')
});
logToConsoleWithColor(`Finish to remap reports`);