var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class：王者约战管理类
     * @author：zhangyusong
     */
    var KickingLogic = /** @class */ (function () {
        function KickingLogic() {
            /** 玩家的战斗数据 */
            this.fireData = null;
            /** pvp神兽ID */
            this.petId = 0;
            /** 房间类型 */
            this.roomType = H52D_Framework.BaseDefine.ItemIdGold;
            /***pk阵容信息 */
            this._kickingwar = {};
            this._kickingherolist = [];
            this._win_alawys = 0;
            this._PositionWar = {};
            this._HeroWar = {};
            this._bChange = false;
            this.showReward = true;
        }
        Object.defineProperty(KickingLogic, "Instance", {
            get: function () {
                if (this.instance == null) {
                    this.instance = new KickingLogic();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickingLogic.prototype, "war", {
            get: function () {
                return this._kickingwar;
            },
            set: function (value) {
                this._kickingwar = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickingLogic.prototype, "bChange", {
            get: function () {
                return this._bChange;
            },
            set: function (value) {
                this._bChange = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickingLogic.prototype, "ChallengeNum", {
            set: function (challengeNum) {
                this.surplusGold = H52D_Framework.GameParamConfig["ParticipationMaxNum"][1] -
                    (challengeNum[H52D_Framework.BaseDefine.ItemIdGold] || 0);
                this.surplusDiamonds = H52D_Framework.GameParamConfig["ParticipationMaxNum"][2] -
                    (challengeNum[H52D_Framework.BaseDefine.ItemIdDiamonds] || 0);
            },
            enumerable: true,
            configurable: true
        });
        /** 增加金币挑战次数 */
        KickingLogic.prototype.AddSurplus = function (num) {
            if (this.roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                this.surplusGold += num;
            }
            else if (this.roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                this.surplusDiamonds += num;
            }
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(30072);
            H52D_Framework.Event.DispatchEvent("KickingChooseUpdate");
        };
        Object.defineProperty(KickingLogic.prototype, "herolist", {
            /**英雄的id数组 */
            get: function () {
                return this._kickingherolist;
            },
            set: function (value) {
                this._kickingherolist = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickingLogic.prototype, "HeroWar", {
            /** 当前布阵英雄位置信息 */
            get: function () {
                return this._HeroWar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickingLogic.prototype, "sceneId", {
            get: function () {
                var sceneId = this.currentVo ? this.currentVo.customsId : 0;
                return sceneId;
            },
            enumerable: true,
            configurable: true
        });
        KickingLogic.prototype.Initialize = function () {
            // this.petId = PetManager.Instance.CurrentpetID;
            this.InitEvent();
        };
        KickingLogic.prototype.GetwarInfo = function () {
            this._kickingherolist = [];
            for (var key in this._kickingwar) {
                var nId = this._kickingwar[key];
                if (nId) {
                    this._kickingherolist.push(nId);
                }
            }
            return this._kickingherolist;
        };
        KickingLogic.prototype.getwar = function () {
            for (var key in this._kickingwar) {
                var nId = this._kickingwar[key];
                if (!nId) {
                    delete this._kickingwar[key];
                }
            }
            return this._kickingwar;
        };
        /** 初始化阵容信息 */
        KickingLogic.prototype.InitPosInfo = function () {
            this._PositionWar = {};
            this._HeroWar = {};
            var HeroWarList = this._kickingwar;
            for (var pos in HeroWarList) {
                var nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID);
            }
            this._bChange = false;
        };
        Object.defineProperty(KickingLogic.prototype, "PositionWar", {
            /** 当前布阵信息 */
            get: function () {
                return this._PositionWar;
            },
            set: function (value) {
                this._PositionWar = value;
            },
            enumerable: true,
            configurable: true
        });
        /**判断是否在保存的阵容上 */
        KickingLogic.prototype.IsInSaveWar = function (pos, nHeroID) {
            var war = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            for (var nIdx in war) {
                if (war[nIdx] == nHeroID) {
                    return true;
                }
            }
            return false;
        };
        /** 判断是否在阵容上 */
        KickingLogic.prototype.IsInWar = function (nHeroID) {
            return this._HeroWar[nHeroID] != null;
        };
        /** 放置英雄 */
        KickingLogic.prototype.PutHero = function (nPos, nHeroID) {
            // 目标位置当前英雄ID
            var nLastHeroID = this._kickingwar[nPos];
            // 目标英雄上一个位置
            var nLastPos = this._HeroWar[nHeroID];
            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._kickingwar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._kickingwar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        };
        /**请求更新玩家战斗数据*/
        KickingLogic.prototype.UpdateCombatInfo = function () {
            if (H52D_Framework.GetTabLength(this.fireData["Hero"]) == 0) {
                return;
            }
            H52D_Framework.RemoteCall.Instance.Send("K_ReqUpdateCombatInfo", this.fireData);
        };
        /***Pvp 连胜 */
        KickingLogic.prototype.Win_alawys = function () {
            if (this._win_alawys == 5 || this._win_alawys == 10) {
                var rew = H52D_Framework.GameParamConfig.KingsSuccessiveVictoryDiamond;
                var d_num = 0;
                for (var key in rew) {
                    var ncfg = rew[key];
                    if (ncfg[1] == this._win_alawys) {
                        d_num = ncfg[2];
                    }
                }
                H52D_Framework.UIManager.Instance.CreateUI("StreakWinView", [H52D_Framework.ViewToppestRoot, 5028, 6038, this._win_alawys, d_num]);
            }
        };
        /**
         * 请求匹配
         * nRoomType -- 房间类型
         * nRoomID -- 房间ID
         * tInfo -- 玩家战斗数据
         */
        KickingLogic.prototype.PvpMatching = function (nRoomType, nRoomID, currentVo) {
            this.roomType = nRoomType;
            this.currentVo = currentVo;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqPvpMatching", nRoomType, nRoomID, this.fireData);
        };
        KickingLogic.prototype.InitEvent = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpMatching", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpCombatEnd", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpActivityInfo", this);
        };
        /**
         * 匹配返回数据
         * code -- 错误码
         * nRoomType -- 房间类型
         * nRoomID -- 房间ID
         * tInfo -- 玩家战斗数据
         * tOtherInfo -- 对手数据
         */
        KickingLogic.prototype.C_ReqPvpMatching = function (buf) {
            var code = buf[0];
            var roomType = buf[1];
            var roomID = buf[2];
            var otherInfo = buf[3]; //对手的数据
            if (code == 1) { //成功
                H52D_Framework.UIManager.Instance.DestroyUI("KickingChooseView", [H52D_Framework.ViewUpRoot]);
                H52D_Framework.DataManager.Instance.ReciveData(otherInfo);
                H52D_Framework.CustomsManager.Instance.EnterCustoms(this.currentVo.customsId);
                H52D_Framework.DropManager.Instance.Destroy();
                H52D_Framework.Event.DispatchEvent("ShowDeputy");
            }
            else if (code == 2) { //已经在战斗中
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("已经在战斗中");
            }
            else { //没有匹配到玩家
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("没有匹配到玩家");
            }
        };
        /**
         * 请求结束战斗
         * nStar -- 结算评星级
         * nWin -- 1 胜利 2 失败 0 平局
         */
        KickingLogic.prototype.PvpCombatEnd = function (nStar, nWin, showReward) {
            if (showReward === void 0) { showReward = true; }
            this.showReward = showReward;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqPvpCombatEnd", nStar, nWin);
        };
        /**
         * 结束战斗返回
         * nStar -- 结算评星级
         * nWin -- 1 胜利 2 失败 0 平局
         * tAllAward -- 奖励
         */
        KickingLogic.prototype.C_ReqPvpCombatEnd = function (buf) {
            var nStar = buf[0];
            var nWin = buf[1];
            var roomType = buf[2];
            var money = buf[3];
            if (roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                this.surplusGold--;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_GOLD);
            }
            else if (roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                this.surplusDiamonds--;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_DIAMONDS);
            }
            //播放结束音效
            if (nWin == 1) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
            }
            else if (nWin == 2) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
            }
            if (this.showReward) {
                H52D_Framework.UIManager.Instance.CreateUI("KickingResultView", [H52D_Framework.ViewToppestRoot, nStar, nWin, roomType, money]);
            }
            this._win_alawys = buf[4];
        };
        /** 请求活动数据 */
        KickingLogic.prototype.ActivityInfo = function () {
            if (this.fireData == null) {
                H52D_Framework.RemoteCall.Instance.Send("K_ReqPvpActivityInfo");
            }
            else {
                H52D_Framework.UIManager.Instance.CreateUI("KickingChooseView", [H52D_Framework.ViewUpRoot]);
            }
        };
        /**活动数据返回*/
        KickingLogic.prototype.C_ReqPvpActivityInfo = function (buf) {
            var tData = buf[0];
            var tInfo = tData[1];
            var bSave = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat);
            if (H52D_Framework.ObjIsEmpty(tInfo) || (!bSave)) {
                H52D_Framework.DataManager.Instance.MainPackData(true);
                tInfo = H52D_Framework.DataManager.Instance.packdata.Info;
            }
            this.fireData = tInfo;
            if (H52D_Framework.GetTabLength(tInfo.Pet) != 0) {
                this.petId = tInfo.Pet[0].id;
            }
            else {
                this.petId = 0;
            }
            this._PositionWar = this.fireData.Hero;
            this.ChangeWar();
            H52D_Framework.UIManager.Instance.CreateUI("KickingChooseView", [H52D_Framework.ViewUpRoot]);
        };
        KickingLogic.prototype.ChangeWar = function () {
            for (var key in this._PositionWar) {
                var nhero = this._PositionWar[key];
                this._kickingwar[nhero["location"]] = nhero["id"];
            }
        };
        /**给服务器发送 保存战斗的阵容信息 */
        KickingLogic.prototype.KickingWarInfo = function (kickwar) {
            this._kickingwar = kickwar;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("保存成功！");
            H52D_Framework.DataManager.Instance.PackData();
            H52D_Framework.Event.DispatchEvent("ReshView_ladder");
        };
        KickingLogic.prototype.ShowRedPrint = function () {
            var join = false;
            return join;
        };
        return KickingLogic;
    }());
    H52D_Framework.KickingLogic = KickingLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=KickingLogic.js.map