declare module "bignumber.js" {
    namespace BigNumber { }

    class BigNumber {
        constructor(value: string, base?: number);
        lessThanOrEqualTo(n: string, base?: number): boolean;
        minus(n: number, base?: number): BigNumber;
        toFixed(dp?: number): string;
    }

    export = BigNumber;
}
