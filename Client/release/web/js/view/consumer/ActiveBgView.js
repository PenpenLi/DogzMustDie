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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ActiveBgView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
    ]);
    /***活动主界面 */
    var ActiveBgView = /** @class */ (function (_super) {
        __extends(ActiveBgView, _super);
        function ActiveBgView(params) {
            var _this = _super.call(this) || this;
            //当前入口的index
            _this._entranceIndex = 0;
            _this._enterceType = null;
            //当前选中的tab页index
            _this._curSelectIndex = -1;
            _this._curtype = 0; //选中的页签的type
            _this._listChildArr = [];
            _this._entranceIndex = params[1];
            _this._enterceType = params[2];
            _this.InitView();
            _this.AddEvent();
            if (window["wx"]) {
                _this.lclbg.bottom = 0;
            }
            else {
                _this.lclbg.centerY = 0;
            }
            return _this;
        }
        ActiveBgView.prototype.InitView = function () {
            this.ReshView();
        };
        ActiveBgView.prototype.ReshView = function () {
            var _this = this;
            this._listChildArr = [];
            this.top_list.hScrollBarSkin = "";
            this._oActivityList = H52D_Framework.OActivityLogic.Instance.openList[this._entranceIndex];
            var arr = [];
            for (var i = 0; i < this._oActivityList.length; i++) {
                var cls = this._oActivityList[i];
                var iconPath = "ui_consumer/" + cls.icon;
                arr.push({ tabBtn: { skin: iconPath, label: cls.tabName } });
            }
            this._enterceType = this._curSelectIndex || 0;
            if (!(this._enterceType > 0)) {
                this._enterceType = 0;
            }
            if (this.top_list.renderHandler) {
                this.top_list.renderHandler.clear();
                this.top_list.renderHandler = null;
            }
            //this.top_list.repeatX = arr.length;
            this.top_list.array = arr;
            this.top_list.renderHandler = new Laya.Handler(this, this.OnListClick, [Laya.Handler.create(this, function () {
                    if (_this._enterceType == null) {
                        _this.OnClickTab(0);
                    }
                    else {
                        // 默认加载选中的界面
                        _this.OnClickTab(_this._enterceType);
                    }
                })]);
        };
        ActiveBgView.prototype.AddEvent = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            H52D_Framework.Event.RegistEvent('CloseOActivityView', Laya.Handler.create(this, this.CloseOActivityView));
            H52D_Framework.Event.RegistEvent('UpdateBtnList_activebg', Laya.Handler.create(this, this.ReshView));
        };
        ActiveBgView.prototype.Btn_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ActiveBgView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("UpdateOActivitysEntrance");
        };
        // 切换页签
        ActiveBgView.prototype.OnClickTab = function (index) {
            var _this = this;
            //给list中的按键添加点击音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            //同一个页面不操作
            if (index == this._curSelectIndex)
                return;
            this._curSelectIndex = index;
            // 当前页面拥有的功能类型
            var type = this._oActivityList[index].type;
            this._curtype = type;
            //this.top_list.array = { tabBtn: { skin: iconPath, label: cls.tabName } }
            for (var i = 0; i < this.top_list.array.length; i++) {
                this._listChildArr[i]._childs[0].alpha = this._curSelectIndex == i ? 1 : 0.7;
            }
            //this.top_list.tweenTo(this._curSelectIndex);
            var viewName = OActivityViewName[type];
            H52D_Framework.UIManager.Instance.CreateUI(viewName, [H52D_Framework.ViewUpRoot, type], Laya.Handler.create(this, function (view) {
                if (_this.destroyed) {
                    view.destroy(true);
                }
                else {
                    if (_this.ChildBox._childs.length > 0) {
                        _this.ChildBox._childs[0].Destroy();
                    }
                    _this.ChildBox.destroyChildren();
                    _this.ChildBox.addChild(view);
                }
            }));
        };
        // 界面1点击list控件
        ActiveBgView.prototype.OnListClick = function (callBack, item, index) {
            this._listChildArr.push(item);
            item.on(Laya.Event.CLICK, this, this.OnClickTab, [index, item]);
            var arr = this.top_list.array;
            var icon = item.getChildByName("icon");
            var name = item.getChildByName("name");
            var red = item.getChildByName("red");
            icon.skin = arr[index].tabBtn.skin;
            name.text = arr[index].tabBtn.label;
            var type = this._oActivityList[index].type;
            var viewName = OActivityViewName[type];
            red.visible = this.Red_controlShow(viewName);
            //加载完成再执行
            if (this._listChildArr.length == this.top_list.length) {
                callBack.run();
            }
        };
        ActiveBgView.prototype.Red_controlShow = function (name) {
            var bool = false;
            if (H52D_Framework.DEverydayManager.Instance.ActionData != null) {
                if (OActivityViewName[OActivityEnum.eDiamondView] == name) {
                    bool = H52D_Framework.DEverydayManager.Instance.red_contr();
                    return bool;
                }
            }
            if (H52D_Framework.mEverydayManager.Instance.ActionData != null) {
                if (OActivityViewName[OActivityEnum.eEverydayMoney] == name) {
                    bool = H52D_Framework.mEverydayManager.Instance.red_contr();
                    return bool;
                }
            }
            if (H52D_Framework.ChangeGoodsManager.Instance.ActionData != null) {
                if (OActivityViewName[OActivityEnum.eChangeitem] == name) {
                    bool = H52D_Framework.ChangeGoodsManager.Instance.red_contr();
                    return bool;
                }
            }
            if (H52D_Framework.EveryDayTurntable.Instance.ActionData != null) {
                if (OActivityViewName[OActivityEnum.eEveryDayTurn] == name) {
                    bool = H52D_Framework.EveryDayTurntable.Instance.red_contr();
                    return bool;
                }
            }
            return bool;
        };
        ActiveBgView.prototype.CloseOActivityView = function (type) {
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
            var b_isHave = false; //当前打开页是否到期删除
            for (var i in this._oActivityList) {
                if (this._oActivityList[i]["type"] == this._curtype) {
                    b_isHave = true;
                }
            }
            if (!b_isHave) {
                this._curSelectIndex = -1;
            }
            //如果一个页签都没了，这个界面就不需要了
            if (this._oActivityList.length <= 0) {
                this.OnDestroy();
                return;
            }
            this.InitView();
        };
        // 退出
        ActiveBgView.prototype.OnDestroy = function () {
            this.offAll();
            if (this.ChildBox._childs.length > 0) {
                this.ChildBox._childs[0].Destroy();
            }
            this.ChildBox.destroyChildren(); //
            H52D_Framework.Event.RemoveEvent('CloseOActivityView', Laya.Handler.create(this, this.CloseOActivityView));
            H52D_Framework.UIManager.Instance.DestroyUI("OActivityBgView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.RemoveEvent('UpdateBtnList_activebg', Laya.Handler.create(this, this.ReshView));
            H52D_Framework.DEverydayManager.Instance.ShowEff = false;
        };
        return ActiveBgView;
    }(ui.consumer.ActiveBgViewUI));
    H52D_Framework.ActiveBgView = ActiveBgView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ActiveBgView.js.map