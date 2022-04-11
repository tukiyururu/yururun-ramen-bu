const ClaspPlugin = require("./clasp-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const GasPlugin = require("gas-webpack-plugin");

// .envのパスを設定
const envPath = `./.env/.env.${process.env.NODE_ENV}`;

// webpackの設定
module.exports = {
  mode: `${process.env.NODE_ENV}`,
  entry: "./src/main.ts",
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
    new ESLintPlugin({
      extensions: [".ts", ".js"],
      exclude: "node_modules"
    }),
    new GasPlugin()
  ]
};
