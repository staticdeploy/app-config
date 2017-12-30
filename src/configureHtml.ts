import { load } from "cheerio";

import generateConfigScript from "./generateConfigScript";
import IConfig from "./IConfig";

export interface IOptions {
    html: Buffer;
    selector: string;
    rawConfig: IConfig;
    configKeyPrefix: string;
}

export default function configureHtml(options: IOptions) {
    const { html, selector, rawConfig, configKeyPrefix } = options;
    const configScript = generateConfigScript({ rawConfig, configKeyPrefix });
    const $ = load(html.toString());
    $(selector)
        .removeAttr("src")
        .html(configScript);
    const configuredHtml = $.html();
    return Buffer.from(configuredHtml);
}
