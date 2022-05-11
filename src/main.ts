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
 * ハッシュタグのリツイート 関数名
 * @constant {string}
 */
const hashTagRetweetName: string = global.hashTagRetweet.name;

/**
 * 時分トリガー設定 関数名
 * @constant {string}
 */
const setAtTriggerName: string = global.setAtTrigger.name;

/**
 * 日次ツイート 関数名
 * @constant {string}
 */
const dailyUpdateName: string = global.dailyUpdate.name;

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
 * ゆるる幼稚園ラーメン部設定
 */
global.setRamenBu = () => {
  // タイムラインを取得
  const statuses = twitter.homeTimeline();

  if (statuses !== null) {
    // タイムラインが取得できた場合
    // スプレッドシートに最終IDを設定
    Sheet.setLastId(statuses[0].id_str);
    // スプレッドシートに回数を設定
    Sheet.setCount(0);

    // トリガーを削除
    Util.deleteTrigger(hashTagRetweetName);
    Util.deleteTrigger(setAtTriggerName);
    Util.deleteTrigger(dailyUpdateName);

    // ハッシュタグのリツイートのトリガーを設定
    Util.setEveryMinutesTrigger(RamenBuConst.HASH_TAG_RETWEET_MINUTE, hashTagRetweetName);
    // 時分トリガー設定のトリガーを設定
    Util.setAtHourTrigger(RamenBuConst.SET_AT_HOUR, setAtTriggerName);
  }
};

/**
 * 時分トリガー設定
 */
global.setAtTrigger = () => {
  // 日次ツイートのトリガーを設定
  Util.setAtTrigger(RamenBuConst.DAILY_UPDATE_HOUR,
      RamenBuConst.DAILY_UPDATE_MINUTE, dailyUpdateName);
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

    // ユーザIDを取得
    const userId: string = `${userProperties.getProperty(TwitterConst.USER_ID)}`;
    // 判定ハッシュタグを取得
    const matchHashTag: string = `${userProperties.getProperty(TwitterConst.HASH_TAG)}`;

    // ループ終了フラグを初期化
    let loopEndFlg = false;
    // 一時IDを設定
    let tempId = new BigNumber(lastId);
    // リツイートオブジェクト配列を初期化
    const retweets: Twitter.Retweets[] = [];

    // スプレッドシートに最終IDを設定
    const shtLastId = Sheet.setLastId(statuses[0].id_str);

    if (shtLastId !== null) {
      // スプレッドシートが取得できた場合
      while (statuses !== null) {
        // タイムラインが取得できた場合，ループ
        for (const status of statuses) {
          // 一時IDを設定
          tempId = new BigNumber(status.id_str);

          if (tempId.isLessThanOrEqualTo(lastId)) {
            // 最終IDの場合，ループ終了フラグを設定
            loopEndFlg = true;
            // forループを終了
            break;
          }

          if (!status.retweeted_status && userId !== status.user.id_str) {
            // リツイートでない，かつ，自分のツイートでない場合
            for (const hashtag of status.entities.hashtags) {
              if (matchHashTag === hashtag.text) {
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
          // ループを終了
          break;
        } else {
          // 最大IDを設定
          const maxId = tempId.minus(1).toFixed(0);
          // タイムラインを取得
          statuses = twitter.homeTimeline(maxId);
        }
      }
    }

    // スプレッドシートから回数を取得
    const count = Sheet.getCount();

    if (count !== null) {
      // スプレッドシートが取得できた場合
      // リツイートオブジェクトの数を取得
      const rtsCount: number = retweets.length;

      // スプレッドシートの回数を更新
      const shtCount = Sheet.setCount(rtsCount + count);

      if (shtCount !== null) {
        // スプレッドシートが取得できた場合
        for (let i = rtsCount - 1; i >= 0; i--) {
          // リツイートオブジェクトを取得
          const retweet = retweets[i];
          // リツイート
          twitter.retweet(retweet.id_str);
          // お気に入り
          twitter.favorite(retweet.id_str);

          if (RamenBuConst.DEVELOPMENT_STRING === `${process.env.NODE_ENV}`) {
            // 開発の場合，メッセージを設定
            const message = Util.format(TwitterConst.MESSAGE_RETWEET_FAVORITE,
                retweet.screen_name, retweet.id_str);
            // ログ出力
            Logger.log(message);
          }

          // スリープ
          Utilities.sleep(RamenBuConst.SLEEP);
        }
      }
    }
  }
};

/**
 * 日次ツイート
 */
global.dailyUpdate = () => {
  // 日次ツイートのトリガーを削除
  Util.deleteTrigger(dailyUpdateName);

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
      if (dailyMessage.border >= count) {
        // 回数を全角変換
        const zenCount: string = Util.toZenkaku(`${count}`);
        // ツイート文字列を設定
        const status = Util.format(RamenBuConst.DAILY_MESSAGE_COUNT, hashTag, zenCount) +
            Util.format(dailyMessage.message, hashTag);

        // ツイート結果を取得
        const result = twitter.update(status);

        if (result !== null) {
          // ツイート結果が取得できた場合，スプレッドシートの回数を初期化
          Sheet.setCount(0);

          if (RamenBuConst.DEVELOPMENT_STRING === `${process.env.NODE_ENV}`) {
            // 開発の場合，メッセージを設定
            const message = Util.format(TwitterConst.MESSAGE_UPDATE,
                result.user.screen_name, result.id_str);
            // ログ出力
            Logger.log(message);
          }
        }
        // forループを終了
        break;
      }
    }
  }
};
