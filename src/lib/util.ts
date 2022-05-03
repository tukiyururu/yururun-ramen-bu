import {RamenBuConst} from "../const/ramen-bu-const";

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
      return typeof embedAry[number] != RamenBuConst.UNDEFINED_STRING ? embedAry[number] : match;
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
}
