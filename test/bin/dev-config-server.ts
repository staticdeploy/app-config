import { expect } from "chai";
import { ChildProcess, spawn } from "child_process";
import { join } from "path";
import request = require("supertest");
import { VM } from "vm2";

describe("dev-config-server", () => {
    const devConfigServerPath = join(
        __dirname,
        "../../src/bin/dev-config-server.ts"
    );
    const env = {
        APP_CONFIG_KEY: "VALUE"
    };
    const envKeyPrefix = "APP_CONFIG_";
    let server: ChildProcess;

    beforeEach(function(done) {
        this.timeout(5000);
        server = spawn(
            require.resolve("ts-node/dist/bin.js"),
            [
                devConfigServerPath,
                "--port",
                "3456",
                "--envKeyPrefix",
                envKeyPrefix
            ],
            { env: { ...process.env, ...env } }
        );
        setTimeout(done, 1000);
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
