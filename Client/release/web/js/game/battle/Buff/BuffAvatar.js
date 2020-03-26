/**
* Buff表现类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BuffAvatar = /** @class */ (function () {
        function BuffAvatar(buffdata, owner, btype) {
            this._buffAvatar = {};
            this._btype = 0;
            this.die = [];
            this._btype = btype;
            this._buffData = buffdata;
            this._ViewRoot = this._buffData.hierarchy == 1 ? H52D_Framework.AvatarRoot : H52D_Framework.AvatarEffectRoot;
            this._owner = owner;
            this._target = H52D_Framework.SelectTarget.BuffTarget(this._buffData, this._buffData.statusActionTarget, this._owner, btype).concat();
            this._buffAvatar = {};
            this.Do();
            H52D_Framework.Event.RegistEvent("DestryBuffById", Laya.Handler.create(this, this.DestroyByid));
        }
        /**添加Buff显示效果 */
        BuffAvatar.prototype.Do = function () {
            if (!this._target)
                return;
            for (var i = 0; i < this._target.length; i++) {
                var pointid = this._buffData.pointID;
                var point = void 0;
                if (this._target[i]) {
                    if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                        if (this._btype == -1) {
                            point = H52D_Framework.PHeroBuffPoint[pointid - 1];
                        }
                        else {
                            point = H52D_Framework.OHeroBuffPoint[pointid - 1];
                        }
                    }
                    else {
                        if (this._target[i].type == eCharacter_TYPE.AHERO
                            || this._target[i].type == eCharacter_TYPE.DHERO) {
                            point = H52D_Framework.HeroBuffPoint[pointid - 1];
                        }
                        else {
                            if (this._target[i].vo.boss) {
                                point = H52D_Framework.BossBuffPoint[pointid - 1];
                            }
                            else {
                                point = H52D_Framework.MonsterBuffPoint[pointid - 1];
                            }
                        }
                    }
                    var x = this._target[i].PosX + point[0];
                    var y = this._target[i].PosY + point[1];
                    this.AddbuffEffect(x, y, this._target[i]);
                }
            }
        };
        /**添加初始化Buff表现特效 */
        BuffAvatar.prototype.AddbuffEffect = function (x, y, target) {
            var _this = this;
            if (this._buffData == null)
                return;
            var avatar = new H52D_Framework.Avatar(this._ViewRoot);
            avatar.Load(this._buffData.effectPath, this._buffData.Dir, this._buffData.effectScla, x, y, Laya.Handler.create(this, function (avatars) {
                avatars.SetOrder(0);
                avatars.Play(_this._buffData.effectName, true);
            }), null, this._buffData.hierarchy == 1);
            this._buffAvatar[target.vo.id] = avatar;
        };
        BuffAvatar.prototype.OnUpdate = function () {
            for (var k in this._target) {
                if (this._target[k]) {
                    if (this._target[k].type == eCharacter_TYPE.MONSTER) {
                        var a = this._target[k];
                        if (a.IsDie)
                            this.Destroy();
                    }
                }
            }
        };
        BuffAvatar.prototype.DestroyByid = function (id) {
            if (this._buffAvatar[id]) {
                this._buffAvatar[id].Destroy();
                this._buffAvatar[id] = null;
            }
        };
        /**删除所有buff的表现效果 */
        BuffAvatar.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("DestryBuffById", Laya.Handler.create(this, this.DestroyByid));
            for (var k in this._buffAvatar) {
                if (this._buffAvatar[k]) {
                    this._buffAvatar[k].Destroy();
                    this._buffAvatar[k] = null;
                }
            }
            this._buffAvatar = {};
            this._target = [];
            this._owner = null;
            H52D_Framework.Tick.ClearAll(this);
        };
        return BuffAvatar;
    }());
    H52D_Framework.BuffAvatar = BuffAvatar;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuffAvatar.js.map