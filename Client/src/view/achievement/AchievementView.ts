/** 成就界面 */
module H52D_Framework {

	AddViewResource("AchievementView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
		]);
	export class AchievementView extends ui.achievement.AchievementViewUI {
		constructor() {
			super();
			if (window["wx"]) {
				this.bj.y = wxsclae + 70
			} else {
				this.bj.centerY = 0
			}
			this.AddEvent();
			this.Init();
		}

		private Init() {
			this.red1.visible = false;
			this.red2.visible = false;
			this.txt1.color = "#bebbf8";
			this.txt2.color = "#eff8bb";
			this.bg3.skin = "ui_rank/img-zi-xuan.png"
			this.btn1.skin = "ui_rank/img-zi-weixuan.png";
			this.btn2.skin = "ui_rank/img-lan-weixuan.png";
			AchievenManger.Instance.achievenType = E_AchievenType.eDay;
			this.tipName.text = "成就";
			this.achieven_List.vScrollBarSkin = "";
			this.SetListData(AchievenManger.Instance.dayMission);
			this.UpdateDate(AchievenManger.Instance.achievenType);
		}
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			this.btn1.on(Laya.Event.CLICK, this, this.UpdateDate, [E_AchievenType.eDay]);
			this.btn2.on(Laya.Event.CLICK, this, this.UpdateDate, [E_AchievenType.eAchieven]);
			Event.RegistEvent('UpdateAchievenDate', Laya.Handler.create(this, this.UpdateDate));
		}
		private OnDestroy() {
			this.offAll();
			Tick.ClearAll(this);
			Event.RemoveEvent('UpdateAchievenDate', Laya.Handler.create(this, this.UpdateDate));
		}

		/**刷新页面数据 */
		private UpdateDate(type: E_AchievenType = AchievenManger.Instance.achievenType) {
			if (AchievenManger.Instance.achievenType != type) {
				this._bSort = true;
			}
			AchievenManger.Instance.achievenType = type;
			if (AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
				this.SetListData(AchievenManger.Instance.dayMission);
				this.txt1.color = "#bebbf8";
				this.txt2.color = "#eff8bb";
				this.bg3.skin = "ui_rank/img-zi-xuan.png"
				this.btn1.skin = "ui_rank/img-zi-weixuan.png";
				this.btn2.skin = "ui_rank/img-lan-weixuan.png";
			}
			if (AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
				this.SetListData(AchievenManger.Instance.achievenMission);
				this.txt1.color = "#eff8bb";
				this.txt2.color = "#bebbf8";
				this.bg3.skin = "ui_rank/img-lan-xuan.png";
				this.btn1.skin = "ui_rank/img-lan-weixuan.png";
				this.btn2.skin = "ui_rank/img-zi-weixuan.png";
			}
			this.red1.visible = AchievenManger.Instance.showPointDay();
			this.red2.visible = AchievenManger.Instance.showPointAchieven();
		}

		private _bSort: boolean = true;
		private achievenIdArr: Array<number> = [];
		private SetListData(achievenList: any) {
			//排序
			if (this._bSort) {
				this.achievenIdArr = [];
				let achieven = achievenList;
				for (let id in achieven) {
					this.achievenIdArr.push(Number(id));
				}
				let len = this.achievenIdArr.length;
				for (let i = 0; i < len - 1; i++) {
					for (let j = i + 1; j < len; j++) {
						let tempValue;
						let value_i = achieven[this.achievenIdArr[i]].order;
						let value_j = achieven[this.achievenIdArr[j]].order;
						if (value_i < value_j) {
							tempValue = this.achievenIdArr[i];
							this.achievenIdArr[i] = this.achievenIdArr[j];
							this.achievenIdArr[j] = tempValue;
						}
					}
				}

				let idArr: Array<number> = [];
				for (let vl = 0; vl < len; vl++) {
					let tempKey = null;
					for (let i in this.achievenIdArr) {
						let id = this.achievenIdArr[i]
						let starValue = achieven[id].star;
						if (starValue > achieven[id].maxStar) {
							let bBreak = false;
							for (let key in idArr) {
								if (idArr[key] == id) {
									bBreak = true;
									break
								}
							}
							if (bBreak) {
								break
							} else {
								tempKey = i
								idArr.push(id);
								break
							}
						}
					}

					if (tempKey != null) {
						let id = this.achievenIdArr[tempKey]
						this.achievenIdArr.splice(tempKey, 1)
						this.achievenIdArr.push(id)
					}
				}

				this._bSort = false;
			}
			this.achieven_List.array = this.achievenIdArr;

			this.achieven_List.renderHandler = new Laya.Handler(this, this.SetListRender);
		}

		private SetListRender(item, index: number) {
			let achieven_icon: Laya.Image = item.getChildByName("achieven_icon");
			let achievent_btn: Laya.Button = item.getChildByName("achievent_btn");
			let achieven_stage: Laya.Image = item.getChildByName("achieven_stage");
			let achieven_content: Laya.Label = item.getChildByName("achieven_content");
			let achieven_progress: Laya.Label = item.getChildByName("achieven_progress");
			let achieven_awart: Laya.HTMLDivElement = Laya.Label = item.getChildByName("achieven_awart");

			let achieven_bar = achieven_progress.getChildByName("achieven_bar") as Laya.Image;
			let achieven_barValue = achieven_progress.getChildByName("achieven_barValue") as Laya.Label;
			let achievent_btnText = achievent_btn.getChildByName("achievent_btnText") as Laya.Label;
			let eventId = this.achieven_List.array[index];
			let achieven: AchievenVo;
			if (AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
				AchievenManger.Instance.dayMission[eventId].Init();
				achieven = AchievenManger.Instance.dayMission[eventId];
			}
			if (AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
				AchievenManger.Instance.achievenMission[eventId].Init();
				achieven = AchievenManger.Instance.achievenMission[eventId];
			}

			let barLength: number = achieven_progress.width - 4;
			let len = (1 - achieven.yetvalue / achieven.aimvalue) * barLength;
			let setLength = len < 0 ? 0 : len;

			achieven_icon.skin = "ui_icon/" + achieven.strPic;
			achieven_content.text = "任务描述：" + achieven.info;
			achieven_barValue.text = achieven.yetvalue + "/" + achieven.aimvalue;
			achieven_bar.width = setLength;

			SetHtmlStyle(achieven_awart, 18, "#fafa85", "center");
			achieven_awart.innerHTML = achieven.rewardType == BaseDefine.ItemIdGold ?
				("<img src= 'ui_icon/icon_prop_012.png' width='20px' height='20px'></img>" + achieven.reward) :
				("<img src= 'ui_icon/icon_prop_013.png' width='20px' height='15px'></img>" + achieven.reward);
			achieven_stage.destroyChildren();
			for (let i = 1; i <= achieven.maxStar; i++) {
				let stage: Laya.Image = new Laya.Image();
				achieven_stage.addChild(stage);
				stage.x = (i - 1) * 30;
				achieven.star >= i + 1 ? stage.skin = "ui_hero/icon-xing-chengjiu.png" : stage.skin = "ui_icon/icon-weijihuo-jinjie-yingxiong.png";
			}

			achievent_btn.gray = false;
			achieven_awart.visible = true;
			achievent_btnText.text = "领奖";
			achievent_btn.offAll(Laya.Event.CLICK)
			if (AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
				achievent_btn.on(Laya.Event.CLICK, this, this.ClickDaytBtn, [eventId]);
			} else if (AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
				achievent_btn.on(Laya.Event.CLICK, this, this.ClickAchieventBtn, [eventId]);
			}

			if (achieven.star > achieven.maxStar) {
				achievent_btn.gray = true;
				achieven_awart.visible = false;
				achievent_btnText.text = "已完成";
				achievent_btn.offAll(Laya.Event.CLICK);
			}
			else if (achieven.yetvalue < achieven.aimvalue) {
				achievent_btnText.text = "未达成";
				achievent_btn.gray = true;
				achievent_btn.offAll(Laya.Event.CLICK);
			}
		}

		private _SendBtnFlag1 = true
		private ClickAchieventBtn(eventId: EventProEnum) {
			if (window["wx"] && AdvertisingManager.Instance.bnWXAdertisingTimes) {
				UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.Achievement, eventId])
			}
			else {
				if (this._SendBtnFlag1 == false) return;
				this._SendBtnFlag1 = false;
				let canShare = AchieveConfig[eventId][1].isCanShare;
				if (canShare) {
					ShareLogic.Instance.ShareAchieven(AchievenManger.Instance.achievenType, eventId);
				}
				else {
					AchievenManger.Instance.K_ReqAchievementAward(eventId);
				}
				OneTimer(1000, () => {
					this._SendBtnFlag1 = true
				}, "ClickAchieventBtn")
			}
			//播放按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		private _SendBtnFlag2 = true
		private ClickDaytBtn(id: number) {
			if (window["wx"] && AdvertisingManager.Instance.bnWXAdertisingTimes) {
				UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.Achievement, id])
			} else {
				if (this._SendBtnFlag2 == false) return;
				this._SendBtnFlag2 = false;
				AchievenManger.Instance.K_ReqDayAchievementAward(id);
				OneTimer(1000, () => {
					this._SendBtnFlag2 = true
				}, "ClickDaytBtn")
			}
			//播放按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		private CloseUI() {
			UIManager.Instance.DestroyUI("AchievementView", [ViewUpRoot]);
		}
	}
}