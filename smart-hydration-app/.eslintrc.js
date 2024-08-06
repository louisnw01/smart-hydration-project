// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: "expo",
    rules: {
        eqeqeq: "off",
        "react-hooks/exhaustive-deps": 0,
    },
    ignorePatterns: ["*.test.ts", "metro.config.js", "jestSetupFile.js"],
};
