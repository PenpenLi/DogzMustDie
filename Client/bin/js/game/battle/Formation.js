/**
* 阵容系统
* @张振明
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Formation = /** @class */ (function () {
        function Formation() {
            //上阵英雄的列表
            this._objectList = [];
            //前排英雄列表           	
            this._frontobjectList = [];
            //后排英雄列表           
            this._backobjectList = [];
            //横排英雄列表
            this._horizontalobjectList = [];
            //阵容最大人数
            this._maxNum = 9;
        }
        Object.defineProperty(Formation.prototype, "GetCaptain", {
            // private _owner: any;
            //获取队长
            get: function () { return this._captain; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Formation.prototype, "Getobject", {
            /**
             * 获取阵容英雄列表
             */
            get: function () { return this._objectList; },
            enumerable: true,
            configurable: true
        });
        Formation.prototype.GetobjectByID = function (id) {
            if (this.Getobject[id] != null) {
                return this.Getobject[id];
            }
            return null;
        };
        Object.defineProperty(Formation.prototype, "GetFrontobject", {
            /**
             * 获取前排英雄列表
             */
            get: function () {
                return this._frontobjectList;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取前排列表中指定id英雄
         * @param id 英雄id
         */
        Formation.prototype.GetFrontobjectById = function (id) {
            if (this.GetFrontobject[id] != null)
                return this.GetFrontobject[id];
            return null;
        };
        Object.defineProperty(Formation.prototype, "GetBackobject", {
            /**
             * 获取后排英雄列表
             */
            get: function () { return this._backobjectList; },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取后排英雄列表中指定id英雄
         * @param id 英雄id
         */
        Formation.prototype.GetBackobjectById = function (id) {
            if (this.GetBackobject[id] != null)
                return this.GetBackobject[id];
            return null;
        };
        Object.defineProperty(Formation.prototype, "GetHorizontalobject", {
            /**
             * 获取横排英雄字典
             */
            get: function () { return this._horizontalobjectList; },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据id获取指定某排英雄列表
         * @param id 横排id
         */
        Formation.prototype.GetHorizontalobjectListById = function (id) {
            if (this.GetHorizontalobject[id] != null)
                return this.GetHorizontalobject[id];
            return null;
        };
        /**
         * 获取横排字典中指定id横排中指定id英雄
         * @param listID 横排id
         * @param id     英雄id
         */
        Formation.prototype.GetHorizontalobjectById = function (listID, id) {
            var objectList = this.GetHorizontalobjectListById(listID);
            if (objectList[id] != null) {
                return objectList[id];
            }
        };
        /**
         * 位置信息写在这 暂时空缺
         */
        Formation.prototype.InitPositionList = function () {
        };
        /**
         * 前排的数量，最大为3，最小为1
         */
        Formation.prototype.FrontNum = function () {
            return H52D_Framework.GetTabLength(this._frontobjectList);
        };
        /**
         * 后排的数量,最大为6，最小为0
         */
        Formation.prototype.BackNum = function () {
            return H52D_Framework.GetTabLength(this._backobjectList);
        };
        /**给敌人表 */
        Formation.prototype.GetFormatInfo = function (objectTab) {
            var key = [];
            for (var k in objectTab) {
                key.push(k);
            }
            for (var i = 0; i < H52D_Framework.GetTabLength(objectTab); i++) {
                if (objectTab[key[i]]) {
                    this._objectList.push(objectTab[key[i]]);
                }
            }
            this.SetFrontobject();
            this.Backobject();
            this.Horizontalobject();
        };
        /**给敌人表 */
        Formation.prototype.GetFormatInfoArry = function (objectTab) {
            this.Destroy();
            this._objectList = objectTab.concat();
            this.SetFrontobject();
            this.Backobject();
            this.Horizontalobject();
        };
        /**
         * 添加到前排英雄列表
         */
        Formation.prototype.SetFrontobject = function () {
            for (var i = 0; i < this._objectList.length; i++) {
                var hc = this._objectList[i];
                if (this._objectList[i]) {
                    if (hc.vo.location == 0 || hc.vo.location == 1 || hc.vo.location == 2) {
                        this._frontobjectList.push(this._objectList[i]);
                    }
                }
            }
            if (this._frontobjectList.length <= 0) {
                for (var i = 0; i < this._objectList.length; i++) {
                    var hc = this._objectList[i];
                    if (this._objectList[i]) {
                        if (hc.vo.location == 3 || hc.vo.location == 4 || hc.vo.location == 5) {
                            this._frontobjectList.push(this._objectList[i]);
                        }
                    }
                }
            }
            if (this._frontobjectList.length <= 0) {
                for (var i = 0; i < this._objectList.length; i++) {
                    var hc = this._objectList[i];
                    if (this._objectList[i]) {
                        if (hc.vo.location == 6 || hc.vo.location == 7 || hc.vo.location == 8) {
                            this._frontobjectList.push(this._objectList[i]);
                        }
                    }
                }
            }
        };
        /**
         * 添加到后排英雄列表
         */
        Formation.prototype.Backobject = function () {
            for (var i = 0; i < this._objectList.length; i++) {
                if (this._objectList[i]) {
                    if (this._objectList[i].vo.location > 5) {
                        this._backobjectList.push(this._objectList[i]);
                    }
                }
            }
            if (this._backobjectList.length == 0) {
                for (var i = 0; i < this._objectList.length; i++) {
                    if (this._objectList[i]) {
                        if (this._objectList[i].vo.location == 3 || this._objectList[i].vo.location == 4 ||
                            this._objectList[i].vo.location == 5) {
                            this._backobjectList.push(this._objectList[i]);
                        }
                    }
                }
            }
        };
        /**
         * 添加到横排英雄列表
         */
        Formation.prototype.Horizontalobject = function () {
            var horizontal_1 = [];
            var horizontal_2 = [];
            var horizontal_3 = [];
            for (var i = 0; i < this._objectList.length; i++) {
                var hc = this._objectList[i];
                if (this._objectList[i]) {
                    if (hc.vo.location == 0 || hc.vo.location == 3 || hc.vo.location == 6) {
                        horizontal_1.push(this._objectList[i]);
                    }
                }
            }
            for (var i = 0; i < this._objectList.length; i++) {
                var hc = this._objectList[i];
                if (this._objectList[i]) {
                    if (hc.vo.location == 1 || hc.vo.location == 4 || hc.vo.location == 7) {
                        horizontal_2.push(this._objectList[i]);
                    }
                }
            }
            for (var i = 0; i < this._objectList.length; i++) {
                var hc = this._objectList[i];
                if (this._objectList[i]) {
                    if (hc.vo.location == 2 || hc.vo.location == 5 || hc.vo.location == 8) {
                        horizontal_3.push(this._objectList[i]);
                    }
                }
            }
            this._horizontalobjectList.push(horizontal_1);
            this._horizontalobjectList.push(horizontal_2);
            this._horizontalobjectList.push(horizontal_3);
        };
        /**设置竖排目标 */
        Formation.prototype.SetHTarget = function () {
            var id = 0;
            for (var k in this.GetHorizontalobject) {
                if (this.GetHorizontalobject[k].length > 0) {
                    id = Number(k);
                }
            }
            var h = this.GetHorizontalobject[id];
            return h;
        };
        /**设置横排目标 */
        Formation.prototype.SetForntTatget = function (num) {
            var tar = [];
            var fornt = this.GetFrontobject;
            var index = 0;
            for (var k in fornt) {
                if (index <= num) {
                    tar.push(fornt[k]);
                }
                index++;
            }
            return tar;
        };
        /**设置后排目标 */
        Formation.prototype.SetBackTatget = function (num) {
            var tar = [];
            var back = this.GetBackobject;
            var index = 0;
            for (var k in back) {
                if (index < num) {
                    tar.push(back[k]);
                }
                index++;
            }
            return tar;
        };
        /**设置队长目标 */
        Formation.prototype.SetCapTarget = function () {
            var tar = [];
            var obj = this.Getobject;
            for (var k in obj) {
                if (obj[k] && obj[k].vo.location == 4) {
                    tar.push(obj[k]);
                    break;
                }
            }
            if (tar.length <= 0) {
                for (var k in obj) {
                    if (obj[k]) {
                        tar.push(obj[k]);
                        break;
                    }
                }
            }
            return tar;
        };
        Formation.prototype.SetrandomTarget = function (tar_arr) {
            var tar = [];
            for (var k = 0; k < tar_arr.length; k++) {
                if (tar_arr[k] && !tar_arr[k].IsDie) {
                    tar.push(tar_arr[k]);
                    break;
                }
            }
            return tar;
        };
        /**设置目标 */
        Formation.prototype.SetTarget = function (tar_arr, mode, num) {
            this.GetFormatInfoArry(tar_arr);
            var tar = null;
            switch (mode) {
                case 0:
                    tar = tar_arr.concat();
                    break;
                case 1:
                    tar = this.SetForntTatget(num);
                    break;
                case 2:
                    tar = this.SetHTarget();
                    break;
                case 3:
                    tar = this.SetBackTatget(num);
                    break;
                case 4:
                    tar = this.SetCapTarget();
                    break;
                case 5:
                    tar = this.Getobject.concat();
                    break;
            }
            return tar;
        };
        Formation.prototype.getHeroByLoc = function (loc) {
            for (var k in this.Getobject) {
                if (this.Getobject[k] && this.Getobject[k].vo.location == loc) {
                    return this.Getobject[k];
                }
            }
        };
        Formation.prototype.Destroy = function () {
            this._objectList = [];
            this._frontobjectList = [];
            this._backobjectList = [];
            this._horizontalobjectList = [];
        };
        return Formation;
    }());
    H52D_Framework.Formation = Formation;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Formation.js.map