const ClaspPlugin = require("./clasp-plugin");
const Dotenv = require("dotenv-webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const GasPlugin = require("gas-webpack-plugin");

// .envのパスを設定
const envPath = `./.env/.env.${process.env.NODE_ENV}`;
// エントリーのパスを設定
let entryPath = "";
if (`${process.env.SET_PROP}` === "true") {
  entryPath = "./src/set-property.ts";
} else {
  entryPath = "./src/main.ts";
}

// webpackの設定
module.exports = {
  mode: `${process.env.NODE_ENV}`,
  entry: entryPath,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new ClaspPlugin({
      envPath: envPath,
      rootDir: "./dist"
    }),
    new Dotenv({
      path: envPath
    }),
    new ESLintPlugin({
      extensions: [".ts", ".js"],
      exclude: "node_modules"
    }),
    new GasPlugin()
  ]
};
