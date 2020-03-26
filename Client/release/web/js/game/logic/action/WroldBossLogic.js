/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**世界boss 数据管理 */
    var WroldBossLogic = /** @class */ (function () {
        function WroldBossLogic() {
            //{ [EquipType: number]: Array<AttrributeEquipment> }
            this.buff_arr = [];
            this._buff_list = [];
            this._reward_list = [];
            this._buff_buy = {};
            this._stop = false;
            this._show = true;
            /********************************************************* */
            this.Reward_labelcolor = {
                2: "#ffe562",
                3: "#d8d9e2",
            };
        }
        Object.defineProperty(WroldBossLogic, "Instance", {
            get: function () {
                if (WroldBossLogic._init == null) {
                    WroldBossLogic._init = new WroldBossLogic();
                }
                return WroldBossLogic._init;
            },
            enumerable: true,
            configurable: true
        });
        WroldBossLogic.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqChallengeBoss", this); //战斗回掉           
        };
        Object.defineProperty(WroldBossLogic.prototype, "StopFight", {
            get: function () {
                return this._stop;
            },
            set: function (value) {
                this._stop = value;
            },
            enumerable: true,
            configurable: true
        });
        /**发送请求 购买buff */
        WroldBossLogic.prototype.Buff_buy = function (type, shop_ID, item_num) {
            H52D_Framework.RemoteCall.Instance.Send("K_MarketBuyReq", type, shop_ID, item_num);
        };
        /**请求战斗 */
        WroldBossLogic.prototype.Fight = function () {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqChallengeBoss");
        };
        /**发送 战斗伤害 */
        WroldBossLogic.prototype.SendHrut = function () {
            var nDamage = H52D_Framework.BattleManager.Instance.TheWordBossDamage;
            H52D_Framework.RemoteCall.Instance.Send('K_ReqSendChallengeHarm', nDamage);
        };
        //-------------------------服务器消息--------------------//
        /**请求战斗回掉 */
        WroldBossLogic.prototype.C_ReqChallengeBoss = function (buf) {
            var data = buf[0];
            H52D_Framework.CustomsManager.Instance.EnterCustoms(30001);
            H52D_Framework.BattleManager.Instance.StopBattle();
            H52D_Framework.DropManager.Instance.Destroy();
            H52D_Framework.BattleManager.Instance.DestroyMonster();
            H52D_Framework.Event.DispatchEvent("StopClick", [false]);
            H52D_Framework.Event.DispatchEvent("ShowDeputy");
            H52D_Framework.UIManager.Instance.DestroyUI("WroldBossView", [H52D_Framework.ViewUpRoot]);
            if (H52D_Framework.UIManager.Instance.IsHave("GuidanceView", H52D_Framework.NewGuidRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("GuidanceView", [H52D_Framework.NewGuidRoot]);
            }
        };
        /**购买buff回调 */
        WroldBossLogic.prototype.ReqBuyBuff = function (type, id) {
            var buff_shop = H52D_Framework.MarketConfig[type][id];
            var Item_Id = buff_shop.sellContent[2];
            this._buff_buy[Item_Id] = 1;
            var Skill_Id = H52D_Framework.ItemConfig[Item_Id].dwUseEffect[1];
            var skill_Info = H52D_Framework.StatusConfig[Skill_Id].effectList;
            this.Buff_add(Skill_Id);
            //TipsLogic.Instance.OpenMessageBox("购买成功!");
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买成功!");
            H52D_Framework.Event.DispatchEvent("Update_bossbuffView");
        };
        Object.defineProperty(WroldBossLogic.prototype, "Show", {
            get: function () {
                return this._show;
            },
            set: function (value) {
                this._show = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WroldBossLogic.prototype, "Buff_List", {
            get: function () {
                return this._buff_list;
            },
            set: function (value) {
                this._buff_list = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WroldBossLogic.prototype, "Buff_Buy", {
            get: function () {
                return this._buff_buy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WroldBossLogic.prototype, "Reward_List", {
            set: function (value) {
                this._reward_list = value;
            },
            enumerable: true,
            configurable: true
        });
        /**buff列表数量 */
        WroldBossLogic.prototype.Buff_num = function () {
            var buff_list = H52D_Framework.MarketConfig[3];
            for (var key in buff_list) {
                var buff_id = Number(key);
                this._buff_list.push(buff_id);
            }
            return this._buff_list;
        };
        /**奖励列表数量 */
        WroldBossLogic.prototype.Reward_num = function () {
            var a = H52D_Framework.GameParamConfig.WorldBossReward;
            for (var key in H52D_Framework.GameParamConfig.WorldBossReward) {
                this._reward_list.push(Number(key));
            }
            return this._reward_list;
        };
        /**增加购买的buff相关属性 */
        WroldBossLogic.prototype.Buff_add = function (buf) {
            var buff_base = new H52D_Framework.Buff(buf, this);
            buff_base.Do();
            this.buff_arr.push(buff_base);
            if (H52D_Framework.BattleManager.Instance.aIOperation) {
                H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            }
        };
        /**卸载buff属性 */
        WroldBossLogic.prototype.Buff_Del = function () {
            for (var key = 0; key < this.buff_arr.length; key++) {
                var buff_base = new H52D_Framework.Buff(this.buff_arr[key].id, this);
                buff_base.Destroy();
            }
            this._buff_buy = [];
            this.buff_arr = [];
            if (H52D_Framework.BattleManager.Instance.aIOperation) {
                H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            }
        };
        /**获取需要的道具图片 */
        WroldBossLogic.prototype.Item_Info = function (type, item_Id) {
            var path_Icon;
            var path_Icon_bg;
            var item_quality;
            var item_name;
            var name_color;
            switch (type) {
                case 1:
                    path_Icon = "ui_icon/" + H52D_Framework.ItemConfig[item_Id].strIconID_B;
                    item_quality = H52D_Framework.ItemConfig[item_Id].dwItemQuality;
                    item_name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[item_Id].dwItemName);
                    path_Icon_bg = H52D_Framework.BaseDefine.QualityList[item_quality];
                    name_color = H52D_Framework.BaseDefine.LabelColor[item_quality];
                    break;
                case 2:
                    path_Icon = "ui_icon/" + H52D_Framework.EquipConfig[item_Id].equipIcon;
                    item_quality = H52D_Framework.EquipConfig[item_Id].equipColor;
                    item_name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.EquipConfig[item_Id].equipName);
                    path_Icon_bg = H52D_Framework.BaseDefine.QualityList[item_quality];
                    name_color = H52D_Framework.BaseDefine.LabelColor[item_quality];
                    break;
                case 3:
                    path_Icon = "ui_icon/" + H52D_Framework.HeroConfig[item_Id].strIcon;
                    item_quality = H52D_Framework.HeroConfig[item_Id].quality;
                    item_name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.HeroConfig[item_Id].name);
                    path_Icon_bg = H52D_Framework.BaseDefine.QualityList[item_quality];
                    name_color = H52D_Framework.BaseDefine.LabelColor[item_quality];
                    break;
                case 4:
                    path_Icon = "ui_icon/" + H52D_Framework.PetConfig[item_Id].strPetIcon;
                    item_quality = H52D_Framework.PetConfig[item_Id].petColor;
                    path_Icon_bg = H52D_Framework.BaseDefine.QualityList[item_quality];
                    item_name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PetConfig[item_Id].petName);
                    name_color = H52D_Framework.BaseDefine.LabelColor[item_quality];
                    break;
            }
            return [path_Icon, path_Icon_bg, item_name, name_color];
        };
        WroldBossLogic.prototype.View_Control = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss && this._show) {
                return false;
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                return true;
            }
        };
        WroldBossLogic.prototype.OpenView = function () {
            H52D_Framework.UIManager.Instance.CreateUI("WroldBossView", [H52D_Framework.ViewUpRoot]);
        };
        WroldBossLogic.prototype.ShowPrint = function () {
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel >= H52D_Framework.OpenGradeConfig[E_OpenGrade.BOSS].Checkpoint) {
                if (H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank) == 0 ||
                    H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank) == null) {
                    return true;
                }
            }
            return false;
        };
        return WroldBossLogic;
    }());
    H52D_Framework.WroldBossLogic = WroldBossLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=WroldBossLogic.js.map