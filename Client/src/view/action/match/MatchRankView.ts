module H52D_Framework {
    AddViewResource("MatchRankView",
        [
            { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
        ]);
    export class MatchRankView extends ui.action.match.MatchRankViewUI {
        /**自己的排名 */
        private _myRangNum: number;
        private rankData: any;
        private otherData: any;
        private _bool: boolean = false;
        constructor() {
            super();
            this.Init();
            this.AddEvent();
        }
        /**添加事件 */
        private AddEvent() {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
        }

        /**销毁按钮侦听器 */
        private OnDestroy(): void {
            this.offAll();
        }

        /**初始化 */
        private Init() {
            this.rankData = RankLogic.Instance.GetDataByType(RankEnum.PKLeagueHit);
            this.otherData = RankLogic.Instance.GetOtherInfoByType(RankEnum.PKLeagueHit);
            this.SetDataToList();
            this.SetHead();
            this.title.text = "海选排名";
        }

        private SetHead() {
            let headId = MasterPlayer.Instance.player.HeadId;
            if (headId == 0) {
                this.myRankIcon.skin = "ui_head/icon_ui_01.png";
            }
            else {
                this.myRankIcon.skin = "ui_icon/" + HeroConfig[headId].strIcon;
            }
        }
        /**获取排行数据 */
        private UpdateDate() {
            RankLogic.Instance.K_RankDataReq(RankEnum.NowBossRank, 1, 100);
        }

        /**为排名list添加数据源 */
        private SetDataToList() {
            this.rankList.vScrollBarSkin = "";
            //排行数据
            //let data = this.rankData;
            let data = this.rankData;
            this.myCampName.visible = this._bool;
            let data_List: any = [];
            for (let i in data) {
                if (Number(i) != 0) {
                    data_List.push(data[i]);
                } else {
                    //自己的数据（没打）
                    this._myRangNum = data[0] as number;
                    if (this._myRangNum == 0) {
                        let name: string = MasterPlayer.Instance.player.Name;
                        let rankContentString: string;
                        this.notNum.visible = true;
                        this.myRankNum.visible = false;
                        this.myRankName.changeText(name);
                        let a = MasterPlayer.Instance.player.Head;
                        this.myVip.visible = MasterPlayer.Instance.player.IsVip;
                        this.myRankName.x = MasterPlayer.Instance.player.IsVip ? 233 : 185;

                        this.myCampName.text = "阵营：无"
                        let myCampId = MasterPlayer.Instance.player.CampID;
                        let GangCfg = GangConfig[myCampId]
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }

                        rankContentString = "伤害：无";
                        this.myRankContent.changeText(rankContentString);
                    }
                    else {
                        let mydata = data[this._myRangNum];
                        //获取自己排名信息
                        this.notNum.visible = false;
                        this.myRankNum.visible = true;
                        this.myRankNum.changeText(this._myRangNum.toString());
                        this.myRankName.changeText(MasterPlayer.Instance.player.Name);
                        this.myVip.visible = MasterPlayer.Instance.player.IsVip;
                        this.myRankName.x = MasterPlayer.Instance.player.IsVip ? 233 : 185;

                        this.myCampName.text = "阵营：无"
                        let myCampId = MasterPlayer.Instance.player.CampID;
                        let GangCfg = GangConfig[myCampId]
                        if (myCampId != -1 && myCampId != 0) {
                            this.myCampName.text = "阵营：" + GetInfoAttr.Instance.GetText(GangCfg.nameId);
                        }
                        let rankContentString = "伤害：" + mydata[3].toString();
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
        }

		/** 
		 * 设置排名Rank list样式
         * @param item 单个box
         * @param index 索引
		*/
        private SetRankListRender(item, index: number): void {
            let vip: Laya.Image = item.getChildByName("vip");
            let bgImg: Laya.Image = item.getChildByName("bgImg");
            let rankNum: Laya.Text = item.getChildByName("rankNum");
            let rankName: Laya.Text = item.getChildByName("rankName");
            let rankIcon: Laya.Image = item.getChildByName("rankIcon");
            let rankContent: Laya.Text = item.getChildByName("rankContent");
            let camp_name: Laya.Label = item.getChildByName("camp_name");
            camp_name.visible = this._bool;

            let num: number = index + 1;
            let tOtherInfo = this.otherData[num] || {};
            let nHeadID = tOtherInfo[1];
            let nVip = tOtherInfo[2];
            let nCamp = tOtherInfo[3];

            let data = this.rankList.array[index];

            camp_name.text = "阵营：无"
            if (nCamp) {
                camp_name.text = "阵营：" + GetInfoAttr.Instance.GetText(GangConfig[nCamp].nameId);
            }

            if (nHeadID != null && nHeadID > 0) {
                let cfg = HeroConfig[nHeadID]
                rankIcon.skin = "ui_icon/" + cfg.strIcon
            } else {
                rankIcon.skin = "ui_head/icon_ui_01.png";
            }
            if (nVip != null && MasterPlayer.Instance.player.getIsVip(nVip)) {
                vip.visible = true;
                rankName.x = 233;
            } else {
                vip.visible = false;
                rankName.x = 185;
            }
            rankName.changeText(data[2]);
            rankNum.changeText(num.toString());
            let rankContentString = "伤害:" + data[3].toString();
            rankContent.changeText(rankContentString);
            if (num == 1 || num == 2 || num == 3) {
                bgImg.skin = "ui_rank/img-" + num.toString() + "-paiming.png";
                rankNum.visible = false;
            } else {
                rankNum.visible = true;
                bgImg.skin = "ui_rank/img-zhihou-paiming.png";
            }
        }

        /**关闭UI */
        private CloseUI() {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }
    }
}