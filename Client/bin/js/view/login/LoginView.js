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
    H52D_Framework.AddViewResource("LoginView", [
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_noPack/login.png", type: Laya.Loader.IMAGE },
    ]);
    var LoginView = /** @class */ (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super.call(this) || this;
            _this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            _this.loginBtn.on(Laya.Event.CLICK, _this, _this.OnLoginBtnClick);
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            if (H52D_Framework.IsNotBaiDuSdk()) {
                _this.logoicon.skin = "ui_login/login_name_fei.png";
            }
            else {
                _this.logoicon.skin = "ui_login/login_name.png";
            }
            //敏感词检测
            H52D_Framework.Tick.FrameLoop(1, _this, function () {
                _this.accountInput.text = H52D_Framework.SensitiveWord.Instance.Replace(_this.accountInput.text);
                if (_this.accountInput.focus) {
                    if (_this.accountInput.text == "请输入角色名") {
                        _this.accountInput.text = "";
                    }
                }
                else {
                    if (_this.accountInput.text == "") {
                        _this.accountInput.text = "请输入角色名";
                    }
                }
            });
            return _this;
        }
        LoginView.prototype.Destroy = function () {
            this.offAll();
        };
        LoginView.prototype.OnLoginBtnClick = function () {
            if (H52D_Framework.StringIsEmpty(this.accountInput.text) || this.accountInput.text == "请输入角色名") {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("账号不能为空!");
                return;
            }
            H52D_Framework.LoginLogic.Instance.Login(this.accountInput.text, 0);
        };
        return LoginView;
    }(ui.login.LoginViewUI));
    H52D_Framework.LoginView = LoginView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LoginView.js.map