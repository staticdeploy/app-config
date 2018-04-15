module.exports = config => {
    config.set({
        testRunner: "mocha",
        testFramework: "mocha",
        mochaOptions: {
            files: ["test/**/*.ts"],
            require: ["ts-node/register"]
        },
        mutate: ["src/**/*.ts"],
        mutator: "typescript",
        // Coverage analysis is not yet supported
        coverageAnalysis: "off",
        reporter: ["html", "clear-text", "progress"]
    });
};
