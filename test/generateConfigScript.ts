import { expect } from "chai";
import { VM } from "vm2";

import generateConfigScript, { IOptions } from "../src/generateConfigScript";

function getGeneratedAPP_CONFIG(options: IOptions) {
    const script = generateConfigScript(options);
    const vm = new VM({ sandbox: { window: {} } });
    vm.run(script);
    return vm.run("window.APP_CONFIG");
}

describe("generateConfigScript", () => {
    describe("generates a script that", () => {
        it("is valid, non-throwing javascript", () => {
            const script = generateConfigScript({
                rawConfig: { KEY: "VALUE" },
                configKeyPrefix: ""
            });
            const vm = new VM({ sandbox: { window: {} } });
            vm.run(script);
        });

        it("defines global variable window.APP_CONFIG", () => {
            const APP_CONFIG = getGeneratedAPP_CONFIG({
                rawConfig: { KEY: "VALUE" },
                configKeyPrefix: ""
            });
            expect(APP_CONFIG).not.to.equal(undefined);
        });

        describe("defines window.APP_CONFIG from the passed-in rawConfig object", () => {
            describe("filtering out keys that don't have the specified prefix", () => {
                it("case: prefix = empty string (no filtering occurs)", () => {
                    const APP_CONFIG = getGeneratedAPP_CONFIG({
                        rawConfig: { KEY: "VALUE" },
                        configKeyPrefix: ""
                    });
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE"
                    });
                });
                it("case: prefix = APP_CONFIG_ (filtering occurs)", () => {
                    const APP_CONFIG = getGeneratedAPP_CONFIG({
                        rawConfig: {
                            NON_PREFIXED_KEY: "VALUE_0",
                            APP_CONFIG_KEY: "VALUE_1"
                        },
                        configKeyPrefix: "APP_CONFIG_"
                    });
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE_1"
                    });
                });
            });
            describe("stripping the prefix from the defined window.APP_CONFIG keys", () => {
                it("case: prefix = empty string", () => {
                    const APP_CONFIG = getGeneratedAPP_CONFIG({
                        rawConfig: {
                            KEY: "VALUE",
                            "0_KEY_STARTS_WITH_NUMBER": "VALUE",
                            "STRANGE_CHARS_IN_KEY_\\/": "VALUE",
                            STRANGE_CHARS_IN_VALUE: '"\\\n\t'
                        },
                        configKeyPrefix: ""
                    });
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE",
                        "0_KEY_STARTS_WITH_NUMBER": "VALUE",
                        "STRANGE_CHARS_IN_KEY_\\/": "VALUE",
                        STRANGE_CHARS_IN_VALUE: '"\\\n\t'
                    });
                });
                it("case: prefix = APP_CONFIG_", () => {
                    const APP_CONFIG = getGeneratedAPP_CONFIG({
                        rawConfig: {
                            APP_CONFIG_KEY: "VALUE",
                            APP_CONFIG_0_KEY_STARTS_WITH_NUMBER: "VALUE",
                            "APP_CONFIG_STRANGE_CHARS_IN_KEY_\\/": "VALUE",
                            APP_CONFIG_STRANGE_CHARS_IN_VALUE: '"\\\n\t'
                        },
                        configKeyPrefix: "APP_CONFIG_"
                    });
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE",
                        "0_KEY_STARTS_WITH_NUMBER": "VALUE",
                        "STRANGE_CHARS_IN_KEY_\\/": "VALUE",
                        STRANGE_CHARS_IN_VALUE: '"\\\n\t'
                    });
                });
            });
        });
    });
});
