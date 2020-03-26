/**
* 点击技能类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var TapSkill = /** @class */ (function () {
        function TapSkill(viewRoot) {
            this._sData = null;
            this._tapAvatar = null;
            this._dir = 1;
            this._viewRoot = H52D_Framework.EffectRoot;
            this._sData = new H52D_Framework.SkillData(100);
            this._viewRoot = viewRoot ? viewRoot : H52D_Framework.EffectRoot;
        }
        Object.defineProperty(TapSkill.prototype, "_path", {
            get: function () { return this._sData.actionEffect["3"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TapSkill.prototype, "_name", {
            get: function () { return this._sData.actionEffect["4"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TapSkill.prototype, "_scla", {
            get: function () { return this._sData.actionEffect["5"]; },
            enumerable: true,
            configurable: true
        });
        /**点击技能 */
        TapSkill.prototype.TapSkill = function (clickType) {
            var _this = this;
            if (!this._tapAvatar) {
                this._tapAvatar = new H52D_Framework.Avatar(this._viewRoot);
                this._tapAvatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function () { _this.PlayTapEffect(clickType); }));
            }
            else {
                this.PlayTapEffect(clickType);
            }
        };
        /**播放技能特效 */
        TapSkill.prototype.PlayTapEffect = function (clickType) {
            if (!this._tapAvatar)
                return;
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
            if (clickType == 1) {
                var x = Laya.MouseManager.instance.mouseX;
                var y = Laya.MouseManager.instance.mouseY;
                var point = this._viewRoot.globalToLocal(new Laya.Point(x, y));
                this._tapAvatar.PosX = point.x;
                this._tapAvatar.PosY = point.y;
                //if(PrivilegeBuff.Instance.IsStart)
                this._tapAvatar.Play(this._name, false);
            }
        };
        TapSkill.prototype.Destroy = function () {
            if (this._tapAvatar) {
                this._tapAvatar.Destroy();
                this._tapAvatar = null;
            }
        };
        return TapSkill;
    }());
    H52D_Framework.TapSkill = TapSkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TapSkill.js.map