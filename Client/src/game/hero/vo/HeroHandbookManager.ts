module H52D_Framework {
    export class HeroHandbookManager {
        constructor() {

        }
        private static _init: HeroHandbookManager;
        public static get Instance(): HeroHandbookManager {
            if (HeroHandbookManager._init == null) {
                this._init = new HeroHandbookManager();
            }
            return this._init;
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUpgeadeHandbook", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUpgeadeSuitHandbook", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendHandbookInfo", this);
        }

        public ViewName = {
            1: "SingleHandBookView",
            2: "MostHandBookView"
        }

        private _isTrue: boolean = true;
        /**图鉴信息s */
        private _handbookInfo_single: { [etype: number]: { [hand_Id: number]: number } } = {};
        /**组合图鉴信息 */
        private _handbookInfo_team: { [etype: number]: { [hand_Id: number]: number } } = {};

        private _hand_Single_Show: boolean = false;

        private _hand_Most_Show: boolean = false;

        public get IsTrue() {
            return this._isTrue;
        }

        public set IsTrue(value) {
            this._isTrue = value;
        }

        public SortHandbook(bool: boolean, arr: Array<number>) {
            function tsort(left, right): number {
                let left_bool = HeroHandbookManager.Instance.HandBookSingle_IsActive(left);
                let right_bool = HeroHandbookManager.Instance.HandBookSingle_IsActive(right);

                let left_IsCan = HeroHandbookManager.Instance.HandSingle_IsTrue(left)
                let right_IsCan = HeroHandbookManager.Instance.HandSingle_IsTrue(right);

                if (left_IsCan != right_IsCan) {
                    return left_IsCan ? -1 : 1;
                }
                if (left_bool != right_bool) {
                    return left_bool ? 1 : -1;
                }
                return left - right;
            }
            if (bool) {
                arr.sort(tsort);                
            }
        }

        /**图鉴是否激活 */
        public HandBookSingle_IsActive(nItem_Id: number) {
            if (GetTabLength(this._handbookInfo_single) == 0) {
                return false;
            }
            let bool = this._handbookInfo_single[1][nItem_Id] > 0 ? true : false;
            return bool;
        }

        /**组合图鉴是否激活 */
        public HandBookMoste_IsActive(nItem_Id: number) {
            if (GetTabLength(this._handbookInfo_team) == 0) {
                return false;
            }
            return this._handbookInfo_team[1][nItem_Id] ? true : false;
        }

        /**组合图鉴 数据 */
        public MostHandBook() {
            let arr: Array<number> = [];
            for (let key in HandbookTeamConfig) {
                arr.push(Number(key));
            }
            return arr;
        }

        /** 所有单个图鉴的等级信息 */
        public Active_HandBook() {
            let active_handbook: { [handId: number]: number } = {};
            let arr_handbook = this.SinghandBook();
            for (let key in arr_handbook) {
                if (this.HandBookSingle_IsActive(arr_handbook[key])) {
                    let lv = this.GetHandBook_Lv(arr_handbook[key]);
                    active_handbook[arr_handbook[key]] = lv;
                }
            }
            return active_handbook;
        }

        /**所有组合图鉴的等级信息 */
        public MostHandbookInfo() {
            let most_handbook: { [handId: number]: number } = {};
            let most_handbooklist = this.MostHandBook();
            for (let key in most_handbooklist) {
                if (this.HandBookMoste_IsActive(most_handbooklist[key])) {
                    let lv = this.GetHandTeambook_lv(most_handbooklist[key])
                    most_handbook[most_handbooklist[key]] = lv;
                }

            }
            return most_handbook;
        }

        /** 图鉴最大等级 */
        public HandLvMax() {
            let maxlv = 0;
            for (let key in HandbookUpConfig) {
                maxlv = Number(key);
            }
            return maxlv;
        }

        /**单个图鉴 数据 */
        public SinghandBook() {
            let arr: Array<number> = [];
            for (let key in RelationConfig) {
                arr.push(Number(key));
            }
            return arr;
        }

        /**获取单个图鉴的等级信息 */
        public GetHandBook_Lv(hand_Id: number) {
            if (GetTabLength(this._handbookInfo_single) == 0) {
                return null;
            }
            return this._handbookInfo_single[1][hand_Id];
        }

        /**获取组合图鉴的等级信息 */
        public GetHandTeambook_lv(hand_Id: number) {
            if (GetTabLength(this._handbookInfo_team) == 0) {
                return null;
            }
            return this._handbookInfo_team[1][hand_Id];
        }

        /**所有单个图鉴 */
        public get HandBookInfo_single() {
            return this._handbookInfo_single;
        }

        /**所有组合图鉴 */
        public get HandBookInfo_Team() {
            return this._handbookInfo_team;
        }

        /**单个图鉴 红点控制 */
        public get HandSingleShow() {
            return this._hand_Single_Show;
        }

        /**组合图鉴红点控制 */
        public get HandMostShow() {
            return this._hand_Most_Show;
        }

        public set HandMostShow(value) {
            this._hand_Most_Show = value;
        }

        /**图鉴指定等级 信息s */
        public HandUpInfo(Item_lv: number) {
            for (let key in HandbookUpConfig) {
                if (Number(key) == Item_lv) {
                    return HandbookUpConfig[key]
                }
            }
            return -1;
        }

        /**图鉴套装升级  增加属性  */
        public HandTeamLvUp(Item_Id: number, lv: number) {
            let team_upInfo: { [name: string]: Array<number> } = {};
            for (let key in HandbookTeamConfig) {
                if (Number(key) == Item_Id) {
                    let up_Attritue = HandbookTeamConfig[key].UpAttritue;
                    let base_Attritue = HandbookTeamConfig[key].Attritue;
                    let a = up_Attritue[2][2] * lv + base_Attritue[2][2];
                    team_upInfo["lvup"] = up_Attritue;
                    team_upInfo["war"] = base_Attritue;
                    team_upInfo["base"] = [a];
                }
            }
            return team_upInfo
        }

        /**单个图鉴是否可以激活  */
        public HandSingle_IsTrue(Item_Id: number) {
            let n_tcfg = HandbookUpConfig[1];
            let needItem_num = n_tcfg.NeedItemNum;
            let playItem_num = BagManager.Instance.getItemNumber(Item_Id);
            return playItem_num >= needItem_num ? true : false;
        }

        /**单个图鉴是否可以升级 */
        public HandSingle_IsUp(Item_Id: number, lv: number) {
            let bool_active = this.HandSingle_IsTrue(Item_Id);
            if (bool_active && lv < this.HandLvMax()) {
                lv += 1;
            }
            if (lv >= this.HandLvMax()) {
                lv = this.HandLvMax();
                return false;
            }
            let n_tcfg = HandbookUpConfig[lv];
            let needItem_num = n_tcfg.NeedItemNum;
            let playItem_num = BagManager.Instance.getItemNumber(Item_Id);
            return playItem_num >= needItem_num ? true : false;
        }

        /**判断组合图鉴 是否可以 激活  升级 */
        public HandTeam_IsTrue(Item_Id: number): boolean {
            let _Indx: number = 0;
            let Lv = this.GetHandTeambook_lv(Item_Id);
            let IsActive = this.HandBookMoste_IsActive(Item_Id);
            if (Lv >= this.HandLvMax()) {
                return false;
            }
            for (let key in HandbookTeamConfig) {
                if (Item_Id == Number(key)) {
                    let team_lv = this.GetHandTeambook_lv(Item_Id);
                    team_lv = team_lv == null ? 1 : team_lv;
                    let hand_singles = HandbookTeamConfig[key].HandbookTeam
                    for (let uzi in hand_singles) {
                        let single_Id = hand_singles[uzi];
                        let single_lv = this.GetHandBook_Lv(single_Id);
                        let bool = this.HandBookSingle_IsActive(single_Id)
                        if (!bool) {
                            single_lv = 0;
                        }
                        if (IsActive) {
                            if (single_lv <= team_lv) {
                                _Indx++;
                            }
                        } else {
                            if (single_lv < team_lv) {
                                _Indx++;
                            }
                        }
                    }
                }
            }
            let bool: boolean = _Indx == 0 ? true : false;
            return bool;
        }

        public GoView(Item_Id: number) {
            let _Id = LineConfig[Item_Id].param;
            let n_cfg = CopyConfig[MemoryType.equip][_Id];
            if (_Id <= MemoryLogic.Instance.GetCurDungeonIdx(MemoryType.equip)) {
                MemoryLogic.Instance.challengeData = n_cfg;
                ViewUILogic.Instance.halfPanel = false;
                Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
                MemoryLogic.Instance.ActivityInfo();
                UIManager.Instance.CreateUI("MemoryChallengeView", [ViewDownRoot]);
            } else {
                let str = GetInfoAttr.Instance.GetSystemText(30068, GetInfoAttr.Instance.GetText(n_cfg.CopyName));
                TipsLogic.Instance.OpenSystemTips(str);
            }
        }

        /**打开图鉴 */
        public OpenHandBookView() {
            //ViewUILogic.Instance.halfPanel = false;
            HeroHandbookManager.Instance.IsTrue = false;
            UIManager.Instance.DestroyUI("MemoryView", [ViewDownRoot]);
            Event.DispatchEvent("OnPanelClick", [E_OpenGrade.HERO]);
            Event.DispatchEvent("OpenHandView");
        }

        public Red_Show() {
            let hand_single_num = 0;
            let hand_most_num = 0;
            for (let key in RelationConfig) {
                let item_Id: number = Number(key)
                let lv = this.GetHandBook_Lv(item_Id)
                lv = lv == null ? 1 : lv;
                let bool_active = this.HandBookSingle_IsActive(item_Id);//是否激活
                let bool_canActive = this.HandSingle_IsTrue(item_Id);//能否激活
                let bool_lvup = this.HandSingle_IsUp(item_Id, lv);
                this._hand_Single_Show = !bool_active || bool_lvup;
                this._hand_Single_Show = bool_active ? bool_lvup : bool_canActive;
                if (this._hand_Single_Show) {
                    hand_single_num++;
                }
            }
            for (let jk in HandbookTeamConfig) {
                let Item_Id = Number(jk);
                this._hand_Most_Show = this.HandTeam_IsTrue(Item_Id);
                if (this._hand_Most_Show) {
                    hand_most_num++;
                }
            }
            this._hand_Single_Show = hand_single_num > 0 ? true : false;
            this._hand_Most_Show = hand_most_num > 0 ? true : false;
            return this._hand_Most_Show || this._hand_Single_Show;
        }

        /*********************************** */

        /**请求升级 激活 单个图鉴 */
        public K_ReqUpgeadeHandbook(Item_Id: number) {
            RemoteCall.Instance.Send("K_ReqUpgeadeHandbook", HandBookType.eHeroType, Item_Id);
        }

        /**请求升级 激活 组合图鉴 */
        public K_ReqUpgeadeSuitHandbook(Item_Id: number) {
            RemoteCall.Instance.Send("K_ReqUpgeadeSuitHandbook", HandBookType.eHeroType, Item_Id);
        }

        ////---------------------------------------------------///

        /**请求升级 激活 单个图鉴回掉 */
        private C_ReqUpgeadeHandbook(buf) {
            if (this._handbookInfo_single[buf[0]] == null) {
                this._handbookInfo_single[buf[0]] = {}
            }
            let Name_Id = RelationConfig[buf[1]].HandbookName;
            let name = GetInfoAttr.Instance.GetText(Name_Id);
            this._handbookInfo_single[buf[0]][buf[1]] = buf[2];
            let str = GetInfoAttr.Instance.GetSystemText(30066, name);
            if (buf[2] > 1) {
                str = GetInfoAttr.Instance.GetSystemText(30067)
            }
            TipsLogic.Instance.OpenSystemTips(str);
            let Hero_Id = RelationConfig[buf[1]].HeroId;
            let attr_Tab = HandbookUpConfig[buf[2]].AddAttribute;
            MHAManager.Instance.Add(Hero_Id, attr_Tab);
            //
            Event.DispatchEvent("Rest_handbook_single");
            Event.DispatchEvent("reshhandviewred");
            Event.DispatchEvent("UpdateRedPoint");
        }

        /**请求升级 激活 组合图鉴回掉 */
        private C_ReqUpgeadeSuitHandbook(buf) {
            if (this._handbookInfo_team[buf[0]] == null) {
                this._handbookInfo_team[buf[0]] = {}
            }
            this._handbookInfo_team[buf[0]][buf[1]] = buf[2];
            let Name_Id = HandbookTeamConfig[buf[1]].SuitName;
            let name = GetInfoAttr.Instance.GetText(Name_Id);
            let str = GetInfoAttr.Instance.GetSystemText(30066, name)
            if (buf[2] > 1) {
                str = GetInfoAttr.Instance.GetSystemText(30067);
            }
            TipsLogic.Instance.OpenSystemTips(str);
            Event.DispatchEvent("Rest_handbook_most");
            Event.DispatchEvent("reshhandviewred");
            Event.DispatchEvent("UpdateRedPoint");
            this.HandBookMoreAttribute(buf);
        }

        private HandBookMoreAttribute(buf) {
            let Loc = HandbookTeamConfig[buf[1]].AttackStation;
            let attr = HandbookTeamConfig[buf[1]].Attritue;
            let upattr = HandbookTeamConfig[buf[1]].UpAttritue;
            let Sum = attr;
            if (buf[2] >= 2) {
                let up = this.AddUpdateAttribute(buf[2] - 1, upattr);
                Sum = this.AttributeAdd(attr, up);
            }
            MHAManager.Instance.AddArrary(Loc, Sum, buf[1]);
        }

        private AddUpdateAttribute(index, UpAttr) {
            if (index <= 0) return UpAttr;
            let Odd = new Object();
            for (let k in UpAttr) {
                let modfiy = UpAttr[k][2] * index;
                Odd[k] = { 1: UpAttr[k][1], 2: modfiy }
            }
            return Odd;
        }

        private AttributeAdd(first, second) {
            let Odd = new Object();
            for (let k in second) {
                let sAttr = second[k];
                let fAttr = first[k];
                let id = sAttr[1];
                let svalue = sAttr[2];
                let fvalue = fAttr[2];
                let modfiy = svalue + fvalue;
                Odd[k] = { 1: id, 2: modfiy }
            }
            return Odd;
        }

        /**上线同步 */
        private C_SendHandbookInfo(buf) {
            this._handbookInfo_single = buf[0];;
            this._handbookInfo_team = buf[1];
        }
    }
}
