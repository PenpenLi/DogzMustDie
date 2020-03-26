module H52D_Framework {

    export class Player {
        /**是否是主玩家 */
        private _isMaster: boolean = false;
        /**角色名称 */
        private _name: string;
        /**角色头像 */
        private _head: string;
        /**角色属性 */
        private _base: number;
        /**角色id */
        private _id: number;
        /**角色等级*/
        private _level: number = 1;
        /**玩家布阵英雄信息 */
        private _heroWarList: Object = {};
        /**玩家法力池 */
        private _mpPool: number;
        /**玩家法力回复速度 */
        private _mpRecoveryRate: number;
        /**阵营ID */
        private _nCampID = -1;
        /**头像ID */
        private _headId = -1;
        /**玩家捐献度 */
        private _nCampDonate: number;
        /**玩家捐献次数 */
        private _Camptimes: any;
        /**英雄礼包 时间 */
        private _heropeck_time={};
        /**玩家充值情况 */
        private _TopUp: any;
        /** 玩家vip过期时间 */
        private _ExpirationTime:number = 0

        private _laddertimes:number=GameParamConfig.LadderFreeNum//-MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
        private _laddertimes_buy:number=GameParamConfig.LadderSpendNum//-MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
        private _fraction:number=0;
        private _needExp: number;
        /**当前关卡Id */
        private _customsId: number;
        /**第几波 */
        private _waveOrder: number;
        /**战斗模式*/
        private _customsMode: Customs_Mode;
        /**当前角色经验 */
        private _exp: number;
        /**角色金币数量*/
        private _moneyNum: number;
        /**角色宝石数量 */
        private _goodStone: number;
        /**点击伤害 */
        private _proint: number;
        /**点击暴击率 */
        private _Strike: number;
        private _Striketimes: number;
        /**角色最大级数 */
        private _maxLevel: number;
        /**MP魔法值 */
        private _mp: number;
        /**最大魔法值 */
        private _maxMp: number;
        /**法力值回复速度 */
        private _recoverMp: number;
        /**玩家技能存放处 */
        private _playSkillList: Object = {};
        /**存放英雄的集合 */
        private _heroList: Object = {};
        /**存放宠物的集合 */
        private _pet: Object = {};
        private _campInfo: Object = {};
        // private _monster:Monster;
        private static _init: Player;
        private _heroNum: number;
        private _camp: string;
        private _donate: number;
        private _pass: number;
        private _skillList:{[type:number]:number} = {};
        /** 播放音效 */
        private _sound: boolean = true;
        /** 播放音乐 */
        private _music: boolean = true;

        private _ladder_win_num:number=0;

        private _playervo: PlayerVo;
        public get vo() { return this._playervo; }
        public set vo(value: PlayerVo) { this._playervo = value; }
        /**单例 */
        public static get Init() {
            if (Player._init == null) {
                Player._init = new Player();
            }
            return Player._init;
        }
        /**是否是主玩家*/
        public get isMaster(): boolean {
            return this._isMaster;
        }
        public set isMaster(value: boolean) {
            this._isMaster = value;
        }
        public get HeroWarList() {
            return this._heroWarList;
        }
        public set HeroWarList(herowar) {
            this._heroWarList = herowar;
        }
        public get MpRecoveryRate() {
            return this._mpRecoveryRate;
        }
        public set MpRecoveryRate(value) {
            this._mpRecoveryRate = value;
            Event.DispatchEvent("MpRecoveryRateChange");
        }
        public get MpPool() {
            return this._mpPool;
        }
        public set MpPool(value) {
            this._mpPool = value;
            Event.DispatchEvent("MpPoolChange");
        }
        /**角色名称 */
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
        }
        /**角色头像 */
        public get Head(): string {
            return this._head;
        }
        public set Head(val: string) {
            this._head = val;
        }
        /**角色属性 */
        public get Base(): number {
            return this._base;
        }
        public set Base(value: number) {
            this._base = value;
        }
        /**角色id */
        public get ID(): number {
            return this._id;
        }
        public set ID(value: number) {
            this._id = value;
        }
        /**当前角色经验 */
        public get Exp(): number {
            return this._exp;
        }
        public set Exp(value: number) {
            this._exp = value;
        }
        /**升级所需经验 */
        public get NeedExp(): number {
            return this._needExp;
        }
        public set NeedExp(value: number) {
            this._needExp = value;
        }

        /** 第几关 */
        public set CustomsId(value: number) {
            this._customsId = value;
        }
        
        /** 第几关 */
        public get CustomsId(): number {
            return this._customsId;
        }

        /** 第几波 */
        public set WaveOrder(value: number) {
            this._waveOrder = value;
        }

        /** 第几波 */
        public get WaveOrder(): number {
            return this._waveOrder;
        }
        public set CustomsMode(value: Customs_Mode) {
            this._customsMode = value;
        }
        public get CustomsMode(): Customs_Mode {
            return this._customsMode;
        }

        public get CampID() {
            return this._nCampID;
        }

        public set CampID(id) {
            this._nCampID = id;
        }

        /**玩家的天梯分数 */
        public get Fraction(){
            return this._fraction;
        }

        public set Fraction(value){
             this._fraction=value;
        }

        /**玩家的天梯胜利次数 */
        public get LadderWinnNum(){
            return this._ladder_win_num;
        }

        public set LadderWinnNum(value){
            this._ladder_win_num=value;
        }
        



        public get HeadId() {
            return this._headId;
        }

        public set HeadId(id) {
            this._headId = id;
        }

        public get CampDonate() {
            return this._nCampDonate;
        }
        public set CampDonate(Num: number) {
            this._nCampDonate = Num;
        }
        /**玩家捐献次数 */
        public get Donatetimes() {
            return this._Camptimes;
        }        

        public set Donatetimes(tNum: any) {
            this._Camptimes = tNum;
        }

        public get Hero_pecktime(){
            return this._heropeck_time
        }

        public set Hero_pecktime(tNum: any) {
            this._heropeck_time = tNum;
        }




        /**角色金币数量 */
        public get MoneyNum(): number {
            return this._moneyNum;
        }
        public set MoneyNum(value: number) {
            this._moneyNum = value;
        }
        /**玩家宝石数量 */
        public get GoodStone(): number {
            return this._goodStone;
        }
        public set GoodStone(value: number) {
            this._goodStone = value;
        }
        /**角色等级 */
        public get Level(): number {
            return this._level;
        }
        public set Level(value: number) {
            this._level = value;
        }
        /**角色点击伤害 */
        public get Proint(): number {
            return this._proint;
        }
        public set Proint(value: number) {
            this._proint = value;
        }
        /** 英雄点击暴击率*/
        public get Strike(): number {
            return this._Strike;
        }
        public set Strike(value: number) {
            this._Strike = value;
        }
        /** 英雄点击暴击倍率*/
        public get StrikeTimes(): number {
            return this._Striketimes;
        }
        public set StrikeTimes(value: number) {
            this._Striketimes = value;
        }

        /**天梯挑战次数 */
        public get Laddertimes(){
            return this._laddertimes;
        }
        public set Laddertimes(value){
            this._laddertimes=value;
        }

        /**每日 可以可购买挑战次数 */
         public get BuyLaddertimes(){
            return this._laddertimes_buy;
        }

        public set BuyLaddertimes(value){
            this._laddertimes_buy=value;
        }

        /**角色最大魔法值 */
        public get MaxMp(): number {
            return this._maxMp;
        }
        public set MaxMp(value: number) {
            this._maxMp = value;
        }
        /**角色魔法值回复速度 */
        public get RecoverMp(): number {
            return this._recoverMp;
        }
        public set RecoverMp(value: number) {
            this._recoverMp = value;
        }
        /**角色当前魔法值 */
        public get Mp(): number {
            return this._mp;
        }
        public set Mp(value: number) {
            this._mp = value;
        }
        /**玩家拥有的已解锁英雄数量 */
        public get HeroNum(): number {
            return this._heroNum;
        }
        public set HeroNum(value: number) {
            this._heroNum = value;
        }
        /**捐献材料的数量 */
        public get Donate(): number {
            return this._donate;
        }
        public set Donate(value: number) {
            this._donate = value;
        }
        /**充值信息 */
        public get TopUp(): any {
            return this._TopUp;
        }
        public set TopUp(value: any) {
            this._TopUp = value;
        }
        /** 玩家vip过期时间 */
        public set ExpirationTime(value: number) {
            this._ExpirationTime = value;
        }

        public get ExpirationTime():number {
            return this._ExpirationTime;
        }

        /** 是否是VIP */
        public get IsVip() {
            return this.IsPermanentVip || this._ExpirationTime > Time.serverSecodes
        }
        
        /** 是否是永久VIP */
        public get IsPermanentVip() {
            return this._ExpirationTime == -1;
        }
        
        /** 是否是VIP  ExpirationTime */
        public getIsVip(eTime: number) {
            if (eTime == -1) {
                return true;
            }
            return eTime > Time.serverSecodes
        }

        /**通关数 */
        public get PassOut(): number {
            return this._pass;
        }
        public set PassOut(value: number) {
            this._pass = value;
        }
        /**通关数 */
        public get Sound(): boolean {
            return this._sound;
        }
        public set Sound(value: boolean) {
            this._sound = value;
        }
        /**通关数 */
        public get Music(): boolean {
            return this._music;
        }
        public set Music(value: boolean) {
            this._music = value;
        }
        public damage: number = 100;

        /** 已解锁技能 */
        public get SkillList(): {[type:number]:number} {
            return this._skillList;
        }
        /** 设置已解锁技能 */
        public SetSkillList(type:number=-128, id:number=0) {
            if(type == -128){
                this._skillList = {};
            }
            else{
                this._skillList[type] = id;
            }
        }

        /**初始化 */
        constructor() {
        }
        public type: eCharacter_TYPE = eCharacter_TYPE.PLAYER;
        /**角色等级提升 */
        public levelUp(needExp: number): void {
            if (this.Level < this._maxLevel) {
                if (this.Exp > this.NeedExp) {
                    this.Level += 1;
                    this.Exp -= this.NeedExp;
                    //this.Base 基础属性改变
                    //this.Proint=对应级数的点击伤害
                    //玩家显示等级的文本改变
                    //播放升级声音 特效
                }
                else {
                    //经验不在累计
                }
            }
        }

        /**去掉1W的关卡数 */
        public get CunstLevel(){
            return CustomspassConfig[this._customsId].customsOrder
        }

        /**销毁 */
        public Destroy() {
            for (let i in this._heroList) {
                this._heroList[i].Destroy();
                this._heroList[i] = null;
            }
            this._heroList = {};
        }
    }
}