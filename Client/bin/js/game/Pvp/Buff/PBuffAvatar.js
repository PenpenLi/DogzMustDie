var H52D_Framework;
(function (H52D_Framework) {
    var PBuffAvatar = /** @class */ (function () {
        function PBuffAvatar(buffdata, owner, btype, belongs) {
            this._buffAvatar = {};
            this._ViewRoot = null;
            this._buffData = buffdata;
            this._owner = owner;
            this._target = H52D_Framework.SelectTarget.PBuffTarget(this._buffData, this._buffData.statusActionTarget, this._owner, btype, belongs).concat();
            this._buffAvatar = {};
            this._ViewRoot = this._buffData.hierarchy == 1 ? H52D_Framework.AvatarRoot : H52D_Framework.AvatarEffectRoot;
        }
        /**添加Buff显示效果 */
        PBuffAvatar.prototype.Do = function () {
            if (!this._target)
                return;
            for (var i = 0; i < this._target.length; i++) {
                var pointid = this._buffData.pointID;
                var point = H52D_Framework.PHeroBuffPoint[pointid - 1];
                if (this._target[i] && this._target[i]) {
                    var x = this._target[i].PosX + point[0];
                    var y = this._target[i].PosY + point[1];
                    this.AddbuffEffect(x, y, this._target[i]);
                }
            }
        };
        /**添加初始化Buff表现特效 */
        PBuffAvatar.prototype.AddbuffEffect = function (x, y, target) {
            var _this = this;
            if (this._buffData == null)
                return;
            var avatar = new H52D_Framework.Avatar(this._ViewRoot);
            this._buffAvatar[target.ID] = avatar;
            avatar.Load(this._buffData.effectPath, this._buffData.Dir, this._buffData.effectScla, x, y, Laya.Handler.create(this, function () {
                avatar.Play(_this._buffData.effectName, true);
            }));
        };
        PBuffAvatar.prototype.OnUpdate = function () {
            for (var t in this._target) {
                if (this._target[t] && this._target[t].IsDie) {
                    this.DestroyZ(this._target[t].ID);
                    this._target[t] = null;
                }
            }
        };
        PBuffAvatar.prototype.DestroyZ = function (index) {
            if (this._buffAvatar[index]) {
                this._buffAvatar[index].Destroy();
                this._buffAvatar[index] = null;
            }
        };
        /**删除所有buff的表现效果 */
        PBuffAvatar.prototype.Destroy = function () {
            for (var k in this._buffAvatar) {
                if (this._buffAvatar[k]) {
                    this._buffAvatar[k].Destroy();
                    this._buffAvatar[k] = null;
                }
            }
            this._buffAvatar = {};
            this._target = [];
            this._owner = null;
            // Tick.ClearAll(this);
        };
        return PBuffAvatar;
    }());
    H52D_Framework.PBuffAvatar = PBuffAvatar;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PBuffAvatar.js.map