module H52D_Framework {
    export class LoginLogic {
        private _genderEnum: GenderEnum = 1;
        private _account: string;
        private _bLogin: boolean = false;
        private _profid:number = 0;
        public secondid:number = 0;
        public thirdid:number = 0;
        public InviteRoleID = "";

        private static _inst: LoginLogic;
        public static get Instance() {
            if (LoginLogic._inst == null)
                LoginLogic._inst = new LoginLogic();
            return LoginLogic._inst;
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_LoadCharListMsg", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_CreateCharResMsg", this);
        }

        public OnReConnect() {
            RemoteCall.Instance.Connect(GameLink.Instance.urlParams['selServerIP'], GameLink.Instance.urlParams['selServerPort']);
            this._bLogin = true;
        }

        /**
         * 登录
         * @param accountName 账户名
         */
        public Login(accountName: string, InviteRoleID?): void {
            this.InviteRoleID = InviteRoleID || ""
            if (this._bLogin) {
                return;
            }
            if (accountName == "") {
                TipsLogic.Instance.OpenMessageBox("请输入账号！");
                return;
            }
            this._account = accountName;
            PfLog.Inst.SendClientLog(900, 0);
            RemoteCall.Instance.Connect(GameLink.Instance.urlParams['selServerIP'], GameLink.Instance.urlParams['selServerPort']);
            this._bLogin = true;
        }

        public OnConnected(): void {
            this.GWHandShakeRequest();
        }

        public OnConnectFail(): void {
            this._bLogin = false;
        }

        public OnDisConnect(): void {
            this._bLogin = false;
        }

        public set profid(value:number){
            if(value == 0){
                return;
            }
            this._profid = value;
            let giftAward = CastingConfig[this._profid]["firstGiftAward"];
            let giftReWrad = RewardConfig[giftAward]["reWrad"][1][2];
            this.secondid = ItemConfig[giftReWrad]["heroId"];
            let dunAward = CastingConfig[this._profid]["dunAward_10008"];
            let dunReWrad = RewardConfig[dunAward]["reWrad"][1][2];
            this.thirdid = ItemConfig[dunReWrad]["heroId"];
        }

        public get profid(){
            return this._profid;
        }

        private C_LoadCharListMsg(buf: any): void {
            if (buf[0] == 1) {
                //请求创建角色
                RemoteCall.Instance.Send("K_PlayerCreate");
            }
            else {
                //进入创建流程,是否自动创角
                this.CreateRole();
            }
        }

        /**
         * 创建角色
         * @param auto是否自动创角
         */
        private CreateRole(){
            // if(!IsNotBaiDuSdk()){
                PfLog.Inst.SendClientLog(1100, 0);
                this.OpenInitialHero(null);
            // }
            // else{
            //     UIManager.Instance.CreateUI("CreateView", [ViewDownRoot]);
            // }
        }

        public OpenInitialHero(nickName:string){
            UIManager.Instance.CreateUI("InitialHeroView", [ViewUpRoot, (prefid:number)=>{
                RemoteCall.Instance.Send("K_CreateCharReqMsg", nickName, prefid, this._genderEnum, this.InviteRoleID);
            }]);
        }

        private GWHandShakeRequest(): void {
            // 网关参数
            let strTGW = "tgw_l7_forward\r\nHost:%s\r\n\r\n\0";
            let replaceIP = GameLink.Instance.urlParams['selServerIP'] + ":" + GameLink.Instance.urlParams['selServerPort'];
            strTGW = strTGW.replace("%s", replaceIP);
            let byte = new Laya.Byte();
            byte.endian = Laya.Byte.getSystemEndian();
            byte.writeUTFBytes(strTGW);
            RemoteCall.Instance.SendDirect(byte.buffer);
            // 发送登录消息
            GameLink.Instance.urlParams['openid'] = this._account;
            GameLink.Instance.urlParams['inviteroleid'] = this.InviteRoleID;

            RemoteCall.Instance.Send("K_EnterKSReqMsg", GameLink.Instance.urlParams, false);
        }

        private C_CreateCharResMsg(ncode: number) {
            if (ncode == 1) {
                // 名字重复
                TipsLogic.Instance.OpenSystemTips("角色名重复！");
            }
        }
    }
}