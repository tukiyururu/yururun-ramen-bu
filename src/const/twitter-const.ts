/**
 * Twitter取得用の定数クラス
 * @class {TwitterConst}
 */
export class TwitterConst {
  /**
   * コンシューマキー
   * @constant {string}
   */
  static readonly CONSUMER_KEY: string = "CONSUMER_KEY";

  /**
   * コンシューマーキーの鍵
   * @constant {string}
   */
  static readonly CONSUMER_SECRET: string = "CONSUMER_SECRET";

  /**
   * ユーザID
   * @constant {string}
   */
  static readonly USER_ID: string = "USER_ID";

  /**
   * ハッシュタグ
   * @constant {string}
   */
  static readonly HASH_TAG: string = "HASH_TAG";

  /**
   * サービス名
   * @constant {string}
   */
  static readonly SERVICE_NAME: string = "Twitter";

  /**
   * アクセストークンURL
   * @constant {string}
   */
  static readonly ACCESS_TOKEN_URL: string = "https://api.twitter.com/oauth/access_token";

  /**
   * リクエストトークンURL
   * @constant {string}
   */
  static readonly REQUEST_TOKEN_URL: string = "https://api.twitter.com/oauth/request_token";

  /**
   * 認証URL
   * @constant {string}
   */
  static readonly AUTHORIZATION_URL: string = "https://api.twitter.com/oauth/authorize";

  /**
   * API URL
   * @constant {string}
   */
  static readonly API_URL: string = "https://api.twitter.com/1.1/";

  /**
   * APIパス タイムライン
   * @constant {string}
   */
  static readonly API_PATH_HOME_TIMELINE: string = "statuses/home_timeline";

  /**
   * APIパス ツイート
   * @constant {string}
   */
  static readonly API_PATH_UPDATE: string = "statuses/update";

  /**
   * タイムライン取得数
   * @constant {number}
   */
  static readonly HOME_TIMELINE_COUNT: number = 200;

  /**
   * 認証メッセージ 成功
   * @constant {string}
   */
  static readonly AUTHORIZATION_MESSAGE_OK: string = "認証に成功しました。";

  /**
   * 認証メッセージ 失敗
   * @constant {string}
   */
  static readonly AUTHORIZATION_MESSAGE_NO: string = "認証に失敗しました。";
}
