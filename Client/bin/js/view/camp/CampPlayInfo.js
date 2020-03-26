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
    H52D_Framework.AddViewResource("CampPlayInfo", [
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
    ]);
    var CampPlayInfo = /** @class */ (function (_super) {
        __extends(CampPlayInfo, _super);
        function CampPlayInfo() {
            var _this = _super.call(this) || this;
            _this.Play_Info = [];
            _this.Play_Info = H52D_Framework.CampManager.Instance.OntherPlatInfo;
            _this.Add_Event();
            _this.CampInfo();
            return _this;
        }
        CampPlayInfo.prototype.Add_Event = function () {
            this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_close);
            this.Other.on(Laya.Event.CLICK, this, this.BtnClick_close);
            this.btn_sure.on(Laya.Event.CLICK, this, this.BtnClick_close);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        CampPlayInfo.prototype.BtnClick_close = function (name) {
            H52D_Framework.UIManager.Instance.DestroyUI("CampPlayInfo", [H52D_Framework.ViewUpRoot]);
        };
        CampPlayInfo.prototype.CampInfo = function () {
            this.Play_Name.text = this.Play_Info[1];
            var camp_id = this.Play_Info[3];
            var cuorder = this.Play_Info[4];
            var play_list = H52D_Framework.CampManager.Instance.Camp_PlayInfO;
            var play = this.Play_Info[1];
            var camp_name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GangConfig[camp_id].nameId);
            this.camp_name.text = camp_name;
            this.guanka_num.text = "" + this.Play_Info[4];
            if (this.Play_Info[4] > 10000) {
                this.guanka_num.text = "" + (this.Play_Info[4] - 10000);
            }
            this.hero_num.text = "" + this.Play_Info[5];
            this.pet_num.text = "" + this.Play_Info[6];
            if (!this.Play_Info[5]) {
                this.hero_num.text = "无";
            }
            if (!this.Play_Info[6]) {
                this.pet_num.text = "无";
            }
            if (this.Play_Info[7]) {
                var now = H52D_Framework.Time.serverSecodes - this.Play_Info[7];
                var time = H52D_Framework.GetFormatTime(now);
                this.time_num.text = time + "前";
            }
            else {
                this.time_num.text = "小于 1 分钟";
            }
        };
        CampPlayInfo.prototype.Destroy = function () {
            this.offAll();
        };
        return CampPlayInfo;
    }(ui.camp.CampPlayInfoUI));
    H52D_Framework.CampPlayInfo = CampPlayInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampPlayInfo.js.map