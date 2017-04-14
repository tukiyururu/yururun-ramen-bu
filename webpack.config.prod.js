"use strict";
var webpack = require("webpack");
var GasPlugin = require("gas-webpack-plugin");
var Dotenv = require("dotenv-webpack");
var config = require("./webpack.config");

config.plugins = [
    new GasPlugin(),
    new Dotenv({ path: ".env" })
];

module.exports = config;
