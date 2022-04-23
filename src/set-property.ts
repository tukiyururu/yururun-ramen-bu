import {RamenBuConst} from "./ramen-bu-const";

global.setProperty = ():void => {
  // ユーザプロパティを取得
  const userProperties = PropertiesService.getUserProperties();
  // ユーザプロパティをリセット
  userProperties.deleteAllProperties();

  // コンシューマキー
  userProperties.setProperty(RamenBuConst.CONSUMER_KEY, `${process.env.CONSUMER_KEY}`);
  // コンシューマーキーの鍵
  userProperties.setProperty(RamenBuConst.CONSUMER_SECRET, `${process.env.CONSUMER_SECRET}`);
  // ユーザID
  userProperties.setProperty(RamenBuConst.USER_ID, `${process.env.USER_ID}`);
  // ハッシュタグ
  userProperties.setProperty(RamenBuConst.HASH_TAG, `${process.env.HASH_TAG}`);
};
