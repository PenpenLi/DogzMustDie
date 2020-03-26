module H52D_Framework {
    AddViewResource("KickingResultView", [
        { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    export class KickingResultView extends ui.action.kicking.KickingResultViewUI {
        private readonly txResult_w: string = "本局胜利";
        private readonly txResult_l: string = "本局失败";
        private readonly txResult_r: string = "本局平局";
        private win: number;
        private star: number;
        private type: number;
        private money: number;
        private time: number = 10;

        constructor(buff: any) {
            super();
            this.star = buff[1];
            this.win = buff[2];
            this.type = buff[3];
            this.money = buff[4];
            this.InitView();
            this.InitEvent();
        }

        private InitView() {
            if (this.win == 2) {//失败
                this.fight_logo.skin = "ui_kicking/img-shibai-pvp.png";
                this.fight_bg.gray = true;//橙色背景板
                this.fight_bg_icon.gray = true;//背景板下的图案
                this.fight_result.text = this.txResult_l;
                this.item_num.text = "-" + this.money;
                this.item_result.text = GetInfoAttr.Instance.GetText(7062);
            }
            else {
                if (this.win == 1) {//胜利
                    let Item_rew=GameParamConfig.StarData;
                    this.fight_logo.skin = "ui_kicking/img-shengli-pvp.png";
                    if(this.star>1){
                         this.fight_result.text = this.star + "星，获得" + Item_rew[4-this.star][3] + "倍奖励";
                    }
                    else{
                         this.fight_result.text=this.star+"星，获得基础奖励";
                    }
                    this.item_num.text = "+" + this.money;
                    this.item_result.text = String(GetInfoAttr.Instance.GetText(7061)).replace("%s", 10 + "%");
                    this.fight_win.visible = true;
                }
                else if (this.win == 0) {//平局
                    this.fight_logo.skin = "ui_kicking/img-pingju-pvp.png";
                    this.fight_result.text = this.txResult_r;
                    this.item_num.text = "无奖励";
                    this.item_result.text = GetInfoAttr.Instance.GetText(7063);
                }
                this.fight_bg.gray = false;
                this.fight_bg_icon.gray = false;//背景板下的图案
            }
            this.Start_Color(1,this.star);

            //战斗中获得的道具 名字
            this.item_name.text = GetInfoAttr.Instance.GetText(ItemConfig[this.type].dwItemName);
            this.item_name.color = BaseDefine.LabelColor1[ItemConfig[this.type]["dwItemQuality"]];

            //战斗中获得的道具品质背景 
            this.item_pinzhi.skin = BaseDefine.HeroQualityList[ItemConfig[this.type].dwItemQuality];
            this.item_icon.skin = "ui_icon/" + ItemConfig[this.type].strIconID_B;

            this.fight_war.array = KickingLogic.Instance.GetwarInfo();
            this.fight_war.renderHandler = new Laya.Handler(this, this.Handler);
        }

        private Start_Color(start: number, num: number) {
            let key: number = start;
            this["start_" + key].skin = "ui_kicking/img-shengli-xingxing-pvp.png";
            this["start_" + key].scale(3, 3);
            Laya.Tween.to(this["start_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, () => {
                key++;
                if (key <= num) {
                    this.Start_Color(key, num);
                }
            }))
        }

        private InitEvent() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_receive.on(Laya.Event.CLICK, this, this.Btn_click_receive);
            Tick.Loop(1000, this, this.CountDown);
        }

        private Handler(item, index: number) {
            let nhero_Id: number = this.fight_war.array[index];
            let n_tcfg = HeroConfig[nhero_Id];
            let hero_bg: Laya.Image = item.getChildByName("hero_bg");
            let hero_icon: Laya.Image = item.getChildByName("hero_icon");
            hero_bg.skin = BaseDefine.QualityList[n_tcfg.quality];
            hero_icon.skin = "ui_icon/" + n_tcfg.strIcon;
        }

        private Btn_click_receive() {
            BattlefieldManager.Instance.Destroy();
            Event.DispatchEvent("DeputyClose");
            UIManager.Instance.DestroyUI("KickingResultView", [ViewToppestRoot]);
            KickingLogic.Instance.Win_alawys();
        }

        private CountDown() {
            this.time--;
            let str: string = "(" + this.time.toString() + "s后自动退出)";
            this.fight_quittime.text = str;
            if (this.time == 0) {
                this.Btn_click_receive();
                Tick.Clear(this, this.CountDown);
            }
        }

        private Destroy() {
            HeroPosition.Instance.Puthero = [];
            this.offAll();
            Tick.Clear(this, this.CountDown);
        }

    }
}
