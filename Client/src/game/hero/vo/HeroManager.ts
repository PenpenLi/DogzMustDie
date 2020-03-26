module H52D_Framework {

    enum SelectType {
        One = 1,
        Five = 2,
        Max = 3,
    }

    export class HeroManager {
        /**所有已有英雄 */
        private _herolist: { [id: number]: HeroInfo } = [];
        /**已有英雄数量 */
        private _heroNum: number;
        /**英雄布阵存储信息 */
        private _heroWar: Array<number> = [];
        /**布阵的位置信息类 */
        private _heroposition: HeroPosition;
        /**所有英雄的id数组 */
        private hero_List: Array<number> = [];

        /**已拥有英雄id */
        private has_List: Array<number> = [];

        private _hero_peck: Array<number> = [];


        private _hero_pecktime: { [nId: number]: number } = {};
        public HeroMaxLv = 0
        private _HeroMaxStar = 0;

        private _peck_num = 0;

        private _peck_buyed: Array<number> = [];
        /**英雄礼包购买记录 */
        private _heropeck_record: { [ID: number]: { [type: number]: number } } = {};

        /** 英雄礼包购买记录  广告版*/
        private _heropeck_buy_ad: { [Id: number]: number } = {};
        constructor() {
            this.hero_List = [];
            for (let key in HeroConfig) {
                let nHeroID: number = Number(key);
                this.hero_List.push(nHeroID);
            }
            this._heroNum = 0;
            this.HeroMaxLv = 0
            let tCfg = HeroUpgrateConfig[1]
            for (let nLv in tCfg) {
                this.HeroMaxLv = Number(nLv)
            }
            this._HeroMaxStar = 0;
            let n_tCfg = HeroAdvanceConfig[this.hero_List[0]]
            for (let star in n_tCfg) {
                this._HeroMaxStar = Number(star);
            }
            for (let key in HeroPeckConfig) {
                let nId = Number(key);
                this._hero_peck.push(nId);
            }
        }

        private _heropeck: Array<number> = [];

        private _peck_show: boolean;

        private _peck_icon: boolean = false;

        public get PeckIcon() {
            return this._peck_icon;
        }
        public set PeckIcon(value) {
            this._peck_icon = value;
        }

        public get HeroPeck_arr() {
            return this._heropeck;
        }

        public set HeroPeck_arr(value) {
            this._heropeck = value;
        }

        public get PeckRecord() {
            return this._heropeck_record;
        }

        public set PeckRecord(value) {
            this._heropeck_record = value;
        }

        /**广告版 礼包购买 */
        public get Peck_Ad() {
            return this._heropeck_buy_ad;
        }

        public set Peck_Ad(value) {
            this._heropeck_buy_ad = value;
        }


        public get PeckShow() {
            return this._peck_show
        }

        public set PeckShow(value) {
            this._peck_show = value;
        }

        public get PeckBuyed() {
            return this._peck_buyed
        }

        public set PeckBuyed(value) {
            this._peck_buyed = value;
        }

        public get PeckNum() {
            return this._peck_num;
        }

        public set PeckNum(value) {
            this._peck_num = value;
        }

        public get HeroPeck() {
            return this._hero_peck;
        }

        public set HeroPeck(value) {
            this._hero_peck = value;
        }

        public get HeroPeckTime() {
            return this._hero_pecktime;
        }

        public get HeroMaxStar() {
            return this._HeroMaxStar
        }

        /** 角色放在第一位 */
        public ProfSort(){

        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqActivateHero", this);//激活英雄
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqHeroLevelUp", this);//请求英雄升级回调
            RemoteCall.Instance.RegistJXS2CProtocol("C_HeroLevelUp", this);//英雄升级
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqHeroStarUp", this);//英雄进阶
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendHeroBeginMsg", this); //开始同步上线英雄  
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendGroupHeroMsg", this);//上线同步英雄
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendHeroEndMsg", this);//上线同步英雄结束
            RemoteCall.Instance.RegistJXS2CProtocol("C_SaveBattleArray", this);//发送布阵的数据信息  
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddHero", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ActivateHeroAward", this);
            this._peck_show = true;
            this._hero_pecktime = MasterPlayer.Instance.player.Hero_pecktime;
        }

        public GetHeroStar(nIdx: number) {
            let ntcfg = HeroAdvanceConfig[nIdx];
            let star;
            for (let nstar in ntcfg) {
                star = Number(nstar);
            }
            return star
        }

        public C_SendHeroBeginMsg(): void {//開始同步上綫英雄
            this._herolist = {}
        }

        /** 上线同步英雄 */
        public C_SendGroupHeroMsg(buf): void {
            let tGroup = buf[0]
            for (let nIdx in tGroup) {
                let tData = tGroup[nIdx]
                let oHero = new HeroInfo();
                oHero.unpackData(tData)
                this._herolist[oHero.nHeroID] = oHero;
            }
        }

        /** 上綫同步英雄結束 */
        public C_SendHeroEndMsg(buf: Object): void {
            let tGroup = buf[0]
            for (let nIdx in tGroup) {
                let tData = tGroup[nIdx]
                let oHero = new HeroInfo();
                oHero.unpackData(tData)
                this._herolist[oHero.nHeroID] = oHero
            }
        }

        /** 添加英雄 */
        public C_AddHero(buf: Object): void {
            let tData = buf[0]
            let oHero = new HeroInfo();
            oHero.unpackData(tData)
            this._herolist[oHero.nHeroID] = oHero
        }

        public C_ActivateHeroAward(buf): void {
            let data = buf[0];
            MasterPlayer.Instance.player.Hero_pecktime[data] = buf[1];
            HeroManager.Instance.PeckShow = true;
            this._peck_icon = true;
            Event.DispatchEvent("UpdateBtnList");
        }

        /**检测某个英雄礼包 */
        public Hero_peck_one(nHeroId: number) {
            if (GetTabLength(this._peck_buyed) == 0) {
                return false;
            }
            for (let key in this._peck_buyed) {
                if (nHeroId == this._peck_buyed[key]) {
                    return false;
                }
            }
            return true;
        }

        /**返回单个英雄的礼包时间 */
        public GetHeroPecktime(nHeroId: number) {
            return MasterPlayer.Instance.player.Hero_pecktime[nHeroId];
            // return 0;
        }

        /** 获取配置全部英雄 */
        public GetCfgHeroList(): Array<number> {
            return this.hero_List;
        }

        /** 檢測英雄是否激活 */
        public IsActive(nHeroID) {
            return this._herolist[nHeroID] ? true : false;
        }

        /**英雄是否满足激活条件 */
        public HeroIstrue(nHeroID) {
            let bool = this.IsActive(nHeroID);
            if (bool) {
                return false;
            }
            let herolv;
            let hero = this.GetHero(nHeroID);
            if (!hero) {
                herolv = 1;
            }
            else {
                herolv = hero.Level;
            }
            let itemID = HeroConfig[nHeroID].needItem;
            let itenNum = HeroConfig[nHeroID].needNum;
            let hasitem = BagManager.Instance.getItemNumber(itemID);
            return (hasitem >= itenNum) ? true : false;
        }

        /**获取所有英雄是否有可以激活的  控制新的显示隐藏*/
        public All_HeroIstrue() {
            let IsCan
            for (let key in HeroConfig) {
                let nHeroID = Number(key);
                let tcfg = HeroConfig[nHeroID];
                let bool = this.IsActive(nHeroID);
                if (!bool) {
                    let item_Id = tcfg.needItem;
                    let play_itemnum = BagManager.Instance.getItemNumber(item_Id);
                    IsCan = play_itemnum >= tcfg.needNum ? true : false;
                    return IsCan
                } else {
                    IsCan = false
                    continue
                }
            }
            return IsCan
        }

        /**判断英雄是否满足进阶条件 */
        public HeroIsStar(nHeroID) {
            let herostar;
            let hero = this.GetHero(nHeroID);
            if (!hero) return
            else {
                herostar = hero.Star
            }
            if (herostar < this.HeroMaxStar) {
                let iteminfo = HeroAdvanceConfig[nHeroID][herostar + 1].Consume
                let itemID = iteminfo[1][1];
                let itenNum = iteminfo[1][2];
                let hasitem = BagManager.Instance.getItemNumber(itemID);
                return (hasitem >= itenNum) ? true : false;
            }
            else {
                let iteminfo = HeroAdvanceConfig[nHeroID][herostar].Consume
                let itemID = iteminfo[1][1];
                let itenNum = iteminfo[1][2];
                let hasitem = BagManager.Instance.getItemNumber(itemID);
                return false;
                //return (hasitem >= itenNum) ? true : false;
            }
        }

        /**判断英雄是否 有礼包 */
        public HeroIsHave_peck(nheroId: number) {
            for (let key in this._hero_peck) {
                let nId = this._hero_peck[key];
                if (nId == nheroId) {
                    return true;
                }
            }
            return false;
        }

        /** 初始化购买过的英雄礼包 */
        public Buyed_peck() { 
            this._peck_buyed=[];
            for (let key in this._hero_peck) {
                let nID = this._hero_peck[key];
                let peck_cfg = HeroPeckConfig[nID];
                let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
                let bool_m = ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId)
                let bool_d = Buy_times == 0 ? true : false;
                if (IsAD()) {
                    if (Buy_times >= 2) {
                        this._peck_buyed.push(nID);
                    }
                } else {
                    if (!bool_d || !bool_m) {
                       this._peck_buyed.push(nID);
                    }
                }
            }            
        }

        /** 检测该英雄是否买过礼包 */
        public Heropeck_IsBuy(nHeroID: number){
            let a =0;
            for(let key in this._peck_buyed){
                if(nHeroID==this._peck_buyed[key]){
                    return false
                }
            }
             return true;
        }

        /**判断英雄是否可以升级 */
        public HeroIsUp(nheroID) {
            let hero_cfg = HeroConfig[nheroID];
            let hero = this.GetHero(nheroID);
            let type = hero_cfg.type;
            let nx = hero_cfg.heroRatio;
            if (hero && hero.Level < 300) {
                let lv = hero ? hero.Level : 1;
                let n_money = HeroUpgrateConfig[type][lv + 1].ConsumeGold - HeroUpgrateConfig[type][lv].ConsumeGold
                let lock_Money = Math.floor(n_money * nx);
                let lock_lv = HeroUpgrateConfig[type][lv + 1].needPlayerLv;
                let play_money = BagManager.Instance.getItemNumber(1);
                let play_lv = MasterPlayer.Instance.player.Level;
                if (play_lv >= lock_lv && play_money >= lock_Money) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }

        public GetheroUpMoney(Idx: number): number {
            for (let key in this._herolist) {
                let nheroID = Number(key);
                this.has_List.push(nheroID);
            }
            let a = this.has_List[Idx];
            let needMoney = this.GetHeroLvUpUse(a, 1);
            if (!needMoney) {
                return;
            }
            return needMoney[1];
        }


        /** 获取升级需要的金币数量 */
        public GetHeroLvUpUse(nHeroID, nSelectType: number) {
            if (nSelectType == 0) {
                nSelectType = 1;
            }
            let nUpLevel = null;
            let nMoney = 0//升级需要的钱数
            let hero = HeroManager.Instance.GetHero(nHeroID);
            if (!hero) {
                return;
            }
            let nNowLevel = hero.Level;
            let tCfg = HeroConfig[nHeroID];
            let nx = tCfg.heroRatio;
            let nUpgrate_Cfg = HeroUpgrateConfig[tCfg.type];
            let nMaxLv = HeroManager.Instance.HeroMaxLv;
            let nHasMoney = BagManager.Instance.getItemNumber(1);//人物金币
            if (nHeroID == 111) {
                let nHasMoney = BagManager.Instance.getItemNumber(1);//人物金币
            }
            // 判断是否已经满级
            if (nUpgrate_Cfg[nNowLevel + 1] == null) {
                return [-1, 0];
            }
            let nNowMoney = nUpgrate_Cfg[nNowLevel].ConsumeGold;
            if (nSelectType == SelectType.One) {
                let tLastCfg = nUpgrate_Cfg[nNowLevel + 1];
                nMoney = (tLastCfg.ConsumeGold - nNowMoney) * nx;
                return [nNowLevel + 1, nMoney];
            }

            let nCanMaxLv = 0;
            // 检测当前能升到的最大等级
            for (let nCanLv = nNowLevel + 1; nCanLv <= nMaxLv; nCanLv++) {
                let tLastCfg = nUpgrate_Cfg[nCanLv];
                let nCanMoney = tLastCfg.ConsumeGold - nNowMoney;
                if (nCanMoney > nHasMoney) {
                    nCanMaxLv = nCanLv - 1;
                    break
                }
                nCanMaxLv = nCanLv;
            }

            switch (nSelectType) {
                case SelectType.Five:
                    if (nNowLevel + 10 > nCanMaxLv) {
                        nUpLevel = nCanMaxLv;
                    } else {
                        nUpLevel = nNowLevel + 10;
                    }
                    break;
                case SelectType.Max:
                    nUpLevel = nCanMaxLv;
                    break;
                default:
                    break
            }
            let tLastCfg = nUpgrate_Cfg[nUpLevel];
            nMoney = tLastCfg.ConsumeGold - nNowMoney;
            let up_info = this.Money_color(nHeroID, nUpLevel, nSelectType)
            return up_info
        }

        private Money_color(nheroId: number, nUpLevel: number, nSelectType: number) {
            let tCfg = HeroConfig[nheroId];
            let nx = tCfg.heroRatio;
            let hero = this.GetHero(nheroId);
            let nUpgrate_Cfg = HeroUpgrateConfig[tCfg.type]
            let nowmoney = (nUpgrate_Cfg[hero.Level].ConsumeGold)
            let lock_lv = nUpgrate_Cfg[nUpLevel].needPlayerLv;
            let lock_money = (nUpgrate_Cfg[nUpLevel].ConsumeGold - nowmoney) * nx;
            let play_lv = MasterPlayer.Instance.player.Level
            let my_money = BagManager.Instance.getItemNumber(1);
            let nCanLv, nMoney;
            let nCanMaxLv = 0;
            let nMaxLv = this.HeroMaxLv;
            for (let nCanLv = hero.Level + 1; nCanLv <= nMaxLv; nCanLv++) {
                let tLastCfg = nUpgrate_Cfg[nCanLv];
                let nCanMoney = tLastCfg.ConsumeGold - nowmoney;
                if (nCanMoney > my_money) {
                    nCanMaxLv = nCanLv - 1;
                    break
                }
                nCanMaxLv = nCanLv;
            }

            if (play_lv >= lock_lv) {
                switch (nSelectType) {
                    case 1:
                        nCanLv = 1;
                        break;
                    case SelectType.Five:
                        if (hero.Level + 10 > nCanMaxLv) {
                            nCanLv = nCanMaxLv;
                        } else {
                            nCanLv = hero.Level + 10;
                        }
                        break;
                    case SelectType.Max:
                        nCanLv = this.MaxLvUp(nheroId, play_lv);
                        break;
                }
                let needMoney = (nUpgrate_Cfg[nCanLv].ConsumeGold - nowmoney) * nx;
                if (needMoney > my_money) {
                    nCanLv = this.M_MaxLvup(nheroId, my_money);
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    nMoney = (nMoney - nowmoney) * nx;
                    return [nCanLv, nMoney]
                } else {
                    return [nCanLv, needMoney]
                }
            } else {
                if (nSelectType == 2 && lock_lv <= play_lv) {
                    nCanLv = nUpLevel
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    return [nCanLv, nMoney]
                }
                nCanLv = this.MaxLvUp(nheroId, play_lv);
                nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                nMoney = (nMoney - nowmoney) * nx;
                if (my_money < nMoney) {
                    nCanLv = this.M_MaxLvup(nheroId, my_money);
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    nMoney = (nMoney - nowmoney) * nx;
                    return [nCanLv, nMoney]
                } else {
                    // return [nUpLevel, lock_money];
                    return [nCanLv, nMoney];
                }
            }
        }


        /**未上阵的英雄 */
        public NHero(): Array<number> {
            let heroobj = HeroCardManager.Instance.CHeroList;
            let key = [];
            let nkey = [];
            for (let k in this._herolist) {
                key.push(Number(k));
            }
            for (let k in heroobj) {
                nkey.push(heroobj[k].vo.nHeroID);
            }
            for (let i = 0; i < nkey.length; i++) {
                key.push(nkey[i]);
            }
            for (let i = 0; i < key.length; i++) {
                for (let j = i + 1; j < key.length; j++) {
                    if (key[i] && key[j]) {
                        if (key[i] == key[j]) {
                            key[i] = null;
                            key[j] = null;
                        }
                    }
                }
            }
            for (let i = key.length; i >= 0; i--) {
                if (key[i] == null) {
                    key.splice(i, 1);
                }
            }
            return key;
        }

        private static _init: HeroManager;
        public static get Instance(): HeroManager {
            if (HeroManager._init == null) {
                HeroManager._init = new HeroManager();
            }
            return HeroManager._init
        }

        /** 获取已有英雄列表 */
        public get Herolist(): Object {
            return this._herolist;
        }

        public Hero_sort(id) {
            let heroID: Array<number> = [];
            for (let nheroId in this._herolist) {
                let nIdx = Number(nheroId)
                heroID.push(nIdx);
            }
            function tsort(a, b): number {
                let a_q = HeroConfig[a].quality;
                let b_q = HeroConfig[b].quality;
                if (a_q == b_q) {
                    return a > b ? 1 : -1;
                }
                return a_q > b_q ? -1 : 1;
            }
            heroID.sort(tsort);
            return heroID[id];
        }

        /** 获取玩家可激活的英雄数量 */
        public get ActiveHeroNum(): number {
            let length = 0;
            for (let nHeroID in HeroConfig) {
                if (!this.IsActive(nHeroID)) {
                    let hero = HeroConfig[nHeroID];
                    let heroID_item = hero.needItem;
                    let heroID_itemNum = hero.needNum;
                    let itemNum = BagManager.Instance.getItemNumber(heroID_item);
                    if (itemNum >= heroID_itemNum) {
                        length++;
                    }
                }
            }
            return length;
        }

        /**获取英雄可以进阶的数量 */
        public get StarHeroNum(): number {
            let num = 0;
            for (let nHeroID in HeroConfig) {
                if (this.IsActive(nHeroID)) {
                    if (this.HeroIsStar(nHeroID)) {
                        num++;
                    }
                }
            }
            return num;
        }

        /**获取玩家英雄解锁数量 */
        public GetHeroNum() {
            let _HasHeroList: Array<any> = []
            for (let nHeroID in HeroManager.Instance.Herolist) {
                _HasHeroList.push(nHeroID);
            }
            return _HasHeroList.length;
        }
        /** 获取英雄实例 */
        public GetHero(nHeroID): HeroInfo {
            return this._herolist[nHeroID]
        }

        public get Herowar(): Array<number> {
            return this._heroWar
        }

        public set Herowar(value: Array<number>) {
            this._heroWar = value;
        }

        /**激活英雄 */
        public K_ReqActivateHero(nHeroID: number): void {
            RemoteCall.Instance.Send("K_ReqActivateHero", nHeroID);
        }
        /**英雄等级提升 */
        public HeroLevlUp(index: number, how: number): void {
            RemoteCall.Instance.Send("K_ReqHeroLevelUp", index, how);
        }
        /**进阶 */
        public HeroStartUp(index: number): void {
            let hero: HeroInfo = this.Herolist[index];
            RemoteCall.Instance.Send("K_ReqHeroStarUp", index);
        }

        /**英雄布阵信息 */
        public HeroWarInfo(herowar: { [pos: number]: number }): void {
            RemoteCall.Instance.Send("K_SaveBattleArray", herowar);
        }

        private _loading: boolean = false;
        /** 通知英雄布阵信息 */
        public C_SaveBattleArray(buf) {
            //if (this._loading) return;
            this._loading = true;
            let HeroWarList = buf[0];
            MasterPlayer.Instance.player.HeroWarList = HeroWarList;
            // 更新完阵容信息后刷新对话列表
            BubbleManager.Instance.UpdateAllBubbleID()
            //清除气泡
            Event.DispatchEvent("ClearBubble")

            HeroCardManager.Instance.AvatarInit(
                Laya.Handler.create(this, () => {
                    this._loading = false;
                    Event.DispatchEvent(EventDefine.BEGIN_FIRE);
                    if (buf[1]) {
                        TipsLogic.Instance.OpenSystemTips("阵容保存成功！");
                    }
                })
            );
        }

        /** 通知客户端激活成功 */
        public C_ReqActivateHero(buf) {
            let heroid = buf[0];
            let hero = HeroConfig[heroid];
            AttributePassiveManager.Instance.Update();
            //hero.OwnIsTrue(a);            
            Event.DispatchEvent("ReqActivateHero");
            //重新生效武器属性
            EquipManager.Instance.AnewLoadAttribute();
            PetManager.Instance.OnResetAttr();
            MHAManager.Instance.OnRest();
            //激活成功后，打开分享
            if (hero.isShare) {
                ShareLogic.Instance.ShareHero(heroid);
            }
        }
        /** 通知客户端升级成功*/
        public C_ReqHeroLevelUp(buf) {
            Event.DispatchEvent("ReqHeroLevelUp");
        }

        public C_HeroLevelUp(buf) {
            let heroid = buf[0];
            let lvnum = buf[1];
            let herobase: HeroInfo = this._herolist[heroid];
            herobase.Level = lvnum;
            Event.DispatchEvent(EventDefine.MODIFYATTR, [heroid]);
        }

        /*** 通知客户端进阶成功 */
        public C_ReqHeroStarUp(buf) {
            let heroid = buf[0];
            let herostat = buf[1];
            let hero = this._herolist[heroid];
            hero.Star = herostat
            Event.DispatchEvent("ReqHeroStartUps");
            //调用方法 进阶
        }

        /** 主界面红点 */
        public HeroMainRed() {
            let herolist = HeroManager.Instance.GetCfgHeroList();
            for (let Idex = 0; Idex < herolist.length; Idex++) {

                let nheroID = herolist[Idex];
                let hero = this.GetHero(nheroID);
                if (!IsShieldRecharge()) {
                    if (this._peck_show && this._peck_icon) {
                        return true;
                    }
                }
                let IsActive = HeroManager.Instance.IsActive(nheroID);
                if (IsActive) {
                    let Red_star = HeroManager.Instance.HeroIsStar(nheroID);
                    if (Red_star) {
                        return true
                    }
                    let Red_lvup = HeroManager.Instance.HeroIsUp(nheroID);
                    if (Red_lvup) {
                        return true
                    }
                } else {
                    let Red_open = HeroManager.Instance.HeroIstrue(nheroID);
                    if (Red_open) {
                        return true
                    }
                }
            }
            let bool = HeroHandbookManager.Instance.Red_Show();
            return bool;
        }

        public OpenView(nHeroID: number) {
            if (UIManager.Instance.IsHave("Hero_AlInfo", ViewToppestRoot)) {
                UIManager.Instance.DestroyUI("Hero_AlInfo", [ViewToppestRoot])
            }
            UIManager.Instance.CreateUI("Hero_AlInfo", [ViewToppestRoot, nHeroID]);
        }

        /**My_money 自己的金币 ，need_mone需要的金币  判断等级不足时 金币数量的颜色  */
        public HeroUp_labelcolor(My_money: number, need_money) {
            let a = My_money >= need_money ? 1 : 2;
            return this.MoneyColor[a]
        }

        public MoneyColor = {
            1: "#75d888",
            2: "#ffa5a7" //hong
        }

        /**同一等级限制下能升级的最大等级 */
        public MaxLvUp(nHeroID: number, playlv: number): number {
            let hero = HeroManager.Instance.GetHero(nHeroID);
            let type = HeroConfig[nHeroID].type;
            let lv = HeroUpgrateConfig[type][hero.Level].needPlayerLv;
            if (playlv < lv) {
                return lv;
            }
            for (let Idex = hero.Level; Idex < Idex + 10; Idex++) {
                if (Idex > 300) return 300;
                let lock = HeroUpgrateConfig[type][Idex].needPlayerLv;
                if (playlv < lock) {
                    if (lv < lock) {
                        return Idex - 1;
                    }
                }
            }
        }

        /**现有金币下能升的级数 */
        public M_MaxLvup(nHeroID: number, play_money: number): number {
            let hero = HeroManager.Instance.GetHero(nHeroID);
            let type = HeroConfig[nHeroID].type;
            let nx = HeroConfig[nHeroID].heroRatio
            let lv = HeroUpgrateConfig[type][hero.Level].needPlayerLv;
            for (let Idex = hero.Level; Idex < Idex + 10; Idex++) {
                if (Idex > 300) return 300;
                let needMoney = HeroUpgrateConfig[type][Idex].ConsumeGold - HeroUpgrateConfig[type][hero.Level].ConsumeGold;
                needMoney = needMoney * nx;
                if (play_money < needMoney) {
                    return Idex - 1;
                }
            }
        }

        public Up_one(play_money, nType, lv, nowmoney, nx) {
            let a = HeroUpgrateConfig[nType][lv + 1].ConsumeGold - nowmoney;
            let money_label = (Math.floor(a * nx)).toString();
            let money_color = HeroManager.Instance.HeroUp_labelcolor(play_money, money_label)
            let str = GetHtmlStrByColor(money_label, money_color);
            return str;
        }

        public Base_one(nType, lv, nx, star) {
            let next_base = HeroUpgrateConfig[nType][lv + 1].Attr;
            let base = HeroUpgrateConfig[nType][lv];
            let addhp = next_base[1][2] - base.Attr[1][2];
            let addhurt = next_base[2][2] - base.Attr[2][2];
            let str_hp = "(↑" + (Math.floor((addhp * nx) * (star + 1))).toString() + ")";
            let str_hurt = "(↑" + (Math.floor((addhurt * nx) * (star + 1))).toString() + ")";
            return [str_hp, str_hurt];
        }

        /**激活英雄 */
        public OpenHero(nHeroID: number): void {
            let tCfg = HeroConfig[nHeroID];
            let needItem = tCfg.needItem;
            let needNum = tCfg.needNum;
            if (BagManager.Instance.getItemNumber(needItem) < needNum) {
                TipsLogic.Instance.OpenSystemTips("激活英雄所需材料不足！");
                return
            }
            this.K_ReqActivateHero(nHeroID);
        }

        public OpenShop(Pos: number) {
            Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
            if (Pos == 2) {
                OneTimer(500, () => {
                    Event.DispatchEvent("toGemShop");
                });
            }
        }

        public SortHero(arr: Array<number>, bool: boolean) {

            function tsort(left, right): number {
                let leftcan = false;//是否能够激活
                let leftActive = false;
                let rightcan = false;//是否已经激活
                let rightActive = false;
                leftActive = HeroManager.Instance.IsActive(left);//是否已经激活
                leftcan = HeroManager.Instance.HeroIstrue(left);
                let left_quality = HeroConfig[left].heroPosition;
                rightActive = HeroManager.Instance.IsActive(right);
                rightcan = HeroManager.Instance.HeroIstrue(right);
                let right_quality = HeroConfig[right].heroPosition;

                if (leftcan != rightcan) {
                    return leftcan ? -1 : 1
                }

                if (leftActive != rightActive) {
                    return leftActive ? -1 : 1;
                }
                //修改选角英雄的排序
                if(left == LoginLogic.Instance.profid){
                    left_quality = 1;
                }
                if(left == LoginLogic.Instance.secondid){
                    left_quality = 2;
                }
                if(left == LoginLogic.Instance.thirdid){
                    left_quality = 3;
                }
                if (left_quality && left_quality != right_quality) {
                    return left_quality < right_quality ? -1 : 1;
                }

                return left - right;
                //先排能够激活的
            }
            if (bool) {
                arr.sort(tsort);
            }
        }

        public StarColorurl = {
			0: "ui_icon/icon-weijihuo-jinjie-yingxiong.png",
			1: "ui_icon/icon-lan-jinjie-yingxiong.png",
			2: "ui_icon/icon-zi-jinjie-yingxiong.png",
			3: "ui_icon/icon-huang-jinjie-yingxiong.png",
			4: "ui_icon/icon-hong-jinjie-yingxiong.png",
		}

        public WarSort(a:Array<number>) {
			function tsort(a, b): number {
				let a_q = HeroConfig[a].quality;
				let b_q = HeroConfig[b].quality;
				if (a_q == b_q) {
					return a > b ? 1 : -1;
				}
				return a_q > b_q ? -1 : 1;
			}
			a.sort(tsort);
		}
    }
}