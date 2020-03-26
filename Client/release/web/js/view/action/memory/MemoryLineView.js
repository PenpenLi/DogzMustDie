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
    var MemoryLineView = /** @class */ (function (_super) {
        __extends(MemoryLineView, _super);
        function MemoryLineView() {
            var _this = _super.call(this) || this;
            /** 被封的出口 0下, 1左, 2上, 3右*/
            _this._into = 0;
            _this.ViewInit();
            return _this;
        }
        MemoryLineView.prototype.ViewInit = function () {
            this.hor.visible = false;
            this.ver.visible = false;
            this.corner_lt.visible = false;
            this.corner_lb.visible = false;
            this.corner_rt.visible = false;
            this.corner_rb.visible = false;
            this.hor_light.visible = false;
            this.ver_light.visible = false;
            this.lt_light.visible = false;
            this.lb_light.visible = false;
            this.rt_light.visible = false;
            this.rb_light.visible = false;
        };
        Object.defineProperty(MemoryLineView.prototype, "into", {
            get: function () {
                return this._into;
            },
            set: function (value) {
                this._into = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 选择路线
         * @param p 路线类型：1左上，2上左，3右上，4上右
         */
        MemoryLineView.prototype.ChoosePath = function (end) {
            this.hor.visible = this.x != end.x;
            if (this.hor.visible) {
                this.hor.width = Math.abs(this.x - end.x) - 32;
            }
            this.ver.visible = this.y != end.y;
            if (this.ver.visible) {
                this.ver.height = Math.abs(this.y - end.y) - 32;
            }
            if (this.y > end.y) {
                if (this.x < end.x) {
                    //右侧封堵
                    if (this.into == 3) {
                        this.hor.x = 16;
                        this.hor.y = end.y - this.y;
                        this.ver.x = 0;
                        this.ver.y = end.y - this.y + 16;
                        this.corner_lt.x = 0;
                        this.corner_lt.y = end.y - this.y;
                        this.corner_lt.visible = true;
                        this.into = 1;
                    }
                    else {
                        this.hor.x = 16;
                        this.hor.y = 0;
                        this.ver.x = end.x - this.x;
                        this.ver.y = end.y - this.y + 16;
                        this.corner_rb.x = end.x - this.x;
                        this.corner_rb.y = 0;
                        this.corner_rb.visible = true;
                        this.into = 0;
                    }
                }
                else if (this.x > end.x) {
                    //左侧封堵,从上面走
                    if (this.into == 1) {
                        this.hor.x = end.x - this.x + 16;
                        this.hor.y = end.y - this.y;
                        this.ver.x = 0;
                        this.ver.y = end.y - this.y + 16;
                        this.corner_rt.x = 0;
                        this.corner_rt.y = end.y - this.y;
                        this.corner_rt.visible = true;
                        this.into = 3;
                    }
                    else {
                        this.hor.x = end.x - this.x + 16;
                        this.hor.y = 0;
                        this.ver.x = end.x - this.x;
                        this.ver.y = end.y - this.y + 16;
                        this.corner_lb.x = end.x - this.x;
                        this.corner_lb.y = 0;
                        this.corner_lb.visible = true;
                        this.into = 0;
                    }
                }
                else if (this.x == end.x) {
                    if (this.y > end.y) {
                        this.ver.x = 0;
                        this.ver.y = end.y - this.y + 16;
                        this.into = 0;
                    }
                }
            }
            else if (this.y <= end.y) {
                if (this.x < end.x) {
                    this.hor.x = 16;
                    this.hor.y = 0;
                    this.into = 1;
                }
                else if (this.x > end.x) {
                    this.hor.x = end.x - this.x + 16;
                    this.hor.y = 0;
                    this.into = 3;
                }
                this.ver.visible = false;
            }
        };
        /** 完成 */
        MemoryLineView.prototype.Complete = function (doing) {
            if (this.hor.visible) {
                this.hor_light.width = this.hor.width;
                this.hor_light.visible = doing;
            }
            if (this.ver.visible) {
                this.ver_light.height = this.ver.height;
                this.ver_light.visible = doing;
            }
            if (this.corner_lt.visible)
                this.lt_light.visible = doing;
            if (this.corner_lb.visible)
                this.lb_light.visible = doing;
            if (this.corner_rt.visible)
                this.rt_light.visible = doing;
            if (this.corner_rb.visible)
                this.rb_light.visible = doing;
        };
        return MemoryLineView;
    }(ui.action.memory.MemoryLineViewUI));
    H52D_Framework.MemoryLineView = MemoryLineView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryLineView.js.map