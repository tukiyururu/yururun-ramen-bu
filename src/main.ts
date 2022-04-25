import {Twitter} from "./lib/twitter";

/**
 * Twitterインスタンス
 * @constant {Twitter}
 */
const twitter = new Twitter(global.setCallback.name);

/**
 * コールバック関数
 * @param {object} request リクエスト
 * @return {GoogleAppsScript.HTML.HtmlOutput} メッセージHTML
 */
global.setCallback = (request: object) => {
  return twitter.setCallback(request);
};

/**
 * 認証URL取得
 */
global.getAuthorizeUrl = () => {
  twitter.getAuthorizeUrl();
};

/**
 * 日次ツイート
 */
global.dailyUpdate = () => {
  // 現在時刻を取得
  const now = new Date();
  // ツイート結果を取得
  const result = twitter.update( `テスト ${now.toString()}`);

  // ログ出力
  Logger.log(result.id_str);
  Logger.log(result.text);
};
