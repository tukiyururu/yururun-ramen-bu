import {RamenBuConst} from "./ramen-bu-const";

global.setProperty = ():void => {
  // ユーザプロパティを取得
  const userProps = PropertiesService.getUserProperties();
  // ユーザプロパティをリセット
  userProps.deleteAllProperties();

  // ユーザプロパティを設定
  // コンシューマキー
  userProps.setProperty(RamenBuConst.CONSUMER_KEY, `${process.env.CONSUMER_KEY}`);
  // コンシューマーキーの鍵
  userProps.setProperty(RamenBuConst.CONSUMER_SECRET, `${process.env.CONSUMER_SECRET}`);
  // ユーザID
  userProps.setProperty(RamenBuConst.USER_ID, `${process.env.USER_ID}`);
  // ハッシュタグ
  userProps.setProperty(RamenBuConst.HASH_TAG, `${process.env.HASH_TAG}`);
};
