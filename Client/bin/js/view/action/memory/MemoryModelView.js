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
    var MemoryModelView = /** @class */ (function (_super) {
        __extends(MemoryModelView, _super);
        function MemoryModelView(data) {
            var _this = _super.call(this) || this;
            /** 挑战状态：1未挑战 2挑战中 3已挑战 */
            _this.state = 0;
            _this.isBig = false;
            _this._unLock = false;
            _this.data = data;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        Object.defineProperty(MemoryModelView.prototype, "CustomsNum", {
            get: function () {
                return this.data.CustomsNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryModelView.prototype, "CopyId", {
            get: function () {
                return this.data.CopyId;
            },
            enumerable: true,
            configurable: true
        });
        /** 当前关卡 */
        MemoryModelView.prototype.CurrentCustoms = function () {
            if (this.isBig) {
                this.Light(this.head_light_move);
                var monstorId = H52D_Framework.CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
                this.head_bg.skin = "ui_icon/" + H52D_Framework.MonstorConfig[monstorId].strHeadIcon;
            }
            else {
                this.icon_light.visible = false;
                this.icon_red.visible = true;
                this.Light(this.icon_red_move);
            }
        };
        Object.defineProperty(MemoryModelView.prototype, "unLock", {
            /** 解锁关卡 */
            set: function (value) {
                this._unLock = value;
                if (this.isBig) {
                    this.head_bg.gray = !value;
                    this.head_light.gray = !value;
                    this.head_lock.visible = !value;
                }
                else {
                    this.icon_red.visible = false;
                    this.icon_light.gray = !value;
                    this.label_bg.width = value ? 176 : this.tx_name.textWidth + 20;
                }
                this.img_star.visible = value;
                this.tx_name.x = value ? -52 : 0;
            },
            enumerable: true,
            configurable: true
        });
        MemoryModelView.prototype.Light = function (page) {
            page.visible = true;
            H52D_Framework.Tick.Loop(800, this, this.Big, [page]);
        };
        MemoryModelView.prototype.Big = function (page) {
            Laya.Tween.to(page, { scaleX: 1.4, scaleY: 1.4, alpha: 0 }, 600, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                page.scaleX = page.scaleY = 1;
                page.alpha = 0.8;
            }));
        };
        MemoryModelView.prototype.ViewInit = function () {
            this.head_light_move.visible = false;
            this.icon_red_move.visible = false;
            this.isBig = this.data.isBig == 1;
            this.page_head.visible = this.isBig;
            this.page_icon.visible = !this.isBig;
            this.head_lock.visible = false;
            this.tx_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(this.data.CopyName);
            this.star = H52D_Framework.MemoryLogic.Instance.GetDungeonStar(H52D_Framework.MemoryType.equip, this.data.CopyId);
            if (this.isBig) {
                var monstorId = H52D_Framework.CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
                this.head_bg.skin = "ui_icon/" + H52D_Framework.MonstorConfig[monstorId].strHeadIcon;
            }
            this.unLock = false;
        };
        Object.defineProperty(MemoryModelView.prototype, "star", {
            /** 亮星1-3 */
            set: function (value) {
                for (var i = 1; i <= 3; i++) {
                    this["star_red_" + i].visible = value[i] != 0;
                    this["star_gray_" + i].visible = value[i] == 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        MemoryModelView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDistroy);
            this.on(Laya.Event.CLICK, this, this.OnLineHandler);
        };
        MemoryModelView.prototype.OnLineHandler = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this.data.CustomsNum <= H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder) {
                if (this._unLock) {
                    H52D_Framework.MemoryLogic.Instance.challengeData = this.data;
                    H52D_Framework.MemoryLogic.Instance.OpenChallenge();
                }
                else {
                    //请先通过前一关
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30062);
                }
            }
            else {
                //主线%s关后开启
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(30061, this.data.CustomsNum);
            }
        };
        MemoryModelView.prototype.OnDistroy = function () {
            this.offAll();
        };
        return MemoryModelView;
    }(ui.action.memory.MemoryModelViewUI));
    H52D_Framework.MemoryModelView = MemoryModelView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryModelView.js.map