import {RamenBuConst} from "./const/ramen-bu-const";
import {TwitterConst} from "./const/twitter-const";
import {Twitter} from "./lib/twitter";
import {Util} from "./lib/util";

/**
 * ユーザプロパティ
 * @constant {GoogleAppsScript.Properties.Properties}
 */
const userProperties = PropertiesService.getUserProperties();

/**
 * Twitterインスタンス
 * @constant {Twitter}
 */
const twitter = new Twitter(global.setCallback.name, userProperties);

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
 * ハッシュタグのリツイート
 */
global.hashTagRetweet = () => {
  // タイムラインを取得
  const result = twitter.homeTimeline()[0];

  // ログ出力
  Logger.log(result.id_str);
  Logger.log(result.text);
};

/**
 * 日次ツイート
 */
global.dailyUpdate = () => {
  // 回数を設定
  const count : number = 0;
  // ハッシュタグ
  const hashTag: string = `${userProperties.getProperty(TwitterConst.HASH_TAG)}`;

  for (const dailyMessage of RamenBuConst.DAILY_MESSAGE_ARRAY) {
    // 日次メッセージ 配列からメッセージオブジェクトを取得
    if (count <= dailyMessage.border) {
      // 回数を全核変換
      const zenCount: string = Util.toZenkaku(`${count}`);
      // 現在時刻を取得
      const now: string = new Date().toString();

      // ツイート文字列を設定
      const status = Util.format(RamenBuConst.DAILY_MESSAGE_COUNT, hashTag, zenCount) +
          Util.format(dailyMessage.message, hashTag) + " " + now;
      // ツイート結果を取得
      const result = twitter.update(status);

      // ログ出力
      Logger.log(result.id_str);
      Logger.log(result.text);

      // forループを終了
      break;
    }
  }
};
