// tslint:disable:no-console
import { writeFileSync } from "fs";
import { resolve } from "path";
import yargs = require("yargs");

import getConfiguredHtml from "../getConfiguredHtml";

interface IArgv extends yargs.Arguments {
    file: string;
    selector: string;
}

const argv = yargs
    .usage("Usage: $0 <options>")
    .option("file", {
        coerce: resolve,
        demandOption: true,
        describe: "File to inject config into",
        type: "string"
    })
    .option("selector", {
        default: "script#app-config",
        describe: "Selector for the script element to inject config into",
        type: "string"
    })
    .wrap(Math.min(120, yargs.terminalWidth()))
    .strict().argv as IArgv;

// Use try-catch to give more descriptive error messages
try {
    writeFileSync(
        argv.file,
        getConfiguredHtml(argv.file, argv.selector, process.env)
    );
} catch (err) {
    console.error(
        `Error injecting config into ${argv.file} @ ${argv.selector}`
    );
    console.error(err);
    process.exit(1);
}
