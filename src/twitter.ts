import {RamenBuConst} from "./ramen-bu-const";

export class Twitter {
  // コールバック関数名
  private callbackFunctionName: string;
  // ユーザプロパティ
  private userProperties: GoogleAppsScript.Properties.Properties;

  public constructor(callbackFunctionName: string) {
    this.callbackFunctionName = callbackFunctionName;
    this.userProperties = PropertiesService.getUserProperties();
  }

  private getService(): GoogleAppsScript.OAuth1.Service {
    // コンシューマキー
    const consumerKey: string = `${this.userProperties
        .getProperty(RamenBuConst.CONSUMER_KEY)}`;
    // コンシューマキーの鍵
    const consumerSecret: string = `${this.userProperties
        .getProperty( RamenBuConst.CONSUMER_SECRET)}`;

    // サービスを作成
    return OAuth1.createService(RamenBuConst.SERVICE_NAME)
        .setConsumerKey(consumerKey)
        .setConsumerSecret(consumerSecret)
        .setAccessTokenUrl(RamenBuConst.ACCESS_TOKEN_URL)
        .setRequestTokenUrl(RamenBuConst.REQUEST_TOKEN_URL)
        .setAuthorizationUrl(RamenBuConst.AUTHORIZATION_URL)
        .setCallbackFunction(this.callbackFunctionName)
        .setPropertyStore(this.userProperties);
  }

  public setCallback(request: object): GoogleAppsScript.HTML.HtmlOutput {
    // サービスを取得
    const service = this.getService();
    // サービスの認証状態を取得
    const isAuthorized = service.handleCallback(request);

    // メッセージを設定
    let message: string = RamenBuConst.EMPTY_STRING;
    if (isAuthorized) {
      message = RamenBuConst.MESSAGE_AUTHORIZATION_OK;
    } else {
      message = RamenBuConst.MESSAGE_AUTHORIZATION_NO;
    }

    // メッセージを表示
    return HtmlService.createHtmlOutput(message);
  }

  public getAuthorizeUrl(): void {
    // サービスをリセット
    OAuth1.createService(RamenBuConst.SERVICE_NAME)
        .setPropertyStore(this.userProperties)
        .reset();
    // サービスを再取得
    const service = this.getService();

    // 認証URLをログ出力
    Logger.log(service.authorize());
  }
}
