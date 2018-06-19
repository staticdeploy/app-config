// tslint:disable:no-console
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import yargs from "yargs";

import configureHtml from "../configureHtml";

interface IArgv extends yargs.Arguments {
    file: string;
    selector: string;
    envKeyPrefix: string;
}

const argv = yargs
    .usage("Usage: $0 <options>")
    .option("file", {
        coerce: resolve,
        demandOption: true,
        describe: "Path of the file to inject config into",
        type: "string"
    })
    .option("selector", {
        default: "script#app-config",
        describe: "Selector for the script element to inject config into",
        type: "string"
    })
    .option("envKeyPrefix", {
        default: "APP_CONFIG_",
        describe:
            "Prefix of the environment variables to use for configuration",
        type: "string"
    })
    .wrap(Math.min(120, yargs.terminalWidth()))
    .strict().argv as IArgv;

// Use try-catch to give more descriptive error messages
try {
    const html = readFileSync(argv.file);
    const configuredHtml = configureHtml({
        html: html,
        selector: argv.selector,
        rawConfig: process.env,
        configKeyPrefix: argv.envKeyPrefix
    });
    writeFileSync(argv.file, configuredHtml);
} catch (err) {
    console.error(
        `Error injecting config into ${argv.file} @ ${argv.selector}`
    );
    console.error(err);
    process.exit(1);
}
