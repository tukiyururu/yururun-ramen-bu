declare module "bignumber.js" {
  /**
   * bignumber.js
   * @class {BigNumber}
   */
  export default class BigNumber {
    constructor(value: string, base?: number);
    isLessThanOrEqualTo(n: string, base?: number): boolean;
    minus(n: number, base?: number): BigNumber;
    toFixed(dp?: number): string;
  }
}
