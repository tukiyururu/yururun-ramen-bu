declare module "bignumber.js" {
    namespace BigNumber { }

    class BigNumber {
        constructor(value: string);
        minus(n: number): BigNumber;
        minus(n:string):BigNumber;
        toFixed(dp?: number): string;
    }

    export = BigNumber;
}
