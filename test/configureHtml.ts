import { expect } from "chai";
import { load } from "cheerio";

import configureHtml from "../src/configureHtml";

describe("getConfiguredHtml", () => {
    const options = {
        html: Buffer.from(`
            <!doctype html>
            <html>
                <head>
                    <title>title</title>
                    <script id="app-config" src="/app-config.js"></script>
                </head>
                <body>
                </body>
            </html>
        `),
        selector: "script#app-config",
        rawConfig: { KEY: "VALUE" },
        configKeyPrefix: ""
    };

    it("injects the generated config script into the supplied html buffer, inside element@selector", () => {
        const configuredHtml = configureHtml(options).toString();
        const $ = load(configuredHtml);
        const scriptContent = $(options.selector).html();
        expect(scriptContent).to.have.string("window.APP_CONFIG");
    });

    it("removes the src attribute from element@selector", () => {
        const configuredHtml = configureHtml(options).toString();
        const $ = load(configuredHtml);
        const scriptSrc = $(options.selector).attr("src");
        expect(scriptSrc).to.equal(undefined);
    });
});
