const fs = require("fs");

class ClaspPlugin {
  // コンストラクタ
  constructor (config = {}) {
    // オプションのパラメータを設定
    this.config = Object.assign({}, {
      envPath: "./.env",
      rootDir: "./"
    }, config)
  }

  apply(compiler) {
    compiler.hooks.run.tap("ClaspPlugin", (compilation) => {
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
      const file = "./.clasp.json"

      fs.writeFile(file, data, (err) => {
        console.log(`create ${file}`);
        if (err) throw err;
      });
    });
  }
}

module.exports = ClaspPlugin
