class SheetApp {
    private sheetName: string = "twitter";
    private sheet = this.getSheet();
    private rtField: string = "A2";
    private cntField: string = "B2";

    public getRetweet(): string {
        const range = this.sheet.getRange(this.rtField);
        return <string> range.getValue();
    }

    public setRetweet(value: string): void {
        const range = this.sheet.getRange(this.rtField);
        range.setValue(value);
    }

    public getCount(): number {
        const range = this.sheet.getRange(this.cntField);
        return +range.getValue();
    }

    public setCount(value: number): void {
        const range = this.sheet.getRange(this.cntField);
        range.setValue(`${value}`);
    }

    private getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
        return SpreadsheetApp.getActiveSpreadsheet()
            .getSheetByName(this.sheetName);
    }
}

export const Sheet = new SheetApp();
