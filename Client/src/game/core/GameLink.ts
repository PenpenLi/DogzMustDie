module H52D_Framework {
    export class GameLink {
        private _urlParams: Object = {};
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
        private _defaultGatewayIP = "154.8.200.214";// me  
        private _defaultGatewayPort: number = 8888; 

        public get urlParams(): Object {
            return this._urlParams;
        }

        private static _inst: GameLink;
        public static get Instance() {
            if (GameLink._inst == null)
                GameLink._inst = new GameLink();
            return GameLink._inst;
        }

        public Initialize() {
            this.SetGameParams();
        }

        // 设置游戏参数
        public SetGameParams() {
            if (window['wx']) {
                if (G_ClientVersionFlag == 1) {
                    // 正式服务器地址
                    // this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/ssbxs_wx";
                    // this._defaultGatewayPort = 443;
                    this._defaultGatewayIP = "wss://ssjxzh5-agent.gyyx.cn";
                    this._defaultGatewayPort = 8406;
                } else {
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
        }
    }

    // 本地开发参数
    class Link {
        public loginParams = {
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
        }
    }
}