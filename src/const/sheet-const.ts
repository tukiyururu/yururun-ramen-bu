/**
 * スプレッドシート操作用の定数クラス
 * @class {SheetConst}
 */
export class SheetConst {
  /**
   * スプレッドシート名
   * @constant {string}
   */
  static readonly SHEET_NAME: string = "Twitter";

  /**
   * 操作モード 設定
   * @constant {string}
   */
  static readonly MODE_SET: "set" = "set";

  /**
   * セル範囲 最終ID
   * @constant {string}
   */
  static readonly RANGE_LAST_ID: string = "A2";

  /**
   * セル範囲 回数
   * @constant {string}
   */
  static readonly RANGE_COUNT: string = "B2";
}
