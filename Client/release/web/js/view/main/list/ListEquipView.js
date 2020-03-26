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
/**
 * 时空法器
 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ListEquipView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_equip.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    var ListEquipView = /** @class */ (function (_super) {
        __extends(ListEquipView, _super);
        function ListEquipView() {
            var _this = _super.call(this) || this;
            _this.Equiplist = [];
            _this.AddEvent();
            _this.InitView();
            return _this;
        }
        ListEquipView.prototype.InitView = function () {
            this.E_list.vScrollBarSkin = "";
            this.red_start();
            this.Btn_click(ListEquipView.Idx);
            this.ChangeListHigth();
            this.Put_Equip();
        };
        /**添加事件 */
        ListEquipView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_1.on(Laya.Event.CLICK, this, this.Btn_click, [1]);
            this.btn_2.on(Laya.Event.CLICK, this, this.Btn_click, [2]);
            this.btn_3.on(Laya.Event.CLICK, this, this.Btn_click, [3]);
            this.btn_4.on(Laya.Event.CLICK, this, this.Btn_click, [4]);
            this.btn_5.on(Laya.Event.CLICK, this, this.Btn_click, [5]);
            this.E_make.on(Laya.Event.CLICK, this, this.OpenView, ["MakeEquipView"]);
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
            H52D_Framework.Event.RegistEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
            H52D_Framework.Event.RegistEvent("redshow", Laya.Handler.create(this, this.RedShow)); //
            H52D_Framework.Event.RegistEvent("DeleShow", Laya.Handler.create(this, this.DeleShow));
        };
        ListEquipView.prototype.EquipMax_num = function () {
            var my_num = H52D_Framework.EquipManager.Instance.GetEquipNum();
            var number = H52D_Framework.GameParamConfig.EquipMaxNum;
            this.E_mynum.text = my_num + "/" + H52D_Framework.GameParamConfig.EquipMaxNum;
        };
        ListEquipView.prototype.Resh_num = function () {
            var my_num = H52D_Framework.EquipManager.Instance.GetEquipNum();
            if (H52D_Framework.EquipManager.Instance.IsOverflow) {
                var str = H52D_Framework.SysPromptConfig[30030].strPromptInfo;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
        };
        ListEquipView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                if (this.destroyed)
                    return;
                this.E_list.height = 175 * G_StageHeightScale;
            }
            else {
                this.E_list.height = (980 - wxsclae) * G_StageHeightScale;
            }
        };
        ListEquipView.prototype.Equip_List = function (index, bool) {
            this.EquipMax_num();
            var E_id = H52D_Framework.EquipManager.Instance.GetEquipByType(index);
            this.Equiplist = E_id.array;
            H52D_Framework.EquipManager.Instance.SortE(this.Equiplist, bool);
            this.E_list.array = this.Equiplist;
            this["red_" + ListEquipView.Idx].visible = false;
            this.E_list.renderHandler = new Laya.Handler(this, this.E_Handler);
        };
        ListEquipView.prototype.E_Handler = function (item, index) {
            var nIdx = this.E_list.array[index].instId;
            var e_Info = H52D_Framework.EquipManager.Instance.GetEquipByInstId(nIdx);
            var e_info_base = e_Info.baseAttribute; //
            var e_icon = item.getChildByName("e_icon");
            var bg = item.getChildByName("bg");
            var pinzhi = item.getChildByName("E_pinzhi");
            var e_name = item.getChildByName("e_name");
            var e_lv = item.getChildByName("e_lv");
            var e_base = item.getChildByName("e_base");
            var btn = item.getChildByName("btn_use");
            var type_icon = btn.getChildByName("type_icon");
            var bnew = item.getChildByName("red");
            var used = item.getChildByName("used");
            var use_id = H52D_Framework.EquipManager.Instance.GetCurrentEquipByType(ListEquipView.Idx);
            if (use_id == nIdx) {
                btn.visible = false;
                used.visible = true;
            }
            else {
                btn.visible = true;
                used.visible = false;
            }
            bnew.visible = e_Info.bNew;
            if (e_Info.bNew) {
                this["red_" + ListEquipView.Idx].visible = e_Info.bNew;
            }
            e_name.color = H52D_Framework.BaseDefine.EquipQualityColor[e_Info.equipColor];
            e_name.text = e_Info.equipName;
            e_icon.skin = "ui_icon/" + e_Info.equipIcon;
            H52D_Framework.SetHtmlStyle(e_lv, 18, "#c0eb9f", "left");
            e_lv.innerHTML = "LV:" + H52D_Framework.GetHtmlStrByColor(e_Info.equipLevel, "#ffff79");
            e_lv.mouseThrough = true;
            pinzhi.skin = H52D_Framework.BaseDefine.EquipBgColor[e_Info.equipColor];
            var base_ID = e_info_base[1][1];
            var base_value = e_info_base[1][2];
            var base_tcfg = H52D_Framework.QualityValue[base_ID];
            e_base.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
            if (base_tcfg.isper == 1) {
                var num = Math.floor(base_value / 100);
                e_base.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + num + "%";
            }
            bg.on(Laya.Event.CLICK, this, this.OpenView, ["EquipTips", nIdx]);
            btn.on(Laya.Event.CLICK, this, this.Btn_use, [nIdx, btn]);
        };
        ListEquipView.prototype.Btn_click = function (index) {
            ListEquipView.Idx = index;
            this.Equip_List(index, true);
            this.TitileShow(index);
        };
        ListEquipView.prototype.OpenView = function (name, id) {
            H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewUpRoot, id]);
        };
        ListEquipView.prototype.Btn_use = function (id, btn) {
            this._btn = btn;
            H52D_Framework.EquipManager.Instance.K_ReqUseEquip(id);
        };
        ListEquipView.prototype.Btn_puton = function (nIdx) {
            var e_Info = H52D_Framework.EquipManager.Instance.GetEquipByInstId(nIdx);
            this["E_" + [ListEquipView.Idx]].skin = "ui_icon/" + e_Info.equipIcon;
            e_Info.bNew = false;
            H52D_Framework.EquipManager.Instance.K_ReqLookEquip(nIdx);
            this.Equip_List(ListEquipView.Idx, false);
            this["icon" + [ListEquipView.Idx]].visible = false;
            if (H52D_Framework.UIManager.Instance.IsHave("EquipTips", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("EquipTips", [H52D_Framework.ViewUpRoot]);
            }
            this.Equip_List(ListEquipView.Idx, false);
        };
        ListEquipView.prototype.TitileShow = function (index) {
            switch (index) {
                case 1:
                    this.o1.visible = true;
                    this.o2.visible = false;
                    this.o3.visible = false;
                    this.o4.visible = false;
                    this.o5.visible = false;
                    this.name1.color = "#d3c1aa";
                    this.name2.color = "#89848a";
                    this.name3.color = "#89848a";
                    this.name4.color = "#89848a";
                    this.name5.color = "#89848a";
                    break;
                case 2:
                    this.o1.visible = false;
                    this.o2.visible = true;
                    this.o3.visible = false;
                    this.o4.visible = false;
                    this.o5.visible = false;
                    this.name1.color = "#89848a";
                    this.name2.color = "#d3c1aa";
                    this.name3.color = "#89848a";
                    this.name4.color = "#89848a";
                    this.name5.color = "#89848a";
                    break;
                case 3:
                    this.o1.visible = false;
                    this.o2.visible = false;
                    this.o3.visible = true;
                    this.o4.visible = false;
                    this.o5.visible = false;
                    this.name1.color = "#89848a";
                    this.name2.color = "#89848a";
                    this.name3.color = "#d3c1aa";
                    this.name4.color = "#89848a";
                    this.name5.color = "#89848a";
                    break;
                case 4:
                    this.o1.visible = false;
                    this.o2.visible = false;
                    this.o3.visible = false;
                    this.o4.visible = true;
                    this.o5.visible = false;
                    this.name1.color = "#89848a";
                    this.name2.color = "#89848a";
                    this.name3.color = "#89848a";
                    this.name4.color = "#d3c1aa";
                    this.name5.color = "#89848a";
                    break;
                case 5:
                    this.o1.visible = false;
                    this.o2.visible = false;
                    this.o3.visible = false;
                    this.o4.visible = false;
                    this.o5.visible = true;
                    this.name1.color = "#89848a";
                    this.name2.color = "#89848a";
                    this.name3.color = "#89848a";
                    this.name4.color = "#89848a";
                    this.name5.color = "#d3c1aa";
                    break;
            }
        };
        ListEquipView.prototype.Put_Equip = function () {
            for (var type = 1; type <= 5; type++) {
                var E_id = H52D_Framework.EquipManager.Instance.GetCurrentEquipByType(type);
                var E_Info = H52D_Framework.EquipManager.Instance.GetEquipByInstId(E_id);
                if (!E_Info) {
                    continue;
                }
                this["E_" + type].skin = "ui_icon/" + E_Info.equipIcon;
                this["icon" + type].visible = false;
            }
        };
        ListEquipView.prototype.Btn_Resh = function (id) {
            this.Equip_List(ListEquipView.Idx, true);
            var e_Info = H52D_Framework.EquipConfig[id];
            e_Info.bNew = true;
            //EquipManager.Instance.GetEquip_one(id);
            var type = e_Info.equipType;
            this["red_" + type].visible = e_Info.bNew && H52D_Framework.EquipManager.Instance.EquipOnlyone;
            this.Resh_num();
        };
        /**增加装备 */
        ListEquipView.prototype.RedShow = function () {
            if (this["red_" + ListEquipView.Idx].visible) {
                this.Equip_List(ListEquipView.Idx, false);
            }
        };
        /**删除装备 */
        ListEquipView.prototype.DeleShow = function () {
            this.Equip_List(ListEquipView.Idx, true);
        };
        ListEquipView.prototype.red_start = function () {
            for (var type = 1; type <= 5; type++) {
                var all_equip = H52D_Framework.EquipManager.Instance.GetEquipByType(type);
                for (var key in all_equip.list) {
                    var e_info = all_equip.list[key];
                    if (e_info.bNew) {
                        this["red_" + type].visible = e_info.bNew && H52D_Framework.EquipManager.Instance.EquipOnlyone;
                    }
                }
            }
        };
        // 移除事件监听
        ListEquipView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RemoveEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
            H52D_Framework.Event.RemoveEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
            H52D_Framework.Event.RemoveEvent("redshow", Laya.Handler.create(this, this.RedShow));
            H52D_Framework.Event.RemoveEvent("DeleShow", Laya.Handler.create(this, this.DeleShow));
        };
        ListEquipView.Idx = 1;
        return ListEquipView;
    }(ui.main.list.ListEquipViewUI));
    H52D_Framework.ListEquipView = ListEquipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListEquipView.js.map