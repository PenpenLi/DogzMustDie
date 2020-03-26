module H52D_Framework {
    AddViewResource("InitialHeroView",
        [
            { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png", type: Laya.Loader.IMAGE },
        ]);
    export class InitialHeroView extends ui.login.InitialHeroViewUI {

        private heroList: number[];
        private readonly localList: number[][] = [[142,666],[376,696],[610,666]];
        private castingTime:number = 0;
        private surplus:number = 0;
        private heroNum:number = -1;
        private txtSurplus:string = "进入游戏：xs";
        private callback:Function;

        constructor(buff:any) {
            super();
            this.callback = buff[1];
            this.ViewInit();
            this.EventInit();
        }

        private ViewInit() {
            // Wx.aldSendEvent("选择英雄");
            this.surplus = this.castingTime = Number(GameParamConfig["CastingTime"]);
            this.heroList = [];
            for(let profid in CastingConfig){
                this.heroList.push(Number(profid)); 
            }
            this.bg.skin = "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png";
            this.txt_information.text = GetInfoAttr.Instance.GetText(7156);
            this.LoadHero(0);
            this.LoadHero(1);
            this.LoadHero(2);
            this.OnChooseHero(1);

            this.SurplusTime();
            Tick.Loop(1000,this,this.SurplusTime);
        }

        private SurplusTime(){
            if(this.surplus > 0){
                this.txt_time.text = this.txtSurplus.replace("x", this.surplus.toString());
                this.surplus--;
            }
            else{
                Tick.Clear(this,this.SurplusTime);
                this.OnDefineHero();
            }
        }

        private LoadHero(num: number) {
            let panel: Laya.Box = this["hero_" + num].getChildByName("img_bg") as Laya.Box;
            let tcfg_hero = HeroConfig[this.heroList[num]];
            let pos = tcfg_hero.position;
            let modle = new Avatar(panel)
            modle.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.0, pos[1] - 60, pos[2] - 120,
                Laya.Handler.create(this, () => {
                    modle.Play(AnimationName.idle, true, true, () => {
                    }, true);
                })
            );
        }

        private EventInit() {
            this.hero_0.on(Laya.Event.CLICK, this, this.OnChooseHero,[0]);
            this.hero_1.on(Laya.Event.CLICK, this, this.OnChooseHero,[1]);
            this.hero_2.on(Laya.Event.CLICK, this, this.OnChooseHero,[2]);
            this.btn_define.on(Laya.Event.CLICK, this, this.OnDefineHero);
        }

        private OnChooseHero(num: number) {
            if(this.heroNum == num){
                return ;
            }
            SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen02.mp3");
            this.surplus = this.castingTime;
            this.SurplusTime();
            if(this["hero_"+this.heroNum]){
                this["hero_"+this.heroNum].scaleX = 1.0;
                this["hero_"+this.heroNum].scaleY = 1.0;
            }
            let left = 0;
            let right = 0;
            if(num == 0){
                left = 2;
                right = 1;
            }
            else if(num == 1){
                left = 0;
                right = 2;
            }
            else if(num == 2){
                left = 1;
                right = 0;
            }
            Laya.Tween.to(this["hero_"+num],{scaleX:1.6,scaleY:1.6,x:this.localList[1][0],y:this.localList[1][1]},200);
            Laya.Tween.to(this["hero_"+left],{scaleX:1,scaleY:1,x:this.localList[0][0],y:this.localList[0][1]},200);
            Laya.Tween.to(this["hero_"+right],{scaleX:1,scaleY:1,x:this.localList[2][0],y:this.localList[2][1]},200);
            
            this.txt_name.text = GetInfoAttr.Instance.GetText(HeroConfig[this.heroList[num]].name);
            
            this.txt_introduce.text = GetInfoAttr.Instance.GetText(HeroConfig[this.heroList[num]].heroOrigin);
            this.txt_introduce.alpha = 0;
            this.txt_introduce.y = 880;
            Laya.Tween.to(this.txt_introduce,{y:850,alpha:1},100);

            this.heroNum = num;
        }

        /** 选定英雄，关闭窗口 */
        private OnDefineHero(){
            this.callback(this.heroList[this.heroNum]);
            // Wx.aldSendEvent("选择英雄成功（注册成功）");
            Tick.Once(500,this,()=>{
                Laya.Tween.to(this, {"alpha" : 0}, 400,Laya.Ease.linearInOut,Laya.Handler.create(this, ()=>{
                    UIManager.Instance.DestroyUI(this.name,[this.parent]);
                }));
            });
        }

    }
}