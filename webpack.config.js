"use strict";
var StringReplacePlugin = require("string-replace-webpack-plugin");
var GasPlugin = require("gas-webpack-plugin");
var Dotenv = require("dotenv-webpack");

var opts = {
    replacements: [
        {
            pattern: /\.default/g,
            replacement: function() {
                return "[\"default\"]";
            }
        }
    ]
}

module.exports = {
    entry: "./lib/main.ts",
    output: {
        filename: "main.gs",
        path: __dirname + "/dist",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: ["*", ".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /node_modules(\/|\\)bignumber.js/,
                use: [{ loader: StringReplacePlugin.replace(opts) }]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{ loader: "ts-loader?silent=true" }]
            }
        ]
    },
    plugins: [
        new GasPlugin(),
        new Dotenv({ path: ".env.test" })
    ]
};
