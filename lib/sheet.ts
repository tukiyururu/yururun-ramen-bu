class SheetApp {
    private sheetName: string = "twitter";
    private sheet = this.getSheet();

    public getValue(field: string): string {
        const range = this.sheet.getRange(field);
        return <string> range.getValue();
    }

    public setValue(field: string, value: string): void {
        const range = this.sheet.getRange(field);
        range.setValue(value);
    }

    private getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
        return SpreadsheetApp.getActiveSpreadsheet()
            .getSheetByName(this.sheetName);
    }
}

export const Sheet = new SheetApp();
