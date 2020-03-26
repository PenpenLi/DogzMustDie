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
    H52D_Framework.AddViewResource("SingleHandBookView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    var SingleHandBookView = /** @class */ (function (_super) {
        __extends(SingleHandBookView, _super);
        function SingleHandBookView() {
            var _this = _super.call(this) || this;
            _this._arr = [];
            _this.ViewInit();
            return _this;
        }
        SingleHandBookView.prototype.ViewInit = function () {
            this.singlehandbook_list.vScrollBarSkin = "";
            this.ViewEvet();
            this.SetHandbook_list();
            this.play_say.text = H52D_Framework.GetInfoAttr.Instance.GetText(7143);
            this.ChangeListHigth();
            var a = H52D_Framework.HeroHandbookManager.Instance.MostHandbookInfo();
        };
        SingleHandBookView.prototype.ViewEvet = function () {
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent("Rest_handbook_single", Laya.Handler.create(this, this.Resh_view));
        };
        SingleHandBookView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                if (this.destroyed)
                    return;
                this.singlehandbook_list.height = 100 * G_StageHeightScale;
            }
            else {
                this.singlehandbook_list.height = (910 - wxsclae) * G_StageHeightScale;
            }
        };
        SingleHandBookView.prototype.Resh_view = function () {
            this._arr = H52D_Framework.HeroHandbookManager.Instance.SinghandBook();
            this.singlehandbook_list.refresh();
            this.singlehandbook_list.renderHandler = new Laya.Handler(this, this.SetHandbook_line);
        };
        SingleHandBookView.prototype.SetHandbook_list = function () {
            this.singlehandbook_list.array = H52D_Framework.HeroHandbookManager.Instance.SinghandBook();
            H52D_Framework.HeroHandbookManager.Instance.SortHandbook(true, this.singlehandbook_list.array);
            this.singlehandbook_list.renderHandler = new Laya.Handler(this, this.SetHandbook_line);
        };
        SingleHandBookView.prototype.SetHandbook_line = function (item, index) {
            var hand_Id = this.singlehandbook_list.array[index];
            var n_active = H52D_Framework.HeroHandbookManager.Instance.HandBookSingle_IsActive(hand_Id);
            var n_tcfg = H52D_Framework.RelationConfig[hand_Id];
            var item_cfg = H52D_Framework.ItemConfig[hand_Id];
            var playItem_num = H52D_Framework.BagManager.Instance.getItemNumber(hand_Id);
            var lv;
            if (n_active) {
                lv = H52D_Framework.HeroHandbookManager.Instance.GetHandBook_Lv(hand_Id);
            }
            else {
                lv = 1;
            }
            var hand_pinzhi = item.getChildByName("hand_pinzhi");
            var hand_icon = item.getChildByName("hand_icon");
            var hand_name = item.getChildByName("hand_name");
            var hand_lv = item.getChildByName("hand_lv");
            var Btn_lvup = item.getChildByName("Btn_lvup");
            var lv_max = item.getChildByName("lv_max");
            var hand_num = Btn_lvup.getChildByName("hand_num");
            var base_Now = item.getChildByName("base_now");
            var base_Next = item.getChildByName("base_next");
            var handup_cfg = H52D_Framework.HandbookUpConfig[lv];
            hand_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(n_tcfg.HandbookName);
            hand_name.color = H52D_Framework.BaseDefine.LabelColor[item_cfg.dwItemQuality];
            hand_icon.skin = "ui_icon/" + n_tcfg.strHandbookIcon;
            hand_pinzhi.skin = H52D_Framework.BaseDefine.QualityList[item_cfg.dwItemQuality];
            hand_num.mouseThrough = true;
            var next_cfg;
            if (n_active) {
                item.alpha = 1;
                Btn_lvup.label = "升级";
                H52D_Framework.SetHtmlStyle(hand_lv, 22, "#9be589", "left");
                hand_lv.innerHTML = "Lv:" + H52D_Framework.GetHtmlStrByColor(lv + "", "#f4ff79");
                next_cfg = H52D_Framework.HandbookUpConfig[lv];
                if (lv < H52D_Framework.HeroHandbookManager.Instance.HandLvMax()) {
                    next_cfg = H52D_Framework.HandbookUpConfig[lv + 1];
                }
                for (var key in handup_cfg.AddAttribute) {
                    var base_key = base_Now.getChildByName("base_now_" + key);
                    base_key.visible = true;
                    var base_info = handup_cfg.AddAttribute[key];
                    base_key.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_info[1]) + ":" + base_info[2] / 100 + "%";
                }
                if (next_cfg != null) {
                    for (var key in next_cfg.AddAttribute) {
                        var base_key = base_Next.getChildByName("base_next_" + key);
                        var base_info = next_cfg.AddAttribute[key];
                        base_key.text = base_info[2] / 100 + "%";
                        base_key.visible = true;
                    }
                }
            }
            else {
                lv = 1;
                var bool = H52D_Framework.HeroHandbookManager.Instance.HandSingle_IsTrue(hand_Id);
                Btn_lvup.label = "激活";
                Btn_lvup.gray = !bool;
                item.alpha = 0.7;
                item.alpha = bool ? 1 : 0.7;
                for (var key in handup_cfg.AddAttribute) {
                    var base_key = base_Now.getChildByName("base_now_" + key);
                    base_key.visible = true;
                    var base_info = handup_cfg.AddAttribute[key];
                    base_key.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_info[1]) + ":" + 0 + "%";
                    H52D_Framework.SetHtmlStyle(hand_lv, 22, "#9be589", "left");
                    hand_lv.innerHTML = "Lv:" + H52D_Framework.GetHtmlStrByColor(0 + "", "#f4ff79");
                }
                next_cfg = H52D_Framework.HandbookUpConfig[1];
                for (var key in next_cfg.AddAttribute) {
                    var base_key = base_Next.getChildByName("base_next_" + key);
                    var base_info = next_cfg.AddAttribute[key];
                    base_key.text = base_info[2] / 100 + "%";
                    base_key.visible = true;
                }
            }
            H52D_Framework.SetHtmlStyle(hand_num, 22, "#ffc58b", "center");
            hand_num.innerHTML = "图鉴: " + H52D_Framework.GetHtmlStrByColor(playItem_num + "", "#ffa5a7") + "/" + next_cfg.NeedItemNum;
            if (playItem_num >= next_cfg.NeedItemNum) {
                hand_num.innerHTML = "图鉴: " + H52D_Framework.GetHtmlStrByColor(playItem_num + "", "#75d888") + "/" + next_cfg.NeedItemNum;
            }
            if (H52D_Framework.HeroHandbookManager.Instance.HandLvMax() <= lv) {
                lv_max.visible = true;
                Btn_lvup.visible = false;
            }
            else {
                lv_max.visible = false;
                Btn_lvup.visible = true;
            }
            hand_name.on(Laya.Event.CLICK, this, this.GoMade_Item, [item_cfg.Line[1]]);
            Btn_lvup.on(Laya.Event.CLICK, this, this.BtnHand_click, [hand_Id]);
        };
        SingleHandBookView.prototype.GoMade_Item = function (Item_Id) {
            H52D_Framework.HeroHandbookManager.Instance.GoView(Item_Id);
        };
        SingleHandBookView.prototype.BtnHand_click = function (Item_Id) {
            H52D_Framework.HeroHandbookManager.Instance.K_ReqUpgeadeHandbook(Item_Id);
        };
        SingleHandBookView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("Rest_handbook_single", Laya.Handler.create(this, this.Resh_view));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
        };
        return SingleHandBookView;
    }(ui.heroList.HeroHandBook.SingleHandBookViewUI));
    H52D_Framework.SingleHandBookView = SingleHandBookView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SingleHandBookView.js.map