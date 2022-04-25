import {TwitterConst} from "./const/twitter-const";

/**
 * ユーザプロパティ設定
 */
global.setProperty = ():void => {
  // ユーザプロパティを取得
  const userProperties = PropertiesService.getUserProperties();
  // ユーザプロパティをリセット
  userProperties.deleteAllProperties();

  // コンシューマキー
  userProperties.setProperty(TwitterConst.CONSUMER_KEY, `${process.env.CONSUMER_KEY}`);
  // コンシューマーキーの鍵
  userProperties.setProperty(TwitterConst.CONSUMER_SECRET, `${process.env.CONSUMER_SECRET}`);
  // ユーザID
  userProperties.setProperty(TwitterConst.USER_ID, `${process.env.USER_ID}`);
  // ハッシュタグ
  userProperties.setProperty(TwitterConst.HASH_TAG, `${process.env.HASH_TAG}`);
};
