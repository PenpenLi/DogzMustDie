/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var InstMsg = /** @class */ (function () {
        function InstMsg() {
            this._InstID = 0;
            this._FreeList = [];
            this._UseMap = {};
            this._Num = 0;
        }
        /** 获取一个新的实力ID */
        InstMsg.prototype.GetNewInstID = function () {
            var nNewInstID = 0;
            if (this._FreeList.length > 0) {
                nNewInstID = this._FreeList.pop();
            }
            else {
                this._InstID += 1;
                nNewInstID = this._InstID;
            }
            this._UseMap[nNewInstID] = 1;
            this._Num += 1;
            return nNewInstID;
        };
        /** 释放回收ID */
        InstMsg.prototype.RemInstID = function (nInstID) {
            if (this._UseMap[nInstID] != 1) {
                return false;
            }
            this._UseMap[nInstID] = 0;
            this._FreeList.push(nInstID);
            this._Num -= 1;
            return true;
        };
        return InstMsg;
    }());
    H52D_Framework.InstMsg = InstMsg;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InstMsg.js.map