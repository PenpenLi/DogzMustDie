module H52D_Framework {
    import MainSkillViewUI = ui.main.subinterface.MainSkillViewUI;

    /**
     * @class：技能视图类
     * @author：zhangyusong
     */
    export class MainSkillView extends MainSkillViewUI implements IViewPanel {
        /** 自动释放技能 */
        public isAuto = false;

        private readonly recovery:string = "(恢复:x/分钟)";
        private skillModelList: Array<SkillModel>;
        private mpListWidth: number = 0;
        /** 技能 */
        private skill: Laya.List;
        /** 队长技能 */
        private captainSkill: CaptainSkill;
        private updateTween: laya.utils.Tween;
        private skillNum: number = 0;
        /** 法力池 */
        private _mpPool: number = 0;
        /** 法力值 */
        private _mpValue: number = 0;
        /** 法力回复速度 */
        private _mpRecoveryRate: number = 0;
        /** 正在初始化 */
        private _isInit:boolean = true;
        /** 法力条正在增长 */
        private _isMoveing:boolean = false;
        /** 法力条恢复缓动时间 */
        private _moveTime:number = 0;
        /** 法力条目标位置 */
        private _targetLocal:number = 0;

        private bGuidanceButton = true;

        public constructor() {
            super();
            this.InitView();
            this.InitEvent();
        }

        public Destroy() {
            this.offAll();
            Event.RemoveEvent("UpdateBtnList", Laya.Handler.create(this, this.ShowControl));
            Event.RemoveEvent("SkillUpdate", Laya.Handler.create(this, this.SkillUpdate));
            Event.RemoveEvent("MpPoolChange", Laya.Handler.create(this, this.MpPoolChange));
            Event.RemoveEvent("MpValueChange", Laya.Handler.create(this, this.MpValueChange));
            Event.RemoveEvent("MpRecoveryRateChange", Laya.Handler.create(this, this.MpRecoveryRateChange));
            Event.RemoveEvent("OnSkillClick", Laya.Handler.create(this, this.OnSkillClick));
            Event.RemoveEvent("CaptainCd", Laya.Handler.create(this, this.UseCaptainSkill));
            Event.RemoveEvent("SkillMouseEnable", Laya.Handler.create(this, this.SkillMouseEnable));
            Event.RemoveEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            Event.RemoveEvent("MpFull", Laya.Handler.create(this, this.MpFull));
            Event.RemoveEvent(EventDefine.CAPATIAN_SKILL_AUTO, Laya.Handler.create(this, this.CaptainSkillAuto));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CustomCurrent));
            Tick.Clear(this, this.Frame);
            this.skillModelList.forEach(model => { model.Destroy() });
            this.captainSkill.Destroy();
            this.destroy();
        }

        /** 当前关卡 */
        private CustomCurrent() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.mouseEnabled = false;
            }
        }

        /** 法力上限 */
        private set mpPool(value: number) {
            this._mpPool = value;
            this.ShowMpNum();
            //刷新法力条
            if(this.mpValue > 0){
                this.mpValue = this.mpValue;
            }
        }

        private get mpPool(): number {
            return this._mpPool;
        }

        /** 法力值 */
        private set mpValue(value: number) {
            this._mpValue = value < 0 ? 0 : value;
            if (ViewUILogic.Instance.mpValueFull = this._mpValue > GameParamConfig["MaxMp"]) {
                this._mpValue = GameParamConfig["MaxMp"];
            }
            MasterPlayer.Instance.player.Mp = this._mpValue;
            //法力值发送到服务器
            OneTimer(1000, () => {
                RemoteCall.Instance.Send("K_SetMP", this._mpValue);
            }, "SendSetMp");
            this.ShowMpNum();
            if ((CustomsManager.Instance.CustomsVo == null || CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs)
                && IsAD() && AdvertisingManager.Instance.bnWXAdertisingTimes) {
                this.btn_recovery.visible = this._mpValue <= this.mpPool * 0.7;
            }
            else {
                this.btn_recovery.visible = false;
            }
            //法力条变化
            this.MpListChange();
        }

        
        /** 更新法力条 */
        private MpListChange(): void {
            let nMp = this.mpValue < this.mpPool ? this.mpValue : this.mpPool;
            //位移
            this._targetLocal = (-this.mpListWidth * (1 - nMp / this.mpPool)) >> 0;
            //全长1000毫秒
            this._moveTime = Math.abs(this._targetLocal - this.mp_list.x) / this.mp_list.width * 1000 >> 0;
            //跳过自增长
            if(this._moveTime > 0){
                if(this._isInit){
                    this.mp_list.x = this._targetLocal;
                }
                else{
                    if(this._moveTime > 10){
                        this._isMoveing = true;
                    }
                    Laya.Tween.to(this.mp_list, { x: this._targetLocal }, this._moveTime, Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this._isMoveing = false;
                    }));
                }
            }
            //容错
            if(this._isMoveing){
                Tick.Once(this._moveTime+100, this, () => {
                    this.mp_list.x = this._targetLocal;
                    this._isMoveing = false;
                });
            }
        }

        private get mpValue(): number {
            return this._mpValue;
        }

        /** 法力回升速度 */
        private set mpRecoveryRate(value: number) {
            this._mpRecoveryRate = value;
            this.ShowMpNum();
        }

        private get mpRecoveryRate(): number {
            return this._mpRecoveryRate;
        }

        private InitView() {
            //法力条初始化
            this.mpListWidth = this.mp_list.width;

            this.ShowControl();
            this.SkillInit(this.Skill);

            this.MpPoolChange();
            this.MpValueChange(MasterPlayer.Instance.player.Mp);
            this.MpRecoveryRateChange();
            this._isInit=false;
        }

        private InitEvent(): void {
            Event.RegistEvent("UpdateBtnList", Laya.Handler.create(this, this.ShowControl));
            Event.RegistEvent("CaptainSkillInit", Laya.Handler.create(this, this.CaptainSkillIcon));
            Event.RegistEvent("SkillUpdate", Laya.Handler.create(this, this.SkillUpdate));
            Event.RegistEvent("SkillLeveUp", Laya.Handler.create(this, this.SkillLeveUp));
            Event.RegistEvent("MpPoolChange", Laya.Handler.create(this, this.MpPoolChange));
            Event.RegistEvent("MpValueChange", Laya.Handler.create(this, this.MpValueChange));
            Event.RegistEvent("MpRecoveryRateChange", Laya.Handler.create(this, this.MpRecoveryRateChange));
            Event.RegistEvent("OnSkillClick", Laya.Handler.create(this, this.OnSkillClick));
            Event.RegistEvent("CaptainCd", Laya.Handler.create(this, this.UseCaptainSkill));
            Event.RegistEvent("SkillMouseEnable", Laya.Handler.create(this, this.SkillMouseEnable));
            Event.RegistEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            Event.RegistEvent("MpFull", Laya.Handler.create(this, this.MpFull));
            Event.RegistEvent(EventDefine.CAPATIAN_SKILL_AUTO, Laya.Handler.create(this, this.CaptainSkillAuto));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CustomCurrent));
            Tick.Loop(100, this, this.Frame);
            this.btn_recovery.on(Laya.Event.CLICK, this, this.OnRecovery);
        }

        /** 法力回满 */
        private MpFull() {
            if (this.mpValue < this.mpPool) {
                this.mpValue = this.mpPool;
            }
        }

        /** 一键恢复，打开广告页 */
        private OnRecovery() {
            UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.mpRecover]);
        }

        
        /**
         * 技能初始化
         * @param value 
         */
        private SkillInit(value) {
            this.skill = value;
            this.skillModelList = [];
            //基础数据初始化
            let roleSkill = MainRoleLogic.Instance.roleSkill;
            this.skillNum = MainRoleLogic.Instance.roleSkill.length;
            for (let i: number = 0; i < this.skillNum; i++) {
                let model: SkillModel = new SkillModel();
                this.skillModelList.push(model);
            }
            this.skill.array = roleSkill;
            this.skill.renderHandler = new Laya.Handler(this, (item: Laya.Box, index: number) => {
                let model: SkillModel = this.skillModelList[index];
                model.SetData(item, index);
                model.UpdateMp(this.mpValue);
                model.view.on(Laya.Event.CLICK, this, this.OnSkillClick, [index]);
                if (index == 0 && this.bGuidanceButton) {
                    Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_6 + 1000, model.view)
                    this.bGuidanceButton = false;
                }
                if (--this.skillNum <= 0) {
                    this.SkillUpdate();
                    MasterPlayer.Instance.player.SetSkillList();
                    for (let k in this.skillModelList) {
                        if (!this.skillModelList[k].lock) {
                            MasterPlayer.Instance.player.SetSkillList(this.skillModelList[k].index, this.skillModelList[k].vo.id);
                        }
                    }
                    this.skillNum = MainRoleLogic.Instance.roleSkill.length;
                }
            });
            //队长技能初始化
            this.captainSkill = new CaptainSkill(this);
            this.CaptainSkillAuto(true);
        }

        /** 显示副本页，用来刷新技能面板 */
        private ShowDeputy() {
            this.skillModelList.forEach(model => { model.Destroy() });
            this.captainSkill.Destroy();
        }

        private CaptainSkillAuto(auto: boolean) {
            this.captainSkill.isAuto = auto;
        }

        /** 更新法力池 */
        private MpPoolChange(): void {
            this.mpPool = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(51);
        }

        /** 更新法力增加值 */
        private MpValueChange(value: number): void {
            this.mpValue += value;
        }

        /** 更新法力恢复速度 */
        private MpRecoveryRateChange(): void {
            this.mpRecoveryRate = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(53);
        }

        private CaptainSkillIcon(icon: string) {
            this.captainSkillIcon.skin = icon;
        }

        /** 技能更新 */
        public SkillUpdate(): void {
            if (CustomsManager.Instance.CustomsType != Customs_Type.Customs) {
                this.mouseEnabled = false;
            }
            this.MpPoolChange();
            //基础数据初始化
            let roleSkill: Array<{ "lv": number, "cd": number }> = MainRoleLogic.Instance.roleSkill;
            for (let i = 0; i < roleSkill.length; i++) {
                let model: SkillModel = this.skillModelList[i];
                model.level = roleSkill[i].lv;
                //副本场景cd是零
                model.UpdateCd(roleSkill[i].cd);
                model.UpdateMp(this.mpValue);
            }
        }

        /** 技能升级 */
        private SkillLeveUp(): void {
            let roleSkill: Array<{ "lv": number, "cd": number }> = MainRoleLogic.Instance.roleSkill;
            for (let i = 0; i < roleSkill.length; i++) {
                let model: SkillModel = this.skillModelList[i];
                model.level = roleSkill[i].lv;
                model.UpdateMp(this.mpValue);
            }
        }

        /**
         * 使用技能
         * @param index:0-5
         * @param excess:额外的技能，释放时不消耗法力值只有持续时间没有冷却时间
         */
        private OnSkillClick(index: number,excess:boolean): void {
            if(typeof excess != "boolean"){
                excess = false;
            }
            let monsterList = MonsterManager.Instance.monsterList;
            if (monsterList == {}) {
                return;
            }
            else {
                for (let k in monsterList) {
                    if (monsterList[k].IsDie) {
                        return;
                    }
                }
            }
            let model: SkillModel = this.skillModelList[index];
            if(!excess){
                if(this.mpValue >= model.vo.conMp){
                    this.mpValue -= model.vo.conMp;
                    model.UpdateMp(this.mpValue);
                }
                else{
                    // TipsLogic.Instance.OpenSystemTips("当前法力值不足");
                    return;
                }
            }
            model.StartUse(excess);
            //主线技能记录释放时间戳，额外技能不记录
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs && !excess) {
                RemoteCall.Instance.Send("K_ReqSkillCD", index + 1);
                MainRoleLogic.Instance.SetSkillCdTime(index, Time.serverSecodes);
            }
            //使用技能数量
            MasterPlayer.Instance.ReqOnEvent(EventProEnum.UsePlayerSkill, 1);
        }

        /** 帧函数，执行法力值自增长和技能刷新 */
        private Frame(): void {
            if (this.mpValue < this.mpPool) {
                //在大幅变化过程中，中断自增长
                if(!this._isMoveing){
                    this.mpValue += this.mpRecoveryRate / 600;
                }
            }
            if (this.skillModelList.length == 6) {
                //更新技能
                for (let i: number = 0; i < 6; i++) {
                    this.skillModelList[i].UpdateMp(this.mpValue);
                }
            }
        }

        /** 显示法力值数据 */
        private ShowMpNum() {
            this.tx_skill_num.text = (this._mpValue >> 0) + "/" + (this._mpPool >> 0);
            this.tx_skill_num.width = this.tx_skill_num.textWidth;
            this.tx_skill_time.text = this.recovery.replace("x", String(this.mpRecoveryRate));
            this.tx_skill_time.x = this.tx_skill_num.x + this.tx_skill_num.textWidth + 10;
        }

        /** 使用队长技能 */
        private UseCaptainSkill(cdTime: number) {
            this.captainSkill.UseCaptainSkill(cdTime);
        }

        /** 隐藏自己，用于副本页面 */
        private ShowControl() {
            this.bg.visible = WroldBossLogic.Instance.Show;
        }

        /** 技能可点击，用于副本页面 */
        private SkillMouseEnable() {
            this.mouseEnabled = true;
        }

    }
}
