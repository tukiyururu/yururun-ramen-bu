export class RamenBuConst {
  // Twitterの設定
  // コンシューマキー
  static readonly CONSUMER_KEY: String = `${process.env.CONSUMER_KEY}`;
  // コンシューマーキーの鍵
  static readonly CONSUMER_SECRET: String = `${process.env.CONSUMER_SECRET}`;
  // ユーザID
  static readonly USER_ID: String = `${process.env.USER_ID}`;
  // ハッシュタグ
  static readonly HASH_TAG: String = `${process.env.HASH_TAG}`;
}
