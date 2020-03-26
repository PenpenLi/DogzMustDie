var H52D_Framework;
(function (H52D_Framework) {
    var ShareType;
    (function (ShareType) {
        ShareType[ShareType["base"] = 1] = "base";
        ShareType[ShareType["hero"] = 2] = "hero";
        ShareType[ShareType["customs"] = 3] = "customs";
        ShareType[ShareType["achieven"] = 4] = "achieven";
        ShareType[ShareType["ladder_win"] = 5] = "ladder_win";
        ShareType[ShareType["ladder_lvup"] = 6] = "ladder_lvup";
        ShareType[ShareType["pvp"] = 7] = "pvp";
    })(ShareType = H52D_Framework.ShareType || (H52D_Framework.ShareType = {}));
    /**
     * @class 分享管理类
     * @author zhangyusong
     **/
    var ShareLogic = /** @class */ (function () {
        function ShareLogic() {
            this._custemsArr = [];
            this._isOpenShare = false;
            this._ShareCustomsMax = 0;
        }
        Object.defineProperty(ShareLogic, "Instance", {
            get: function () {
                if (ShareLogic._instance == null) {
                    ShareLogic._instance = new ShareLogic();
                }
                return ShareLogic._instance;
            },
            enumerable: true,
            configurable: true
        });
        /** 显示红点 */
        ShareLogic.prototype.ShowRed = function () {
            var showRed = false;
            if (!H52D_Framework.IsShieldRecharge()) {
                showRed = !H52D_Framework.MasterPlayer.Instance.player.IsVip && //不是VIP
                    H52D_Framework.MasterPlayer.Instance.invitaVipTimes < 5 && //临时VIP小于5天
                    H52D_Framework.MasterPlayer.Instance.invitaVipFlag == 0 && //没有领过
                    H52D_Framework.MasterPlayer.Instance.dayInviteNum >= H52D_Framework.GameParamConfig["VipNeedPlayerNum"]; //邀请人数够了
            }
            if (!showRed) {
                for (var c in H52D_Framework.InvitationConfig) {
                    if (Number(c) <= H52D_Framework.MasterPlayer.Instance.newInviteNum) {
                        showRed = Number(H52D_Framework.MasterPlayer.Instance.getInvitation(Number(c))) == 0;
                        if (showRed)
                            break;
                    }
                }
            }
            return showRed;
        };
        ShareLogic.prototype.Initialize = function () {
            var custemsConfig = H52D_Framework.GameParamConfig.ShareRelationCustoms;
            for (var key in custemsConfig) {
                if (custemsConfig[key]) {
                    var custems = custemsConfig[key];
                    this._custemsArr.push(custems);
                }
            }
            this.ShareCustemsMax();
            this.EventInit();
        };
        ShareLogic.prototype.EventInit = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddFreeUseNum", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetInviteAward", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqShareGame", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetInviteVip", this);
        };
        ShareLogic.prototype.C_ReqAddFreeUseNum = function () {
            var totle = H52D_Framework.GameParamConfig["ShareDialyGetFreePrivilegeNum"];
            var prv = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.ShareNum);
            if (prv > totle) {
                var str = H52D_Framework.SysPromptConfig[30050].strPromptInfo;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
            var aa = H52D_Framework.MasterPlayer.Instance._FreeSum;
            if (H52D_Framework.MasterPlayer.Instance._FreeSum == H52D_Framework.MasterPlayer.Instance.getFreeUseSum()) {
                var str = H52D_Framework.SysPromptConfig[30035].strPromptInfo;
                // TipsLogic.Instance.OpenSystemTips(str);
            }
            if (H52D_Framework.UIManager.Instance.IsHave("ShareBaseView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.Event.DispatchEvent("ShareInit");
            }
            //刷新特权数据
            H52D_Framework.MainRoleLogic.Instance.SetPrivList();
        };
        /** 领取邀请奖励返回 */
        ShareLogic.prototype.C_ReqGetInviteAward = function (buf) {
            var award = buf[1];
            H52D_Framework.MasterPlayer.Instance.setInvitation(buf[0], 1);
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(award);
            H52D_Framework.Event.DispatchEvent("InviteAwardFrush");
        };
        ShareLogic.prototype.C_ReqShareGame = function (buf) {
            var nCallType = buf[0];
            var nId = buf[1];
            var info = buf[2];
            H52D_Framework.OneTimer(2000, function () {
                if (nCallType == ShareType.hero) {
                    var heroName = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.HeroConfig[nId].name);
                    var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[30036].strPromptInfo, heroName);
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    H52D_Framework.Event.DispatchEvent("ReqHeroLevelUp");
                }
                else if (nCallType == ShareType.customs ||
                    nCallType == ShareType.ladder_win ||
                    nCallType == ShareType.pvp) {
                    var str = H52D_Framework.SysPromptConfig[30037].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(info);
                }
                else if (nCallType == ShareType.achieven) {
                    var str = H52D_Framework.SysPromptConfig[30038].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                }
                else if (nCallType == ShareType.base) {
                    var str = H52D_Framework.SysPromptConfig[30037].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                }
                else if (nCallType == ShareType.ladder_lvup) {
                    var a = H52D_Framework.GameParamConfig.LadderParagraphPromotionIntegral;
                    var str = H52D_Framework.SysPromptConfig[30070].strPromptInfo;
                    str = H52D_Framework.Format(str, a);
                    H52D_Framework.MasterPlayer.Instance.player.Fraction += a;
                    H52D_Framework.Event.DispatchEvent("ReshView_ladder");
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                }
            });
        };
        ShareLogic.prototype.C_ReqGetInviteVip = function (buf) {
            H52D_Framework.MasterPlayer.Instance.invitaVipFlag = 1;
            H52D_Framework.MasterPlayer.Instance.invitaVipTimes++;
            H52D_Framework.Event.DispatchEvent("FrushVipTime");
        };
        ShareLogic.prototype.ShareCustemsMax = function () {
            var max = 0;
            for (var i = 0; i < this._custemsArr.length; i++) {
                if (this._custemsArr[i] > max) {
                    max = this._custemsArr[i];
                }
            }
            this._ShareCustomsMax = max;
        };
        Object.defineProperty(ShareLogic.prototype, "shareCustems", {
            /**
            * 获取可分享的关卡数据
            */
            get: function () {
                return this._custemsArr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShareLogic.prototype, "ShareMax", {
            /**
            * 获取可分享的最大关卡
            */
            get: function () {
                return this._ShareCustomsMax;
            },
            enumerable: true,
            configurable: true
        });
        /** 英雄激活分享 */
        ShareLogic.prototype.ShareHero = function (heroId) {
            H52D_Framework.UIManager.Instance.CreateUI("ShareHeroView", [H52D_Framework.ViewToppestRoot, heroId]);
        };
        /** 通关分享 */
        ShareLogic.prototype.ShareCustoms = function (order) {
            H52D_Framework.UIManager.Instance.CreateUI("ShareCustomsView", [H52D_Framework.ViewToppestRoot, order]);
        };
        /** 成就分享 */
        ShareLogic.prototype.ShareAchieven = function (type, id) {
            H52D_Framework.UIManager.Instance.CreateUI("ShareAchievenView", [H52D_Framework.ViewToppestRoot, type, id]);
        };
        /** 助力通关 */
        ShareLogic.prototype.AssistanceCustems = function () {
            H52D_Framework.UIManager.Instance.CreateUI("InvitationCustomsView", [H52D_Framework.ViewToppestRoot, 0]);
        };
        /** 助力邀请 */
        ShareLogic.prototype.AssistanceInvitation = function () {
            H52D_Framework.UIManager.Instance.CreateUI("InvitationCustomsView", [H52D_Framework.ViewToppestRoot, 1]);
        };
        Object.defineProperty(ShareLogic.prototype, "isOpenShare", {
            /**
             * 是否开启分享
             */
            get: function () {
                return this._isOpenShare;
            },
            enumerable: true,
            configurable: true
        });
        return ShareLogic;
    }());
    H52D_Framework.ShareLogic = ShareLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShareLogic.js.map