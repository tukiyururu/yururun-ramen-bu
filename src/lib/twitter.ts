import {RamenBuConst} from "../const/ramen-bu-const";
import {TwitterConst} from "../const/twitter-const";

/**
 * Twitter取得用クラス
 * @class {Twitter}
 */
export class Twitter {
  /**
   * コールバック関数名
   * @private {string}
   */
  private callbackFunctionName: string;

  /**
   * @constructor
   * @param {string} callbackFunctionName コールバック関数名
   */
  public constructor(callbackFunctionName: string) {
    // コールバック関数名を設定
    this.callbackFunctionName = callbackFunctionName;
  }

  /**
   * コールバック関数
   * @param {object} request リクエスト
   * @return {GoogleAppsScript.HTML.HtmlOutput} メッセージHTML
   */
  public setCallback(request: object): GoogleAppsScript.HTML.HtmlOutput {
    // サービスを取得
    const service = this.getService();
    // サービスの認証状態を取得
    const isAuthorized = service.handleCallback(request);

    // メッセージを設定
    let message: string = RamenBuConst.EMPTY_STRING;
    if (isAuthorized) {
      message = TwitterConst.AUTHORIZATION_MESSAGE_OK;
    } else {
      message = TwitterConst.AUTHORIZATION_MESSAGE_NO;
    }

    // メッセージHTMLを表示
    return HtmlService.createHtmlOutput(message);
  }

  /**
   * 認証URL取得
   */
  public getAuthorizeUrl(): void {
    // ユーザプロパティを取得
    const userProperties = PropertiesService.getUserProperties();

    // サービスをリセット
    OAuth1.createService(TwitterConst.SERVICE_NAME)
        .setPropertyStore(userProperties)
        .reset();
    // サービスを再取得
    const service = this.getService();

    // 認証URLをログ出力
    Logger.log(service.authorize());
  }

  /**
   * タイムライン
   * @param {string} [maxId] 最大ID
   * @return {Twitter.JSON.Status[] | null}  タイムライン取得結果
   */
  public homeTimeline(maxId?: string): Twitter.JSON.Status[] | null {
    // パラメータを設定
    const params: Twitter.Parameters = {
      count: TwitterConst.HOME_TIMELINE_COUNT
    };

    if ("undefined" !== typeof maxId) {
      // 最大IDが設定された場合，最大IDをパラメータに設定
      params.max_id = maxId;
    }

    // API基底を呼出し
    return this.api<Twitter.JSON.Status[]>(TwitterConst.API_PATH_HOME_TIMELINE, params);
  }

  /**
   * ツイート
   * @param {string} status ツイート文字列
   * @return {Twitter.JSON.Status | null} ツイート結果
   */
  public update(status: string): Twitter.JSON.Status | null {
    // パラメータを設定
    const params: Twitter.Parameters = {
      status: status
    };

    // API基底を呼出し
    return this.api<Twitter.JSON.Status>(TwitterConst.API_PATH_UPDATE, params);
  }

  /**
   * リツイート
   * @param {string} id ツイートID
   * @return {Twitter.JSON.Status | null} リツイート結果
   */
  public retweet(id: string): Twitter.JSON.Status | null {
    // API基底を呼出し
    return this.api<Twitter.JSON.Status>(TwitterConst.API_PATH_RETWEET + id);
  }

  /**
   * お気に入り
   * @param {string} id ツイートID
   * @return {Twitter.JSON.Status | null} お気に入り結果
   */
  public favorite(id: string): Twitter.JSON.Status | null {
    // パラメータを設定
    const params: Twitter.Parameters = {
      id: id
    };

    // API基底を呼出し
    return this.api<Twitter.JSON.Status>(TwitterConst.API_PATH_FAVORITE, params);
  }

  /**
   * サービス作成
   * @return {GoogleAppsScript.OAuth1.Service} サービス
   */
  private getService(): GoogleAppsScript.OAuth1.Service {
    // ユーザプロパティを取得
    const userProperties = PropertiesService.getUserProperties();

    // コンシューマキー
    const consumerKey: string = `${userProperties.getProperty(TwitterConst.CONSUMER_KEY)}`;
    // コンシューマキーの鍵
    const consumerSecret: string = `${userProperties.getProperty(TwitterConst.CONSUMER_SECRET)}`;

    // サービスを作成
    return OAuth1.createService(TwitterConst.SERVICE_NAME)
        .setConsumerKey(consumerKey)
        .setConsumerSecret(consumerSecret)
        .setAccessTokenUrl(TwitterConst.ACCESS_TOKEN_URL)
        .setRequestTokenUrl(TwitterConst.REQUEST_TOKEN_URL)
        .setAuthorizationUrl(TwitterConst.AUTHORIZATION_URL)
        .setCallbackFunction(this.callbackFunctionName)
        .setPropertyStore(userProperties);
  }

  /**
   * パラメータ展開
   * @param {Twitter.Parameters} params パラメータ
   * @return {string} パラメータ文字列
   */
  private parse(params: Twitter.Parameters): string {
    return Object.keys(params).map((key: string) => {
      return key + "=" + params[key];
    }).join("&");
  }

  /**
   * API基底
   * @param {string} apiPath APIパス
   * @param {Twitter.Parameters} [params] パラメータ
   * @return {T} 処理結果
   */
  private api<T>(apiPath: string, params?: Twitter.Parameters): T | null {
    // 処理結果
    let result = null;

    try {
      // サービスを取得
      const service = this.getService();

      if (service.hasAccess()) {
        // サービスにアクセスできた場合
        // API URLを設定
        let apiUrl: string = TwitterConst.API_URL + apiPath + ".json";
        // URL Fetchオプションを初期化
        const opts: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {};

        if (TwitterConst.API_PATH_HOME_TIMELINE === apiPath) {
          // GETの場合
          opts.method = "get";

          if ("undefined" !== typeof params) {
            // パラメータが設定された場合，GET時のURLにパラメータを設定
            apiUrl += "?" + this.parse(params);
          }
        } else {
          // POSTの場合
          opts.method = "post";

          if ("undefined" !== typeof params) {
            // パラメータが設定された場合，POST時のパラメータを設定
            opts.payload = params;
          }
        }

        // 処理結果を取得
        const response = service.fetch(apiUrl, opts);
        // 処理結果をJSONに変換
        result = <T> JSON.parse(response.getContentText());
      }
    } catch (error: any) {
      // エラーログを出力
      console.error(error);
    }

    // 処理結果を返却
    return result;
  }
}
