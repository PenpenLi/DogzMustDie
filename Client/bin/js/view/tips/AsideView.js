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
    H52D_Framework.AddViewResource("AsideView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS }
    ]);
    var AsideView = /** @class */ (function (_super) {
        __extends(AsideView, _super);
        function AsideView(buf) {
            var _this = _super.call(this) || this;
            _this.character = ["<br>", "&nbsp;", "&lt;", "&gt;", "&amp;", "&quot;", "&apos;"];
            /** 对话上一个是不是队长 */
            _this.captain = false;
            var id = buf[1];
            _this.callBack = buf[2];
            var cfg = H52D_Framework.AsideConfig[id];
            if (cfg == null) {
                _this.Exit();
            }
            else {
                _this.list = [];
                for (var i in cfg) {
                    _this.list.push(cfg[i]);
                }
                _this.index = 0;
                _this.position = _this.list[_this.index]["position"];
                _this.hero.visible = _this.position == 1 || _this.position == 2;
                _this.black.visible = _this.position == 0;
                if (_this.position == 0) {
                    //没有英雄，则显示黑屏
                    _this.currentContent = _this.tx_black;
                    H52D_Framework.SetHtmlStyle(_this.currentContent, 38, "#ffffff", "left");
                    _this.ContentWrite();
                }
                else {
                    _this.Location(_this.position);
                    _this.currentContent = _this.tx_hero;
                    H52D_Framework.SetHtmlStyle(_this.currentContent, 28, "#16184a", "left");
                    _this.canClick = false;
                    _this.path = "";
                    _this.Action();
                }
                _this.InitEvent();
            }
            return _this;
        }
        AsideView.prototype.InitEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.on(Laya.Event.CLICK, this, this.ClickHander);
        };
        AsideView.prototype.Destroy = function () {
            if (this.callBack) {
                this.callBack.run();
            }
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            if (this.avatar) {
                this.avatar.Destroy();
                this.avatar = null;
            }
        };
        /** 点击事件 */
        AsideView.prototype.ClickHander = function () {
            if (this.canClick && this.index < this.list.length) {
                //字没有写完，让写字瞬间完成
                if (this.writeIndex < this.list[this.index]["strtext"].length) {
                    this.writeIndex = this.list[this.index]["strtext"].length;
                    this.Write();
                }
                //字写完了，条到下一步
                else {
                    this.NextStep();
                }
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            }
        };
        /** 下一步动作 */
        AsideView.prototype.NextStep = function () {
            H52D_Framework.Tick.Clear(this, this.NextStep);
            //下一步有内容，跳转到下一步内容
            if (typeof (this.index) == "number" && ++this.index < this.list.length) {
                this.Action();
            }
            //最后一步，退出
            else {
                this.Exit();
            }
        };
        /** 退出 */
        AsideView.prototype.Exit = function () {
            var _this = this;
            this.canClick = false;
            Laya.Tween.to(this.avart_bg, { x: this.ASX }, 200, Laya.Ease.linearInOut);
            Laya.Tween.to(this.text_bg, { y: this.CSY }, 200, Laya.Ease.linearInOut);
            Laya.Tween.to(this, { alpha: 0 }, 300, Laya.Ease.linearInOut, null, 200);
            H52D_Framework.OneTimer(500, function () {
                H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [H52D_Framework.ViewStoryRoot]);
            });
        };
        /** 模型的动作 */
        AsideView.prototype.Action = function () {
            var path = this.list[this.index]["strmodel"];
            if (path == "0") {
                if (this.avatar != null) {
                    this.avatar.Destroy();
                }
                this.path = path;
                this.tx_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(this.list[this.index]["name"]);
                this.Location(this.list[this.index]["position"]);
                this.ContentWrite();
            }
            else if (this.path != path && (path != "-1" || !this.captain)) {
                //特殊处理，使用队长头像及姓名
                if (path == "-1") {
                    var list = H52D_Framework.HeroManager.Instance.Herolist;
                    for (var heroid in list) {
                        if (list[heroid].location == 4) {
                            this.path = list[heroid].ModlePath;
                            this.tx_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(list[heroid].heroCfg.name);
                            this.captain = true;
                            break;
                        }
                    }
                }
                else {
                    this.path = path;
                    this.tx_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(this.list[this.index]["name"]);
                    this.captain = false;
                }
                this.Location(this.list[this.index]["position"]);
                var direction = this.list[this.index]["direction"] == 1 ? AvatarDirection.right : AvatarDirection.left;
                var scale = this.list[this.index]["scaling"];
                if (this.avatar) {
                    this.avatar.Destroy();
                }
                //有英雄，显示带英雄面板
                this.avatar = new H52D_Framework.Avatar(this.avart_bg);
                this.avatar.Load(this.path, direction, scale, 0, 0, Laya.Handler.create(this, this.Complete));
            }
            else {
                this.AvatarPlay(); //说话
                this.ContentWrite(); //写字
            }
        };
        /** 动作加载完成 */
        AsideView.prototype.Complete = function () {
            var _this = this;
            if (this.list[this.index] == null) {
                return;
            }
            if (this.avatar) {
                this.avatar.Play(this.list[this.index]["tole"]);
            }
            Laya.Tween.to(this.avart_bg, { x: this.AEX }, 200);
            Laya.Tween.to(this.text_bg, { y: this.CEY }, 200);
            H52D_Framework.OneTimer(200, function () {
                _this.AvatarPlay();
                _this.ContentWrite();
            });
        };
        /** 人物说话动作 */
        AsideView.prototype.AvatarPlay = function () {
            var _this = this;
            this.avart_bg.x = this.AEX;
            this.canClick = false;
            if (this.list && this.index < this.list.length && this.avatar) {
                this.avatar.Play(this.list[this.index]["speak"], false, true, function () {
                    if (_this.avatar && _this.list && _this.index < _this.list.length) {
                        _this.avatar.Play(_this.list[_this.index]["tole"]);
                        _this.canClick = true;
                    }
                    _this.canClick = true;
                });
                H52D_Framework.SoundManager.Instance.OnPlaySound(this.list[this.index]["strsound"]);
            }
            else {
                this.canClick = true;
            }
        };
        /** 内容页写字 */
        AsideView.prototype.ContentWrite = function () {
            this.text_bg.y = this.CEY;
            this.canClick = true;
            this.writeIndex = 0;
            this.Write();
            H52D_Framework.Tick.Loop(60, this, this.Write);
        };
        /** 写字动作 */
        AsideView.prototype.Write = function () {
            if (this.index < this.list.length) {
                var content = this.list[this.index]["strtext"];
                for (var i in this.character) {
                    var char = this.character[i];
                    if (content.slice(this.writeIndex, this.writeIndex + char.length) == char) {
                        this.writeIndex += char.length;
                    }
                }
                this.currentContent.innerHTML = content.slice(0, this.writeIndex) + "_";
                this.writeIndex++;
                // 写字完成
                if (this.writeIndex >= content.length) {
                    this.currentContent.innerHTML = content;
                    H52D_Framework.Tick.Clear(this, this.Write);
                    /** 等待下一步 */
                    H52D_Framework.Tick.Once(5000, this, this.NextStep);
                }
            }
            else {
                H52D_Framework.Tick.Clear(this, this.Write);
                H52D_Framework.Tick.Once(5000, this, this.NextStep);
            }
        };
        /** 位置 */
        AsideView.prototype.Location = function (pos) {
            if (pos == 1) {
                this.AY = 900;
                this.ASX = -200;
                this.AEX = 120;
                this.CEY = 800;
            }
            else if (pos == 2) {
                this.AY = 700;
                this.ASX = 950;
                this.AEX = 600;
                this.CEY = 600;
            }
            this.CSY = 1500;
            this.avart_bg.y = this.AY;
            this.avart_bg.x = this.ASX;
            this.text_bg.y = this.CSY;
        };
        return AsideView;
    }(ui.tips.AsideViewUI));
    H52D_Framework.AsideView = AsideView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AsideView.js.map