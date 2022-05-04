import BigNumber from "bignumber.js";
import {RamenBuConst} from "./const/ramen-bu-const";
import {TwitterConst} from "./const/twitter-const";
import {Sheet} from "./lib/sheet";
import {Twitter} from "./lib/twitter";
import {Util} from "./lib/util";

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
 * スプレッドシート設定
 */
global.setSheet = () => {
  // スプレッドシートに回数を設定
  Sheet.setCount(0);

  // タイムラインを取得
  const statuses = twitter.homeTimeline();

  if (statuses !== null) {
    // タイムラインが取得できた場合，スプレッドシートに最終IDを設定
    Sheet.setLastId(statuses[0].id_str);
  }
};

/**
 * ハッシュタグのリツイート
 */
global.hashTagRetweet = () => {
  // タイムラインを取得
  let statuses = twitter.homeTimeline();
  // スプレッドシートから最終IDを取得
  const lastId = Sheet.getLastId();

  if (statuses !== null && lastId !== null) {
    // タイムラインが取得できた，かつ，スプレッドシートが取得できた場合
    // ユーザプロパティを取得
    const userProperties = PropertiesService.getUserProperties();

    // ループ終了フラグを初期化
    let loopEndFlg = false;
    // ユーザIDを取得
    const userId: string = `${userProperties.getProperty(TwitterConst.USER_ID)}`;
    // 判定ハッシュタグを取得
    const matchHashtag: string = `${userProperties.getProperty(TwitterConst.HASH_TAG)}`;

    // 一時IDを設定
    let tempId = new BigNumber(lastId);
    // スプレッドシートに最終IDを設定
    Sheet.setLastId(statuses[0].id_str);
    // リツイートオブジェクト配列
    const retweets: RamenBu.Retweets[] = [];

    while (statuses !== null) {
      // タイムラインが取得できた場合，繰り返し
      for (const status of statuses) {
        // 一時IDを設定
        tempId = new BigNumber(status.id_str);

        if (tempId.isLessThanOrEqualTo(lastId)) {
          // 最終IDの場合，ループ終了フラグを設定
          loopEndFlg = true;
          // forループを終了
          break;
        }

        if (!status.retweeted_status && status.user.id_str !== userId) {
          // リツイートでない，かつ，自分のツイートでない場合
          for (const hashtag of status.entities.hashtags) {
            if (hashtag.text === matchHashtag) {
              // ハッシュタグが一致した場合，リツイートオブジェクトを追加
              retweets.push({
                id_str: status.id_str,
                screen_name: status.user.screen_name
              });

              // forループを終了
              break;
            }
          }
        }
      }

      if (loopEndFlg) {
        // ループ終了
        break;
      } else {
        // 最大IDを設定
        const maxId = tempId.minus(1).toFixed(0);
        // タイムラインを取得
        statuses = twitter.homeTimeline(maxId);
      }
    }

    for (let i = retweets.length - 1; i >= 0; i--) {
      // リツイートオブジェクトを取得
      const retweet = retweets[i];
      // メッセージ変換
      const message = Util.format(TwitterConst.RT_FAV_MESSAGE, retweet.screen_name, retweet.id_str);

      // ログ出力
      Logger.log(message);
    }
  }
};

/**
 * 日次ツイート
 */
global.dailyUpdate = () => {
  // スプレッドシートから回数を取得
  const count = Sheet.getCount();

  if (count !== null) {
    // スプレッドシートが取得できた場合
    // ユーザプロパティを取得
    const userProperties = PropertiesService.getUserProperties();
    // ハッシュタグ
    const hashTag: string = `${userProperties.getProperty(TwitterConst.HASH_TAG)}`;

    for (const dailyMessage of RamenBuConst.DAILY_MESSAGE_ARRAY) {
      // 日次メッセージ 配列からメッセージオブジェクトを取得
      if (count <= dailyMessage.border) {
        // 回数を全角変換
        const zenCount: string = Util.toZenkaku(`${count}`);
        // 現在時刻を取得
        const now: string = new Date().toString();

        // ツイート文字列を設定
        const status = Util.format(RamenBuConst.DAILY_MESSAGE_COUNT, hashTag, zenCount) +
            Util.format(dailyMessage.message, hashTag) + " " + now;
        // ツイート結果を取得
        const result = twitter.update(status);

        if (result !== null) {
          // ログ出力
          Logger.log(result.id_str);
          Logger.log(result.text);
        }

        // forループを終了
        break;
      }
    }
  }
};
