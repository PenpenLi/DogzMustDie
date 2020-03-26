module H52D_Framework {
    AddViewResource("CreateView",
        [
            { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_noPack/login_background.png", type: Laya.Loader.IMAGE },
        ]);

    export class CreateView extends ui.login.CreateViewUI {
        private _genderEnum: GenderEnum = 1;
        private _StartGameTime: number = GameParamConfig["StartGameTime"];
        private _StartGameResTime: number = GameParamConfig["StartGameResTime"];

        private _beginTime: number = 0;
        private _countTime: number = -1;

        private _heromod: Avatar;
        private _stareffect: Avatar;
        private _suipianeffect: Avatar;
        private _xingxingmod: Avatar
        constructor() {
            super();
            PfLog.Inst.SendClientLog(1000, 0);
            this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            this.rBtn.on(Laya.Event.CLICK, this, this.OnRandomClick);//骰子 
            this.loginBtn.on(Laya.Event.CLICK, this, this.OnLoginBtn);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.OnRandomClick();
            this.countlabel.visible = false;
            if (IsNotBaiDuSdk()) {
                this.logoicon.skin = "ui_login/login_name_fei.png"
            }
            else {
                this.logoicon.skin = "ui_login/login_name.png"
            }

            // 保持socket唤醒状态
            Tick.Loop(3000, this, () => {
                RemoteCall.Instance.Send("K_Ping");
            })

            Tick.FrameLoop(1, this, () => {
                this.input.text = SensitiveWord.Instance.Replace(this.input.text);
                if (this.input.focus) {
                    this.countlabel.visible = false;
                    this._beginTime = 0;
                    this._countTime = -1;
                }
            })

            Tick.Loop(1000, this, () => {
                //先判定名字长度
                let nickName = this.input.text;
                let nLength = 0
                for (var index = 0; index < nickName.length; index++) {
                    if (nickName.charCodeAt(index) > 255) {
                        nLength += 2;
                    }
                    else {
                        nLength++;
                    }
                }
                if (nLength > 12) {
                    this.countlabel.visible = false;
                    this._beginTime = 0;
                    this._countTime = -1;
                    return;
                }

                this._beginTime++;
                if (this._beginTime > this._StartGameTime) {
                    this.countlabel.visible = true;
                    this._countTime++;
                    if (this._StartGameResTime - this._countTime < 1) {
                        if (StringIsEmpty(this.input.text)) {
                            this.input.text = GetRandName(this._genderEnum);
                        }
                        this.countlabel.visible = false;
                        let nickName = this.input.text;
                        PfLog.Inst.SendClientLog(1100, 0);
                        LoginLogic.Instance.OpenInitialHero(nickName);
                    }
                    this.countlabel.text = (this._StartGameResTime - this._countTime) + "秒后自动进入游戏";
                }
            })

            let nScale = 0.5
            this._heromod = new Avatar(this.heromod)
            this._heromod.Load("res/player/login_juese/juese.sk", 1, nScale, 0, 0, Laya.Handler.create(this, () => {
                this._heromod.Play("idle", true)
            }))
            this._stareffect = new Avatar(this.stareffect)
            this._stareffect.Load("res/player/login_huoxing/huoxing.sk", 1, nScale, 0, 0, Laya.Handler.create(this, () => {
                this._stareffect.Play("idle", true)
            }))
            this._suipianeffect = new Avatar(this.suipianeffect)
            this._suipianeffect.Load("res/player/login_suipian/suipian.sk", 1, 0.36, 0, 0, Laya.Handler.create(this, () => {
                this._suipianeffect.Play("idle", true)
            }))
            this._xingxingmod = new Avatar(this.xingxingmod)
            this._xingxingmod.Load("res/player/login_gly/login_gly.sk", 1, 0.7, 0, 0, Laya.Handler.create(this, () => {
                this._xingxingmod.Play("idle", true)
            }))
        }

        private OnRandomClick() {
            this.input.text = GetRandName(this._genderEnum);
            this._beginTime = 0;
        }

        /**判断输入的角色名称是否合规 */
        private RegularJudgeName(): boolean {
            // let reg: RegExp = new RegExp("^([\u4e00-\u9fa5]|[A-Za-z0-9])*$");
            // if (!reg.test(this.input.text)) {
            //     return true;
            // }
            return false;
        }

        private OnLoginBtn() {
            if (StringIsEmpty(this.input.text) || this.input.text == "请输入角色名") {
                TipsLogic.Instance.OpenMessageBox("角色名不能为空!");
                return;
            }
            // else if (this.RegularJudgeName()) {
            //     TipsLogic.Instance.OpenMessageBox("角色名称包含非法字符！");
            //     return;
            // }

            let nickName = this.input.text;
            let nLength = 0
            for (var index = 0; index < nickName.length; index++) {
                if (nickName.charCodeAt(index) > 255) {
                    nLength += 2;
                } else {
                    nLength++;
                }
            }
            if (nLength > 12) {
                TipsLogic.Instance.OpenMessageBox("角色名过长，请重新输入！");
                return;
            }
            PfLog.Inst.SendClientLog(1100, 0);
            LoginLogic.Instance.OpenInitialHero(nickName);
        }

        private Destroy(): void {
            Tick.ClearAll(this);
            this.offAll();
            if (this._heromod != null) {
                this._heromod.Destroy()
            }
            if (this._stareffect != null) {
                this._stareffect.Destroy()
            }
            if (this._suipianeffect != null) {
                this._suipianeffect.Destroy()
            }
            if (this._xingxingmod != null) {
                this._xingxingmod.Destroy()
            }
        }
    }
}