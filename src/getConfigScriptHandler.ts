import { RequestHandler } from "express";

import generateConfigScript from "./generateConfigScript";
import IConfig from "./IConfig";

export interface IOptions {
    rawConfig: IConfig;
    configKeyPrefix: string;
}

export default function getConfigScriptHandler(
    options: IOptions
): RequestHandler {
    const { rawConfig, configKeyPrefix } = options;
    const script = generateConfigScript({ rawConfig, configKeyPrefix });
    return (_req, res) =>
        res
            .type("js")
            .status(200)
            .send(script);
}
