const fs = require("fs");

/**
 * webpack用claspプラグイン
 * @class {ClaspPlugin}
 */
class ClaspPlugin {
  /**
   * @constructor
   * @param {object} config
   */
  constructor(config = {}) {
    // オプションのパラメータを設定
    this.config = Object.assign({}, {
      envPath: "./.env",
      rootDir: "./"
    }, config);
  }

  /**
   * webpack実行時の処理
   * @param {any} compiler
   */
  apply(compiler) {
    compiler.hooks.run.tap("ClaspPlugin", () => {
      // .envファイルを読込
      require("dotenv").config({
        path: this.config.envPath
      });

      // .clasp.jsonを設定
      const data = JSON.stringify({
        "scriptId": `${process.env.SCRIPT_ID}`,
        "rootDir": this.config.rootDir,
        "parentId": [
          `${process.env.PARENT_ID}`
        ]
      }, null, 2);

      // .clasp.jsonを生成
      fs.writeFile("./.clasp.json", data, (error) => {
        if (error) throw error;
      });
    });
  }
}

module.exports = ClaspPlugin;