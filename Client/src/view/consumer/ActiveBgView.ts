/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("ActiveBgView",
		[
			{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		]);

	/***活动主界面 */
	export class ActiveBgView extends ui.consumer.ActiveBgViewUI {
		//当前入口的index
		private _entranceIndex: number = 0;
		private _enterceType: number = null;
		//当前入口的数据
		private _oActivityList: Array<OActivityData>;
		//当前选中的tab页index
		private _curSelectIndex = -1;
		private _curtype = 0;//选中的页签的type

		private _listChildArr: Array<Laya.Box> = [];

		constructor(params: any) {
			super();
			this._entranceIndex = params[1];
			this._enterceType = params[2];

			this.InitView();
			this.AddEvent();
			if( window["wx"] ){
				this.lclbg.bottom = 0
			}else{
				this.lclbg.centerY = 0
			}
		}

		private InitView() {
			this.ReshView();
		}

		private ReshView() {
			this._listChildArr = [];
			this.top_list.hScrollBarSkin = "";
			this._oActivityList = OActivityLogic.Instance.openList[this._entranceIndex];

			let arr: Array<any> = [];
			for (let i: number = 0; i < this._oActivityList.length; i++) {
				let cls = this._oActivityList[i];
				let iconPath = "ui_consumer/" + cls.icon;

				arr.push({ tabBtn: { skin: iconPath, label: cls.tabName } });
			}
			this._enterceType = this._curSelectIndex || 0;
			if (!(this._enterceType > 0)) {
				this._enterceType = 0
			}
			if (this.top_list.renderHandler) {
				this.top_list.renderHandler.clear();
				this.top_list.renderHandler = null;
			}

			//this.top_list.repeatX = arr.length;
			this.top_list.array = arr;
			this.top_list.renderHandler = new Laya.Handler(this, this.OnListClick, [Laya.Handler.create(this, () => {
				if (this._enterceType == null) {
					this.OnClickTab(0);
				}
				else {
					// 默认加载选中的界面
					this.OnClickTab(this._enterceType);
				}
			})]);
		}

		private AddEvent() {
			this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			Event.RegistEvent('CloseOActivityView', Laya.Handler.create(this, this.CloseOActivityView));
			Event.RegistEvent('UpdateBtnList_activebg', Laya.Handler.create(this, this.ReshView));
		}

		private Btn_close() {
			UIManager.Instance.DestroyUI("ActiveBgView", [ViewUpRoot]);
			Event.DispatchEvent("UpdateOActivitysEntrance");
		}

		// 切换页签
		private OnClickTab(index: number): void {
			//给list中的按键添加点击音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); 
			//同一个页面不操作
			if (index == this._curSelectIndex) return;
			this._curSelectIndex = index;
			// 当前页面拥有的功能类型
			let type: OActivityEnum = this._oActivityList[index].type;
			this._curtype = type;

			//this.top_list.array = { tabBtn: { skin: iconPath, label: cls.tabName } }
			for (let i = 0; i < this.top_list.array.length; i++) {
				this._listChildArr[i]._childs[0].alpha = this._curSelectIndex == i ? 1 : 0.7;
			}

			//this.top_list.tweenTo(this._curSelectIndex);
			let viewName: string = OActivityViewName[type];
			UIManager.Instance.CreateUI(viewName, [ViewUpRoot, type], Laya.Handler.create(this, (view) => {
				if (this.destroyed) {
					view.destroy(true);
				}
				else {
					if (this.ChildBox._childs.length > 0) {
						this.ChildBox._childs[0].Destroy();
					}
					this.ChildBox.destroyChildren();
					this.ChildBox.addChild(view);
				}
			}));
		}


		// 界面1点击list控件
		private OnListClick(callBack: Laya.Handler, item: any, index: number) {
			this._listChildArr.push(item);
			item.on(Laya.Event.CLICK, this, this.OnClickTab, [index, item]);
			let arr = this.top_list.array;
			let icon: Laya.Image = item.getChildByName("icon");
			let name: Laya.Label = item.getChildByName("name");
			let red: Laya.Image = item.getChildByName("red");
			icon.skin = arr[index].tabBtn.skin;
			name.text = arr[index].tabBtn.label;

			let type: OActivityEnum = this._oActivityList[index].type;
			let viewName: string = OActivityViewName[type];
			red.visible = this.Red_controlShow(viewName);
			//加载完成再执行
			if (this._listChildArr.length == this.top_list.length) {
				callBack.run();
			}
		}

		private Red_controlShow(name:string) {
			let bool: boolean = false;
			if (DEverydayManager.Instance.ActionData != null) {
				if (OActivityViewName[OActivityEnum.eDiamondView] == name) {
					bool = DEverydayManager.Instance.red_contr();
					return bool;
				}
			}
			if (mEverydayManager.Instance.ActionData != null) {
				if (OActivityViewName[OActivityEnum.eEverydayMoney] == name) {
					bool = mEverydayManager.Instance.red_contr();
					return bool;
				}
			}
			if (ChangeGoodsManager.Instance.ActionData != null) {
				if (OActivityViewName[OActivityEnum.eChangeitem] == name) {
					bool = ChangeGoodsManager.Instance.red_contr();
					return bool;
				}
			}
			if (EveryDayTurntable.Instance.ActionData != null) {
				if (OActivityViewName[OActivityEnum.eEveryDayTurn] == name) {
					bool = EveryDayTurntable.Instance.red_contr();
					return bool;
				}
			}
			return bool;
		}

		private CloseOActivityView(type: any): void {
			//正在查看此界面
			// let bLook: boolean = false;
			// if (this._oActivityList[this._curSelectIndex]) {
			// 	bLook = this._oActivityList[this._curSelectIndex].type == type;
			// }
			// for (let i = this._oActivityList.length - 1; i >= 0; i--) {
			// 	if (this._oActivityList[i]["type"] == type) {
			// 		//this._oActivityList.splice(i, 1);
			// 	}
			// }
			let b_isHave: boolean = false;//当前打开页是否到期删除
			for (let i in this._oActivityList) {
				if (this._oActivityList[i]["type"] == this._curtype) {
					b_isHave = true;
				}
			}
			if(!b_isHave){
				this._curSelectIndex = -1;
			}

			//如果一个页签都没了，这个界面就不需要了
			if (this._oActivityList.length <= 0) {
				this.OnDestroy();
				return;
			}
			this.InitView();
		}

		// 退出
		private OnDestroy(): void {
			this.offAll();
			if (this.ChildBox._childs.length > 0) {
				this.ChildBox._childs[0].Destroy();
			}
			this.ChildBox.destroyChildren();//
			Event.RemoveEvent('CloseOActivityView', Laya.Handler.create(this, this.CloseOActivityView));
			UIManager.Instance.DestroyUI("OActivityBgView", [ViewUpRoot]);
			Event.RemoveEvent('UpdateBtnList_activebg', Laya.Handler.create(this, this.ReshView));
			DEverydayManager.Instance.ShowEff = false;
		}
	}
}