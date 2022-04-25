import {TwitterConst} from "../const/twitter-const";
import {RamenBuConst} from "../const/ramen-bu-const";

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
   * ユーザプロパティ
   * @private {GoogleAppsScript.Properties.Properties}
   */
  private userProperties: GoogleAppsScript.Properties.Properties;

  /**
   * @constructor
   * @param {string} callbackFunctionName コールバック関数名
   */
  public constructor(callbackFunctionName: string) {
    // コールバック関数名を設定
    this.callbackFunctionName = callbackFunctionName;
    // ユーザプロパティを取得
    this.userProperties = PropertiesService.getUserProperties();
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

    // メッセージを表示
    return HtmlService.createHtmlOutput(message);
  }

  /**
   * 認証URL取得
   */
  public getAuthorizeUrl(): void {
    // サービスをリセット
    OAuth1.createService(TwitterConst.SERVICE_NAME)
        .setPropertyStore(this.userProperties)
        .reset();
    // サービスを再取得
    const service = this.getService();

    // 認証URLをログ出力
    Logger.log(service.authorize());
  }

  /**
   * ツイート
   * @param {string} status ツイート文字列
   * @return {TwitterJSON.JSON.Status} ツイート結果
   */
  public update(status: string): Twitter.JSON.Status {
    // post時のパラメータを設定
    const payload: GoogleAppsScript.URL_Fetch.Payload = {
      status: status
    };

    // API基底を呼出し
    return this.api<Twitter.JSON.Status>(TwitterConst.API_PATH_UPDATE, payload);
  }

  /**
   * サービス作成
   * @return {GoogleAppsScript.OAuth1.Service} サービス
   */
  private getService(): GoogleAppsScript.OAuth1.Service {
    // コンシューマキー
    const consumerKey: string = `${this.userProperties
        .getProperty(TwitterConst.CONSUMER_KEY)}`;
    // コンシューマキーの鍵
    const consumerSecret: string = `${this.userProperties
        .getProperty(TwitterConst.CONSUMER_SECRET)}`;

    // サービスを作成
    return OAuth1.createService(TwitterConst.SERVICE_NAME)
        .setConsumerKey(consumerKey)
        .setConsumerSecret(consumerSecret)
        .setAccessTokenUrl(TwitterConst.ACCESS_TOKEN_URL)
        .setRequestTokenUrl(TwitterConst.REQUEST_TOKEN_URL)
        .setAuthorizationUrl(TwitterConst.AUTHORIZATION_URL)
        .setCallbackFunction(this.callbackFunctionName)
        .setPropertyStore(this.userProperties);
  }

  /**
   * API基底
   * @param {string} apiPath APIパス
   * @param {GoogleAppsScript.URL_Fetch.Payload} payload post時のパラメータ
   * @return {T} 処理結果
   */
  private api<T>(apiPath: string, payload: GoogleAppsScript.URL_Fetch.Payload): T {
    // サービスを取得
    const service = this.getService();
    // 処理結果
    let result: any = null;

    // サービスにアクセスできた場合
    if (service.hasAccess()) {
      // API URLを設定
      const apiUrl: string = `${TwitterConst.API_URL}${apiPath}.json`;

      // URL Fetchのパラメータを設定
      const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: "post",
        payload: payload
      };

      // 処理結果を取得
      const response = service.fetch(apiUrl, params);
      // 処理結果をJSONに変換
      result = JSON.parse(response.getContentText());
    }

    // 処理結果を返却
    return <T> result;
  }
}
