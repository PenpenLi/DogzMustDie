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
    H52D_Framework.AddViewResource("SettingView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class 设置页面
     * @author zhangyusong
     **/
    var SettingView = /** @class */ (function (_super) {
        __extends(SettingView, _super);
        function SettingView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            _this.EventInit();
            _this.btn_name.visible = false;
            return _this;
        }
        SettingView.prototype.ViewInit = function () {
            /** 默认头像信息 */
            this.defaultVo = new H52D_Framework.HeadVo();
            this.defaultVo.headSelect = true;
            this.ChangeName(false);
            this.ChangeHead(false);
            this.txt_username.text = H52D_Framework.MasterPlayer.Instance.player.Name;
            this.effect_select.visible = H52D_Framework.MasterPlayer.Instance.player.Sound;
            this.music_select.visible = H52D_Framework.MasterPlayer.Instance.player.Music;
        };
        SettingView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this, this.ChangeName));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.ChangeHead));
            this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_close"]);
            this.btn_head.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_head"]);
            this.img_head.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_head"]);
            //this.btn_name.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_name"]);
            this.btn_effect.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_sound"]);
            this.btn_music.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_music"]);
            this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_ok"]);
        };
        SettingView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this, this.ChangeName));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.ChangeHead));
        };
        /** 名字更新 */
        SettingView.prototype.ChangeName = function (tips) {
            if (tips === void 0) { tips = true; }
            this.txt_username.text = H52D_Framework.MasterPlayer.Instance.player.Name;
            if (tips) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("改名成功");
                H52D_Framework.UIManager.Instance.DestroyUI("SettingNameView", [H52D_Framework.ViewUpRoot]);
            }
        };
        /** 头像更新 */
        SettingView.prototype.ChangeHead = function (tips) {
            if (tips === void 0) { tips = true; }
            this.defaultVo.headId = H52D_Framework.MasterPlayer.Instance.player.HeadId;
            if (this.defaultVo.headId == 0) {
                this.defaultVo.headRes = "ui_head/icon_ui_01.png";
            }
            else {
                this.defaultVo.headRes = "ui_icon/" + H52D_Framework.HeroConfig[this.defaultVo.headId].strIcon;
            }
            this.img_head.skin = this.defaultVo.headRes;
            if (tips) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("更换头像成功");
                H52D_Framework.UIManager.Instance.DestroyUI("SettingHeadView", [H52D_Framework.ViewUpRoot]);
            }
        };
        SettingView.prototype.OnBtnClick = function (btnName) {
            switch (btnName) {
                case "btn_head": //改头像
                    H52D_Framework.UIManager.Instance.CreateUI("SettingHeadView", [H52D_Framework.ViewUpRoot, this.defaultVo.headId]);
                    //头像点击音效
                    H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
                    break;
                case "btn_name": //改名
                    //UIManager.Instance.CreateUI("SettingNameView", [ViewUpRoot]);
                    break;
                case "btn_sound": //音效
                    var sound = H52D_Framework.MasterPlayer.Instance.player.Sound = !H52D_Framework.MasterPlayer.Instance.player.Sound;
                    this.effect_select.visible = sound;
                    H52D_Framework.SetLocalStorage("sound", sound ? "1" : "0", true);
                    break;
                case "btn_music": //音乐
                    var music = H52D_Framework.MasterPlayer.Instance.player.Music = !H52D_Framework.MasterPlayer.Instance.player.Music;
                    this.music_select.visible = music;
                    H52D_Framework.SetLocalStorage("music", music ? "1" : "0", true);
                    H52D_Framework.Event.DispatchEvent("PlayMusic");
                    break;
                case "btn_close": //关闭
                case "btn_ok": //确定
                    H52D_Framework.UIManager.Instance.DestroyUI("SettingView", [H52D_Framework.ViewUpRoot]);
                    break;
            }
        };
        return SettingView;
    }(ui.setting.SettingViewUI));
    H52D_Framework.SettingView = SettingView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SettingView.js.map