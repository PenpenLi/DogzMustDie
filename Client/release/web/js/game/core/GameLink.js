var H52D_Framework;
(function (H52D_Framework) {
    var GameLink = /** @class */ (function () {
        function GameLink() {
            this._urlParams = {};
            // private _defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/ssbxs_wx";
            // private _defaultGatewayPort: number = 443;
            //private _defaultGatewayIP = "192.168.253.114";
            // private _defaultGatewayPort: number = 8888; 
            // private readonly _defaultGatewayIP = "wss://ssjxzh5-agent.gyyx.cn";
            // private readonly _defaultGatewayPort: number = 20001;
            // 叶竹年
            // private _defaultGatewayIP = "192.168.253.114";
            // private _defaultGatewayPort: number = 8888; 
            // private _defaultGatewayIP = "https://ssjxzh5-agent.gyyx.cn";
            // private _defaultGatewayPort = 8888;
            // 测试
            // private _defaultGatewayIP = "192.168.253.81";
            this._defaultGatewayIP = "154.8.200.214"; // me  
            this._defaultGatewayPort = 8888;
        }
        Object.defineProperty(GameLink.prototype, "urlParams", {
            get: function () {
                return this._urlParams;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameLink, "Instance", {
            get: function () {
                if (GameLink._inst == null)
                    GameLink._inst = new GameLink();
                return GameLink._inst;
            },
            enumerable: true,
            configurable: true
        });
        GameLink.prototype.Initialize = function () {
            this.SetGameParams();
        };
        // 设置游戏参数
        GameLink.prototype.SetGameParams = function () {
            if (window['wx']) {
                if (G_ClientVersionFlag == 1) {
                    // 正式服务器地址
                    // this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/ssbxs_wx";
                    // this._defaultGatewayPort = 443;
                    this._defaultGatewayIP = "wss://ssjxzh5-agent.gyyx.cn";
                    this._defaultGatewayPort = 8406;
                }
                else {
                    // 测试服务器地址
                    // this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/ssbxs_wxts";
                    // this._defaultGatewayPort = 443;
                    this._defaultGatewayIP = "wss://ssjxzh5-agent.gyyx.cn";
                    this._defaultGatewayPort = 8405;
                }
            }
            this._urlParams['selServerIP'] = this._defaultGatewayIP;
            this._urlParams['selServerPort'] = this._defaultGatewayPort;
            this._urlParams['serverid'] = new Link().loginParams.serverid;
            this._urlParams['sid'] = new Link().loginParams.sid;
            this._urlParams['firstGame'] = 'false';
            this._urlParams['mac'] = '';
            this._urlParams['openid'] = new Link().loginParams.openid;
            this._urlParams['pf'] = new Link().loginParams.pf;
        };
        return GameLink;
    }());
    H52D_Framework.GameLink = GameLink;
    // 本地开发参数
    var Link = /** @class */ (function () {
        function Link() {
            this.loginParams = {
                openid: "",
                serverid: 1,
                sid: 1,
                pf: "pf",
                firstGame: "FALSE",
                openkey: null,
                seqid: null,
                pfkey: null,
                sig: null,
                mac: ""
            };
        }
        return Link;
    }());
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GameLink.js.map