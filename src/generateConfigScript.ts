import { startsWith } from "lodash";

import IConfig from "./IConfig";

export interface IOptions {
    rawConfig: IConfig;
    configKeyPrefix: string;
}

export default function generateConfigScript(options: IOptions): string {
    const { rawConfig, configKeyPrefix } = options;
    const config = Object.keys(rawConfig)
        .filter(key => startsWith(key, configKeyPrefix))
        .reduce<IConfig>(
            (c, key) => ({
                ...c,
                [key.slice(configKeyPrefix.length)]: rawConfig[key]
            }),
            {}
        );
    return `window.APP_CONFIG=${JSON.stringify(config)};`;
}
