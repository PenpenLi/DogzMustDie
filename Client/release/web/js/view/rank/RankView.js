var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**排行榜
 * yezhunian
*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("RankView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
    ]);
    var RankView = /** @class */ (function (_super) {
        __extends(RankView, _super);
        function RankView(buf) {
            var _a;
            var _this = _super.call(this) || this;
            _this.rankTypeName_d = {
                1: "个人榜",
                2: "魅力榜",
                3: "年兽大作战"
            };
            _this.rankTypeName_s = {
                1: [1, "等级榜", RankEnum.ePerStrength],
                4: [1, "财富榜", RankEnum.ePerTreasure],
                3: [1, "点击榜", RankEnum.ePerClick],
                5: [1, "富豪榜", RankEnum.ePerRich],
                2: [1, "英雄榜", RankEnum.ePerHreo],
                6: [2, "本周榜", RankEnum.CharmWeek],
                7: [2, "上周榜", RankEnum.CharmLastWeek],
                8: [2, "总榜", RankEnum.CharmAll],
                9: [3, "今日榜", RankEnum.NowBossRank],
                10: [3, "昨日榜", RankEnum.LastBossRank],
            };
            _this.rankText = (_a = {},
                _a[RankEnum.ePerStrength] = "角色等级：",
                _a[RankEnum.ePerHreo] = "英雄数量：",
                _a[RankEnum.ePerClick] = "点击次数：",
                _a[RankEnum.ePerTreasure] = "累计获取金币：",
                _a[RankEnum.ePerRich] = "充值钻石：",
                _a[RankEnum.CharmAll] = "魅力值：",
                _a[RankEnum.CharmWeek] = "魅力值：",
                _a[RankEnum.CharmLastWeek] = "魅力值：",
                _a[RankEnum.LastBossRank] = "伤害：",
                _a[RankEnum.NowBossRank] = "伤害：",
                _a);
            _this._bool = false;
            //设置初始页面
            _this._currentRankEnum_d = buf[1] || RankTypeEnum.ePer;
            _this._currentRankEnum_s = buf[2] || RankEnum.ePerStrength;
            _this.Init();
            _this.AddEvent();
            return _this;
        }
        /**添加事件 */
        RankView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            H52D_Framework.Event.RegistEvent('UpdateRankList', Laya.Handler.create(this, this.UpdateRankList));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.SetHead));
        };
        /**销毁按钮侦听器 */
        RankView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('UpdateRankList', Laya.Handler.create(this, this.UpdateRankList));
        };
        /**初始化 */
        RankView.prototype.Init = function () {
            this.UpdateDate();
            this.SetOneTypeToList();
            this.SetTwoTypeToList();
            this.SetHead();
            this.WroldBossReward(this._currentRankEnum_d);
        };
        /**控制世界boss奖励按钮显示 隐藏 */
        RankView.prototype.WroldBossReward = function (id) {
            if (this.rankTypeName_d[id] != this.rankTypeName_d[3]) {
                this.Btn_reward.visible = false;
                return;
            }
            this._bool = true;
            this.Btn_reward.on(Laya.Event.CLICK, this, this.Btn_reward_show);
        };
        /**打开世界boss奖励界面 */
        RankView.prototype.Btn_reward_show = function () {
            H52D_Framework.UIManager.Instance.CreateUI("WroldBossRewardView", [H52D_Framework.ViewUpRoot]);
        };
        RankView.prototype.SetHead = function () {
            var headId = H52D_Framework.MasterPlayer.Instance.player.HeadId;
            if (headId == 0) {
                this.myRankIcon.skin = "ui_head/icon_ui_01.png";
            }
            else {
                this.myRankIcon.skin = "ui_icon/" + H52D_Framework.HeroConfig[headId].strIcon;
            }
        };
        RankView.prototype.UpdateDate = function () {
            H52D_Framework.RankLogic.Instance.K_ReqClickTimes(0);
            H52D_Framework.RankLogic.Instance.K_RankDataReq(this._currentRankEnum_s, 1, 100);
        };
        /**排行列表刷新 */
        RankView.prototype.UpdateRankList = function (type) {
            this.SetDataToList(type);
        };
        /**设置一级级排行榜标签List*/
        RankView.prototype.SetOneTypeToList = function () {
            this.typeList_d.hScrollBarSkin = "";
            var arr = [];
            for (var info in this.rankTypeName_d) {
                arr.push(this.rankTypeName_d[info]);
            }
            this.typeList_d.array = arr;
            this.typeList_d.renderHandler = new Laya.Handler(this, this.SetOneTypeListRender);
        };
        /**设置二级排行榜标签List*/
        RankView.prototype.SetTwoTypeToList = function () {
            this.typeList_s.hScrollBarSkin = "";
            var arr = [];
            for (var info in this.rankTypeName_s) {
                var rankData_s = this.rankTypeName_s[info];
                if (rankData_s[0] == this._currentRankEnum_d) {
                    arr.push(rankData_s);
                }
            }
            this.typeList_s.array = arr;
            this.typeList_s.renderHandler = new Laya.Handler(this, this.SetTwoTypeListRender);
        };
        /**为排名list添加数据源 */
        RankView.prototype.SetDataToList = function (rankEnum) {
            this._curRankType = rankEnum;
            this.rankList.vScrollBarSkin = "";
            //this.rankList.array = [];
            var info = this.typeList_s.array[rankEnum];
            var data = H52D_Framework.RankLogic.Instance.GetDataByType(rankEnum);
            this.myCampName.visible = this._bool;
            var data_List = [];
            for (var i in data) {
                if (Number(i) != 0) {
                    data_List.push(data[i]);
                }
                else {
                    this._myRangNum = data[0];
                    if (this._myRangNum == 0) {
                        var name_1 = H52D_Framework.MasterPlayer.Instance.player.Name;
                        var rankContentString = void 0;
                        this.notNum.visible = true;
                        this.myRankNum.visible = false;
                        this.myRankName.changeText(name_1);
                        var a = H52D_Framework.MasterPlayer.Instance.player.Head;
                        //this.myRankIcon.skin = "ui_icon/icon_tou_lss.png";
                        this.myCampName.text = "阵营：无";
                        var myCampId = H52D_Framework.MasterPlayer.Instance.player.CampID;
                        var GangCfg = H52D_Framework.GangConfig[myCampId];
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }
                        switch (this._currentRankEnum_s) {
                            case RankEnum.ePerClick:
                                var clickNum = H52D_Framework.MasterPlayer.Instance.GetEventProByType[EventProEnum.AddClick].toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + clickNum;
                                break;
                            case RankEnum.ePerHreo:
                                var hreo = H52D_Framework.HeroManager.Instance.GetHeroNum().toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + hreo;
                                break;
                            case RankEnum.ePerRich:
                                //let Rich = MasterPlayer.Instance.GetEventProByType[RankProEnum.AddGold].toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + "暂未开启！";
                                break;
                            case RankEnum.ePerStrength:
                                var lv = H52D_Framework.MasterPlayer.Instance.player.Level.toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + lv;
                                break;
                            case RankEnum.ePerTreasure:
                                var Treasure = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.AddGold).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + Treasure;
                                break;
                            case RankEnum.CharmAll:
                                var Charm = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.Charm).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + Charm;
                                break;
                            case RankEnum.CharmWeek:
                                var CharmWeek = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.CharmWeek).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + CharmWeek;
                                break;
                            case RankEnum.CharmLastWeek:
                                var CharLastmWeek = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.CharLastmWeek).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + CharLastmWeek;
                                break;
                            case RankEnum.NowBossRank:
                                var NowBossRanks = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + NowBossRanks;
                                break;
                            case RankEnum.LastBossRank:
                                var LastBossRanks = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.LastBossRank).toString();
                                rankContentString = this.rankText[this._currentRankEnum_s] + LastBossRanks;
                                break;
                        }
                        this.myRankContent.changeText(rankContentString);
                    }
                    else {
                        var mydata = data[this._myRangNum];
                        //获取自己排名信息
                        this.notNum.visible = false;
                        this.myRankNum.visible = true;
                        this.myRankNum.changeText(this._myRangNum.toString());
                        this.myRankName.changeText(mydata[2]);
                        this.myVip.visible = H52D_Framework.MasterPlayer.Instance.player.IsVip;
                        this.myRankName.x = H52D_Framework.MasterPlayer.Instance.player.IsVip ? 233 : 185;
                        this.myCampName.text = "阵营：无";
                        var myCampId = H52D_Framework.MasterPlayer.Instance.player.CampID;
                        var GangCfg = H52D_Framework.GangConfig[myCampId];
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }
                        var rankContentString = this.rankText[this._currentRankEnum_s] + mydata[3].toString();
                        this.myRankContent.changeText(rankContentString);
                    }
                }
            }
            this.rankList.array = data_List;
            this.rankList.renderHandler = new Laya.Handler(this, this.SetRankListRender);
        };
        /**
         * 设置一级标签Rank list样式
         * @param item 单个box
         * @param index 索引
        */
        RankView.prototype.SetOneTypeListRender = function (item, index) {
            var data = this.typeList_d.array[index];
            var type = item.getChildByName("type");
            var btn = item.getChildByName("btn");
            var cur = item.getChildByName("cur");
            type.text = data;
            if (index + 1 == this._currentRankEnum_d) {
                cur.skin = "ui_rank/img-zi-daxuanze.png";
            }
            else {
                cur.skin = "";
            }
            btn.on(Laya.Event.CLICK, this, this.SetCurrentOneRankEnum, [index + 1]);
        };
        /**
         * 设置二级标签Rank list样式
         * @param item 单个box
         * @param index 索引
        */
        RankView.prototype.SetTwoTypeListRender = function (item, index) {
            var data = this.typeList_s.array[index];
            var nRankType = data[2];
            var type = item.getChildByName("type");
            var btn = item.getChildByName("btn");
            type.text = data[1];
            type.color = "#bebbf8";
            if (nRankType == this._currentRankEnum_s) {
                btn.skin = "ui_rank/img-zi-weixuan.png";
            }
            else {
                btn.skin = "ui_rank/img-lan-weixuan.png";
            }
            if (this._currentRankEnum_s == RankEnum.ePerStrength || this._currentRankEnum_s == RankEnum.CharmWeek) {
                this.tp.skin = "ui_rank/img-zi-xuan.png";
            }
            else {
                this.tp.skin = "ui_rank/img-lan-xuan.png";
            }
            btn.on(Laya.Event.CLICK, this, this.SetCurrentTwoRankEnum, [nRankType]);
            if (this._currentRankEnum_s == RankEnum.ePerRich) {
                this.typeList_s.scrollBar.value = 100;
            }
            if (this._currentRankEnum_s == nRankType) {
                type.color = "#eff8bb";
            }
        };
        /**
         * 设置排名Rank list样式
         * @param item 单个box
         * @param index 索引
        */
        RankView.prototype.SetRankListRender = function (item, index) {
            var vip = item.getChildByName("vip");
            var bgImg = item.getChildByName("bgImg");
            var rankNum = item.getChildByName("rankNum");
            var rankName = item.getChildByName("rankName");
            var rankIcon = item.getChildByName("rankIcon");
            var rankContent = item.getChildByName("rankContent");
            var camp_name = item.getChildByName("camp_name");
            camp_name.visible = this.Btn_reward.visible;
            var tOtherList = {};
            if (this._curRankType) {
                tOtherList = H52D_Framework.RankLogic.Instance.GetOtherInfoByType(this._curRankType);
            }
            var data = this.rankList.array[index];
            var num = index + 1;
            var tOtherInfo = tOtherList[num] || {};
            var nHeadID = tOtherInfo[1];
            var nVip = tOtherInfo[2];
            var nCamp = tOtherInfo[3];
            camp_name.text = "阵营：无";
            if (nCamp) {
                camp_name.text = "阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GangConfig[nCamp].nameId);
            }
            if (nHeadID != null && nHeadID > 0) {
                var cfg = H52D_Framework.HeroConfig[nHeadID];
                rankIcon.skin = "ui_icon/" + cfg.strIcon;
            }
            else {
                rankIcon.skin = "ui_head/icon_ui_01.png";
            }
            if (nVip != null && H52D_Framework.MasterPlayer.Instance.player.getIsVip(nVip)) {
                vip.visible = true;
                rankName.x = 233;
            }
            else {
                vip.visible = false;
                rankName.x = 185;
            }
            rankName.changeText(data[2]);
            rankNum.changeText(num.toString());
            var rankContentString = this.rankText[this._currentRankEnum_s] + data[3].toString();
            rankContent.changeText(rankContentString);
            if (num == 1 || num == 2 || num == 3) {
                bgImg.skin = "ui_rank/img-" + num.toString() + "-paiming.png";
                rankNum.visible = false;
            }
            else {
                rankNum.visible = true;
                bgImg.skin = "ui_rank/img-zhihou-paiming.png";
            }
            if (this._myRangNum != num) {
                rankIcon.on(Laya.Event.CLICK, this, this.GiveGift, [data[1], data[2]]);
            }
            else {
                rankIcon.off(Laya.Event.CLICK, this, this.GiveGift);
            }
        };
        /**设置当前一级标签 */
        RankView.prototype.SetCurrentOneRankEnum = function (_rankTypeEnum) {
            //if (_rankTypeEnum == RankTypeEnum.ePer) {
            this._currentRankEnum_d = _rankTypeEnum;
            for (var i in this.rankTypeName_s) {
                var data = this.rankTypeName_s[i];
                if (data[0] == _rankTypeEnum) {
                    this.SetCurrentTwoRankEnum(data[2]);
                    break;
                }
            }
            this.WroldBossReward(this._currentRankEnum_d);
            this.SetTwoTypeToList();
            this.SetOneTypeToList();
        };
        /**设置当前二级标签 */
        RankView.prototype.SetCurrentTwoRankEnum = function (_rankEnum) {
            if (_rankEnum == RankEnum.ePerRich) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("暂未开启！！");
                return;
            }
            this._currentRankEnum_s = _rankEnum;
            H52D_Framework.RankLogic.Instance.K_RankDataReq(_rankEnum, 1, 100);
            this.SetTwoTypeToList();
            //添加按钮点击音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /**
         * 赠送礼物
         * @param roleID 玩家ID
         * @param strName 玩家名字
         */
        RankView.prototype.GiveGift = function (roleID, strName) {
            H52D_Framework.UIManager.Instance.CreateUI("InteractView", [H52D_Framework.ViewUpRoot, roleID, strName]);
        };
        /**关闭UI */
        RankView.prototype.CloseUI = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            H52D_Framework.UIManager.Instance.DestroyUI("RankView", [H52D_Framework.ViewUpRoot]);
        };
        return RankView;
    }(ui.rank.RankViewUI));
    H52D_Framework.RankView = RankView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RankView.js.map