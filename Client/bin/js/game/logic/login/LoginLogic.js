var H52D_Framework;
(function (H52D_Framework) {
    var LoginLogic = /** @class */ (function () {
        function LoginLogic() {
            this._genderEnum = 1;
            this._bLogin = false;
            this._profid = 0;
            this.secondid = 0;
            this.thirdid = 0;
            this.InviteRoleID = "";
        }
        Object.defineProperty(LoginLogic, "Instance", {
            get: function () {
                if (LoginLogic._inst == null)
                    LoginLogic._inst = new LoginLogic();
                return LoginLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        LoginLogic.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_LoadCharListMsg", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_CreateCharResMsg", this);
        };
        LoginLogic.prototype.OnReConnect = function () {
            H52D_Framework.RemoteCall.Instance.Connect(H52D_Framework.GameLink.Instance.urlParams['selServerIP'], H52D_Framework.GameLink.Instance.urlParams['selServerPort']);
            this._bLogin = true;
        };
        /**
         * 登录
         * @param accountName 账户名
         */
        LoginLogic.prototype.Login = function (accountName, InviteRoleID) {
            this.InviteRoleID = InviteRoleID || "";
            if (this._bLogin) {
                return;
            }
            if (accountName == "") {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("请输入账号！");
                return;
            }
            this._account = accountName;
            H52D_Framework.PfLog.Inst.SendClientLog(900, 0);
            H52D_Framework.RemoteCall.Instance.Connect(H52D_Framework.GameLink.Instance.urlParams['selServerIP'], H52D_Framework.GameLink.Instance.urlParams['selServerPort']);
            this._bLogin = true;
        };
        LoginLogic.prototype.OnConnected = function () {
            this.GWHandShakeRequest();
        };
        LoginLogic.prototype.OnConnectFail = function () {
            this._bLogin = false;
        };
        LoginLogic.prototype.OnDisConnect = function () {
            this._bLogin = false;
        };
        Object.defineProperty(LoginLogic.prototype, "profid", {
            get: function () {
                return this._profid;
            },
            set: function (value) {
                if (value == 0) {
                    return;
                }
                this._profid = value;
                var giftAward = H52D_Framework.CastingConfig[this._profid]["firstGiftAward"];
                var giftReWrad = H52D_Framework.RewardConfig[giftAward]["reWrad"][1][2];
                this.secondid = H52D_Framework.ItemConfig[giftReWrad]["heroId"];
                var dunAward = H52D_Framework.CastingConfig[this._profid]["dunAward_10008"];
                var dunReWrad = H52D_Framework.RewardConfig[dunAward]["reWrad"][1][2];
                this.thirdid = H52D_Framework.ItemConfig[dunReWrad]["heroId"];
            },
            enumerable: true,
            configurable: true
        });
        LoginLogic.prototype.C_LoadCharListMsg = function (buf) {
            if (buf[0] == 1) {
                //请求创建角色
                H52D_Framework.RemoteCall.Instance.Send("K_PlayerCreate");
            }
            else {
                //进入创建流程,是否自动创角
                this.CreateRole();
            }
        };
        /**
         * 创建角色
         * @param auto是否自动创角
         */
        LoginLogic.prototype.CreateRole = function () {
            // if(!IsNotBaiDuSdk()){
            H52D_Framework.PfLog.Inst.SendClientLog(1100, 0);
            this.OpenInitialHero(null);
            // }
            // else{
            //     UIManager.Instance.CreateUI("CreateView", [ViewDownRoot]);
            // }
        };
        LoginLogic.prototype.OpenInitialHero = function (nickName) {
            var _this = this;
            H52D_Framework.UIManager.Instance.CreateUI("InitialHeroView", [H52D_Framework.ViewUpRoot, function (prefid) {
                    H52D_Framework.RemoteCall.Instance.Send("K_CreateCharReqMsg", nickName, prefid, _this._genderEnum, _this.InviteRoleID);
                }]);
        };
        LoginLogic.prototype.GWHandShakeRequest = function () {
            // 网关参数
            var strTGW = "tgw_l7_forward\r\nHost:%s\r\n\r\n\0";
            var replaceIP = H52D_Framework.GameLink.Instance.urlParams['selServerIP'] + ":" + H52D_Framework.GameLink.Instance.urlParams['selServerPort'];
            strTGW = strTGW.replace("%s", replaceIP);
            var byte = new Laya.Byte();
            byte.endian = Laya.Byte.getSystemEndian();
            byte.writeUTFBytes(strTGW);
            H52D_Framework.RemoteCall.Instance.SendDirect(byte.buffer);
            // 发送登录消息
            H52D_Framework.GameLink.Instance.urlParams['openid'] = this._account;
            H52D_Framework.GameLink.Instance.urlParams['inviteroleid'] = this.InviteRoleID;
            H52D_Framework.RemoteCall.Instance.Send("K_EnterKSReqMsg", H52D_Framework.GameLink.Instance.urlParams, false);
        };
        LoginLogic.prototype.C_CreateCharResMsg = function (ncode) {
            if (ncode == 1) {
                // 名字重复
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("角色名重复！");
            }
        };
        return LoginLogic;
    }());
    H52D_Framework.LoginLogic = LoginLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LoginLogic.js.map