import { expect } from "chai";
import { ChildProcess, spawn } from "child_process";
import { join } from "path";
import request from "supertest";
import { VM } from "vm2";

describe("dev-config-server", () => {
    const devConfigServerPath = join(
        __dirname,
        "../../src/bin/dev-config-server.ts"
    );
    const env = {
        APP_CONFIG_KEY: "VALUE"
    };
    let server: ChildProcess;

    beforeEach(async function() {
        this.timeout(10000);
        server = spawn(
            require.resolve("ts-node/dist/bin.js"),
            [devConfigServerPath],
            { env: { ...process.env, ...env } }
        );
        await new Promise(resolve => {
            server.stdout!.on("data", chunk => {
                if (/dev-config-server started/.test(chunk.toString())) {
                    resolve();
                }
            });
        });
    });
    afterEach(() => {
        server.kill();
    });

    it("starts a server serving the config script generated from environment variables at /app-config.js", () => {
        return request("http://localhost:3456")
            .get("/app-config.js")
            .expect(200)
            .then(res => {
                const script = res.text;
                const vm = new VM({ sandbox: { window: {} } });
                vm.run(script);
                const APP_CONFIG = vm.run("window.APP_CONFIG");
                expect(APP_CONFIG).to.deep.equal({ KEY: "VALUE" });
            });
    });
});
