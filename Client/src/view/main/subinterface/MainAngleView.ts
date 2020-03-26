module H52D_Framework {
    /**
     * @class：主界面小仙女页面
     * @author：zhangyusong
     */
    export class MainAngleView extends ui.main.subinterface.MainAngleViewUI implements IViewPanel {
        private readonly anglePath: string = "res/player/xiaoxiannv/xxn.sk";
        private readonly angleScale: number = 0.10;
        private readonly boxPath: string = "res/player/box/box.sk";
        private readonly boxScale: number = 0.12;
        private readonly effPath: string = "res/effect/effect_state_baoxiang/effect_state_baoxiang.sk";
        private readonly effScale: number = 1;

        private angleId: number;
        private angleModel: Avatar;
        private boxModel: Avatar;
        private effModel: Avatar;
        /** 天使状态，1入场 2飞行 3掉落 4离开 */
        private state: number = 0;
        /** 方向，借用Avatar */
        private _direction: number = AvatarDirection.right;
        private frame: number;
        private rotationDirection: number = 1;
        private g: number = 0;

        public constructor() {
            super();
            this.InitView();
            this.InitEvent();
        }

        private InitView() {
            this.view.visible = false;
            this.view.x = 0;
            this.view.y = 0;
            this.angleModel = new Avatar(this.model);
            this.angleModel.Load(this.anglePath, AvatarDirection.left, this.angleScale, 35, 42, Laya.Handler.create(this, () => {
                this.angleModel.Play(AnimationName.idle);
            }));
            this.img_box.visible = false;
            this.boxModel = new Avatar(this.box);
            this.boxModel.Load(this.boxPath, AvatarDirection.left, this.boxScale, 35, 0, Laya.Handler.create(this, () => {
                this.boxModel.Play(AnimationName.idle);
            }));
            this.effModel = new Avatar(this.box);
            this.effModel.Load(this.effPath, AvatarDirection.left, this.effScale, 45, -10, Laya.Handler.create(this, () => {
            }));
        }

        private InitEvent(): void {
            Event.RegistEvent("AngleOpen", Laya.Handler.create(this, this.Start));
            Event.RegistEvent("AngleLeave", Laya.Handler.create(this, this.Leave));
            Event.RegistEvent("AngleSuspend", Laya.Handler.create(this, this.Suspend));
            Event.RegistEvent("AngleContinue", Laya.Handler.create(this, this.Continue));
        }

        public Destroy(): void {
            Tick.ClearAll(this);
        }

        private set direction(value: number) {
            this._direction = value;
            this.angleModel.direction = -value;
            this.boxModel.direction = -value;
            this.img_box.scaleX = -value;
        }
        private get direction(): number {
            return this._direction;
        }

        /** 小天使离开 */
        private Leave() {
            this.state = 4;
        }

        /** 暂停 */
        private Suspend(state:number){
            ViewUILogic.Instance.angleRun = false;
            this.view.visible = false;
            Tick.Clear(this, this.FrameHander);

            if(this.state == 1){        //入场状态
                this.SetPoint(0,0);
                this.state = 2;
            }
            else if(this.state == 2){   //飞行状态
            }
            else if(this.state == 3){   //掉落状态
                this.SetPoint(0,0);
                this.g = 0;
                this.state = 2;
            }
            else if(this.state == 4){   //离开状态
                this.state = 1;
                this.SetPoint(-60,-160);
            }
        }
        /** 继续 */
        private Continue(){
            ViewUILogic.Instance.angleRun = true;
            if(this.state == 2){    //飞行状态
                Tick.Loop(10, this, this.FrameHander);
                this.view.visible = true;
            }
        }

        /** 开始 */
        private Start(id:number) {
            //入场播放音效
            SoundManager.Instance.OnPlaySound("res/sound/angel.mp3");
            this.angleId = id;
            this.frame = 0;
            this.state = 1;
            this.SetPoint(-60,-60);
            this.direction = AvatarDirection.right;
            this.img_box.visible = false;
            this.boxModel.visible = true;
            this.view.visible = true;
            Tick.Loop(10, this, this.FrameHander);
            this.model.on(Laya.Event.CLICK, this, this.OnPackHander);
        }

        private SetPoint(sx:number, sy:number){
            this.model.x = sx;
            this.model.y = sy;
            this.box.x = this.model.x + 35;
            this.box.y = this.model.y + 48;
        }

        /** 拾取宝箱 */
        private OnPackHander() {
            //播放点击小仙女瞬间音效
            SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
            this.frame = 0;
            this.state = 3;
            this.img_box.visible = true;
            this.boxModel.visible = false;
            ViewUILogic.Instance.AngleTimeInit();
        }

        private FrameHander() {
            if (this.state == 1) {       //入场状态
                this.AdmissionState();
            }
            else if (this.state == 2) {  //飞行状态
                this.FlyState();
            }
            else if (this.state == 3) {  //掉落状态
                this.DropState();
            }
            else if (this.state == 4) {  //离开状态
                this.LeaveState();
            }
        }

        /** 入场状态 */
        private AdmissionState() {         
            //天使飞走
            if (this.model.x < 0) {
                this.model.x += 1;
                this.model.y += 1;
                this.SetPoint(this.model.x, this.model.y);
            }
            else {
                this.SetPoint(0, 0);
                this.state = 2;
            }
        }

        /** 飞行状态 */
        private FlyState() {
            if (this.model.x < 0 || this.model.x > this.panel.width) {
                if(this.model.x < 0) this.model.x = 0;
                if(this.model.x > this.panel.width) this.model.x = this.panel.width;
                this.frame = 0;
                this.direction = -this.direction;
                this.model.x += this.direction * 1;
            }
            else{
                this.frame += this.direction * 0.03;
                let x = this.model.x;
                x += this.direction * 1.2;
                let y = Math.sin(this.frame) * 18;
                this.SetPoint(x,y);
            }
        }

        /** 掉落状态 */
        private DropState() {
            //天使飞走
            if (this.model.y > -320) {
                this.model.x += this.direction * 3 ;
                this.model.y -= 4;
            }
            //宝箱坠落
            if (this.box.y < this.panel.height) {
                this.g += 0.98;
                this.box.y += 0.3 * this.g;
                //宝箱旋转
                if (this.box.rotation >= 4) {
                    this.rotationDirection = -1;
                }
                else if (this.box.rotation <= -4) {
                    this.rotationDirection = 1;
                }
                this.box.rotation += this.rotationDirection * 0.4;
            }
            else {
                //延迟一下，打开宝箱
                SoundManager.Instance.OnPlaySound("res/sound/angel2.mp3");
                this.g = 0;
                this.box.rotation = 0;
                this.view.off(Laya.Event.CLICK, this, this.OnPackHander);
                this.effModel.PlayOnce("effect_state_baoxiang");
                Tick.ClearAll(this);
                Tick.Once(400,this,()=>{
                    this.view.visible = false;
                    this.OpenReward();
                });
            }
        }

        /** 打开奖励 */
        private OpenReward() {
            let angleType = ViewUILogic.Instance.angleType;
            let type = FairyConfig[angleType][this.angleId]["fairyType"]
            if (type == 1) {
                ViewUILogic.Instance.AngleStop();
                UIManager.Instance.CreateUI("AngleView", [ViewUpRoot, this.angleId]);
            }
            else if (type == 2) {
                ViewUILogic.Instance.K_ReqAngelBeats(this.angleId, false);
            }
            else if (type == 3) {
                ViewUILogic.Instance.AngleStop();
                UIManager.Instance.CreateUI("AngleView", [ViewUpRoot, this.angleId]);
            }
        }

        /** 离开状态 */
        private LeaveState() {
            //天使飞走
            if (this.model.y > -300) {
                this.model.x += this.direction * 3 ;
                this.model.y -= 4;
                this.SetPoint(this.model.x, this.model.y);
            }
            else {
                Tick.ClearAll(this);
                this.view.visible = false;
            }
        }

    }
}