var H52D_Framework;
(function (H52D_Framework) {
    var Player = /** @class */ (function () {
        /**初始化 */
        function Player() {
            /**是否是主玩家 */
            this._isMaster = false;
            /**角色等级*/
            this._level = 1;
            /**玩家布阵英雄信息 */
            this._heroWarList = {};
            /**阵营ID */
            this._nCampID = -1;
            /**头像ID */
            this._headId = -1;
            /**英雄礼包 时间 */
            this._heropeck_time = {};
            /** 玩家vip过期时间 */
            this._ExpirationTime = 0;
            this._laddertimes = H52D_Framework.GameParamConfig.LadderFreeNum; //-MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
            this._laddertimes_buy = H52D_Framework.GameParamConfig.LadderSpendNum; //-MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
            this._fraction = 0;
            /**玩家技能存放处 */
            this._playSkillList = {};
            /**存放英雄的集合 */
            this._heroList = {};
            /**存放宠物的集合 */
            this._pet = {};
            this._campInfo = {};
            this._skillList = {};
            /** 播放音效 */
            this._sound = true;
            /** 播放音乐 */
            this._music = true;
            this._ladder_win_num = 0;
            this.damage = 100;
            this.type = eCharacter_TYPE.PLAYER;
        }
        Object.defineProperty(Player.prototype, "vo", {
            get: function () { return this._playervo; },
            set: function (value) { this._playervo = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player, "Init", {
            /**单例 */
            get: function () {
                if (Player._init == null) {
                    Player._init = new Player();
                }
                return Player._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isMaster", {
            /**是否是主玩家*/
            get: function () {
                return this._isMaster;
            },
            set: function (value) {
                this._isMaster = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "HeroWarList", {
            get: function () {
                return this._heroWarList;
            },
            set: function (herowar) {
                this._heroWarList = herowar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "MpRecoveryRate", {
            get: function () {
                return this._mpRecoveryRate;
            },
            set: function (value) {
                this._mpRecoveryRate = value;
                H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "MpPool", {
            get: function () {
                return this._mpPool;
            },
            set: function (value) {
                this._mpPool = value;
                H52D_Framework.Event.DispatchEvent("MpPoolChange");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Name", {
            /**角色名称 */
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Head", {
            /**角色头像 */
            get: function () {
                return this._head;
            },
            set: function (val) {
                this._head = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Base", {
            /**角色属性 */
            get: function () {
                return this._base;
            },
            set: function (value) {
                this._base = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ID", {
            /**角色id */
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Exp", {
            /**当前角色经验 */
            get: function () {
                return this._exp;
            },
            set: function (value) {
                this._exp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "NeedExp", {
            /**升级所需经验 */
            get: function () {
                return this._needExp;
            },
            set: function (value) {
                this._needExp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "CustomsId", {
            /** 第几关 */
            get: function () {
                return this._customsId;
            },
            /** 第几关 */
            set: function (value) {
                this._customsId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "WaveOrder", {
            /** 第几波 */
            get: function () {
                return this._waveOrder;
            },
            /** 第几波 */
            set: function (value) {
                this._waveOrder = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "CustomsMode", {
            get: function () {
                return this._customsMode;
            },
            set: function (value) {
                this._customsMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "CampID", {
            get: function () {
                return this._nCampID;
            },
            set: function (id) {
                this._nCampID = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Fraction", {
            /**玩家的天梯分数 */
            get: function () {
                return this._fraction;
            },
            set: function (value) {
                this._fraction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "LadderWinnNum", {
            /**玩家的天梯胜利次数 */
            get: function () {
                return this._ladder_win_num;
            },
            set: function (value) {
                this._ladder_win_num = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "HeadId", {
            get: function () {
                return this._headId;
            },
            set: function (id) {
                this._headId = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "CampDonate", {
            get: function () {
                return this._nCampDonate;
            },
            set: function (Num) {
                this._nCampDonate = Num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Donatetimes", {
            /**玩家捐献次数 */
            get: function () {
                return this._Camptimes;
            },
            set: function (tNum) {
                this._Camptimes = tNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Hero_pecktime", {
            get: function () {
                return this._heropeck_time;
            },
            set: function (tNum) {
                this._heropeck_time = tNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "MoneyNum", {
            /**角色金币数量 */
            get: function () {
                return this._moneyNum;
            },
            set: function (value) {
                this._moneyNum = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "GoodStone", {
            /**玩家宝石数量 */
            get: function () {
                return this._goodStone;
            },
            set: function (value) {
                this._goodStone = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Level", {
            /**角色等级 */
            get: function () {
                return this._level;
            },
            set: function (value) {
                this._level = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Proint", {
            /**角色点击伤害 */
            get: function () {
                return this._proint;
            },
            set: function (value) {
                this._proint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Strike", {
            /** 英雄点击暴击率*/
            get: function () {
                return this._Strike;
            },
            set: function (value) {
                this._Strike = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "StrikeTimes", {
            /** 英雄点击暴击倍率*/
            get: function () {
                return this._Striketimes;
            },
            set: function (value) {
                this._Striketimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Laddertimes", {
            /**天梯挑战次数 */
            get: function () {
                return this._laddertimes;
            },
            set: function (value) {
                this._laddertimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "BuyLaddertimes", {
            /**每日 可以可购买挑战次数 */
            get: function () {
                return this._laddertimes_buy;
            },
            set: function (value) {
                this._laddertimes_buy = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "MaxMp", {
            /**角色最大魔法值 */
            get: function () {
                return this._maxMp;
            },
            set: function (value) {
                this._maxMp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "RecoverMp", {
            /**角色魔法值回复速度 */
            get: function () {
                return this._recoverMp;
            },
            set: function (value) {
                this._recoverMp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Mp", {
            /**角色当前魔法值 */
            get: function () {
                return this._mp;
            },
            set: function (value) {
                this._mp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "HeroNum", {
            /**玩家拥有的已解锁英雄数量 */
            get: function () {
                return this._heroNum;
            },
            set: function (value) {
                this._heroNum = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Donate", {
            /**捐献材料的数量 */
            get: function () {
                return this._donate;
            },
            set: function (value) {
                this._donate = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "TopUp", {
            /**充值信息 */
            get: function () {
                return this._TopUp;
            },
            set: function (value) {
                this._TopUp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ExpirationTime", {
            get: function () {
                return this._ExpirationTime;
            },
            /** 玩家vip过期时间 */
            set: function (value) {
                this._ExpirationTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "IsVip", {
            /** 是否是VIP */
            get: function () {
                return this.IsPermanentVip || this._ExpirationTime > H52D_Framework.Time.serverSecodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "IsPermanentVip", {
            /** 是否是永久VIP */
            get: function () {
                return this._ExpirationTime == -1;
            },
            enumerable: true,
            configurable: true
        });
        /** 是否是VIP  ExpirationTime */
        Player.prototype.getIsVip = function (eTime) {
            if (eTime == -1) {
                return true;
            }
            return eTime > H52D_Framework.Time.serverSecodes;
        };
        Object.defineProperty(Player.prototype, "PassOut", {
            /**通关数 */
            get: function () {
                return this._pass;
            },
            set: function (value) {
                this._pass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Sound", {
            /**通关数 */
            get: function () {
                return this._sound;
            },
            set: function (value) {
                this._sound = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Music", {
            /**通关数 */
            get: function () {
                return this._music;
            },
            set: function (value) {
                this._music = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "SkillList", {
            /** 已解锁技能 */
            get: function () {
                return this._skillList;
            },
            enumerable: true,
            configurable: true
        });
        /** 设置已解锁技能 */
        Player.prototype.SetSkillList = function (type, id) {
            if (type === void 0) { type = -128; }
            if (id === void 0) { id = 0; }
            if (type == -128) {
                this._skillList = {};
            }
            else {
                this._skillList[type] = id;
            }
        };
        /**角色等级提升 */
        Player.prototype.levelUp = function (needExp) {
            if (this.Level < this._maxLevel) {
                if (this.Exp > this.NeedExp) {
                    this.Level += 1;
                    this.Exp -= this.NeedExp;
                    //this.Base 基础属性改变
                    //this.Proint=对应级数的点击伤害
                    //玩家显示等级的文本改变
                    //播放升级声音 特效
                }
                else {
                    //经验不在累计
                }
            }
        };
        Object.defineProperty(Player.prototype, "CunstLevel", {
            /**去掉1W的关卡数 */
            get: function () {
                return H52D_Framework.CustomspassConfig[this._customsId].customsOrder;
            },
            enumerable: true,
            configurable: true
        });
        /**销毁 */
        Player.prototype.Destroy = function () {
            for (var i in this._heroList) {
                this._heroList[i].Destroy();
                this._heroList[i] = null;
            }
            this._heroList = {};
        };
        return Player;
    }());
    H52D_Framework.Player = Player;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Player.js.map