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
    H52D_Framework.AddViewResource("MakeEquipView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MakeEquipView = /** @class */ (function (_super) {
        __extends(MakeEquipView, _super);
        function MakeEquipView() {
            var _this = _super.call(this) || this;
            _this._sendlock = true;
            _this.AddEvent();
            _this.InitView();
            return _this;
        }
        MakeEquipView.prototype.InitView = function () {
            this.E_suitList.vScrollBarSkin = "";
            this.Info();
            this.Btn_click(MakeEquipView.Indx);
        };
        MakeEquipView.prototype.AddEvent = function () {
            this.btn_1.on(Laya.Event.CLICK, this, this.Btn_click, [3]);
            this.btn_2.on(Laya.Event.CLICK, this, this.Btn_click, [4]);
            this.btn_3.on(Laya.Event.CLICK, this, this.Btn_click, [5]);
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_closeclick);
            this.Other.on(Laya.Event.CLICK, this, this.Btn_closeclick);
            this.M_help.on(Laya.Event.CLICK, this, this.Btn_help);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
            H52D_Framework.Event.RegistEvent("DeleShow", Laya.Handler.create(this, this.Btn_Resh));
        };
        MakeEquipView.prototype.Info = function () {
            H52D_Framework.SetHtmlStyle(this.my_num, 26, "#c0eb9f", "left");
            var path = "<img src= 'ui_icon/icon_prop_016.png' width='35px' height='35px'></img>";
            var item_num = H52D_Framework.BagManager.Instance.getItemNumber(2201);
            this.my_num.innerHTML = "拥有:" + path + H52D_Framework.GetHtmlStrByColor(item_num + "", "#fafa85");
            ;
        };
        MakeEquipView.prototype.UpdateList = function (type) {
            MakeEquipView.Indx = type;
            this.E_suitList.array = H52D_Framework.EquipManager.Instance.GetSuitCfgListByType(type);
            this.E_suitList.renderHandler = new Laya.Handler(this, this.E_Handler);
        };
        MakeEquipView.prototype.E_Handler = function (item, index) {
            var nIdx = this.E_suitList.array[index];
            var suit_tcfg = H52D_Framework.SuitConfig[nIdx];
            var equipnum = suit_tcfg.equipGroupId;
            var suit_name = item.getChildByName("Equip_name");
            var suit_base1 = item.getChildByName("suit_base1");
            var suit_base2 = item.getChildByName("suit_base2");
            var suit_base3 = item.getChildByName("suit_base3");
            suit_base1.innerHTML = "";
            suit_base2.innerHTML = "";
            suit_base3.innerHTML = "";
            H52D_Framework.SetHtmlStyle(suit_name, 22, H52D_Framework.BaseDefine.EquipQualityColor[suit_tcfg.suitColor], "left");
            var base_info = suit_tcfg.suitAttribute;
            for (var key in base_info) {
                var path = "<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
                var suit_base = item.getChildByName("suit_base" + key);
                H52D_Framework.SetHtmlStyle(suit_base, 22, "#dde2f2", "left");
                var id = base_info[key][1];
                var name_id = H52D_Framework.QualityValue[id];
                var name_text = H52D_Framework.GetInfoAttr.Instance.GetText(name_id.dwName);
                if (H52D_Framework.EquipManager.Instance.IsSuitActivate(nIdx)) {
                    H52D_Framework.SetHtmlStyle(suit_base, 22, "#9be589", "left");
                }
                suit_base.innerHTML = path + name_text + H52D_Framework.GetHtmlStrByColor(base_info[key][2], "#f4ff79");
                if (name_id.isper == 1) {
                    suit_base.innerHTML = path + name_text + H52D_Framework.GetHtmlStrByColor((base_info[key][2] / 100).toString(), "#f4ff79") + "%";
                }
            }
            var name = H52D_Framework.GetInfoAttr.Instance.GetText(suit_tcfg.suitName);
            var num = H52D_Framework.EquipManager.Instance.GetSuitOnceActivateNum(nIdx);
            suit_name.innerHTML = name + H52D_Framework.GetHtmlStrByColor("(" + num + "/5)", "#bebbf8");
            for (var key in equipnum) {
                var l_n = item.getChildByName(key); //
                var suit_bg = l_n.getChildByName("E_pinzhi" + key);
                var suit_icon = l_n.getChildByName("E_icon" + key);
                var suit_name_1 = l_n.getChildByName("E_name" + key);
                var suit_base1_1 = l_n.getChildByName("E_base" + key);
                var suit_lv = l_n.getChildByName("E_lv" + key);
                var make_num = l_n.getChildByName("E_makenum" + key);
                var btn = l_n.getChildByName("E_make" + key);
                var suit_lock = l_n.getChildByName("E_lock");
                H52D_Framework.SetHtmlStyle(make_num, 20, "#fafa85", "center");
                var group_id = equipnum[key];
                var equip_id = H52D_Framework.EquipManager.Instance.GetEquipIdBySuitId(group_id);
                if (equip_id == null) {
                    return;
                }
                var e_info = H52D_Framework.EquipConfig[equip_id];
                var type = e_info.equipType;
                var bool = H52D_Framework.EquipManager.Instance.IsSuitOnceActivate(group_id);
                suit_icon.gray = !bool;
                suit_lock.visible = !bool;
                btn.gray = bool;
                var base = e_info.baseAttribute;
                H52D_Framework.SetHtmlStyle(suit_lv, 20, "#9be589", "left");
                suit_lv.innerHTML = "LV:" + H52D_Framework.GetHtmlStrByColor(e_info.equipLevel, "#f4ff79");
                suit_name_1.text = H52D_Framework.GetInfoAttr.Instance.GetText(e_info.equipName);
                suit_name_1.color = H52D_Framework.BaseDefine.EquipQualityColor[e_info.equipColor];
                suit_bg.skin = H52D_Framework.BaseDefine.EquipBgColor[e_info.equipColor];
                suit_icon.skin = "ui_icon/" + e_info.equipIcon;
                var base_ID = base[1][1];
                var base_value = base[1][2];
                var base_tcfg = H52D_Framework.QualityValue[base_ID];
                suit_base1_1.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
                if (base_tcfg.isper == 1) {
                    suit_base1_1.text = H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + Math.floor(base_value / 100) + "%";
                }
                var item_num = H52D_Framework.BagManager.Instance.getItemNumber(2201);
                var path = "<img src= 'ui_icon/icon_prop_016.png' width='25px' height='25px'></img>";
                make_num.innerHTML = path + e_info.composeNeedNum;
                suit_base1_1.color = "#d7e6ff";
                btn.gray = item_num < e_info.composeNeedNum ? true : false;
                btn.mouseEnabled = !btn.gray;
                if (item_num < e_info.composeNeedNum) {
                    btn.gray = true;
                }
                else {
                    btn.gray = false;
                }
                btn.on(Laya.Event.CLICK, this, this.Btn_makeequip, [group_id]);
            }
        };
        MakeEquipView.prototype.Btn_closeclick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("MakeEquipView", [H52D_Framework.ViewUpRoot]);
        };
        MakeEquipView.prototype.Btn_click = function (index) {
            this.UpdateList(index);
            switch (index) {
                case 3:
                    this.img1.skin = "ui_rank/img-zi-weixuan.png";
                    this.left1.skin = "ui_rank/img-zi-xuan.png";
                    this.img2.skin = "ui_rank/img-lan-weixuan.png";
                    this.img3.skin = "ui_rank/img-lan-weixuan.png";
                    this.btn_name1.color = "#eff8bb";
                    this.btn_name2.color = "#bebbf8";
                    this.btn_name3.color = "#bebbf8";
                    break;
                case 4:
                    this.img1.skin = "ui_rank/img-lan-weixuan.png";
                    this.left1.skin = "ui_rank/img-lan-xuan.png";
                    this.img2.skin = "ui_rank/img-zi-weixuan.png";
                    this.img3.skin = "ui_rank/img-lan-weixuan.png";
                    this.btn_name1.color = "#bebbf8";
                    this.btn_name2.color = "#eff8bb";
                    this.btn_name3.color = "#bebbf8";
                    break;
                case 5:
                    this.img1.skin = "ui_rank/img-lan-weixuan.png";
                    this.left1.skin = "ui_rank/img-lan-xuan.png";
                    this.img2.skin = "ui_rank/img-lan-weixuan.png";
                    this.img3.skin = "ui_rank/img-zi-weixuan.png";
                    this.btn_name1.color = "#bebbf8";
                    this.btn_name2.color = "#bebbf8";
                    this.btn_name3.color = "#eff8bb";
                    break;
            }
        };
        /**制作装备 */
        MakeEquipView.prototype.Btn_makeequip = function (id) {
            var _this = this;
            if (this._sendlock == false) {
                return;
            }
            this._sendlock = false;
            H52D_Framework.OneTimer(1000, function () {
                _this._sendlock = true;
            });
            H52D_Framework.EquipManager.Instance.K_ReqCompoundEquip(id);
        };
        MakeEquipView.prototype.Btn_help = function () {
            var title = "玩法说明";
            var content = H52D_Framework.GetInfoAttr.Instance.GetText(6005);
            H52D_Framework.UIManager.Instance.CreateUI("TipsActionView", [H52D_Framework.ViewToppestRoot, title, content]);
            //播放点击按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        MakeEquipView.prototype.Btn_Resh = function () {
            this.Info();
            this.UpdateList(MakeEquipView.Indx);
        };
        MakeEquipView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
            H52D_Framework.Event.RemoveEvent("DeleShow", Laya.Handler.create(this, this.Btn_Resh));
        };
        MakeEquipView.Indx = 3;
        return MakeEquipView;
    }(ui.Equep.MakeEquipViewUI));
    H52D_Framework.MakeEquipView = MakeEquipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MakeEquipView.js.map