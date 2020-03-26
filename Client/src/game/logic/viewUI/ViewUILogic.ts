module H52D_Framework {

    /** 背景逻辑累 */
    export class ViewUILogic {
        public isAuto: boolean = true;
        public mpValueFull: boolean = false;

        private static _inst: ViewUILogic;
        /** 半屏显示 */
        private _halfPanel: boolean = true;
        /** 底部视图 */
        private _listView: MainListView;
        /** 底部视图 */
        private _customWave: Laya.Button;
        /**  */
        private btn_role: Laya.Box;

        private camp_red: Laya.Image;
        /** 第一个技能的CD时间 */
        private first_skill_cd: number;
        /** 面板是否打开 */
        private _openPanel: number;

        private angleOpenTime: number;
        private angleLeaveTime: number;
        private angleTime: number = Number.MAX_VALUE;
        /** 小仙女运行 */
        public angleRun: boolean = true;
        /** 小仙女版本类型 */
        public angleType: number;
        /** 小仙女是否在看广告 */
        public isWatch: boolean;

        /** 广告上次观看的时间戳 */
        public adTimeStamp: number = 0;
        /** 广告开启状态, 1关闭, 2观看, 3领奖 */
        public adState:number = 2;

        public static get Instance() {
            if (ViewUILogic._inst == null) {
                ViewUILogic._inst = new ViewUILogic();
            }
            return ViewUILogic._inst;
        }

        public Initialize(): void {
            this.EventInit();
        }

        public FrameHander(){
            //全局心跳函数
            Tick.Loop(1000, this, this.OnFrameHander);
        }
        /** 零点刷新 */
        public OnDay(){
            MasterPlayer.Instance.dayInviteNum = 0;
            MasterPlayer.Instance.invitaVipFlag = 0;
            Event.DispatchEvent("ZeroRefresh");
        }

        private EventInit(): void {
            Event.RegistEvent("OpenRank", Laya.Handler.create(this, this.OpenRank));
            //系统设置中改名成功
            RemoteCall.Instance.RegistJXS2CProtocol("C_RoleRename", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ChgHeadID", this);
            //小仙女领奖
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAngelBeats", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReleaseSkill", this);
        }

        private OpenRank(): void {
            UIManager.Instance.CreateUI("RankView", [ViewUpRoot]);
        }

        /** 全局心跳事件 */
        private OnFrameHander() {
            //小天使
            if (MasterPlayer.Instance.player.CustomsId && OpenCondition(E_OpenGrade.ANGLE, false)) {
                this.AngleControl();
            }
            //活动列表显示红点
            MainActionLogic.Instance.ShowRedPoint();
            //体力恢复
            if(MemoryLogic.Instance.Power < GameParamConfig["PowerMax"]){
                MemoryLogic.Instance.PowerUpdate();
            }
        }

        /** 天使时间初始化 */
        public AngleTimeInit() {
            this.angleTime = 0;
            this.angleRun = true;
            this.angleOpenTime = Math.round(Number(GameParamConfig["FairyGenerationTime"][1]) + Math.random() * (Number(GameParamConfig["FairyGenerationTime"][2]) - Number(GameParamConfig["FairyGenerationTime"][1])));
            this.angleLeaveTime = Number(GameParamConfig["FairyGenerationFlyTime"]);
        }

        /** 小天使停止 */
        public AngleStop() {
            this.angleTime = Number.MAX_VALUE;
        }
        /** 小天使立即开启 */
        public AngleStart() {
            this.angleTime = this.angleOpenTime - 2;
        }

        private AngleControl() {
            if (!this.angleRun) {
                return;
            }
            if (this.angleTime < this.angleOpenTime || (this.angleTime > this.angleOpenTime && this.angleTime < this.angleOpenTime + this.angleLeaveTime)) {
                ++this.angleTime;
            }
            else if (this.angleTime == this.angleOpenTime) {
                //小天使开启
                Event.DispatchEvent("AngleOpen", this.AngleRandomId());
                ++this.angleTime;
            }
            else if (this.angleTime == this.angleOpenTime + this.angleLeaveTime) {
                //小天使离开
                Event.DispatchEvent("AngleLeave");
                this.angleTime = 0;
            }
        }

        private AngleRandomId(): number {
            let id: number = 0;
            let weight: number[][] = [];
            let totleWeight: number = 0;
            this.angleType = IsAD() ? 2 : 1;

            //只有在有看广告次数时，才寻找技能解锁情况
            let unlock: boolean = false;
            if(AdvertisingManager.Instance.hasAngleTimes){
                let length: number = MainRoleLogic.Instance.roleSkill.length;
                for (let i: number = 0; i < length; i++) {
                    if (MainRoleLogic.Instance.IsSkillUnlocked(i)) {
                        unlock = true;
                        break;
                    }
                }
            }

            let config: any = FairyConfig[this.angleType];
            for (let _id in config) {
                //如果没有次数，就把必须看广告类型屏蔽掉
                if(!AdvertisingManager.Instance.hasAngleTimes){
                    if(config[_id]["fairyType"] == AdStage.MustWatch){
                        continue;
                    }
                }
                if (_id != "4" || unlock) {
                    totleWeight += Number(config[_id]["treasureweight"]);
                    weight.push([Number(_id), totleWeight]);
                }
            }
            let num: number = Math.random() * totleWeight >> 0;
            for (let i in weight) {
                id = weight[i][0];
                if (weight[i][1] >= num) {
                    break;
                }
            }
            return id;
        }

        /**半屏显示*/
        public set halfPanel(b: boolean) {
            this._halfPanel = b;
        }
        public get halfPanel(): boolean {
            return this._halfPanel;
        }

        public set listView(view: MainListView) {
            this._listView = view;
        }
        public get listView(): MainListView {
            return this._listView;
        }

        public set customWave(btn: Laya.Button) {
            this._customWave = btn;
        }
        public get customWave(): Laya.Button {
            return this._customWave;
        }

        public set roleLvUp(btn: Laya.Box) {
            this.btn_role = btn;
        }
        public get roleLvUp(): Laya.Box {
            return this.btn_role;
        }
        public set CampRed(btn: Laya.Image) {
            this.camp_red = btn;
        }
        public get CampRed(): Laya.Image {
            return this.camp_red;
        }

        public set FirstSkillCd(value: number) {
            this.first_skill_cd = value;
        }
        public get FirstSkillCd(): number {
            return this.first_skill_cd;
        }

        public set OpenPanel(value: number) {
            this._openPanel = value;
        }
        public get OpenPanel(): number {
            return this._openPanel;
        }

        /** 系统设置中改名成功 */
        private C_RoleRename(newName: any) {
            MasterPlayer.Instance.player.Name = newName[0];
            Event.DispatchEvent(EventDefine.PLAYER_NAME_UPDATE);
        }

        /** 系统设置中修改头像 */
        private C_ChgHeadID(newHead: any) {
            MasterPlayer.Instance.player.HeadId = newHead[0];
            Event.DispatchEvent(EventDefine.PLAYER_HEAD_UPDATE);
        }

        /** 请求领取小仙女奖励 */
        public K_ReqAngelBeats(id, redAdvertising) {
            RemoteCall.Instance.Send('K_ReqAngelBeats', this.angleType, id, redAdvertising);
        }

        /** 释放技能 */
        public C_ReleaseSkill(buf) {
            //技能ID：0-5
            let nidx = buf[0]-1;
            let SkillID = MainRoleLogic.Instance.GetSkillID(nidx)
            let nNameID = ActiveSkillConfig[SkillID].nameId
            let s = SysPromptConfig[30057].strPromptInfo
            let skill = GetInfoAttr.Instance.GetText(nNameID)
            let msg = Format(s, skill);
            TipsLogic.Instance.OpenTips(msg, 2);
            Event.DispatchEvent("OnSkillClick",[nidx,true]);
        }

        /** 小仙女奖励回调 */
        private C_ReqAngelBeats(value: any) {
            let nType = value[0];
            let nId = value[1];
            let bAdversiting = value[2];
            let allAward = value[3];

            let fairyType = 2;
            if(nId != null){
                fairyType = FairyConfig[nType][nId].fairyType
            }
            if( IsAD() &&  this.isWatch && (fairyType==1||fairyType==3)){
                AdvertisingManager.Instance.AddAdvertisingTimes(AdvertisementType.angelBeats);
            }
            
            if (GetTabLength(allAward) != 0) {
                TipsLogic.Instance.OpenGoodsProTips(allAward)
            }
            this.angleTime = 0;
        }

        
        public Destroy() {
            Event.DispatchEvent("ClearMainView");
        }
    }
}