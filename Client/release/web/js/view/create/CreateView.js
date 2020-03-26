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
    H52D_Framework.AddViewResource("CreateView", [
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_noPack/login_background.png", type: Laya.Loader.IMAGE },
    ]);
    var CreateView = /** @class */ (function (_super) {
        __extends(CreateView, _super);
        function CreateView() {
            var _this = _super.call(this) || this;
            _this._genderEnum = 1;
            _this._StartGameTime = H52D_Framework.GameParamConfig["StartGameTime"];
            _this._StartGameResTime = H52D_Framework.GameParamConfig["StartGameResTime"];
            _this._beginTime = 0;
            _this._countTime = -1;
            H52D_Framework.PfLog.Inst.SendClientLog(1000, 0);
            _this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            _this.rBtn.on(Laya.Event.CLICK, _this, _this.OnRandomClick); //骰子 
            _this.loginBtn.on(Laya.Event.CLICK, _this, _this.OnLoginBtn);
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            _this.OnRandomClick();
            _this.countlabel.visible = false;
            if (H52D_Framework.IsNotBaiDuSdk()) {
                _this.logoicon.skin = "ui_login/login_name_fei.png";
            }
            else {
                _this.logoicon.skin = "ui_login/login_name.png";
            }
            // 保持socket唤醒状态
            H52D_Framework.Tick.Loop(3000, _this, function () {
                H52D_Framework.RemoteCall.Instance.Send("K_Ping");
            });
            H52D_Framework.Tick.FrameLoop(1, _this, function () {
                _this.input.text = H52D_Framework.SensitiveWord.Instance.Replace(_this.input.text);
                if (_this.input.focus) {
                    _this.countlabel.visible = false;
                    _this._beginTime = 0;
                    _this._countTime = -1;
                }
            });
            H52D_Framework.Tick.Loop(1000, _this, function () {
                //先判定名字长度
                var nickName = _this.input.text;
                var nLength = 0;
                for (var index = 0; index < nickName.length; index++) {
                    if (nickName.charCodeAt(index) > 255) {
                        nLength += 2;
                    }
                    else {
                        nLength++;
                    }
                }
                if (nLength > 12) {
                    _this.countlabel.visible = false;
                    _this._beginTime = 0;
                    _this._countTime = -1;
                    return;
                }
                _this._beginTime++;
                if (_this._beginTime > _this._StartGameTime) {
                    _this.countlabel.visible = true;
                    _this._countTime++;
                    if (_this._StartGameResTime - _this._countTime < 1) {
                        if (H52D_Framework.StringIsEmpty(_this.input.text)) {
                            _this.input.text = H52D_Framework.GetRandName(_this._genderEnum);
                        }
                        _this.countlabel.visible = false;
                        var nickName_1 = _this.input.text;
                        H52D_Framework.PfLog.Inst.SendClientLog(1100, 0);
                        H52D_Framework.LoginLogic.Instance.OpenInitialHero(nickName_1);
                    }
                    _this.countlabel.text = (_this._StartGameResTime - _this._countTime) + "秒后自动进入游戏";
                }
            });
            var nScale = 0.5;
            _this._heromod = new H52D_Framework.Avatar(_this.heromod);
            _this._heromod.Load("res/player/login_juese/juese.sk", 1, nScale, 0, 0, Laya.Handler.create(_this, function () {
                _this._heromod.Play("idle", true);
            }));
            _this._stareffect = new H52D_Framework.Avatar(_this.stareffect);
            _this._stareffect.Load("res/player/login_huoxing/huoxing.sk", 1, nScale, 0, 0, Laya.Handler.create(_this, function () {
                _this._stareffect.Play("idle", true);
            }));
            _this._suipianeffect = new H52D_Framework.Avatar(_this.suipianeffect);
            _this._suipianeffect.Load("res/player/login_suipian/suipian.sk", 1, 0.36, 0, 0, Laya.Handler.create(_this, function () {
                _this._suipianeffect.Play("idle", true);
            }));
            _this._xingxingmod = new H52D_Framework.Avatar(_this.xingxingmod);
            _this._xingxingmod.Load("res/player/login_gly/login_gly.sk", 1, 0.7, 0, 0, Laya.Handler.create(_this, function () {
                _this._xingxingmod.Play("idle", true);
            }));
            return _this;
        }
        CreateView.prototype.OnRandomClick = function () {
            this.input.text = H52D_Framework.GetRandName(this._genderEnum);
            this._beginTime = 0;
        };
        /**判断输入的角色名称是否合规 */
        CreateView.prototype.RegularJudgeName = function () {
            // let reg: RegExp = new RegExp("^([\u4e00-\u9fa5]|[A-Za-z0-9])*$");
            // if (!reg.test(this.input.text)) {
            //     return true;
            // }
            return false;
        };
        CreateView.prototype.OnLoginBtn = function () {
            if (H52D_Framework.StringIsEmpty(this.input.text) || this.input.text == "请输入角色名") {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("角色名不能为空!");
                return;
            }
            // else if (this.RegularJudgeName()) {
            //     TipsLogic.Instance.OpenMessageBox("角色名称包含非法字符！");
            //     return;
            // }
            var nickName = this.input.text;
            var nLength = 0;
            for (var index = 0; index < nickName.length; index++) {
                if (nickName.charCodeAt(index) > 255) {
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
            H52D_Framework.PfLog.Inst.SendClientLog(1100, 0);
            H52D_Framework.LoginLogic.Instance.OpenInitialHero(nickName);
        };
        CreateView.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            this.offAll();
            if (this._heromod != null) {
                this._heromod.Destroy();
            }
            if (this._stareffect != null) {
                this._stareffect.Destroy();
            }
            if (this._suipianeffect != null) {
                this._suipianeffect.Destroy();
            }
            if (this._xingxingmod != null) {
                this._xingxingmod.Destroy();
            }
        };
        return CreateView;
    }(ui.login.CreateViewUI));
    H52D_Framework.CreateView = CreateView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CreateView.js.map