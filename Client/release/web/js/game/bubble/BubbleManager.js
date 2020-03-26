/**
* 气泡对话
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BubbleManager = /** @class */ (function () {
        function BubbleManager() {
            /** 对话组反向映射表 */
            this._tMappingList = {};
            /** 当前的可用的对话组ID */
            this._tBuffleList = [];
            /**是否弹了第一个怪物气泡 */
            this._bMonsterBubble = false;
            this._bMonsterFirst = false;
            // 制作反向映射表
            for (var nGroupID in H52D_Framework.GroupConfig) {
                var cfg = H52D_Framework.GroupConfig[nGroupID];
                var hero1 = cfg.hero1;
                var hero2 = cfg.hero2;
                if (this._tMappingList[hero1] == null) {
                    this._tMappingList[hero1] = {};
                }
                if (this._tMappingList[hero2] == null) {
                    this._tMappingList[hero2] = {};
                }
                this._tMappingList[hero1][hero2] = nGroupID;
                this._tMappingList[hero2][hero1] = nGroupID;
            }
        }
        Object.defineProperty(BubbleManager, "Instance", {
            get: function () {
                if (BubbleManager._inst == null)
                    BubbleManager._inst = new BubbleManager();
                return BubbleManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BubbleManager.prototype, "bMonsterBubble", {
            get: function () {
                return this._bMonsterBubble;
            },
            set: function (b) {
                this._bMonsterBubble = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BubbleManager.prototype, "bMonsterFirst", {
            get: function () {
                return this._bMonsterFirst;
            },
            set: function (b) {
                this._bMonsterFirst = b;
            },
            enumerable: true,
            configurable: true
        });
        /** 刷新缓存当前所有可能的对话ID */
        BubbleManager.prototype.UpdateAllBubbleID = function () {
            // 清空对话列表
            this._tBuffleList = [];
            // 记录已有ID
            var tFlagBubbleID = {};
            //获取当前阵容ID
            var tHeroWarList = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            // 开始寻找聊天伙伴
            for (var nPos1 in tHeroWarList) {
                var nHero1ID = tHeroWarList[nPos1];
                if (this._tMappingList[nHero1ID] != null) {
                    for (var nPos2 in tHeroWarList) {
                        var nHero2ID = tHeroWarList[nPos2];
                        // 检测是否有话题
                        var nGroupID = this._tMappingList[nHero1ID][nHero2ID];
                        if (nGroupID != null) {
                            var cfg = H52D_Framework.GroupConfig[nGroupID];
                            var tBubbleIdList = cfg.talkid;
                            for (var idx in tBubbleIdList) {
                                var nBubbleID = tBubbleIdList[idx];
                                if (tFlagBubbleID[nBubbleID] != true) {
                                    this._tBuffleList.push(nBubbleID);
                                    tFlagBubbleID[nBubbleID] = true;
                                }
                            }
                        }
                    }
                }
            }
        };
        //** 随机一个对话ID */
        BubbleManager.prototype.RandomHeroBubbleID = function () {
            if (this._tBuffleList.length <= 0) {
                return null;
            }
            var idx = Math.random() * this._tBuffleList.length >> 0;
            return this._tBuffleList[idx];
        };
        return BubbleManager;
    }());
    H52D_Framework.BubbleManager = BubbleManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BubbleManager.js.map