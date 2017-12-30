import { expect } from "chai";
import { load } from "cheerio";
import { execSync } from "child_process";
import { createTree, destroyTree } from "create-fs-tree";
import { readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("inject-config", () => {
    const injectConfigPath = join(__dirname, "../../src/bin/inject-config.ts");
    const workdir = join(tmpdir(), "app-config");
    const file = join(workdir, "index.html");
    const selector = "script#app-config";
    const env = {
        APP_CONFIG_KEY: "VALUE"
    };
    const envKeyPrefix = "APP_CONFIG_";

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

    it("injects the config script generated from environment variables into the specified file", function() {
        this.timeout(5000);
        execSync(
            `$(npm bin)/ts-node ${injectConfigPath} --file ${file} --selector ${selector} --envKeyPrefix ${envKeyPrefix}`,
            { env: { ...process.env, ...env } }
        );
        const configuredFile = readFileSync(file, "utf8");
        const $ = load(configuredFile);
        const scriptContent = $(selector).html();
        expect(scriptContent).to.have.string("window.APP_CONFIG");
        expect(scriptContent).to.have.string("KEY");
    });
});
