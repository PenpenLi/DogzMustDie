var H52D_Framework;
(function (H52D_Framework) {
    var ConfigTab = /** @class */ (function () {
        function ConfigTab(filename, bytes) {
            this._keyNums = new Array();
            this._filename = filename;
            if (this.Parse(bytes))
                ConfigTab[filename] = this;
        }
        ConfigTab.prototype.GetValueToString = function (columnName, keys) {
            if (!(keys instanceof Array)) {
                keys = [keys];
            }
            var key = "";
            for (var i = 0; i < keys.length; i++) {
                if (i == 0) {
                    key += keys[i];
                }
                else {
                    key += ("_" + keys[i]);
                }
            }
            var row = this[key];
            if (row == null) {
                H52D_Framework.Debugger.LogError("key值错误");
                return "-1";
            }
            return row[columnName];
        };
        ConfigTab.prototype.GetValueToNumber = function (columnName, keys) {
            return Number(this.GetValueToString(columnName, keys));
        };
        ConfigTab.prototype.Parse = function (bytes) {
            var fileData;
            if (bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF)
                fileData = Uint8ArrayToString(bytes.subarray(3, bytes.length - 1));
            else
                fileData = Uint8ArrayToString(bytes);
            var lines = fileData.split('\n');
            if (lines == null || lines.length == 0) {
                //Debugger.LogError("配置表 " + this._filename + " 解析失败: 没有内容!");
                return false;
            }
            var splittedLine = lines[0].split('\t');
            if (splittedLine.length > 0) {
                var lastColumn = splittedLine[splittedLine.length - 1];
                if (lastColumn.charAt(lastColumn.length - 1) == '\r')
                    splittedLine[splittedLine.length - 1] = lastColumn.substring(0, lastColumn.length - 2);
            }
            this._columnNames = splittedLine;
            var columnSet = new Array();
            for (var j = 0; j < this._columnNames.length; ++j) {
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
            for (var i = 1; i < lines.length; ++i) {
                if (lines[i] == null || lines[i] == "" || lines[i][0] == '#')
                    continue;
                splittedLine = lines[i].split('\t');
                if (splittedLine.length > 0) {
                    var lastColumn = splittedLine[splittedLine.length - 1];
                    if (lastColumn.charAt(lastColumn.length - 1) == '\r')
                        splittedLine[splittedLine.length - 1] = lastColumn.substring(0, lastColumn.length - 2);
                }
                var key = "";
                for (var _i = 0, _a = this._keyNums; _i < _a.length; _i++) {
                    var keyNum = _a[_i];
                    key += splittedLine[keyNum] + "_";
                }
                key = key.substring(0, key.length - 1);
                if (this[key] != null) {
                    //Debugger.LogError("配置表 " + this._filename + " 解析失败: 表存在重复的key行,第" + i + "行!");
                    return false;
                }
                var row = {};
                this[key] = row;
                for (var j = 0; j < this._columnNames.length; j++) {
                    if (this._columnNames[j] == null || this._columnNames[j] == "")
                        continue;
                    row[this._columnNames[j]] = splittedLine[j];
                }
            }
            return true;
        };
        return ConfigTab;
    }());
    H52D_Framework.ConfigTab = ConfigTab;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ConfigTab.js.map