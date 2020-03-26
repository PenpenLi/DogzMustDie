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
    H52D_Framework.AddViewResource("SettingView", [
        { url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class 设置页面
     * @author zhangyusong
     **/
    var SettingNameView = /** @class */ (function (_super) {
        __extends(SettingNameView, _super);
        function SettingNameView() {
            var _this = _super.call(this) || this;
            /** 性别 */
            _this._genderEnum = 1;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        SettingNameView.prototype.ViewInit = function () {
            this.startName = H52D_Framework.MasterPlayer.Instance.player.Name;
            this.username = this.startName;
            var changeNum = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.ChangeName);
            this.ChangeNameCost(!changeNum);
        };
        SettingNameView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("LoseFocus", Laya.Handler.create(this, this.InputBlur));
            this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_close"]);
            this.btn_random.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_random"]);
            this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_ok"]);
            this.input.on(Laya.Event.FOCUS, this, this.OnBtnClick, ["input_focus"]);
        };
        SettingNameView.prototype.OnBtnClick = function (btnName) {
            switch (btnName) {
                case "btn_random": //骰子
                    this.username = H52D_Framework.GetRandName(this._genderEnum);
                    break;
                case "input_focus":
                    this.username = "";
                    break;
                case "btn_ok": //确定
                    this.OnLoginBtn();
                    break;
                case "btn_close": //关闭
                    H52D_Framework.UIManager.Instance.DestroyUI("SettingNameView", [H52D_Framework.ViewUpRoot]);
                    break;
            }
        };
        /** 强制失去焦点 */
        SettingNameView.prototype.InputBlur = function () {
            this.username = this.input.text;
            this.input.focus = false;
        };
        Object.defineProperty(SettingNameView.prototype, "username", {
            get: function () {
                return this._username;
            },
            set: function (value) {
                this._username = value;
                this.input.text = this.username;
            },
            enumerable: true,
            configurable: true
        });
        /** 更名消费 */
        SettingNameView.prototype.ChangeNameCost = function (free) {
            this.cost = free ? 0 : H52D_Framework.GameParamConfig["ReNameExpend"];
            this.img_diamonds.visible = !free;
            this.txt_cost.visible = !free;
            this.txt_freed.visible = free;
            this.txt_cost.text = String(this.cost);
        };
        SettingNameView.prototype.OnLoginBtn = function () {
            this.username = this.input.text;
            if (this.startName == this.username) {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("角色名没有修改!");
                return;
            }
            if (H52D_Framework.StringIsEmpty(this.username)) {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("角色名不能为空!");
                return;
            }
            if (this.username != H52D_Framework.SensitiveWord.Instance.Replace(this.username)) {
                this.input.text = "";
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("少侠，您创建的角色名称中含有非法字符，请重新输入");
                return;
            }
            var diamonds = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds);
            if (this.cost > diamonds) {
                if (H52D_Framework.IsShieldRecharge()) {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足!");
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足，是否前往购买", Laya.Handler.create(this, this.BuyDiamonds));
                }
                return;
            }
            var nLength = 0;
            for (var index = 0; index < this.username.length; index++) {
                if (this.username.charCodeAt(index) > 255) {
                    nLength += 2;
                }
                else {
                    nLength++;
                }
            }
            if (nLength > 12) {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("角色名过长，请重新输入！");
                return;
            }
            H52D_Framework.RemoteCall.Instance.Send("K_RoleRenameReq", this.username);
        };
        /** 购买钻石 */
        SettingNameView.prototype.BuyDiamonds = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("SettingNameView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("SettingView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL, [false, Laya.Handler.create(this, function () {
                    H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                })]);
        };
        SettingNameView.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            this.offAll();
            H52D_Framework.Event.RemoveEvent("LoseFocus", Laya.Handler.create(this, this.InputBlur));
        };
        return SettingNameView;
    }(ui.setting.SettingNameViewUI));
    H52D_Framework.SettingNameView = SettingNameView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SettingNameView.js.map