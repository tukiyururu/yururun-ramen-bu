export class RamenBuConst {
  // コンシューマキー
  static readonly CONSUMER_KEY: string = "CONSUMER_KEY";
  // コンシューマーキーの鍵
  static readonly CONSUMER_SECRET: string = "CONSUMER_SECRET";
  // ユーザID
  static readonly USER_ID: string = "USER_ID";
  // ハッシュタグ
  static readonly HASH_TAG: string = "HASH_TAG";

  // サービス名
  static readonly SERVICE_NAME: string = "Twitter";
  // エンドポイントURL
  static readonly ACCESS_TOKEN_URL: string = "https://api.twitter.com/oauth/access_token";
  static readonly REQUEST_TOKEN_URL: string = "https://api.twitter.com/oauth/request_token";
  static readonly AUTHORIZATION_URL: string = "https://api.twitter.com/oauth/authorize";
  // 認証時のメッセージを設定
  static readonly MESSAGE_AUTHORIZATION_OK: string = "認証に成功しました。";
  static readonly MESSAGE_AUTHORIZATION_NO: string = "認証に失敗しました。";

  // 空文字
  static readonly EMPTY_STRING: string = "";
}
