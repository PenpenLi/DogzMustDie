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
    var ChatFaceResView = /** @class */ (function (_super) {
        __extends(ChatFaceResView, _super);
        function ChatFaceResView() {
            var _this = _super.call(this) || this;
            _this._pageNum = 0;
            _this._offX = 0;
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            _this.list.hScrollBarSkin = "";
            _this.list.array = H52D_Framework.ChatLogic.Inst.FaceList;
            //this.list.repeatX = ChatLogic.Inst.FaceList.length
            _this.list.renderHandler = new Laya.Handler(_this, _this.RenderHandler);
            _this.on(Laya.Event.MOUSE_DOWN, _this, function () {
                _this._offX = Laya.MouseManager.instance.mouseX;
            });
            _this.rights.visible = true;
            _this.lefts.visible = false;
            _this.on(Laya.Event.MOUSE_UP, _this, function () {
                //向左画
                if (_this._offX - Laya.MouseManager.instance.mouseX > 150) {
                    if (_this._pageNum < H52D_Framework.ChatLogic.Inst.FaceList.length - 1) {
                        _this._pageNum++;
                    }
                }
                else if (Laya.MouseManager.instance.mouseX - _this._offX > 150) {
                    if (_this._pageNum > 0) {
                        _this._pageNum--;
                    }
                }
                _this.list.tweenTo(_this._pageNum, 2.0, new Laya.Handler(_this, function () {
                    _this.list.scrollBar.stopScroll();
                    _this.UpdateLeftRight();
                }));
            });
            _this.lefts.on(Laya.Event.CLICK, _this, function () {
                if (_this._pageNum > 0) {
                    _this._pageNum--;
                    _this.list.tweenTo(_this._pageNum, 2.0, new Laya.Handler(_this, function () {
                        _this.list.scrollBar.stopScroll();
                        _this.UpdateLeftRight();
                    }));
                }
            });
            _this.rights.on(Laya.Event.CLICK, _this, function () {
                if (_this._pageNum < H52D_Framework.ChatLogic.Inst.FaceList.length - 1) {
                    _this._pageNum++;
                    _this.list.tweenTo(_this._pageNum, 2.0, new Laya.Handler(_this, function () {
                        _this.list.scrollBar.stopScroll();
                        _this.UpdateLeftRight();
                    }));
                }
            });
            return _this;
        }
        /** 刷新左右按钮 */
        ChatFaceResView.prototype.UpdateLeftRight = function () {
            this.rights.visible = true;
            this.lefts.visible = true;
            if (this._pageNum == 0) {
                this.lefts.visible = false;
            }
            else if (this._pageNum == H52D_Framework.ChatLogic.Inst.FaceList.length - 1) {
                this.rights.visible = false;
            }
        };
        /**  @param callBack:初始化回调(点击表情回调通知点击的图片类型) **/
        ChatFaceResView.prototype.init = function (callBack) {
            this._callBack = callBack;
            this.initEvent();
        };
        /** click事件添加**/
        ChatFaceResView.prototype.initEvent = function () {
        };
        /** click事件移除,便于销毁调用**/
        ChatFaceResView.prototype.removeEvent = function () {
        };
        /**list */
        ChatFaceResView.prototype.RenderHandler = function (item, index) {
            var page = H52D_Framework.ChatLogic.Inst.FaceList[index];
            for (var idx = 0; idx < item._childs.length; idx++) {
                var id = page[idx];
                var itemChild = item.getChildByName("item" + idx);
                if (id != null) {
                    itemChild.visible = true;
                    var icon = "i_f";
                    if (H52D_Framework.IsNotBaiDuSdk()) {
                        icon = "face";
                    }
                    itemChild.skin = "ui_chat/" + icon + id + ".png";
                    itemChild.on(Laya.Event.CLICK, this, this.onFaceImgClick, [id]);
                }
                else {
                    itemChild.visible = false;
                }
            }
        };
        /** 表情图片点击注册事件  **/
        ChatFaceResView.prototype.onFaceImgClick = function (type, evt) {
            //runWith执行处理器，携带额外数据。"@" + type + "@"就是图片类型
            this._callBack != null && (this._callBack.runWith(["@" + type + "@"]));
        };
        /** 销毁 **/
        ChatFaceResView.prototype.dispose = function () {
            this.removeEvent();
            this.removeSelf();
        };
        ChatFaceResView.prototype.Destroy = function () {
            this.offAll();
        };
        return ChatFaceResView;
    }(ui.Chat.ChatFaceResViewUI));
    H52D_Framework.ChatFaceResView = ChatFaceResView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChatFaceResView.js.map