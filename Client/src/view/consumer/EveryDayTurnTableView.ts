/**
* 转盘
*/
module H52D_Framework {
	export class EveryDayTurntableView extends ui.consumer.EveryDayTurnTableUI {
		private angle: number = 0;
		private turnData: any;
		//免费次数
		private freeNum: number = 0;
		//倒计时更新的时间
		private updataTimer: number = 0;
		//抽奖次数
		private _turnNum: number;
		private _turnNumObjAll: Object = [5, 10, 50, 70, 100];
		//每格需再抽次数
		private _turnNumObj: Object = [5, 5, 40, 20, 30];
		//每格长度
		private _turnLengthObj: Object = [41, 174, 117, 143, 121];
		//转一次价格
		private _oneMoney: number;
		private _tenMoney: number;

		constructor(buf: any) {
			super();
			this.updataTimer = Math.ceil(EveryDayTurntable.Instance.EndTime - Time.serverSecodes);
			Tick.Loop(1000, this, this.UpdataTimer);
			this.turnOneBtn.disabled = false;
			this.turnTenBtn.disabled = false;
			this.xuanxiangImg.visible = false;
			this.titlestr.text = CStrValueConfig.Inst.GetText(7141, [EveryDayTurntable.Instance.Discount * 10]);//描述
			this.AddEvent();
			this.RefNum();
			this.ShowData();
			this.UpdataTimer();
		}

		/**
		 * 添加事件
		 */
		private AddEvent(): void {
			this.turnOneBtn.on(Laya.Event.CLICK, this, this.TurnOne);
			this.turnTenBtn.on(Laya.Event.CLICK, this, this.TurnTen);
			this.recordBtn.on(Laya.Event.CLICK, this, this.Record);
			Event.RegistEvent("RefTurnTable", Laya.Handler.create(this, this.RefNum));
			Event.RegistEvent("updataTurnTable", Laya.Handler.create(this, this.ShowData));
			Event.RegistEvent("TurnTableYAOYIYAO", Laya.Handler.create(this, this.TurnData));
		}

		private RefNum() {
			this.Init();
			this.ShowInit();
		}

		private Init() {
			this._oneMoney = EveryDayTurntable.Instance.OneCost;
			this._tenMoney = EveryDayTurntable.Instance.TenCost * EveryDayTurntable.Instance.Discount;
			this.freeNum = EveryDayTurntable.Instance.FreeNum;
		}

		private ShowInit() {
			this.oneNeedNum.text = this._oneMoney + "";
			this.tenNeedNum.text = this._tenMoney + "";
			this.turnOneLab.text = "抽一次";
			this.diamond1.visible = true;
			if (this.freeNum > 0) {
				this.turnOneLab.text = "免费抽取";
				this.diamond1.visible = false;
				this.oneNeedNum.text = "";
			}
		}

		/**
		 * 转一次
		 */
		private TurnOne(): void {//钻石数
			if (this.freeNum > 0) {
				EveryDayTurntable.Instance.K_BuyChargeAward(1);
				return;
			}
			if (this._oneMoney <= BagManager.Instance.getItemNumber(2)) {
				EveryDayTurntable.Instance.K_BuyChargeAward(1);
			}
			else {
				if (IsShieldRecharge()) {
					TipsLogic.Instance.OpenMessageBox(CStrValueConfig.Inst.GetSysText(30059));
				}
				else {
					TipsLogic.Instance.OpenMessageBox(CStrValueConfig.Inst.GetSysText(10009), Laya.Handler.create(this, this.OpenRecharge), Laya.Handler.create(this, this.CloseMessage));
				}
			}
		}

		/**
		 * 转十次
		 */
		private TurnTen(): void {
			if (this.freeNum >= 10) {
				EveryDayTurntable.Instance.K_BuyChargeAward(1);
				return;
			}
			if (this._tenMoney <= BagManager.Instance.getItemNumber(2)) {
				EveryDayTurntable.Instance.K_BuyChargeAward(10);
			}
			else {
				if (IsShieldRecharge()) {
					TipsLogic.Instance.OpenMessageBox(CStrValueConfig.Inst.GetSysText(30059));
				}
				else {
					TipsLogic.Instance.OpenMessageBox(CStrValueConfig.Inst.GetSysText(10009), Laya.Handler.create(this, this.OpenRecharge), Laya.Handler.create(this, this.CloseMessage));
				}
			}
		}

		/**抽奖记录 */
		private Record() {
			UIManager.Instance.CreateUI("RecordListView", [ViewToppestRoot]);
		}

		/**
		 * 领取额外奖励
		 */
		private OnLingqv(id: number): void {
			EveryDayTurntable.Instance.K_GetActivityAwardReq(id);
		}

		/**
		 * 获取剩余时间
		 */
		private UpdataTimer(): void {
			this.timeDelay.text = GetFormatTime(this.updataTimer);
			this.updataTimer--;
		}

		/**
		 * 弹出充值界面(商城)
		 */
		private OpenRecharge(): void {
			UIManager.Instance.DestroyUI("ActiveBgView", [ViewUpRoot])
			Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
		}
		/**
		 * 关闭弹窗的方法
		 */
		private CloseMessage(): void {

		}

		/**
		 * 请求结果
		 */
		private TurnData(): void {
			// 抽到的礼包
			this.turnData = EveryDayTurntable.Instance.GiftItemData;
			// 后台传过来 ，抽中第几个礼物
			let index: number = EveryDayTurntable.Instance.GetIndexGift();
			this.angle = EveryDayTurntable.Instance.TableAngle;
			//抽奖次数
			this._turnNum = EveryDayTurntable.Instance.GetTurnNum;

			if (index != 0) {
				// 计算出现在 要达到的点相对与0点的距离
				let indexAngle: number = (Number(this.turnData[1][1]) - 1) * 36 - Number(this.angle % 360);
				EveryDayTurntable.Instance.TableAngle = this.angle + 3600 + indexAngle;
				//选择框
				this.xuanxiangImg.visible = false;
				this.xuanxiangImg.rotation = (Number(this.turnData[1][1]) - 1) * 36;
				//按钮
				this.turnOneBtn.disabled = true;
				this.turnTenBtn.disabled = true;
				OneTimer(4000, () => {
					if (this.destroyed) {
						return
					}
					this.turnOneBtn.disabled = false;
					this.turnTenBtn.disabled = false;
				});
				// 转盘缓动
				let _rotation: number = this.angle + 3600 + indexAngle;
				Laya.Tween.to(this.zhizhenImg, { rotation: _rotation }, 4000, Laya.Ease.expoInOut, Laya.Handler.create(this, () => {
					// 记录并 储存转完以后的角度
					this.zhizhenImg.rotation %= 360;
					this.angle = this.zhizhenImg.rotation;
					EveryDayTurntable.Instance.TableAngle = this.zhizhenImg.rotation;
					this.xuanxiangImg.visible = true;
					// this.turnOneBtn.disabled = false;
					// this.turnTenBtn.disabled = false;
					if (index == 1) {
						TipsLogic.Instance.OpenGoodsProTips(EveryDayTurntable.Instance.ShowGift)
					}
					else if (index > 2) {
						// 十连抽弹面板
						TipsLogic.Instance.OpenGoodsProTips(EveryDayTurntable.Instance.ShowGiftMore, true)
					}
				}));
			}
		}

		/**
		 * 面板信息
		 */
		private ShowData(): void {
			// 同步现在的角度
			this.angle = EveryDayTurntable.Instance.TableAngle;
			this.zhizhenImg.rotation = EveryDayTurntable.Instance.TableAngle;
			let award: any[] = EveryDayTurntable.Instance.AwardData;
			let num: number = 0;
			for (let i in EveryDayTurntable.Instance.GiftData) {
				num++;
			}

			// 转盘奖励列表
			for (let i = 0; i < award.length; i++) {
				let _itemInfo = ItemConfig[award[i]["itemid"]];
				let _itemNum = award[i]["itemnum"];
				let _itemName = GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);;
				let _itemIcon = "ui_icon/" + _itemInfo.strIconID_B;
				this["numLab" + String(i + 1)].text = _itemNum + " " + _itemName;
				this["Img" + String(i + 1)].skin = _itemIcon;
			}
		}

		private BoxGiftShow() {
			for (let i = 1; i <= 5; i++) {
				this['boxRed' + i].visible = false;
			}
		}

		/**抽奖次数奖励展示:length=600 */
		private TurnNumGiftShow() {
			//进度条状态
			let _length: number = 0;
			if (this._turnNum < 5) {
				_length = (this._turnLengthObj[0] / 5) * this._turnNum;
			}
			else if (this._turnNum >= 100) {
				_length = 600;
			}
			else {
				for (let i in this._turnNumObjAll) {
					if (this._turnNum >= this._turnNumObjAll[i]) {
						_length += this._turnLengthObj[i];//后面的进度条
						if (this._turnNum > this._turnNumObjAll[i] && this._turnNum < this._turnNumObjAll[i + 1]) {
							let _spareNum = this._turnNum - this._turnNumObjAll[i];//多出来几个
							let _length0 = (this._turnLengthObj[i + 1] / this._turnNumObj[i + 1]) * _spareNum;
							_length += _length0;
						}
					}
				}
			}

			this.progressBar.width = _length;

			//宝箱状态
			for (let i in this._turnNumObjAll) {
				if (this._turnNum >= this._turnNumObjAll[i]) {
					this['box' + (Number(i) + 1)]//可领
				}
			}
		}

		/** 
		 * 事件界面销毁
		 */
		public Destroy(): void {
			this.offAll();
			Laya.Tween.clearAll(this);
			Event.RemoveEvent("RefTurnTable", Laya.Handler.create(this, this.RefNum));
			Event.RemoveEvent("updataTurnTable", Laya.Handler.create(this, this.ShowData));
			Event.RemoveEvent("TurnTableYAOYIYAO", Laya.Handler.create(this, this.TurnData));
		}
	}
}