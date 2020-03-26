module H52D_Framework {
    export enum ShareType {
        base = 1,
        hero = 2,
        customs = 3,
        achieven = 4,
        ladder_win = 5,
        ladder_lvup = 6,
        pvp = 7
    }
	/**
	 * @class 分享管理类
	 * @author zhangyusong 
	 **/
    export class ShareLogic {
        private static _instance: ShareLogic;
        private _custemsArr: Array<any> = [];
        private _isOpenShare = false;
        private _ShareCustomsMax: number = 0;
        public static get Instance(): ShareLogic {
            if (ShareLogic._instance == null) {
                ShareLogic._instance = new ShareLogic();
            }
            return ShareLogic._instance;
        }

        /** 显示红点 */
        public ShowRed(): boolean {
            let showRed: boolean = false
            if (!IsShieldRecharge()) {
                showRed = !MasterPlayer.Instance.player.IsVip &&      //不是VIP
                    MasterPlayer.Instance.invitaVipTimes < 5 && //临时VIP小于5天
                    MasterPlayer.Instance.invitaVipFlag == 0 && //没有领过
                    MasterPlayer.Instance.dayInviteNum >= GameParamConfig["VipNeedPlayerNum"]   //邀请人数够了
            }

            if (!showRed) {
                for (let c in InvitationConfig) {
                    if (Number(c) <= MasterPlayer.Instance.newInviteNum) {
                        showRed = Number(MasterPlayer.Instance.getInvitation(Number(c))) == 0;
                        if (showRed)
                            break;
                    }
                }
            }
            return showRed;
        }

        public Initialize(): void {
            let custemsConfig = GameParamConfig.ShareRelationCustoms
            for (var key in custemsConfig) {
                if (custemsConfig[key]) {
                    let custems = custemsConfig[key]
                    this._custemsArr.push(custems);
                }
            }
            this.ShareCustemsMax();
            this.EventInit();
        }

        private EventInit() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddFreeUseNum", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetInviteAward", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqShareGame", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetInviteVip", this);
        }

        private C_ReqAddFreeUseNum() {
            let totle: number = GameParamConfig["ShareDialyGetFreePrivilegeNum"];
            let prv: number = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.ShareNum);
            if (prv > totle) {
                let str = SysPromptConfig[30050].strPromptInfo
                TipsLogic.Instance.OpenSystemTips(str);
            }
            let aa = MasterPlayer.Instance._FreeSum;
            if (MasterPlayer.Instance._FreeSum == MasterPlayer.Instance.getFreeUseSum()) {
                let str = SysPromptConfig[30035].strPromptInfo
                // TipsLogic.Instance.OpenSystemTips(str);
            }
            if (UIManager.Instance.IsHave("ShareBaseView", ViewUpRoot)) {
                Event.DispatchEvent("ShareInit");
            }
            //刷新特权数据
            MainRoleLogic.Instance.SetPrivList();
        }

        /** 领取邀请奖励返回 */
        private C_ReqGetInviteAward(buf: any) {
            let award: Object = buf[1];
            MasterPlayer.Instance.setInvitation(buf[0], 1);
            TipsLogic.Instance.OpenGoodsProTips(award)
            Event.DispatchEvent("InviteAwardFrush");
        }

        private C_ReqShareGame(buf: any) {
            let nCallType = buf[0];
            let nId = buf[1];
            let info = buf[2];

            OneTimer(2000, () => {
                if (nCallType == ShareType.hero) {
                    let heroName = GetInfoAttr.Instance.GetText(HeroConfig[nId].name)
                    let str = Format(SysPromptConfig[30036].strPromptInfo, heroName)
                    TipsLogic.Instance.OpenSystemTips(str);
                    Event.DispatchEvent("ReqHeroLevelUp");
                }
                else if (nCallType == ShareType.customs ||
                    nCallType == ShareType.ladder_win ||
                    nCallType == ShareType.pvp) {
                    let str = SysPromptConfig[30037].strPromptInfo
                    TipsLogic.Instance.OpenSystemTips(str);
                    TipsLogic.Instance.OpenGoodsProTips(info)
                }
                else if (nCallType == ShareType.achieven) {
                    let str = SysPromptConfig[30038].strPromptInfo
                    TipsLogic.Instance.OpenSystemTips(str);
                }
                else if (nCallType == ShareType.base) {
                    let str = SysPromptConfig[30037].strPromptInfo
                    TipsLogic.Instance.OpenSystemTips(str);
                }
                else if (nCallType == ShareType.ladder_lvup) {
                    let a = GameParamConfig.LadderParagraphPromotionIntegral
                    let str = SysPromptConfig[30070].strPromptInfo;
                    str = Format(str, a);
                    MasterPlayer.Instance.player.Fraction+=a;
                    Event.DispatchEvent("ReshView_ladder");
                    TipsLogic.Instance.OpenSystemTips(str);
                }
            })
        }

        private C_ReqGetInviteVip(buf: any) {
            MasterPlayer.Instance.invitaVipFlag = 1;
            MasterPlayer.Instance.invitaVipTimes++;
            Event.DispatchEvent("FrushVipTime");
        }

        private ShareCustemsMax(): void {
            let max: number = 0;
            for (let i = 0; i < this._custemsArr.length; i++) {
                if (this._custemsArr[i] > max) {
                    max = this._custemsArr[i];
                }
            }
            this._ShareCustomsMax = max;
        }

        /**
        * 获取可分享的关卡数据
        */
        public get shareCustems(): Array<any> {
            return this._custemsArr;
        }

        /**
        * 获取可分享的最大关卡
        */
        public get ShareMax(): number {
            return this._ShareCustomsMax;
        }

        /** 英雄激活分享 */
        public ShareHero(heroId: number) {
            UIManager.Instance.CreateUI("ShareHeroView", [ViewToppestRoot, heroId]);
        }

        /** 通关分享 */
        public ShareCustoms(order: number) {
            UIManager.Instance.CreateUI("ShareCustomsView", [ViewToppestRoot, order]);
        }

        /** 成就分享 */
        public ShareAchieven(type: number, id: number) {
            UIManager.Instance.CreateUI("ShareAchievenView", [ViewToppestRoot, type, id]);
        }

        /** 助力通关 */
        public AssistanceCustems() {
            UIManager.Instance.CreateUI("InvitationCustomsView", [ViewToppestRoot, 0]);
        }
        /** 助力邀请 */
        public AssistanceInvitation() {
            UIManager.Instance.CreateUI("InvitationCustomsView", [ViewToppestRoot, 1]);
        }


        /**
         * 是否开启分享
         */
        public get isOpenShare(): boolean {
            return this._isOpenShare;
        }
    }
}