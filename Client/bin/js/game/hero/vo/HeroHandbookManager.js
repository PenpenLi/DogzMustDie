var H52D_Framework;
(function (H52D_Framework) {
    var HeroHandbookManager = /** @class */ (function () {
        function HeroHandbookManager() {
            this.ViewName = {
                1: "SingleHandBookView",
                2: "MostHandBookView"
            };
            this._isTrue = true;
            /**图鉴信息s */
            this._handbookInfo_single = {};
            /**组合图鉴信息 */
            this._handbookInfo_team = {};
            this._hand_Single_Show = false;
            this._hand_Most_Show = false;
        }
        Object.defineProperty(HeroHandbookManager, "Instance", {
            get: function () {
                if (HeroHandbookManager._init == null) {
                    this._init = new HeroHandbookManager();
                }
                return this._init;
            },
            enumerable: true,
            configurable: true
        });
        HeroHandbookManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUpgeadeHandbook", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUpgeadeSuitHandbook", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendHandbookInfo", this);
        };
        Object.defineProperty(HeroHandbookManager.prototype, "IsTrue", {
            get: function () {
                return this._isTrue;
            },
            set: function (value) {
                this._isTrue = value;
            },
            enumerable: true,
            configurable: true
        });
        HeroHandbookManager.prototype.SortHandbook = function (bool, arr) {
            function tsort(left, right) {
                var left_bool = HeroHandbookManager.Instance.HandBookSingle_IsActive(left);
                var right_bool = HeroHandbookManager.Instance.HandBookSingle_IsActive(right);
                var left_IsCan = HeroHandbookManager.Instance.HandSingle_IsTrue(left);
                var right_IsCan = HeroHandbookManager.Instance.HandSingle_IsTrue(right);
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
        };
        /**图鉴是否激活 */
        HeroHandbookManager.prototype.HandBookSingle_IsActive = function (nItem_Id) {
            if (H52D_Framework.GetTabLength(this._handbookInfo_single) == 0) {
                return false;
            }
            var bool = this._handbookInfo_single[1][nItem_Id] > 0 ? true : false;
            return bool;
        };
        /**组合图鉴是否激活 */
        HeroHandbookManager.prototype.HandBookMoste_IsActive = function (nItem_Id) {
            if (H52D_Framework.GetTabLength(this._handbookInfo_team) == 0) {
                return false;
            }
            return this._handbookInfo_team[1][nItem_Id] ? true : false;
        };
        /**组合图鉴 数据 */
        HeroHandbookManager.prototype.MostHandBook = function () {
            var arr = [];
            for (var key in H52D_Framework.HandbookTeamConfig) {
                arr.push(Number(key));
            }
            return arr;
        };
        /** 所有单个图鉴的等级信息 */
        HeroHandbookManager.prototype.Active_HandBook = function () {
            var active_handbook = {};
            var arr_handbook = this.SinghandBook();
            for (var key in arr_handbook) {
                if (this.HandBookSingle_IsActive(arr_handbook[key])) {
                    var lv = this.GetHandBook_Lv(arr_handbook[key]);
                    active_handbook[arr_handbook[key]] = lv;
                }
            }
            return active_handbook;
        };
        /**所有组合图鉴的等级信息 */
        HeroHandbookManager.prototype.MostHandbookInfo = function () {
            var most_handbook = {};
            var most_handbooklist = this.MostHandBook();
            for (var key in most_handbooklist) {
                if (this.HandBookMoste_IsActive(most_handbooklist[key])) {
                    var lv = this.GetHandTeambook_lv(most_handbooklist[key]);
                    most_handbook[most_handbooklist[key]] = lv;
                }
            }
            return most_handbook;
        };
        /** 图鉴最大等级 */
        HeroHandbookManager.prototype.HandLvMax = function () {
            var maxlv = 0;
            for (var key in H52D_Framework.HandbookUpConfig) {
                maxlv = Number(key);
            }
            return maxlv;
        };
        /**单个图鉴 数据 */
        HeroHandbookManager.prototype.SinghandBook = function () {
            var arr = [];
            for (var key in H52D_Framework.RelationConfig) {
                arr.push(Number(key));
            }
            return arr;
        };
        /**获取单个图鉴的等级信息 */
        HeroHandbookManager.prototype.GetHandBook_Lv = function (hand_Id) {
            if (H52D_Framework.GetTabLength(this._handbookInfo_single) == 0) {
                return null;
            }
            return this._handbookInfo_single[1][hand_Id];
        };
        /**获取组合图鉴的等级信息 */
        HeroHandbookManager.prototype.GetHandTeambook_lv = function (hand_Id) {
            if (H52D_Framework.GetTabLength(this._handbookInfo_team) == 0) {
                return null;
            }
            return this._handbookInfo_team[1][hand_Id];
        };
        Object.defineProperty(HeroHandbookManager.prototype, "HandBookInfo_single", {
            /**所有单个图鉴 */
            get: function () {
                return this._handbookInfo_single;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroHandbookManager.prototype, "HandBookInfo_Team", {
            /**所有组合图鉴 */
            get: function () {
                return this._handbookInfo_team;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroHandbookManager.prototype, "HandSingleShow", {
            /**单个图鉴 红点控制 */
            get: function () {
                return this._hand_Single_Show;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroHandbookManager.prototype, "HandMostShow", {
            /**组合图鉴红点控制 */
            get: function () {
                return this._hand_Most_Show;
            },
            set: function (value) {
                this._hand_Most_Show = value;
            },
            enumerable: true,
            configurable: true
        });
        /**图鉴指定等级 信息s */
        HeroHandbookManager.prototype.HandUpInfo = function (Item_lv) {
            for (var key in H52D_Framework.HandbookUpConfig) {
                if (Number(key) == Item_lv) {
                    return H52D_Framework.HandbookUpConfig[key];
                }
            }
            return -1;
        };
        /**图鉴套装升级  增加属性  */
        HeroHandbookManager.prototype.HandTeamLvUp = function (Item_Id, lv) {
            var team_upInfo = {};
            for (var key in H52D_Framework.HandbookTeamConfig) {
                if (Number(key) == Item_Id) {
                    var up_Attritue = H52D_Framework.HandbookTeamConfig[key].UpAttritue;
                    var base_Attritue = H52D_Framework.HandbookTeamConfig[key].Attritue;
                    var a = up_Attritue[2][2] * lv + base_Attritue[2][2];
                    team_upInfo["lvup"] = up_Attritue;
                    team_upInfo["war"] = base_Attritue;
                    team_upInfo["base"] = [a];
                }
            }
            return team_upInfo;
        };
        /**单个图鉴是否可以激活  */
        HeroHandbookManager.prototype.HandSingle_IsTrue = function (Item_Id) {
            var n_tcfg = H52D_Framework.HandbookUpConfig[1];
            var needItem_num = n_tcfg.NeedItemNum;
            var playItem_num = H52D_Framework.BagManager.Instance.getItemNumber(Item_Id);
            return playItem_num >= needItem_num ? true : false;
        };
        /**单个图鉴是否可以升级 */
        HeroHandbookManager.prototype.HandSingle_IsUp = function (Item_Id, lv) {
            var bool_active = this.HandSingle_IsTrue(Item_Id);
            if (bool_active && lv < this.HandLvMax()) {
                lv += 1;
            }
            if (lv >= this.HandLvMax()) {
                lv = this.HandLvMax();
                return false;
            }
            var n_tcfg = H52D_Framework.HandbookUpConfig[lv];
            var needItem_num = n_tcfg.NeedItemNum;
            var playItem_num = H52D_Framework.BagManager.Instance.getItemNumber(Item_Id);
            return playItem_num >= needItem_num ? true : false;
        };
        /**判断组合图鉴 是否可以 激活  升级 */
        HeroHandbookManager.prototype.HandTeam_IsTrue = function (Item_Id) {
            var _Indx = 0;
            var Lv = this.GetHandTeambook_lv(Item_Id);
            var IsActive = this.HandBookMoste_IsActive(Item_Id);
            if (Lv >= this.HandLvMax()) {
                return false;
            }
            for (var key in H52D_Framework.HandbookTeamConfig) {
                if (Item_Id == Number(key)) {
                    var team_lv = this.GetHandTeambook_lv(Item_Id);
                    team_lv = team_lv == null ? 1 : team_lv;
                    var hand_singles = H52D_Framework.HandbookTeamConfig[key].HandbookTeam;
                    for (var uzi in hand_singles) {
                        var single_Id = hand_singles[uzi];
                        var single_lv = this.GetHandBook_Lv(single_Id);
                        var bool_1 = this.HandBookSingle_IsActive(single_Id);
                        if (!bool_1) {
                            single_lv = 0;
                        }
                        if (IsActive) {
                            if (single_lv <= team_lv) {
                                _Indx++;
                            }
                        }
                        else {
                            if (single_lv < team_lv) {
                                _Indx++;
                            }
                        }
                    }
                }
            }
            var bool = _Indx == 0 ? true : false;
            return bool;
        };
        HeroHandbookManager.prototype.GoView = function (Item_Id) {
            var _Id = H52D_Framework.LineConfig[Item_Id].param;
            var n_cfg = H52D_Framework.CopyConfig[H52D_Framework.MemoryType.equip][_Id];
            if (_Id <= H52D_Framework.MemoryLogic.Instance.GetCurDungeonIdx(H52D_Framework.MemoryType.equip)) {
                H52D_Framework.MemoryLogic.Instance.challengeData = n_cfg;
                H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
                H52D_Framework.MemoryLogic.Instance.ActivityInfo();
                H52D_Framework.UIManager.Instance.CreateUI("MemoryChallengeView", [H52D_Framework.ViewDownRoot]);
            }
            else {
                var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30068, H52D_Framework.GetInfoAttr.Instance.GetText(n_cfg.CopyName));
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
        };
        /**打开图鉴 */
        HeroHandbookManager.prototype.OpenHandBookView = function () {
            //ViewUILogic.Instance.halfPanel = false;
            HeroHandbookManager.Instance.IsTrue = false;
            H52D_Framework.UIManager.Instance.DestroyUI("MemoryView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.HERO]);
            H52D_Framework.Event.DispatchEvent("OpenHandView");
        };
        HeroHandbookManager.prototype.Red_Show = function () {
            var hand_single_num = 0;
            var hand_most_num = 0;
            for (var key in H52D_Framework.RelationConfig) {
                var item_Id = Number(key);
                var lv = this.GetHandBook_Lv(item_Id);
                lv = lv == null ? 1 : lv;
                var bool_active = this.HandBookSingle_IsActive(item_Id); //是否激活
                var bool_canActive = this.HandSingle_IsTrue(item_Id); //能否激活
                var bool_lvup = this.HandSingle_IsUp(item_Id, lv);
                this._hand_Single_Show = !bool_active || bool_lvup;
                this._hand_Single_Show = bool_active ? bool_lvup : bool_canActive;
                if (this._hand_Single_Show) {
                    hand_single_num++;
                }
            }
            for (var jk in H52D_Framework.HandbookTeamConfig) {
                var Item_Id = Number(jk);
                this._hand_Most_Show = this.HandTeam_IsTrue(Item_Id);
                if (this._hand_Most_Show) {
                    hand_most_num++;
                }
            }
            this._hand_Single_Show = hand_single_num > 0 ? true : false;
            this._hand_Most_Show = hand_most_num > 0 ? true : false;
            return this._hand_Most_Show || this._hand_Single_Show;
        };
        /*********************************** */
        /**请求升级 激活 单个图鉴 */
        HeroHandbookManager.prototype.K_ReqUpgeadeHandbook = function (Item_Id) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqUpgeadeHandbook", HandBookType.eHeroType, Item_Id);
        };
        /**请求升级 激活 组合图鉴 */
        HeroHandbookManager.prototype.K_ReqUpgeadeSuitHandbook = function (Item_Id) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqUpgeadeSuitHandbook", HandBookType.eHeroType, Item_Id);
        };
        ////---------------------------------------------------///
        /**请求升级 激活 单个图鉴回掉 */
        HeroHandbookManager.prototype.C_ReqUpgeadeHandbook = function (buf) {
            if (this._handbookInfo_single[buf[0]] == null) {
                this._handbookInfo_single[buf[0]] = {};
            }
            var Name_Id = H52D_Framework.RelationConfig[buf[1]].HandbookName;
            var name = H52D_Framework.GetInfoAttr.Instance.GetText(Name_Id);
            this._handbookInfo_single[buf[0]][buf[1]] = buf[2];
            var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30066, name);
            if (buf[2] > 1) {
                str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30067);
            }
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            var Hero_Id = H52D_Framework.RelationConfig[buf[1]].HeroId;
            var attr_Tab = H52D_Framework.HandbookUpConfig[buf[2]].AddAttribute;
            H52D_Framework.MHAManager.Instance.Add(Hero_Id, attr_Tab);
            //
            H52D_Framework.Event.DispatchEvent("Rest_handbook_single");
            H52D_Framework.Event.DispatchEvent("reshhandviewred");
            H52D_Framework.Event.DispatchEvent("UpdateRedPoint");
        };
        /**请求升级 激活 组合图鉴回掉 */
        HeroHandbookManager.prototype.C_ReqUpgeadeSuitHandbook = function (buf) {
            if (this._handbookInfo_team[buf[0]] == null) {
                this._handbookInfo_team[buf[0]] = {};
            }
            this._handbookInfo_team[buf[0]][buf[1]] = buf[2];
            var Name_Id = H52D_Framework.HandbookTeamConfig[buf[1]].SuitName;
            var name = H52D_Framework.GetInfoAttr.Instance.GetText(Name_Id);
            var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30066, name);
            if (buf[2] > 1) {
                str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30067);
            }
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            H52D_Framework.Event.DispatchEvent("Rest_handbook_most");
            H52D_Framework.Event.DispatchEvent("reshhandviewred");
            H52D_Framework.Event.DispatchEvent("UpdateRedPoint");
            this.HandBookMoreAttribute(buf);
        };
        HeroHandbookManager.prototype.HandBookMoreAttribute = function (buf) {
            var Loc = H52D_Framework.HandbookTeamConfig[buf[1]].AttackStation;
            var attr = H52D_Framework.HandbookTeamConfig[buf[1]].Attritue;
            var upattr = H52D_Framework.HandbookTeamConfig[buf[1]].UpAttritue;
            var Sum = attr;
            if (buf[2] >= 2) {
                var up = this.AddUpdateAttribute(buf[2] - 1, upattr);
                Sum = this.AttributeAdd(attr, up);
            }
            H52D_Framework.MHAManager.Instance.AddArrary(Loc, Sum, buf[1]);
        };
        HeroHandbookManager.prototype.AddUpdateAttribute = function (index, UpAttr) {
            if (index <= 0)
                return UpAttr;
            var Odd = new Object();
            for (var k in UpAttr) {
                var modfiy = UpAttr[k][2] * index;
                Odd[k] = { 1: UpAttr[k][1], 2: modfiy };
            }
            return Odd;
        };
        HeroHandbookManager.prototype.AttributeAdd = function (first, second) {
            var Odd = new Object();
            for (var k in second) {
                var sAttr = second[k];
                var fAttr = first[k];
                var id = sAttr[1];
                var svalue = sAttr[2];
                var fvalue = fAttr[2];
                var modfiy = svalue + fvalue;
                Odd[k] = { 1: id, 2: modfiy };
            }
            return Odd;
        };
        /**上线同步 */
        HeroHandbookManager.prototype.C_SendHandbookInfo = function (buf) {
            this._handbookInfo_single = buf[0];
            ;
            this._handbookInfo_team = buf[1];
        };
        return HeroHandbookManager;
    }());
    H52D_Framework.HeroHandbookManager = HeroHandbookManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroHandbookManager.js.map