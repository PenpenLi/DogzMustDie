var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("MostHandBookView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MostHandBookView = /** @class */ (function (_super) {
        __extends(MostHandBookView, _super);
        function MostHandBookView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            return _this;
        }
        MostHandBookView.prototype.ViewInit = function () {
            this.mosthanbook.vScrollBarSkin = "";
            this.ViewEvet();
            this.SetMostHandbook_list();
            this.ChangeListHigth();
        };
        MostHandBookView.prototype.ViewEvet = function () {
            H52D_Framework.Event.RegistEvent("Rest_handbook_most", Laya.Handler.create(this, this.SetMostHandbook_list));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
        };
        MostHandBookView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                if (this.destroyed)
                    return;
                this.mosthanbook.height = 160 * G_StageHeightScale;
            }
            else {
                this.mosthanbook.height = (960 - wxsclae) * G_StageHeightScale;
            }
        };
        MostHandBookView.prototype.SetMostHandbook_list = function () {
            this.mosthanbook.array = H52D_Framework.HeroHandbookManager.Instance.MostHandBook();
            this.mosthanbook.renderHandler = new Laya.Handler(this, this.MostHandbook_line);
        };
        MostHandBookView.prototype.MostHandbook_line = function (item, index) {
            var Team_Id = this.mosthanbook.array[index];
            var Team_cfg = H52D_Framework.HandbookTeamConfig[Team_Id];
            var n_active = H52D_Framework.HeroHandbookManager.Instance.HandBookMoste_IsActive(Team_Id);
            var lv = H52D_Framework.HeroHandbookManager.Instance.GetHandTeambook_lv(Team_Id);
            var Teamhand_name = item.getChildByName("mosthand_name");
            var Teamhand_lock = item.getChildByName("mosthand_lock");
            var Btn_active = item.getChildByName("Btn_lvup");
            var now = item.getChildByName("mostbase_now");
            var next = item.getChildByName("mostbase_next");
            var jiantou = item.getChildByName("jiantou");
            var lv_max = item.getChildByName("lv_max");
            var img_4 = item.getChildByName("mosthand_4");
            var img_5 = item.getChildByName("mosthand_5");
            img_4.visible = img_5.visible = false;
            lv = lv == null ? 1 : lv;
            Teamhand_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(Team_cfg.SuitName);
            var war_pos = Team_cfg.AttackStation;
            var posInfo = "";
            if (H52D_Framework.GetTabLength(war_pos) > 1) {
                posInfo = war_pos[1] + "号、" + war_pos[2] + "号";
                jiantou.x = 328;
            }
            else {
                posInfo = war_pos[1] + "号";
                jiantou.x = 298;
            }
            var a = posInfo + "阵位英雄";
            var bool = H52D_Framework.HeroHandbookManager.Instance.HandTeam_IsTrue(Team_Id);
            if (n_active) {
                Teamhand_lock.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7145, lv + 1);
                Btn_active.label = "升级";
                for (var key in Team_cfg.Attritue) {
                    var Attritue_now = now.getChildByName("Attritue_" + key);
                    var Attritue_next = next.getChildByName("Attritue_" + key);
                    var Attritue_arr_now = H52D_Framework.HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv);
                    var Attritue_arr_next = H52D_Framework.HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv + 1);
                    var new_info = a + H52D_Framework.GetInfoAttr.Instance.GetText(Attritue_arr_now["war"][key][1]);
                    var war_base = Attritue_arr_now["base"][0] - 100;
                    Attritue_now.text = new_info + ":" + war_base / 100 + "%";
                    Attritue_next.text = (Attritue_arr_next["base"][0] / 100) - 1 + "%";
                    if (lv_max.visible || H52D_Framework.HeroHandbookManager.Instance.HandLvMax() <= lv) {
                        Attritue_next.text = "";
                    }
                }
            }
            else {
                Btn_active.label = "激活";
                Teamhand_lock.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7144, 1);
                for (var key in Team_cfg.Attritue) {
                    var Attritue_now = now.getChildByName("Attritue_" + key);
                    var Attritue_next = next.getChildByName("Attritue_" + key);
                    var Attritue_arr_now = H52D_Framework.HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv);
                    var Attritue_arr_next = H52D_Framework.HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, 1);
                    var new_info = a + H52D_Framework.GetInfoAttr.Instance.GetText(Attritue_arr_now["war"][key][1]);
                    Attritue_now.text = new_info + ":" + 0 + "%";
                    Attritue_next.text = Attritue_arr_next["war"][key][2] / 100 + "%";
                }
            }
            // 组合图鉴中 单个图鉴的信息
            for (var key in Team_cfg.HandbookTeam) {
                var mosthand = item.getChildByName("mosthand_" + key);
                mosthand.visible = true;
                var hand_name = mosthand.getChildByName("hand_name");
                var hand_lv = mosthand.getChildByName("hand_lv");
                var icon = mosthand.getChildByName("hand_icon");
                var hand_Id = Team_cfg.HandbookTeam[key];
                var single_active = H52D_Framework.HeroHandbookManager.Instance.HandBookSingle_IsActive(hand_Id);
                var Item_cfg = H52D_Framework.ItemConfig[hand_Id];
                var hand_Lv = H52D_Framework.HeroHandbookManager.Instance.GetHandBook_Lv(hand_Id);
                var hand_nameId = H52D_Framework.RelationConfig[hand_Id].HandbookName;
                hand_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(hand_nameId);
                hand_name.color = H52D_Framework.BaseDefine.LabelColor[Item_cfg.dwItemQuality];
                H52D_Framework.SetHtmlStyle(hand_lv, 22, "#9be589", "left");
                hand_lv.innerHTML = "Lv:" + H52D_Framework.GetHtmlStrByColor(hand_Lv + "", "#f4ff79");
                if (!single_active) {
                    hand_lv.innerHTML = "Lv:" + H52D_Framework.GetHtmlStrByColor(0 + "", "#f4ff79");
                }
                icon.skin = "ui_icon/" + H52D_Framework.RelationConfig[hand_Id].strHandbookIcon;
                icon.gray = !single_active;
                mosthand.skin = H52D_Framework.BaseDefine.QualityList[Item_cfg.dwItemQuality];
                hand_name.on(Laya.Event.CLICK, this, this.GoMade_Item, [Item_cfg.Line[1]]);
            }
            if (H52D_Framework.HeroHandbookManager.Instance.HandLvMax() <= lv) {
                lv_max.visible = true;
                Btn_active.visible = false;
                Teamhand_lock.visible = false;
            }
            else {
                lv_max.visible = false;
                Btn_active.visible = true;
                Teamhand_lock.visible = true;
            }
            Btn_active.gray = !bool;
            Btn_active.mouseEnabled = bool;
            H52D_Framework.HeroHandbookManager.Instance.HandMostShow = !bool;
            Btn_active.on(Laya.Event.CLICK, this, this.Btnclick_TeamHand, [Team_Id]);
        };
        MostHandBookView.prototype.GoMade_Item = function (Item_Id) {
            H52D_Framework.HeroHandbookManager.Instance.GoView(Item_Id);
        };
        MostHandBookView.prototype.Btnclick_TeamHand = function (Item_Id) {
            var bool = H52D_Framework.HeroHandbookManager.Instance.HandTeam_IsTrue(Item_Id);
            if (!bool) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("等级不足");
            }
            H52D_Framework.HeroHandbookManager.Instance.K_ReqUpgeadeSuitHandbook(Item_Id);
        };
        MostHandBookView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("Rest_handbook_most", Laya.Handler.create(this, this.SetMostHandbook_list));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
        };
        return MostHandBookView;
    }(ui.heroList.HeroHandBook.MostHandBookViewUI));
    H52D_Framework.MostHandBookView = MostHandBookView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MostHandBookView.js.map