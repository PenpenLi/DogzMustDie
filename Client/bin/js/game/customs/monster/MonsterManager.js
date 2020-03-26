var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 怪物管理类
     * @author zhangyusong
     */
    var MonsterManager = /** @class */ (function () {
        function MonsterManager() {
        }
        Object.defineProperty(MonsterManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new MonsterManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonsterManager.prototype, "monsterList", {
            get: function () {
                return this._monsterList;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 管理类设置数据
         * @param data
         * @constructor
         */
        MonsterManager.prototype.DataInit = function (obj) {
            this.data = new Array();
            for (var _id in obj) {
                var vo = new H52D_Framework.MonsterVo(Number(_id));
                vo.location = obj[_id] - 1;
                this.data.push(vo);
            }
        };
        MonsterManager.prototype.GetMonsterByID = function (id) {
            if (this.monsterList[id]) {
                return this.monsterList[id];
            }
        };
        /**
         * 加载资源
         * @param callBack 加载完成时回调
         * @constructor
         */
        MonsterManager.prototype.Initialize = function (callBack) {
            this.loadComplete = callBack;
            this._monsterList = {};
            MonsterManager.index = 0;
            //循环加载怪物
            this.loadMonster();
        };
        /** 清除所有怪物 */
        MonsterManager.prototype.Destroy = function () {
            if (this._monsterList) {
                var kaylist = [];
                for (var index in this._monsterList) {
                    kaylist.push(index);
                }
                var Len = kaylist.length;
                for (var i = 0; i < Len; i++) {
                    if (this._monsterList[kaylist[i]]) {
                        this._monsterList[kaylist[i]].Destroy();
                        this._monsterList[kaylist[i]] = null;
                    }
                }
                kaylist = [];
            }
            MonsterManager.index = 0;
            this._monsterList = {};
        };
        MonsterManager.prototype.loadMonster = function () {
            var _this = this;
            var _hp = 0;
            var _name = "";
            var _loop_1 = function (md) {
                var vo = this_1.data[md];
                var monster = new H52D_Framework.Monster(vo);
                //队长位
                if (vo.location == 4) {
                    _name = vo.name;
                }
                var scale = vo.modelScale;
                var x = H52D_Framework.MonsterLocal[vo.location][0] * G_StageWidthScale;
                var y = H52D_Framework.MonsterLocal[vo.location][1];
                //阴影大小
                var shadow = H52D_Framework.MonstorConfig[vo.id]["shadow"];
                _hp += vo.attr.GetAttributeValue(1);
                var dir = H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory ? -1 : 1;
                monster.LoadMonster(dir, scale, x, y, shadow, vo.location, Laya.Handler.create(this_1, function () {
                    _this._monsterList[MonsterManager.index] = monster;
                    MonsterManager.index++;
                    if (MonsterManager.index >= _this.data.length) {
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CUSTOMS_BASEINFOR, { "monster_name": _name, "blood": _hp });
                        _this.loadComplete.run();
                    }
                }));
            };
            var this_1 = this;
            for (var md in this.data) {
                _loop_1(md);
            }
        };
        MonsterManager.prototype.MonsterAttack = function () {
            var monster = this.monsterList;
            var _loop_2 = function (k) {
                if (monster[k]) {
                    var r = Math.random() * 95;
                    var s = Math.random() * 200 - 100;
                    var time = s * (r / 100);
                    H52D_Framework.Tick.Once(time, this_2, function () {
                        monster[k].Close = false;
                    });
                }
            };
            var this_2 = this;
            for (var k in monster) {
                _loop_2(k);
            }
        };
        return MonsterManager;
    }());
    H52D_Framework.MonsterManager = MonsterManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MonsterManager.js.map