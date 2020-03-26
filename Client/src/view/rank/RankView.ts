/**排行榜
 * yezhunian
*/
module H52D_Framework {
	AddViewResource("RankView",
		[
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
		]);
	export class RankView extends ui.rank.RankViewUI {
		private rankTypeName_d =
		{
			1: "个人榜",
			2: "魅力榜",
			3: "年兽大作战"
		};
		private rankTypeName_s =
		{
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
			//暂未开启
			//7: [2, "实力榜", RankEnum.eCampStrength],
			//8: [3, "英雄榜", RankEnum.eCulSuit]
		};

		private rankText =
		{
			[RankEnum.ePerStrength]: "角色等级：",
			[RankEnum.ePerHreo]: "英雄数量：",
			[RankEnum.ePerClick]: "点击次数：",
			[RankEnum.ePerTreasure]: "累计获取金币：",
			[RankEnum.ePerRich]: "充值钻石：",
			[RankEnum.CharmAll]: "魅力值：",
			[RankEnum.CharmWeek]: "魅力值：",
			[RankEnum.CharmLastWeek]: "魅力值：",
			[RankEnum.LastBossRank]: "伤害：",
			[RankEnum.NowBossRank]: "伤害：",
			//暂未开启
			//6: "阵营热度：",
			//7: "玩家等级总和：",
			//8: "英雄等级总和："
		};

		/**当前排行榜一级类型 */
		private _currentRankEnum_d: RankTypeEnum;
		/**当前排行榜二级类型 */
		private _currentRankEnum_s: RankEnum;
		/**自己的排名 */
		private _myRangNum: number;
		private _curRankType;

		private _bool:boolean=false;
		constructor(buf: any) {
			super();
			//设置初始页面
			this._currentRankEnum_d = buf[1] || RankTypeEnum.ePer;
			this._currentRankEnum_s = buf[2] || RankEnum.ePerStrength;
			this.Init();
			this.AddEvent();
		}
		/**添加事件 */
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			Event.RegistEvent('UpdateRankList', Laya.Handler.create(this, this.UpdateRankList));
			Event.RegistEvent(EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.SetHead));
		}

		/**销毁按钮侦听器 */
		private OnDestroy(): void {
			this.offAll();
			Event.RemoveEvent('UpdateRankList', Laya.Handler.create(this, this.UpdateRankList));
		}

		/**初始化 */
		private Init() {

			this.UpdateDate();
			this.SetOneTypeToList();
			this.SetTwoTypeToList();
			this.SetHead();

			this.WroldBossReward(this._currentRankEnum_d);

		}

		/**控制世界boss奖励按钮显示 隐藏 */
		private WroldBossReward(id: number) {
			if (this.rankTypeName_d[id] != this.rankTypeName_d[3]) {
				this.Btn_reward.visible = false;
				return
			}
			this._bool= true;
			this.Btn_reward.on(Laya.Event.CLICK, this, this.Btn_reward_show)
		}

		/**打开世界boss奖励界面 */
		private Btn_reward_show() {
			UIManager.Instance.CreateUI("WroldBossRewardView", [ViewUpRoot]);
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
		private UpdateDate() {
			RankLogic.Instance.K_ReqClickTimes(0);
			RankLogic.Instance.K_RankDataReq(this._currentRankEnum_s, 1, 100);
		}
		/**排行列表刷新 */
		private UpdateRankList(type: RankEnum) {
			this.SetDataToList(type);		
		}
		/**设置一级级排行榜标签List*/
		private SetOneTypeToList() {
			this.typeList_d.hScrollBarSkin = "";
			let arr: Array<any> = [];
			for (let info in this.rankTypeName_d) {
				arr.push(this.rankTypeName_d[info]);
			}
			this.typeList_d.array = arr;
			this.typeList_d.renderHandler = new Laya.Handler(this, this.SetOneTypeListRender);
		}

		/**设置二级排行榜标签List*/
		private SetTwoTypeToList() {
			this.typeList_s.hScrollBarSkin = "";
			let arr: Array<any> = [];
			for (let info in this.rankTypeName_s) {
				let rankData_s = this.rankTypeName_s[info];
				if (rankData_s[0] == this._currentRankEnum_d) {
					arr.push(rankData_s);
				}
			}
			this.typeList_s.array = arr;
			this.typeList_s.renderHandler = new Laya.Handler(this, this.SetTwoTypeListRender);
		}

		/**为排名list添加数据源 */
		private SetDataToList(rankEnum: RankEnum) {			
			this._curRankType = rankEnum
			this.rankList.vScrollBarSkin = "";
			//this.rankList.array = [];
			let info = this.typeList_s.array[rankEnum]
			let data = RankLogic.Instance.GetDataByType(rankEnum);
			this.myCampName.visible = this._bool;
			let data_List: any = [];
			for (let i in data) {
				if (Number(i) != 0) {
					data_List.push(data[i]);
				} else {
					this._myRangNum = data[0] as number;
					if (this._myRangNum == 0) {
						let name: string = MasterPlayer.Instance.player.Name;
						let rankContentString: string;
						this.notNum.visible = true;
						this.myRankNum.visible = false;
						this.myRankName.changeText(name);
						let a = MasterPlayer.Instance.player.Head;
						//this.myRankIcon.skin = "ui_icon/icon_tou_lss.png";

						this.myCampName.text = "阵营：无"
						let myCampId = MasterPlayer.Instance.player.CampID;
						let GangCfg = GangConfig[myCampId]						
						if (myCampId != -1 && myCampId != 0) {						
							this.myCampName.text = "阵营：" + GetInfoAttr.Instance.GetText(GangCfg.nameId);
						}

						switch (this._currentRankEnum_s) {
							case RankEnum.ePerClick:
								let clickNum: string = MasterPlayer.Instance.GetEventProByType[EventProEnum.AddClick].toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + clickNum;
								break;
							case RankEnum.ePerHreo:
								let hreo: string = HeroManager.Instance.GetHeroNum().toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + hreo;
								break;
							case RankEnum.ePerRich:
								//let Rich = MasterPlayer.Instance.GetEventProByType[RankProEnum.AddGold].toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + "暂未开启！";
								break;
							case RankEnum.ePerStrength:
								let lv: string = MasterPlayer.Instance.player.Level.toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + lv;
								break;
							case RankEnum.ePerTreasure:
								let Treasure: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.AddGold).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + Treasure;
								break;

							case RankEnum.CharmAll:
								let Charm: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.Charm).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + Charm;
								break;
							case RankEnum.CharmWeek:
								let CharmWeek: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.CharmWeek).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + CharmWeek;
								break;
							case RankEnum.CharmLastWeek:
								let CharLastmWeek: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.CharLastmWeek).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + CharLastmWeek;
								break;
							case RankEnum.NowBossRank:
								let NowBossRanks: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + NowBossRanks;
								break;
							case RankEnum.LastBossRank:
								let LastBossRanks: string = MasterPlayer.Instance.GetEventProByType(EventProEnum.LastBossRank).toString();
								rankContentString = this.rankText[this._currentRankEnum_s] + LastBossRanks;
								break;
						}
						this.myRankContent.changeText(rankContentString);
					}
					else {
						let mydata = data[this._myRangNum];
						//获取自己排名信息
						this.notNum.visible = false;
						this.myRankNum.visible = true;
						this.myRankNum.changeText(this._myRangNum.toString());
						this.myRankName.changeText(mydata[2]);
						this.myVip.visible = MasterPlayer.Instance.player.IsVip;
						this.myRankName.x = MasterPlayer.Instance.player.IsVip ? 233 : 185;
						
						this.myCampName.text = "阵营：无"
						let myCampId = MasterPlayer.Instance.player.CampID;
						let GangCfg = GangConfig[myCampId]
						if (myCampId != -1 && myCampId != 0) {
							this.myCampName.text = "阵营：" + GetInfoAttr.Instance.GetText(GangCfg.nameId);
						}
						let rankContentString = this.rankText[this._currentRankEnum_s] + mydata[3].toString();
						this.myRankContent.changeText(rankContentString);
					}
				}
			}

			this.rankList.array = data_List;
			this.rankList.renderHandler = new Laya.Handler(this, this.SetRankListRender);
		}

		/** 
		 * 设置一级标签Rank list样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetOneTypeListRender(item, index: number): void {
			let data = this.typeList_d.array[index];
			let type: Laya.Label = item.getChildByName("type");
			let btn: Laya.Button = item.getChildByName("btn");
			let cur: Laya.Image = item.getChildByName("cur");
			type.text = data;
			if (index + 1 == this._currentRankEnum_d) {
				cur.skin = "ui_rank/img-zi-daxuanze.png";
			} else {
				cur.skin = "";
			}
			btn.on(Laya.Event.CLICK, this, this.SetCurrentOneRankEnum, [index + 1])
		}

		/** 
		 * 设置二级标签Rank list样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetTwoTypeListRender(item, index: number): void {
			let data = this.typeList_s.array[index];
			let nRankType = data[2]
			let type: Laya.Label = item.getChildByName("type");
			let btn: Laya.Button = item.getChildByName("btn");
			type.text = data[1];
			type.color = "#bebbf8";
			if (nRankType == this._currentRankEnum_s) {
				btn.skin = "ui_rank/img-zi-weixuan.png";
			}
			else {
				btn.skin = "ui_rank/img-lan-weixuan.png";
			}
			if (this._currentRankEnum_s == RankEnum.ePerStrength || this._currentRankEnum_s == RankEnum.CharmWeek) {
				this.tp.skin = "ui_rank/img-zi-xuan.png"
			}
			else {
				this.tp.skin = "ui_rank/img-lan-xuan.png"
			}
			btn.on(Laya.Event.CLICK, this, this.SetCurrentTwoRankEnum, [nRankType]);
			if (this._currentRankEnum_s == RankEnum.ePerRich) {
				this.typeList_s.scrollBar.value = 100;
			}
			if (this._currentRankEnum_s == nRankType) {
				type.color = "#eff8bb";
			}
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
			camp_name.visible = this.Btn_reward.visible;
			let tOtherList = {}
			if (this._curRankType) {
				tOtherList = RankLogic.Instance.GetOtherInfoByType(this._curRankType)
			}
			let data = this.rankList.array[index];
			let num: number = index + 1;
			let tOtherInfo = tOtherList[num] || {}
			let nHeadID = tOtherInfo[1]
			let nVip = tOtherInfo[2]
			let nCamp = tOtherInfo[3]
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
			let rankContentString = this.rankText[this._currentRankEnum_s] + data[3].toString();
			rankContent.changeText(rankContentString);
			if (num == 1 || num == 2 || num == 3) {
				bgImg.skin = "ui_rank/img-" + num.toString() + "-paiming.png";
				rankNum.visible = false;
			} else {
				rankNum.visible = true;
				bgImg.skin = "ui_rank/img-zhihou-paiming.png";
			}
			if (this._myRangNum != num) {
				rankIcon.on(Laya.Event.CLICK, this, this.GiveGift, [data[1], data[2]]);
			} else {
				rankIcon.off(Laya.Event.CLICK, this, this.GiveGift);
			}
		}

		/**设置当前一级标签 */
		private SetCurrentOneRankEnum(_rankTypeEnum: RankTypeEnum) {
			//if (_rankTypeEnum == RankTypeEnum.ePer) {
			this._currentRankEnum_d = _rankTypeEnum;
			for (let i in this.rankTypeName_s) {
				let data = this.rankTypeName_s[i];
				if (data[0] == _rankTypeEnum) {
					this.SetCurrentTwoRankEnum(data[2]);
					break;
				}
			}
			this.WroldBossReward(this._currentRankEnum_d);
			this.SetTwoTypeToList();
			this.SetOneTypeToList();
		}

		/**设置当前二级标签 */
		private SetCurrentTwoRankEnum(_rankEnum: RankEnum) {
			if (_rankEnum == RankEnum.ePerRich) {
				TipsLogic.Instance.OpenSystemTips("暂未开启！！");
				return;
			}
			this._currentRankEnum_s = _rankEnum;
			RankLogic.Instance.K_RankDataReq(_rankEnum, 1, 100);

			this.SetTwoTypeToList();
			//添加按钮点击音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3")
		}

		/**
		 * 赠送礼物
		 * @param roleID 玩家ID
		 * @param strName 玩家名字
		 */
		private GiveGift(roleID: number, strName: string) {
			UIManager.Instance.CreateUI("InteractView", [ViewUpRoot, roleID, strName]);
		}


		/**关闭UI */
		private CloseUI() {
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			UIManager.Instance.DestroyUI("RankView", [ViewUpRoot]);
		}
	}
}