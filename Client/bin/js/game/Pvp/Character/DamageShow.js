/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var DamageShow = /** @class */ (function () {
        function DamageShow() {
            this.LogUI = null;
            this.LogUI = new H52D_Framework.TextNameView();
            H52D_Framework.ViewToppestRoot.addChild(this.LogUI);
            this.LogUI.visible = false;
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.KeyDownHander);
        }
        Object.defineProperty(DamageShow, "Instance", {
            get: function () {
                if (this.instance == null) {
                    this.instance = new DamageShow();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        DamageShow.prototype.SetText = function (parame) {
            this.LogUI.SetLog(parame);
        };
        DamageShow.prototype._Cler = function () {
            this.LogUI._Cler();
        };
        DamageShow.prototype.KeyDownHander = function (key) {
            switch (key.keyCode) {
                case Laya.Keyboard.P:
                    this.LogUI.visible = !this.LogUI.visible;
                    H52D_Framework.BattlefieldManager.Instance.GMTools_AttrShow();
                    break;
            }
        };
        DamageShow.instance = null;
        return DamageShow;
    }());
    H52D_Framework.DamageShow = DamageShow;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DamageShow.js.map