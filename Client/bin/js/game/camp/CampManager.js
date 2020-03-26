/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var CampManager = /** @class */ (function () {
        function CampManager() {
            /***所有的阵营信息 */
            this.camp_List = {};
            this.camp_Id = [];
            this.Play_List = {};
            this._LogList = []; //捐献信息
            this.bool = true;
            this._bool = true;
            this._OtherPlay_Info = [];
            this.Campview_list = {
                0: "CampDonateView",
                1: "CampInfoView",
                2: "CampMainInfo",
                3: "CampMemberView",
                4: "CampPlayInfo",
                5: "CampRankView",
                6: "CampView",
                7: "JoinCampTip",
                8: "ReplaceCampView",
                9: "ReplaceTipView",
            };
            this.camp_info = [];
            this.camplist = [];
            /**设定 关闭一次后 不再打开  再次登陆重置 */
            this.bShowFlag = true;
            for (var campid in H52D_Framework.GangConfig) {
                var nId = Number(campid);
                this.camp_Id.push(nId);
            }
        }
        Object.defineProperty(CampManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new CampManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        CampManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddGuild", this); //请求加入阵营
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildList", this); //请求阵营列表  C_WinDungeons
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildPlayerList", this); //请求阵营成员信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddGuildLog", this); //请求阵营日志
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqContribution", this); //捐献
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqObserverInfo", this); //他人信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildInfo", this); //获取本公会信息			
            this.Play_List = {};
            this.OpenCond();
        };
        CampManager.prototype.OpenCond = function () {
            this.openlv = H52D_Framework.OpenGradeConfig[9].Checkpoint;
        };
        Object.defineProperty(CampManager.prototype, "camp_Info", {
            get: function () {
                return this.camp_info;
            },
            set: function (value) {
                this.camp_info = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "Bool", {
            get: function () {
                return this.bool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "Camp_PlayInfO", {
            /**获取阵营中的玩家信息 */
            get: function () {
                return this.Play_List;
            },
            enumerable: true,
            configurable: true
        });
        /**zhe */
        CampManager.prototype.Camp_LvMax = function () {
            var lv = 0;
            for (var key in H52D_Framework.GangLevelUpConfig) {
                var MaxLv = Number(key);
                if (lv < MaxLv) {
                    lv = MaxLv;
                }
                else {
                    return lv;
                }
            }
            return lv;
        };
        CampManager.prototype.Camp_sort = function () {
            for (var key in this.camp_List) {
                var camp = this.camp_List[key];
                this.camp_info.push(camp);
            }
            //return this.camp_info;
        };
        CampManager.prototype.campList = function () {
            for (var key in CampManager.Instance.CampList) {
                var Indx = Number(key);
                this.camplist.push(Indx);
            }
        };
        Object.defineProperty(CampManager.prototype, "CampHot", {
            /**当前阵营热度 */
            get: function () {
                return this._camp_hot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "PlayRank", {
            get: function () {
                return this.my_rank;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "LogList", {
            /**获取阵营日志信息 */
            get: function () {
                return this._LogList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "OntherPlatInfo", {
            /**他人信息 */
            get: function () {
                return this._OtherPlay_Info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CampManager.prototype, "CampList", {
            /**阵营列表 */
            get: function () {
                return this.camp_List;
            },
            set: function (list) {
                this.camp_List = list;
            },
            enumerable: true,
            configurable: true
        });
        /**获取指定的阵营 */
        CampManager.prototype.nCamp = function (ncampid) {
            return this.camp_List[ncampid];
        };
        Object.defineProperty(CampManager.prototype, "CampId", {
            /**阵营id */
            get: function () {
                return this.camp_Id;
            },
            enumerable: true,
            configurable: true
        });
        /**发送消息给服务器 请求当前阵营信息 */
        CampManager.prototype.Camp_Info = function () {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGuildInfo");
        };
        /**发送消息给服务器 请求加入阵营 */
        CampManager.prototype.Camp_Jion = function (campId) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqAddGuild", campId);
        };
        /**发送消息给服务器 请求阵营列表 */
        CampManager.prototype.GetCamp_List = function () {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGuildList");
        };
        /**请求阵营成员列表 */
        CampManager.prototype.GetCampPlayInfo = function (campID) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGuildPlayerList", campID);
        };
        /**发送消息  获取玩家的捐献次数 */
        CampManager.prototype.Donate_times = function (itemId) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqContribution", itemId);
        };
        /**请求查看他人信息  */
        CampManager.prototype.n_Play = function (play_Id) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqObserverInfo", play_Id);
        };
        /**接受他人信息 */
        CampManager.prototype.C_ReqObserverInfo = function (buf) {
            this._OtherPlay_Info = buf[0];
        };
        /**捐献成功 */
        CampManager.prototype.C_ReqContribution = function (buf) {
            var nType = buf[0];
            var campInfo = buf[1];
            var camp_Id = campInfo[1];
            this.camp_List[camp_Id] = campInfo;
            this._camp_hot = campInfo[4];
            H52D_Framework.MasterPlayer.Instance.player.Donatetimes[nType] += 1;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("捐献成功！");
            H52D_Framework.Event.DispatchEvent("changetimes");
        };
        /**阵营日志信息 */
        CampManager.prototype.C_AddGuildLog = function (buf) {
            var info = [buf[0], buf[1]];
            this._LogList.push(info);
            H52D_Framework.Event.DispatchEvent("updatecamplist");
        };
        /**通知客户端 加入阵营成功 */
        CampManager.prototype.C_ReqAddGuild = function (buf) {
            var campid = buf[0];
            var campInfo = buf[1];
            var old_Id = H52D_Framework.MasterPlayer.Instance.player.CampID;
            H52D_Framework.MasterPlayer.Instance.player.CampID = campid;
            this.camp_List[campid] = campInfo;
            if (old_Id != 0) {
                H52D_Framework.Event.DispatchEvent("ReqchangeCamp");
                this._LogList = [];
                this._camp_hot = 0;
            }
            else {
                H52D_Framework.Event.DispatchEvent("C_ReqAddCamp");
            }
            H52D_Framework.BCampManager.Instance.LoadBCamp();
        };
        /**获取玩家成员列表 */
        CampManager.prototype.C_ReqGuildPlayerList = function (buf) {
            this.Play_List = {};
            var camp_ID = buf[0];
            var nData = buf[1];
            this.my_rank = buf[2];
            this.Play_List = nData;
        };
        Object.defineProperty(CampManager.prototype, "BShowFlag", {
            get: function () {
                return this.bShowFlag;
            },
            set: function (bool) {
                this.bShowFlag = bool;
            },
            enumerable: true,
            configurable: true
        });
        /**满足条件 弹出阵营面板 */
        CampManager.prototype.Add_camp = function () {
            if (H52D_Framework.UIManager.Instance.IsHave("CampView", H52D_Framework.ViewUpRoot)) {
                return;
            }
            //CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true)	
            var bool = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp);
            var customsOrder = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
            if (H52D_Framework.MasterPlayer.Instance.player.CampID == 0) {
                if (customsOrder >= this.openlv) {
                    if (!bool) {
                        //UIManager.Instance.CreateUI("JoinCampTip", [ViewUpRoot]);
                    }
                }
            }
        };
        /** 通知客户端  请求阵营列表 */
        CampManager.prototype.C_ReqGuildList = function (buf) {
            this.camp_List = buf[0];
            H52D_Framework.Event.DispatchEvent("C_ReqGuildList");
        };
        /** 获取当前阵营信息 */
        CampManager.prototype.C_ReqGuildInfo = function (buf) {
            var info = buf[0];
            var camp_Id = info[1];
            this.camp_List[camp_Id] = info;
            H52D_Framework.Event.DispatchEvent("chengehot");
        };
        CampManager.prototype.SortCamp = function (camp_Info) {
            function C_sort(up, down) {
                var hot_up = up[4]; //热度
                var hot_down = down[4]; //id 人数 等级 贡献值 
                if (up[3] == down[3]) {
                    if (up[2] == down[2]) {
                        if (up[4] == down[4]) {
                            return up[1] > down[1] ? -1 : 1;
                        }
                        return up[4] > down[4] ? -1 : 1;
                    }
                    return up[2] > down[2] ? -1 : 1; //根据阵营人数排行
                }
                return up[3] > down[3] ? -1 : 1;
            }
            camp_Info.sort(C_sort);
            return camp_Info;
        };
        /**红点显示 */
        CampManager.prototype.ShowRed = function (D_red) {
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel < this.openlv) {
                return false;
            }
            var n_tcfg = H52D_Framework.GangDonateConfig[1];
            if (!H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1]) {
                H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1] = 0;
            }
            var image = H52D_Framework.ViewUILogic.Instance.CampRed;
            var tiems = n_tcfg.num - H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1];
            var item = n_tcfg.consume;
            var itemId = item[1];
            var play_itemNum = H52D_Framework.BagManager.Instance.getItemNumber(itemId);
            if (tiems > 0 && play_itemNum > n_tcfg.consume[1]) {
                return D_red.visible = image.visible = true;
            }
            else {
                return D_red.visible = image.visible = false;
            }
        };
        CampManager.prototype.logInfo = function (info) {
            var str = "";
            var type = info[0];
            var date = info[1];
            switch (type) {
                case 1:
                    str = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(6020), H52D_Framework.GetHtmlStrByColor("【" + date[1] + "】", "#e6fefe"));
                    break;
                case 2:
                    str = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(6022), H52D_Framework.GetHtmlStrByColor("【" + date[1] + "】", "#e6fefe"));
                    break;
                case 3:
                    var name_1 = date[1];
                    var itemType = date[2];
                    var cfg = H52D_Framework.GangDonateConfig[itemType];
                    var n_tcfg = cfg.consume;
                    var n_heat = cfg.heat;
                    var itemName = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[n_tcfg[1]].dwItemName);
                    var itemNumber = n_tcfg[2];
                    str = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(6021), H52D_Framework.GetHtmlStrByColor("【" + name_1 + "】", "#e6fefe"), itemNumber, itemName, n_heat);
                    break;
            }
            return str;
        };
        return CampManager;
    }());
    H52D_Framework.CampManager = CampManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampManager.js.map