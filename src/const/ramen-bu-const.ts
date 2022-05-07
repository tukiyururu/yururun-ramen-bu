/**
 * ゆるる幼稚園ラーメン部の定数クラス
 * @class {RamenBuConst}
 */
export class RamenBuConst {
  /**
   * 空文字
   * @constant {string}
   */
  static readonly EMPTY_STRING: string = "";

  /**
   * 開発判定用文字列
   * @constant {string}
   */
  static readonly DEVELOPMENT_STRING: string = "development";

  /**
   * スリープミリ秒数
   * @constant {number}
   */
  static readonly SLEEP: number = 3000;

  /**
   * 定時トリガー設定 時
   * @constant {number}
   */
  static readonly SET_AT_HOUR: number = 22;

  /**
   * 定時トリガー設定 分
   * @constant {number}
   */
  static readonly SET_AT_MINUTE: number = 50;

  /**
   * ハッシュタグのリツイート 分
   * @constant {number}
   */
  static readonly HASH_TAG_RETWEET_MINUTE: number = 15;

  /**
   * 日次ツイート 時
   * @constant {number}
   */
  static readonly DAILY_UPDATE_HOUR: number = 23;

  /**
   * 日次ツイート 分
   * @constant {number}
   */
  static readonly DAILY_UPDATE_MINUTE: number = 59;

  /**
   * 日次メッセージ 回数
   * @constant {string}
   */
  static readonly DAILY_MESSAGE_COUNT: string = "本日確認できた #{0} の活動は，{1}回でした。";

  /**
   * 日次メッセージ 配列
   * @constant {RamenBu.DailyMessageArray[]}
   */
  static readonly DAILY_MESSAGE_ARRAY: RamenBuConst.DailyMessageArray[] = [
    {
      border: 0,
      message: "０回……。このままでは廃部の危機です。みなさんラーメン部員としての自覚を持ってください！"
    },
    {
      border: 3,
      message: "ちょっと少ない？　明日はラーメン部活動をがんばりましょう！"
    },
    {
      border: 6,
      message: "みなさん，この調子でラーメン部活動をがんばっていきましょう！！"
    },
    {
      border: 9,
      message: "今日は活発でしたね！　みなさん，明日からも元気よくラーメン部活動をがんばっていきましょう！！！"
    },
    {
      border: 19,
      message: "ラーメン部活動は永遠なり。この調子で #{0} を語り継いでいきましょう！"
    },
    {
      border: 29,
      message: "今ここに，千年 #{0} 王国への扉が開かれた！！！！　みんなで伝説の王国へ行こう！"
    },
    {
      border: 99,
      message: "ーーそして，#{0} は神話となった。［ゆるる幼稚園黙示録 第６章１３節］"
    }
  ];
}
