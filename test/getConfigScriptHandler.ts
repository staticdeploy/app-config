import { expect } from "chai";
import express from "express";
import request from "supertest";
import { VM } from "vm2";

import getConfigScriptHandler from "../src/getConfigScriptHandler";

describe("The express handler returned by getConfigScriptHandler", () => {
    const configScriptHandler = getConfigScriptHandler({
        rawConfig: { KEY: "VALUE" },
        configKeyPrefix: ""
    });
    const server = express().get("/app-config.js", configScriptHandler);

    it("serves the config script", () => {
        return request(server)
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

    it("returns the correct Content-Type for the script (~ application/javascript)", () => {
        return request(server)
            .get("/app-config.js")
            .expect(200)
            .expect("Content-Type", /application\/javascript/);
    });
});
