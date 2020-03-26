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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("MatchRankView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MatchRankView = /** @class */ (function (_super) {
        __extends(MatchRankView, _super);
        function MatchRankView() {
            var _this = _super.call(this) || this;
            _this._bool = false;
            _this.Init();
            _this.AddEvent();
            return _this;
        }
        /**添加事件 */
        MatchRankView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
        };
        /**销毁按钮侦听器 */
        MatchRankView.prototype.OnDestroy = function () {
            this.offAll();
        };
        /**初始化 */
        MatchRankView.prototype.Init = function () {
            this.rankData = H52D_Framework.RankLogic.Instance.GetDataByType(RankEnum.PKLeagueHit);
            this.otherData = H52D_Framework.RankLogic.Instance.GetOtherInfoByType(RankEnum.PKLeagueHit);
            this.SetDataToList();
            this.SetHead();
            this.title.text = "海选排名";
        };
        MatchRankView.prototype.SetHead = function () {
            var headId = H52D_Framework.MasterPlayer.Instance.player.HeadId;
            if (headId == 0) {
                this.myRankIcon.skin = "ui_head/icon_ui_01.png";
            }
            else {
                this.myRankIcon.skin = "ui_icon/" + H52D_Framework.HeroConfig[headId].strIcon;
            }
        };
        /**获取排行数据 */
        MatchRankView.prototype.UpdateDate = function () {
            H52D_Framework.RankLogic.Instance.K_RankDataReq(RankEnum.NowBossRank, 1, 100);
        };
        /**为排名list添加数据源 */
        MatchRankView.prototype.SetDataToList = function () {
            this.rankList.vScrollBarSkin = "";
            //排行数据
            //let data = this.rankData;
            var data = this.rankData;
            this.myCampName.visible = this._bool;
            var data_List = [];
            for (var i in data) {
                if (Number(i) != 0) {
                    data_List.push(data[i]);
                }
                else {
                    //自己的数据（没打）
                    this._myRangNum = data[0];
                    if (this._myRangNum == 0) {
                        var name_1 = H52D_Framework.MasterPlayer.Instance.player.Name;
                        var rankContentString = void 0;
                        this.notNum.visible = true;
                        this.myRankNum.visible = false;
                        this.myRankName.changeText(name_1);
                        var a = H52D_Framework.MasterPlayer.Instance.player.Head;
                        this.myVip.visible = H52D_Framework.MasterPlayer.Instance.player.IsVip;
                        this.myRankName.x = H52D_Framework.MasterPlayer.Instance.player.IsVip ? 233 : 185;
                        this.myCampName.text = "阵营：无";
                        var myCampId = H52D_Framework.MasterPlayer.Instance.player.CampID;
                        var GangCfg = H52D_Framework.GangConfig[myCampId];
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }
                        rankContentString = "伤害：无";
                        this.myRankContent.changeText(rankContentString);
                    }
                    else {
                        var mydata = data[this._myRangNum];
                        //获取自己排名信息
                        this.notNum.visible = false;
                        this.myRankNum.visible = true;
                        this.myRankNum.changeText(this._myRangNum.toString());
                        this.myRankName.changeText(H52D_Framework.MasterPlayer.Instance.player.Name);
                        this.myVip.visible = H52D_Framework.MasterPlayer.Instance.player.IsVip;
                        this.myRankName.x = H52D_Framework.MasterPlayer.Instance.player.IsVip ? 233 : 185;
                        this.myCampName.text = "阵营：无";
                        var myCampId = H52D_Framework.MasterPlayer.Instance.player.CampID;
                        var GangCfg = H52D_Framework.GangConfig[myCampId];
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }
                        var rankContentString = "伤害：" + mydata[3].toString();
                        this.myRankContent.changeText(rankContentString);
                        if (this._myRangNum > 100) {
                            this.notNum.visible = true;
                            this.myRankNum.visible = false;
                        }
                    }
                }
            }
            this.rankList.array = data_List;
            this.rankList.renderHandler = new Laya.Handler(this, this.SetRankListRender);
        };
        /**
         * 设置排名Rank list样式
         * @param item 单个box
         * @param index 索引
        */
        MatchRankView.prototype.SetRankListRender = function (item, index) {
            var vip = item.getChildByName("vip");
            var bgImg = item.getChildByName("bgImg");
            var rankNum = item.getChildByName("rankNum");
            var rankName = item.getChildByName("rankName");
            var rankIcon = item.getChildByName("rankIcon");
            var rankContent = item.getChildByName("rankContent");
            var camp_name = item.getChildByName("camp_name");
            camp_name.visible = this._bool;
            var num = index + 1;
            var tOtherInfo = this.otherData[num] || {};
            var nHeadID = tOtherInfo[1];
            var nVip = tOtherInfo[2];
            var nCamp = tOtherInfo[3];
            var data = this.rankList.array[index];
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
            var rankContentString = "伤害:" + data[3].toString();
            rankContent.changeText(rankContentString);
            if (num == 1 || num == 2 || num == 3) {
                bgImg.skin = "ui_rank/img-" + num.toString() + "-paiming.png";
                rankNum.visible = false;
            }
            else {
                rankNum.visible = true;
                bgImg.skin = "ui_rank/img-zhihou-paiming.png";
            }
        };
        /**关闭UI */
        MatchRankView.prototype.CloseUI = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        return MatchRankView;
    }(ui.action.match.MatchRankViewUI));
    H52D_Framework.MatchRankView = MatchRankView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchRankView.js.map