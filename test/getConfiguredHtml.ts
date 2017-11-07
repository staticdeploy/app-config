import { expect } from "chai";
import { load } from "cheerio";
import { createTree, destroyTree } from "create-fs-tree";
import { tmpdir } from "os";
import { join } from "path";

import getConfiguredHtml from "../src/getConfiguredHtml";

describe("getConfiguredHtml", () => {
    const workdir = join(tmpdir(), "app-config");
    const file = join(workdir, "index.html");
    const selector = "script#app-config";
    const env = {
        APP_CONFIG_MY_VAR: "VALUE"
    };

    beforeEach(() => {
        createTree(workdir, {
            "index.html": `
                <!doctype html>
                <html>
                    <head>
                        <title>title</title>
                        <script id="app-config" src="/app-config.js"></script>
                    </head>
                    <body>
                    </body>
                </html>
            `
        });
    });
    afterEach(() => {
        destroyTree(workdir);
    });

    it("injects the generated config script into file@file, element@selector", () => {
        const html = getConfiguredHtml(file, selector, env).toString();
        const $ = load(html);
        const scriptContent = $(selector).html();
        expect(scriptContent).to.have.string("window.APP_CONFIG");
    });

    it("removes the src attribute from element@selector", () => {
        const html = getConfiguredHtml(file, selector, env).toString();
        const $ = load(html);
        const scriptSrc = $(selector).attr("src");
        expect(scriptSrc).to.equal(undefined);
    });
});
