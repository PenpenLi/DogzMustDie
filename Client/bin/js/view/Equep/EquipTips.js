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
    H52D_Framework.AddViewResource("EquipTips", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_equip.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var EquipTips = /** @class */ (function (_super) {
        __extends(EquipTips, _super);
        function EquipTips(buf) {
            var _this = _super.call(this) || this;
            _this.equip_ID = buf[1];
            _this.e_Info = H52D_Framework.EquipManager.Instance.GetEquipByInstId(_this.equip_ID);
            _this.ChangeLock(_this.e_Info.bLock);
            _this.InitView();
            _this.AddEvent();
            return _this;
        }
        EquipTips.prototype.InitView = function () {
            this.Info();
            this.Isuse();
            this.Btn_puton();
            H52D_Framework.EquipManager.Instance.K_ReqLookEquip(this.equip_ID);
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
        };
        EquipTips.prototype.Info = function () {
            H52D_Framework.SetHtmlStyle(this.price_num, 18, "#fafa85", "center");
            this.price_num.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='20px'></img>" + this.e_Info.sellNum;
            H52D_Framework.SetHtmlStyle(this.E_lv, 18, "#9be589", "left");
            this.E_lv.innerHTML = "LV:" + H52D_Framework.GetHtmlStrByColor(this.e_Info.equipLevel, "#fafa85");
            H52D_Framework.SetHtmlStyle(this.E_base1, 20, "#d7e6ff", "left");
            //SetHtmlStyle(this.E_base2,18,"#d6d7dd","center");
            //this.E_base2.innerHTML=path;//属性
            var path = "<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
            this.E_icon.skin = "ui_icon/" + this.e_Info.equipIcon; //装备图片
            this.E_pinzhi.skin = H52D_Framework.BaseDefine.EquipBgColor[this.e_Info.equipColor];
            this.E_name.text = this.e_Info.equipName;
            this.E_name.color = H52D_Framework.BaseDefine.EquipQualityColor[this.e_Info.equipColor];
            var e_info_base = this.e_Info.baseAttribute;
            var base_ID = e_info_base[1][1];
            var base_value = Math.floor(e_info_base[1][2]);
            var base_tcfg = H52D_Framework.QualityValue[base_ID];
            this.E_base1.innerHTML = path + H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
            if (base_tcfg.isper == 1) {
                this.E_base1.innerHTML = path + H52D_Framework.GetInfoAttr.Instance.GetText(base_tcfg.dwName) + Math.floor(base_value / 100) + "%";
            }
        };
        EquipTips.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_lock.on(Laya.Event.CLICK, this, this.Btn_lock);
            this.btn_price.on(Laya.Event.CLICK, this, this.Btn_price);
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
            this.btn_use.on(Laya.Event.CLICK, this, this.Btn_use);
            this.Other.on(Laya.Event.CLICK, this, this.Btn_close);
            H52D_Framework.Event.RegistEvent("Setlock", Laya.Handler.create(this, this.ChangeLock));
            H52D_Framework.Event.RegistEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
        };
        EquipTips.prototype.Btn_lock = function () {
            if (this.e_Info.bLock) {
                H52D_Framework.EquipManager.Instance.K_ReqLockEquip(this.equip_ID, false);
            }
            else {
                H52D_Framework.EquipManager.Instance.K_ReqLockEquip(this.equip_ID, true);
            }
        };
        /**关闭页面 */
        EquipTips.prototype.Btn_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("EquipTips", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("redshow");
        };
        EquipTips.prototype.Btn_puton = function () {
            var E_Info = H52D_Framework.EquipManager.Instance.GetEquipByInstId(this.equip_ID);
            var type = E_Info.equipType;
            var E_id = H52D_Framework.EquipManager.Instance.GetCurrentEquipByType(type);
            var bool = E_id == this.equip_ID ? true : false;
            this.used.visible = bool;
            this.btn_use.visible = !bool;
        };
        /**佩戴装备 */
        EquipTips.prototype.Btn_use = function () {
            H52D_Framework.EquipManager.Instance.K_ReqUseEquip(this.equip_ID);
        };
        /**出售装备 */
        EquipTips.prototype.Btn_price = function () {
            var _this = this;
            if (this.e_Info.equipColor > 3) {
                var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[30032].strPromptInfo, H52D_Framework.GetHtmlStrByColor(this.e_Info.equipName, H52D_Framework.BaseDefine.EquipQualityColor[this.e_Info.equipColor]));
                H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                    if (!_this.e_Info.bLock) {
                        H52D_Framework.EquipManager.Instance.K_ReqSellEquip(_this.equip_ID);
                        H52D_Framework.UIManager.Instance.DestroyUI("EquipTips", [H52D_Framework.ViewUpRoot]);
                    }
                    else {
                        //飘字 或者啥
                    }
                }));
            }
            else {
                H52D_Framework.EquipManager.Instance.K_ReqSellEquip(this.equip_ID);
                H52D_Framework.UIManager.Instance.DestroyUI("EquipTips", [H52D_Framework.ViewUpRoot]);
            }
        };
        EquipTips.prototype.Isuse = function () {
            var tcfg = H52D_Framework.EquipManager.Instance.GetEquipByInstId(this.equip_ID);
            var use_id = H52D_Framework.EquipManager.Instance.GetCurrentEquipByType(tcfg.equipType);
            if (use_id == this.equip_ID) {
                this.used.visible = true;
                this.btn_price.visible = false;
            }
        };
        EquipTips.prototype.ChangeLock = function (bool) {
            var path_s = "ui_equip/btn-suoding-faqi.png";
            var path_w = "ui_equip/btn-weisuoding-faqi.png"; //true 锁上
            if (bool) {
                this.E_lock.skin = path_s;
            }
            else {
                this.E_lock.skin = path_w;
            }
            var tcfg = H52D_Framework.EquipManager.Instance.GetEquipByInstId(this.equip_ID);
            var use_id = H52D_Framework.EquipManager.Instance.GetCurrentEquipByType(tcfg.equipType);
            if (use_id == this.equip_ID)
                return;
            this.btn_price.gray = bool;
            this.btn_price.mouseEnabled = !bool;
        };
        EquipTips.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("Setlock", Laya.Handler.create(this, this.ChangeLock));
            H52D_Framework.Event.RemoveEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
        };
        return EquipTips;
    }(ui.Equep.EquipTipsUI));
    H52D_Framework.EquipTips = EquipTips;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EquipTips.js.map