/**
 * ユーティリティ用クラス
 * @class {Util}
 */
export class Util {
  /**
   * @constructor
   */
  private constructor() {
  }

  /**
   * 埋込フォーマット
   * @param {string} string 文字列
   * @param {string} embedAry 埋込文字
   * @return {string} 埋込後文字列
   */
  public static format(string: string, ...embedAry: string[]): string {
    return string.replace(/{(\d+)}/g, (match: string, number: number) => {
      return "undefined" !== typeof embedAry[number] ? embedAry[number] : match;
    });
  }

  /**
   * 全角変換
   * @param {string} string 文字列
   * @return {string} 全角文字列
   */
  public static toZenkaku(string: string): string {
    return string.replace(/[!-~]/g, (match: string) => {
      return String.fromCharCode(match.charCodeAt(0) + 0xFEE0);
    });
  }

  /**
   * 毎分トリガー設定
   * @param {number} minute 分
   * @param {string} functionName 関数名
   */
  public static setEveryMinutesTrigger(minute: number, functionName: string) {
    try {
      // 毎分トリガーを設定
      ScriptApp.newTrigger(functionName)
          .timeBased().everyMinutes(minute).create();
    } catch (eroor: any) {
      // エラーログを出力
      console.error(eroor);
    }
  }

  /**
   * 日次トリガー設定
   * @param {number} hour 時
   * @param {string} functionName 関数名
   */
  public static setAtHourTrigger(hour: number, functionName: string) {
    try {
      // 日次トリガーを設定
      ScriptApp.newTrigger(functionName)
          .timeBased().everyDays(1).atHour(hour).create();
    } catch (eroor: any) {
      // エラーログを出力
      console.error(eroor);
    }
  }

  /**
   * 時分トリガー設定
   * @param {number} hour 時
   * @param {number} minute 分
   * @param {string} functionName 関数名
   */
  public static setAtTrigger(hour: number, minute: number, functionName: string) {
    // 現在日時を取得
    const date = new Date();
    // 時分の設定
    date.setHours(hour);
    date.setMinutes(minute);

    try {
      // 時分トリガー設定
      ScriptApp.newTrigger(functionName)
          .timeBased().at(date).create();
    } catch (eroor: any) {
      // エラーログを出力
      console.error(eroor);
    }
  }

  /**
   * トリガー削除
   * @param {string} functionName 関数名
   */
  public static deleteTrigger(functionName: string) {
    try {
      // トリガーを取得
      const triggers = ScriptApp.getProjectTriggers();

      for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === functionName) {
          // 関数名が一致した場合，トリガーを削除
          ScriptApp.deleteTrigger(trigger);
        }
      }
    } catch (eroor: any) {
      // エラーログを出力
      console.error(eroor);
    }
  }
}
