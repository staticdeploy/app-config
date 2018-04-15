// tslint:disable:no-console
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import yargs = require("yargs");

import getConfigScriptHandler from "../getConfigScriptHandler";

interface IArgv extends yargs.Arguments {
    port: string;
}

const argv = yargs
    .usage("Usage: $0 <options>")
    .option("port", {
        default: "3456",
        describe: "Port to listen on",
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
    const { port } = argv;
    dotenv.config();
    express()
        .use(cors({ origin: /.*/, credentials: true }))
        .get(
            "/app-config.js",
            getConfigScriptHandler({
                rawConfig: process.env,
                configKeyPrefix: argv.envKeyPrefix
            })
        )
        .listen(port, () => {
            console.log(`dev-config-server started on port ${port}`);
        });
} catch (err) {
    console.error("Error starting dev-config-server");
    console.error(err);
    process.exit(1);
}
