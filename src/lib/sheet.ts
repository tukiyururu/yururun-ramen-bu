import {RamenBuConst} from "../const/ramen-bu-const";
import {SheetConst} from "../const/sheet-const";

/**
 * スプレッドシート操作用クラス
 * {Sheet}
 */
export class Sheet {
  /**
   * @constructor
   */
  private constructor() {
  }

  /**
   * スプレッドシート操作
   * @param {string} range セル範囲
   * @param {string} [value] 値
   * @param {"get" | "set"} [mode] 操作モード
   * @return {T | null}
   */
  public static sheetHandler<T>(range: string, value?: string, mode?: "get" | "set"): T | null {
    // 処理結果
    let result = null;

    try {
      // スプレッドシートを取得
      const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName(SheetConst.SHEET_NAME);

      if (sheet !== null) {
        // スプレッドシートが取得できた場合、セル範囲を取得
        const shtRange = sheet.getRange(range);

        if (SheetConst.MODE_SET === mode && typeof value !== RamenBuConst.UNDEFINED_STRING) {
          // 操作モードが設定，かつ，値が設定された場合、値を設定して取得
          result = <T> shtRange.setValue(value).getValue();
        } else {
          // 操作モードが取得の場合、値を取得
          result = <T> shtRange.getValue();
        }
      }
    } catch (error: any) {
      Logger.log(error);
    }

    // 処理結果を返却
    return result;
  }

  /**
   * 最終ID取得
   * @return {string | null} 最終ID
   */
  public static getLastId(): string | null {
    // スプレッドシートから最終IDを取得
    return this.sheetHandler<string>(SheetConst.RANGE_LAST_ID);
  }

  /**
   * 回数取得
   * @return {number | null} 回数
   */
  public static getCount(): number | null {
    // スプレッドシートから回数を取得
    return this.sheetHandler<number>(SheetConst.RANGE_COUNT);
  }

  /**
   * 最終ID設定
   * @param {string} value 値
   * @return {string} 最終ID
   */
  public static setLastId(value: string): string | null {
    // スプレッドシートから最終IDを取得
    return this.sheetHandler<string>(SheetConst.RANGE_LAST_ID, value, SheetConst.MODE_SET);
  }

  /**
   * 回数設定
   * @param {string} value 値
   * @return {string} 回数
   */
  public static setCount(value: string): number | null {
    // スプレッドシートから回数を取得
    return this.sheetHandler<number>(SheetConst.RANGE_COUNT, value, SheetConst.MODE_SET);
  }
}
