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
    H52D_Framework.AddViewResource("InteractView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_interact.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
    ]);
    var InteractView = /** @class */ (function (_super) {
        __extends(InteractView, _super);
        function InteractView(buf) {
            var _this = _super.call(this) || this;
            _this._presentCfg = [];
            _this._giveObj = 0;
            _this._roleID = 0;
            _this._roleName = "";
            _this._image = null;
            _this._pageNum = 0;
            _this._offX = 0;
            _this._selected = false;
            _this._time = 0;
            _this._mouseDown = false;
            _this._image = null;
            _this._giveObj = null;
            _this._roleID = buf[1];
            _this._roleName = buf[2];
            _this.Init();
            _this.InitEvent();
            return _this;
        }
        InteractView.prototype.Init = function () {
            this.giveto.text = this._roleName;
            //list
            this._presentCfg = H52D_Framework.InteractLogic.Inst.presentCfg;
            this.list.hScrollBarSkin = "";
            this.list.array = this._presentCfg;
            this.list.renderHandler = new Laya.Handler(this, this.RenderHandler);
            for (var index = 1; index < 6; index++) {
                this["image" + index].visible = false;
            }
            for (var index = 1; index < this._presentCfg.length + 1; index++) {
                this["image" + index].visible = true;
            }
            this["image" + 1].skin = "ui_interact/img-huaye1.png";
        };
        InteractView.prototype.InitEvent = function () {
            var _this = this;
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.giveBtn.on(Laya.Event.CLICK, this, this.OnGive);
            this.close.on(Laya.Event.CLICK, this, function () {
                H52D_Framework.UIManager.Instance.DestroyUI("InteractView", [H52D_Framework.ViewUpRoot]);
            });
            H52D_Framework.Event.RegistEvent("RefreshInteractViewList", Laya.Handler.create(this, this.RefreshInteractViewList));
            this.on(Laya.Event.MOUSE_DOWN, this, function () {
                _this._mouseDown = true;
                _this._offX = Laya.MouseManager.instance.mouseX;
            });
            this.on(Laya.Event.MOUSE_UP, this, function () {
                H52D_Framework.Debugger.Log("MOUSE_UP");
                if (!_this._mouseDown)
                    return;
                _this._mouseDown = false;
                //向左画
                if (_this._offX - Laya.MouseManager.instance.mouseX > 150) {
                    if (_this._pageNum < _this._presentCfg.length - 1) {
                        _this._pageNum++;
                    }
                }
                else if (Laya.MouseManager.instance.mouseX - _this._offX > 150) {
                    if (_this._pageNum > 0) {
                        _this._pageNum--;
                    }
                }
                _this.list.tweenTo(_this._pageNum, 2.0, new Laya.Handler(_this, function () {
                    _this.list.scrollBar.stopScroll();
                    _this._image.visible = true;
                    _this._selected = true;
                    for (var index = 1; index < _this._presentCfg.length + 1; index++) {
                        _this["image" + index].skin = "ui_interact/img-huaye2.png";
                    }
                    var i = _this._pageNum + 1;
                    _this["image" + i].skin = "ui_interact/img-huaye1.png";
                }));
            });
            this.on(Laya.Event.MOUSE_OUT, this, function () {
                H52D_Framework.Debugger.Log("MOUSE_OUT");
                if (!_this._mouseDown)
                    return;
                _this._mouseDown = false;
                //向左画
                if (_this._offX - Laya.MouseManager.instance.mouseX > 150) {
                    if (_this._pageNum < _this._presentCfg.length - 1) {
                        _this._pageNum++;
                    }
                }
                else if (Laya.MouseManager.instance.mouseX - _this._offX > 150) {
                    if (_this._pageNum > 0) {
                        _this._pageNum--;
                    }
                }
                _this.list.tweenTo(_this._pageNum, 2.0, new Laya.Handler(_this, function () {
                    _this.list.scrollBar.stopScroll();
                    _this._image.visible = true;
                    _this._selected = true;
                    for (var index = 1; index < _this._presentCfg.length + 1; index++) {
                        _this["image" + index].skin = "ui_interact/img-huaye2.png";
                    }
                    var i = _this._pageNum + 1;
                    _this["image" + i].skin = "ui_interact/img-huaye1.png";
                }));
            });
        };
        InteractView.prototype.Destroy = function () {
            this.offAll();
            Laya.timer.clearAll(this);
            H52D_Framework.Event.RemoveEvent("RefreshInteractViewList", Laya.Handler.create(this, this.RefreshInteractViewList));
        };
        InteractView.prototype.OnGive = function () {
            if (H52D_Framework.BagManager.Instance.getItemNumber(this._giveObj["itemId"]) > 0) {
                var nowDate = new Date();
                var time = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
                ;
                if (this._time == 0 || time - this._time > 1) {
                    this._time = time;
                    H52D_Framework.RemoteCall.Instance.Send("K_ReqGiveGifts", this._roleID, Number(this._giveObj["presentId"]));
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("一秒内只能赠送一次");
                }
            }
            else {
                if (H52D_Framework.BagManager.Instance.getItemNumber(this._giveObj["cost"][1]) > this._giveObj["cost"][2]) {
                    var nowDate = new Date();
                    var time = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
                    ;
                    if (this._time == 0 || time - this._time > 1) {
                        this._time = time;
                        H52D_Framework.RemoteCall.Instance.Send("K_ReqGiveGifts", this._roleID, Number(this._giveObj["presentId"]));
                    }
                    else {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips("一秒内只能赠送一次");
                    }
                }
                else {
                    if (H52D_Framework.IsShieldRecharge()) {
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足!");
                        return;
                    }
                    else {
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox("前往充值", Laya.Handler.create(this, function () {
                            H52D_Framework.UIManager.Instance.DestroyUI("InteractView", [H52D_Framework.ViewUpRoot]);
                            H52D_Framework.UIManager.Instance.DestroyUI("RankView", [H52D_Framework.ViewUpRoot]);
                            H52D_Framework.UIManager.Instance.DestroyUI("ChatView", [H52D_Framework.ViewUpRoot]);
                            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                            H52D_Framework.OneTimer(500, function () {
                                H52D_Framework.Event.DispatchEvent("toGemShop");
                            });
                        }), Laya.Handler.create(this, function () {
                        }));
                    }
                }
            }
        };
        InteractView.prototype.RefreshInteractViewList = function () {
            // this._selected = false;
            this.list.refresh();
        };
        /**list */
        InteractView.prototype.RenderHandler = function (item, index) {
            var page = this._presentCfg[index];
            for (var m = 0; m < item._childs.length; m++) {
                item._childs[m].visible = false;
            }
            for (var key in page) {
                var obj = page[key];
                var box = item._childs[key];
                box.visible = true;
                //---------------------------------
                var selecticon = box.getChildByName("selecticon");
                var giftname = box.getChildByName("giftname");
                var gifticon = box.getChildByName("gifticon");
                var giftnum = box.getChildByName("giftnum");
                var charm = box.getChildByName("charm");
                var gold = box.getChildByName("gold");
                var goldnum = box.getChildByName("goldnum");
                selecticon.visible = false;
                if ((index == 0 && Number(key) == 0) && (this._giveObj == null)) {
                    this._image = selecticon;
                    this._giveObj = obj;
                }
                var itemID = obj.itemId;
                giftname.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[itemID].dwItemName);
                giftname.color = H52D_Framework.BaseDefine.LabelColor[H52D_Framework.ItemConfig[itemID].dwItemQuality];
                gifticon.skin = H52D_Framework.GetIcon(H52D_Framework.ItemConfig[itemID].strIconID_B);
                giftnum.text = H52D_Framework.BagManager.Instance.getItemNumber(itemID) + "";
                // if ((this._giveObj != null) && (BagManager.Instance.getItemNumber(this._giveObj.itemId))) {
                // 	if( this._giveObj == obj ){
                // 		this._giveObj = obj;
                // 		this._image = selecticon;
                // 		selecticon.visible = true;
                // 		this._selected = true;
                // 	}
                // } else {
                if (H52D_Framework.BagManager.Instance.getItemNumber(itemID) > 0 && !this._selected) {
                    this._giveObj = obj;
                    this._image = selecticon;
                    selecticon.visible = true;
                    this._selected = true;
                }
                // }
                if (obj.charm >= 0) {
                    charm.text = "魅力+" + obj.charm;
                }
                else {
                    charm.text = "魅力" + obj.charm;
                }
                var cost = obj.cost;
                gold.skin = H52D_Framework.GetIcon(H52D_Framework.ItemConfig[cost[1]].strIconID_B);
                goldnum.text = cost[2];
                box.on(Laya.Event.CLICK, this, this.OnGift, [{ 1: obj, 2: selecticon }]);
                if (index == this._presentCfg.length - 1 && Number(key) == (H52D_Framework.ObjLength(page) - 1)) {
                    this._image.visible = true;
                    this._selected = true;
                }
            }
        };
        /**
         * 技能详情
         */
        InteractView.prototype.OnGift = function (buf) {
            if (this._image) {
                this._image.visible = false;
            }
            this._giveObj = buf[1];
            this._image = buf[2];
            if (buf[2]) {
                buf[2].visible = true;
            }
        };
        return InteractView;
    }(ui.Chat.InteractViewUI));
    H52D_Framework.InteractView = InteractView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InteractView.js.map