module H52D_Framework {
    AddViewResource("LoginView",
        [
            { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_noPack/login.png", type: Laya.Loader.IMAGE },
        ]);

    export class LoginView extends ui.login.LoginViewUI {
        constructor() {
            super();
            this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            this.loginBtn.on(Laya.Event.CLICK, this, this.OnLoginBtnClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            if( IsNotBaiDuSdk( ) ){
                this.logoicon.skin = "ui_login/login_name_fei.png"
            }else{
                this.logoicon.skin = "ui_login/login_name.png"
            }

            //敏感词检测
            Tick.FrameLoop(1, this, () => {
                this.accountInput.text = SensitiveWord.Instance.Replace(this.accountInput.text);

                if (this.accountInput.focus) {
                    if (this.accountInput.text == "请输入角色名") {
                        this.accountInput.text = "";
                    }
                }
                else {
                    if (this.accountInput.text == "") {
                        this.accountInput.text = "请输入角色名";
                    }
                }
            });
        }
        private Destroy() {
            this.offAll();
        }

        private OnLoginBtnClick(): void {
            if (StringIsEmpty(this.accountInput.text) || this.accountInput.text == "请输入角色名") {
                TipsLogic.Instance.OpenMessageBox("账号不能为空!");
                return;
            }
            LoginLogic.Instance.Login(this.accountInput.text, 0);
        }
    }
}