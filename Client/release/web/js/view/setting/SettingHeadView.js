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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("SettingHeadView", [
        { url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class 设置页面
     * @author zhangyusong
     **/
    var SettingHeadView = /** @class */ (function (_super) {
        __extends(SettingHeadView, _super);
        function SettingHeadView(defaultVo) {
            var _this = _super.call(this) || this;
            _this.defaultId = defaultVo[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        SettingHeadView.prototype.ViewInit = function () {
            this.InitHeadList();
            this.warehouse.vScrollBarSkin = "";
            for (var i in this.voList) {
                if (this.voList[i].headSelect) {
                    this.defaultIndex = Number(i);
                }
            }
            this.warehouse.renderHandler = new Laya.Handler(this, this.WarehouseHandler);
            this.warehouse.array = this.voList;
        };
        SettingHeadView.prototype.EventInit = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_close"]);
            this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_ok"]);
        };
        SettingHeadView.prototype.OnBtnClick = function (btnName) {
            switch (btnName) {
                case "btn_ok": //确认
                    if (this.defaultId != this.voList[this.defaultIndex].headId) {
                        H52D_Framework.RemoteCall.Instance.Send("K_ChgHeadID", this.voList[this.defaultIndex].headId);
                        break;
                    }
                case "btn_close": //关闭
                    H52D_Framework.UIManager.Instance.DestroyUI("SettingHeadView", [H52D_Framework.ViewUpRoot]);
                    break;
            }
        };
        /** 头像信息列表初始化 */
        SettingHeadView.prototype.InitHeadList = function () {
            this.voList = new Array();
            var hvo = new H52D_Framework.HeadVo();
            hvo.headId = 0;
            hvo.headRes = "ui_head/icon_ui_01.png";
            hvo.headSelect = hvo.headId == this.defaultId;
            hvo.headUse = hvo.headId == this.defaultId;
            this.voList.push(hvo);
            var heroHead = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            for (var i = 0; i < heroHead.length; i++) {
                var nHeroID = heroHead[i];
                var bActive = H52D_Framework.HeroManager.Instance.IsActive(nHeroID);
                if (bActive) {
                    var hvo_1 = new H52D_Framework.HeadVo();
                    hvo_1.headId = nHeroID;
                    hvo_1.headRes = "ui_icon/" + H52D_Framework.HeroConfig[nHeroID].strIcon;
                    hvo_1.headSelect = nHeroID == this.defaultId;
                    hvo_1.headSelect = hvo_1.headId == this.defaultId;
                    hvo_1.headUse = hvo_1.headId == this.defaultId;
                    this.voList.push(hvo_1);
                }
            }
        };
        /** 头像库初始化 */
        SettingHeadView.prototype.WarehouseHandler = function (item, index) {
            item.getChildByName("img_select").visible = this.voList[index].headSelect;
            item.getChildByName("img_head").skin = this.voList[index].headRes;
            item.getChildByName("img_use").visible = this.voList[index].headUse;
            item.offAll();
            item.on(Laya.Event.CLICK, this, this.OnSelect, [item, index]);
        };
        SettingHeadView.prototype.OnSelect = function (item, index) {
            //播放选择音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this.defaultIndex != index) {
                for (var i in this.voList) {
                    if (Number(i) == this.defaultIndex) {
                        this.voList[i].headSelect = false;
                    }
                    if (Number(i) == index) {
                        this.voList[i].headSelect = true;
                    }
                }
                this.defaultIndex = index;
                this.warehouse.array = this.voList;
            }
        };
        return SettingHeadView;
    }(ui.setting.SettingHeadViewUI));
    H52D_Framework.SettingHeadView = SettingHeadView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SettingHeadView.js.map