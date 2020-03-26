module H52D_Framework {
    import Box = Laya.Box;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import Button = Laya.Button;
    import System = laya.system.System;

    /**
     * @class 活动列表模块
     * @author zhangyusong
     */
    export class ActionModel {
        private readonly PromptId: number = 30029;
        /** 红点 */
        public redPoint: boolean = false;
        private _vo: ActionVo;
        private type: ActionType;
        private id: number;

        private bgImg: Image;
        private bgReward: Image;
        private quality: Laya.Label;
        private actionName: Text;
        private actionContent: Text;
        private btn_tips: Button;
        private btn_attend: Button;
        private btn_share: Button;
        private btn_time: Image;
        private btn_remaning: Text;
        private btn_condition: Text;
        private red_point: Image;

        /** 记录列表索引 */
        public ItemName: string = null
        /**倒计时*/
        private remaningNum: number;
        /** 可查看 */
        private chack: boolean = true;
        /** 详情内容 */
        private content: string;
        private bGuidanceButton = true;

        public constructor() {
            this.chack = true;
        }

        public set item(view: Box) {
            this.bgImg = view.getChildByName("bgImg") as Image;
            this.bgReward = view.getChildByName("img_reward") as Image;
            this.actionName = view.getChildByName("txt_action_name") as Text;
            this.actionContent = view.getChildByName("txt_action_content") as Text;
            this.quality = view.getChildByName("item_quality") as Laya.Label;
            this.btn_tips = view.getChildByName("btn_tips") as Button;
            this.btn_share = view.getChildByName("btn_share") as Button;
            this.btn_attend = view.getChildByName("btn_attend") as Button;
            this.btn_time = this.btn_attend.getChildByName("attend_time") as Image;
            this.btn_remaning = this.btn_time.getChildByName("txt_remaning") as Text;
            this.btn_condition = this.btn_attend.getChildByName("txt_condition") as Text;
            this.red_point = this.btn_attend.getChildByName("red_point") as Image;
            for (let i: number = 0; i < 4; i++) {
                let model: RewardView = view.getChildByName("RewardView" + i) as RewardView
                if (model != null) {
                    model.visible = false;
                }
            }
            if (this.bgImg != null) {
                this.actionName.text = this.vo.name;
                this.btn_tips.x = this.actionName.textWidth + 30;
                this.actionContent.text = "活动时间:" + this.vo.actionTimeShow;
                this.bgReward.removeChildren(0,this.bgReward.numChildren);
                for (let i: number = 0; i < this.vo.reward.length; i++) {
                    let item: ItemModel = this.vo.reward[i];
                    let model: RewardView = view.getChildByName("RewardView" + i) as RewardView
                    if (model == null) {
                        model = new RewardView(item.itemId);
                        model.name = "RewardView" + i
                    }
                    model.visible = true
                    model.itemNum = item.itemNumber;
                    model.x = 30 + 100 * i;
                    this.bgReward.addChild(model);
                }
            }
            if (this.actionName.text == GetInfoAttr.Instance.GetText(5020) && this.bGuidanceButton) {
                Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_12, this.btn_attend)
                this.bGuidanceButton = false;
            }
        }

        public set vo(value: ActionVo) {
            this._vo = value;
            this.type = this._vo.type;
            this.id = this._vo.id;
            this.remaningNum = this._vo.remaning;
        }

        public get vo(): ActionVo {
            return this._vo;
        }

        /** 初始化，判定开启条件 */
        public Init(): void {
            let openGrade: E_OpenGrade;
            this.chack = true;
            switch (this.type) {
                case ActionType.topic:
                    openGrade = E_OpenGrade.TOPIC;
                    this.content = GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, this.vo.actionTimeShow);
                    //分享按钮
                    this.btn_share.offAll();
                    this.btn_share.on(Laya.Event.CLICK, this, this.ShowShare);
                    break;
                case ActionType.kicking:
                    openGrade = E_OpenGrade.KICKING;
                    this.content = GetInfoAttr.Instance.GetText(this.vo.detailsId);
                    break;
                case ActionType.boss:
                    openGrade = E_OpenGrade.BOSS;
                    this.content = GetInfoAttr.Instance.GetText(this.vo.detailsId);
                    break;
                case ActionType.ladder:
                    openGrade = E_OpenGrade.LADDER;
                    this.content = Format(GetInfoAttr.Instance.GetText(this.vo.detailsId),
                        GameParamConfig["LadderFreeNum"],
                        GameParamConfig["DailyAvailableAwardNum"]);
                    break;
                case ActionType.memory:
                    openGrade = E_OpenGrade.MEMORY;
                    this.content = GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, OpenGradeConfig[E_OpenGrade.MEMORY].Checkpoint);
                    break;
                case ActionType.match:
                    openGrade = E_OpenGrade.PKMATCH;
                    this.content = GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, OpenGradeConfig[E_OpenGrade.PKMATCH].Checkpoint);
                    break;
            }

            if (!OpenCondition(openGrade, false)) {
                if (openGrade == E_OpenGrade.TOPIC) {
                    this.OpenBtn(false, "等级不足");
                }
                else {
                    this.OpenBtn(false, OpenGradeConfig[openGrade].Checkpoint + "关开启");
                }
                this.btnWord = "参加";
            }
            else {
                this.UpDate();
            }
            this.btn_share.visible = false;

            this.ShowRedPoint();
            this.btn_attend.offAll();
            this.btn_attend.on(Laya.Event.CLICK, this, this.AttendHander);
            this.btn_tips.offAll();
            this.btn_tips.on(Laya.Event.CLICK, this, this.ShowTips);
        }

        /** 更新 */
        public UpDate() {
            //PK联赛需要特殊处理，变换时间段
            let matchTime:any = null;
            if(this.type == ActionType.match){
                matchTime = MainActionLogic.Instance.MatchCurrentTime();
                this.vo.timePoint = matchTime.point;
                this.vo.timeStart = matchTime.start;
                this.vo.timeEnd = matchTime.end;
            }
            if (MainActionLogic.Instance.Period(this.vo)) {
                this.btnWord = "参加";
                let useOpenBtn:boolean = true;
                //话题先锋
                if (this.type == ActionType.topic) {
                    this.btnWord = this.vo.viewPoint == ViewPoint.empty ? "参加" : "查看";
                    this.chack = true;
                    this.btn_share.visible = true;
                }
                //PK联赛
                else if(this.type == ActionType.match){
                    //PK联赛在报名时间内已经报名则取消倒计时
                    if(matchTime){
                        if(matchTime.point == MacthType.eApply){
                            if(MainActionLogic.Instance.hasMatch){
                                useOpenBtn = false;
                                this.OpenBtn(true, "星期六"+MainActionLogic.Instance.MatchTimeList[2].getHours()
                                    +":"+MainActionLogic.Instance.MatchTimeList[2].getMinutes());
                                this.actionContent.text = "活动时间:" + MainActionLogic.Instance.MatchTimeShow(MacthType.eApply);
                            }
                            else{
                                this.btnWord = "报名";
                            }
                        }
                        else if(matchTime.point == MacthType.eUnopened){
                            this.btnWord = "报名";
                            useOpenBtn = false;
                            this.OpenBtn(false, "休息中");
                            this.actionContent.text = "活动时间:" + MainActionLogic.Instance.MatchTimeShow(MacthType.eApply);
                        }
                        else{
                            this.actionContent.text = "活动时间:" + MainActionLogic.Instance.MatchTimeShow(matchTime.point);
                        }
                    }
                }
                this.remaningNum = Math.round((this.vo.timeEnd.getTime() - Time.serverTime.getTime()) * 0.001);
                if(useOpenBtn){
                    this.OpenBtn(true, GetFormatNumTime(this.remaningNum));
                }
            }
            else {
                let btnshow: string = "休息中";
                if (this.type == ActionType.topic) {
                    if(this.vo.viewPoint != ViewPoint.empty){
                        btnshow = "已结算";
                    }
                    this.chack = this.vo.viewPoint != ViewPoint.empty;
                    this.btn_share.visible = false;
                }
                this.btnWord = "查看";
                this.OpenBtn(true, btnshow);
            }
            this.ShowRedPoint();
        }

        public Destroy() {
            if (this.btn_attend == null) {
                return
            }
            if (this.btn_attend.hasListener(Laya.Event.CLICK)) {
                this.btn_attend.off(Laya.Event.CLICK, this, this.AttendHander);
            }
            if (this.btn_tips.hasListener(Laya.Event.CLICK)) {
                this.btn_tips.off(Laya.Event.CLICK, this, this.ShowTips);
            }
            if (this.btn_share.hasListener(Laya.Event.CLICK)) {
                this.btn_share.off(Laya.Event.CLICK, this, this.ShowShare);
            }
        }

        /** 设置字：
         * w:1参加，2查看
         **/
        public set btnWord(word: string) {
            if (this.ItemName == null) {
                return
            }
            this.btn_attend.label = word;
        }

        /** 心跳函数，展示倒计时 */
        public FrameAction() {
            if (this.ItemName == null) {
                return
            }
            if (--this.remaningNum > 0) {
                this.UpDate();
            }
            else {
                // this.Destroy();
                this.Init();
            }
        }

        private OpenBtn(b: boolean, txt: string): void {
            if(!this.btn_attend){
                return;
            }
            this.btn_attend.gray = !b;
            this.btn_time.visible = b;
            this.btn_condition.visible = !b;
            if (b) {
                this.btn_remaning.text = txt;
            }
            else {
                this.btn_condition.text = txt;
            }
        }

        private ShowRedPoint() {
            if(this.red_point){
                this.red_point.visible = MainActionLogic.Instance.redPointList[this.type];
            }
        }

        private AttendHander(): void {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this.chack) {
                // 请求参加活动
                Event.DispatchEvent("ActionOpen", [this.type, this.id]);
            }
            else {
                TipsLogic.Instance.OpenSystemTips(Format(SysPromptConfig[this.PromptId]["strPromptInfo"]));
            }
        }

        /** 显示玩法说明 */
        private ShowTips() {
            UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, this.vo.name, this.content]);
        }

        private ShowShare() {
            CallShare(ShareType.base);
        }

        /** 布阵事件 */
        private ShowCamp() {
            UIManager.Instance.CreateUI("KickingWarView", [ViewToppestRoot, ActionType.match]);
        }

    }
}