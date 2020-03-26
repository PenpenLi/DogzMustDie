module H52D_Framework {
    export class ConfigTab {
        private _filename: string;
        private _columnNames: string[];
        private _keyNums: Array<number>;

        constructor(filename: string, bytes: Uint8Array) {
            this._keyNums = new Array<number>();
            this._filename = filename;
            if (this.Parse(bytes))
                ConfigTab[filename] = this;
        }

        public GetValueToString(columnName: string, keys: any): string {
            if (!(keys instanceof Array)) {
                keys = [keys];
            }

            let key: string = "";
            for (let i: number = 0; i < keys.length; i++) {
                if (i == 0) {
                    key += keys[i];
                }
                else {
                    key += ("_" + keys[i]);
                }
            }
            let row: Object = this[key];
            if (row == null) {
                Debugger.LogError("key值错误");
                return "-1";
            }
            return row[columnName];
        }

        public GetValueToNumber(columnName: string, keys: any): number {
            return Number(this.GetValueToString(columnName, keys));
        }

        private Parse(bytes: Uint8Array): boolean {
            let fileData: string;
            if (bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF)
                fileData = Uint8ArrayToString(bytes.subarray(3, bytes.length - 1));
            else
                fileData = Uint8ArrayToString(bytes);

            let lines: string[] = fileData.split('\n');
            if (lines == null || lines.length == 0) {
                //Debugger.LogError("配置表 " + this._filename + " 解析失败: 没有内容!");
                return false;
            }

            let splittedLine: string[] = lines[0].split('\t');
            if (splittedLine.length > 0) {
                let lastColumn: string = splittedLine[splittedLine.length - 1];
                if (lastColumn.charAt(lastColumn.length - 1) == '\r')
                    splittedLine[splittedLine.length - 1] = lastColumn.substring(0, lastColumn.length - 2);
            }

            this._columnNames = splittedLine;
            let columnSet = new Array();
            for (let j: number = 0; j < this._columnNames.length; ++j) {
                if (this._columnNames[j] == null || this._columnNames[j] == "") {
                    //Debugger.LogError("配置表 " + this._filename + " 解析失败: 第" + j + "列列名为空!");
                    //return;
                }

                if (columnSet[this._columnNames[j]]) {
                    //Debugger.LogError("配置表 " + this._filename + " 解析失败: 重复列名 " + this._columnNames[j]);
                    //return;
                }

                if (this._columnNames[j][0] == '@') {
                    this._columnNames[j] = this._columnNames[j].substring(1);
                    this._keyNums.push(j);
                }

                columnSet[this._columnNames[j]] = true;
            }

            if (this._keyNums.length == 0)
                this._keyNums.push(0);

            for (let i: number = 1; i < lines.length; ++i) {
                if (lines[i] == null || lines[i] == "" || lines[i][0] == '#')
                    continue;

                splittedLine = lines[i].split('\t');
                if (splittedLine.length > 0) {
                    let lastColumn: string = splittedLine[splittedLine.length - 1];
                    if (lastColumn.charAt(lastColumn.length - 1) == '\r')
                        splittedLine[splittedLine.length - 1] = lastColumn.substring(0, lastColumn.length - 2);
                }

                let key: string = "";
                for (let keyNum of this._keyNums) {
                    key += splittedLine[keyNum] + "_";
                }
                key = key.substring(0, key.length - 1);

                if (this[key] != null) {
                    //Debugger.LogError("配置表 " + this._filename + " 解析失败: 表存在重复的key行,第" + i + "行!");
                    return false;
                }

                let row: Object = {};
                this[key] = row;

                for (let j: number = 0; j < this._columnNames.length; j++) {
                    if (this._columnNames[j] == null || this._columnNames[j] == "")
                        continue;
                    row[this._columnNames[j]] = splittedLine[j];
                }
            }
            return true;
        }
    }
}