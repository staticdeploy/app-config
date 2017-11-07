import { load } from "cheerio";
import getDebug = require("debug");
import { readFileSync } from "fs";

import generateConfigScript, { IEnv } from "./generateConfigScript";

const debug = getDebug("app-config");

export default function getConfiguredHtml(
    htmlPath: string,
    selector: string,
    env: IEnv
) {
    const configScript = generateConfigScript(env);
    debug("Generated config script:");
    debug(configScript);
    const originalHtml = readFileSync(htmlPath, "utf8");
    debug("Loaded target html:");
    debug(originalHtml);
    const $ = load(originalHtml);
    $(selector)
        .removeAttr("src")
        .html(configScript);
    const html = $.html();
    debug("Injected config script in html:");
    debug(html);
    return Buffer.from(html);
}
