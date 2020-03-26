var H52D_Framework;
(function (H52D_Framework) {
    var CustomsVo = /** @class */ (function () {
        function CustomsVo(id, waveOrder) {
            /** 配置 */
            this._cfg = null;
            this.customsId = id;
            this.waveOrder = waveOrder;
        }
        Object.defineProperty(CustomsVo.prototype, "customsId", {
            /** 副本ID */
            get: function () {
                return this._customsId;
            },
            set: function (nCustomsID) {
                this._customsId = nCustomsID;
                this._cfg = H52D_Framework.CustomspassConfig[nCustomsID];
                var mpdata = this._cfg["monstorPosition"];
                this.monstorPosition = {};
                for (var w in mpdata) {
                    this.monstorPosition[w] = {}; //这里放置1波怪
                    for (var m in mpdata[w]) {
                        this.monstorPosition[w][Number(mpdata[w][m][1])] = Number(mpdata[w][m][2]);
                    }
                }
                // Wx.aldSendEvent("玩家闯关", {
                //     "关卡": this._customsId + "关",
                //     "波数": this.waveOrder + "波"
                // })
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "waveNum", {
            /** 共几波 */
            get: function () {
                var num = 0;
                for (var i in this._cfg.monstorPosition) {
                    num++;
                }
                return num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "customsOrder", {
            /** 第几关 */
            get: function () {
                return this._cfg.customsOrder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "sceneID", {
            /** 场景ID */
            get: function () {
                return this._cfg.sceneID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "strCustomsIcon", {
            /** 副本图标 */
            get: function () {
                return this._cfg.strCustomsIcon;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "customsType", {
            /** 副本类型 */
            get: function () {
                return this._cfg.dunType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "waveTime", {
            /** 波次持续时间，大boss用 */
            get: function () {
                return this._cfg.waveTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "waveRewardID", {
            /** 通关奖励，每波怪都有 */
            get: function () {
                return this._cfg.waveRewardID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "extraRewardID", {
            /** 通关额外奖励*/
            get: function () {
                return this._cfg.extraRewardID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "composeEquipLevel", {
            /**可合成装备等级 */
            get: function () {
                return this._cfg.composeEquipLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "aside", {
            /** 旁白ID */
            get: function () {
                return this._cfg.aside;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "asideB", {
            /** 旁白ID，场景前 */
            get: function () {
                return this._cfg.asideb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsVo.prototype, "tie", {
            /** 百度小贴士 */
            get: function () {
                return this._cfg.tips;
            },
            enumerable: true,
            configurable: true
        });
        return CustomsVo;
    }());
    H52D_Framework.CustomsVo = CustomsVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CustomsVo.js.map