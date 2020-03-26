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
/**剧情*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("StoryView", [
        { url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS },
    ]);
    var StoryView = /** @class */ (function (_super) {
        __extends(StoryView, _super);
        function StoryView(buf) {
            var _this = _super.call(this) || this;
            _this.AddEvent();
            _this.Init(buf);
            return _this;
        }
        StoryView.prototype.Init = function (buf) {
            var sound = buf[1][1].sound;
            var shake = buf[1][1].shake;
            var AnimaName = buf[1][1].AnimaName;
            var strFlieName = buf[1][1].strFlieName;
            this.PlaySound(sound, shake);
            this.PlayStory(strFlieName, AnimaName);
        };
        StoryView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.overBtn.on(Laya.Event.CLICK, this, this.OverStory);
        };
        StoryView.prototype.OnDestroy = function () {
            this.offAll();
        };
        //播放音效、震屏处理
        StoryView.prototype.PlaySound = function (sound, shake) {
            var _loop_1 = function (key) {
                var time = sound[key][1];
                var soundName = sound[key][2];
                H52D_Framework.Tick.Once(time, this_1, function () {
                    H52D_Framework.SoundManager.Instance.OnStopMusic();
                    H52D_Framework.SoundManager.Instance.OnPlaySound(soundName);
                });
            };
            var this_1 = this;
            //播放音效
            for (var key in sound) {
                _loop_1(key);
            }
            var _loop_2 = function (key) {
                var time = shake[key][1];
                var value_1 = shake[key][2];
                var value_2 = shake[key][3];
                H52D_Framework.Tick.Once(time, this_2, function () {
                    H52D_Framework.EffectManager.Instance.StartShock(value_1, true, value_2);
                });
            };
            var this_2 = this;
            //震屏
            for (var key in shake) {
                _loop_2(key);
            }
        };
        //播放动画
        StoryView.prototype.PlayStory = function (aimUrl, aimNameArr) {
            var _this = this;
            if (this._storyImgMod != null) {
                this._storyImgMod.Destroy();
            }
            //动画名字
            var aimName;
            //延迟播放、结束时间
            var standingTime = 0;
            this._storyImgMod = new H52D_Framework.Avatar(this.aim);
            this._storyImgMod.Load(aimUrl, 1, 0.69, 0, 0, Laya.Handler.create(this, function () {
                aimName = aimNameArr[1][2];
                standingTime = aimNameArr[1][1];
                H52D_Framework.OneTimer(standingTime, function () {
                    _this._storyImgMod.Play(aimName, false, null, function () {
                        aimName = aimNameArr[2][2];
                        standingTime = aimNameArr[2][1];
                        H52D_Framework.OneTimer(standingTime, function () {
                            _this._storyImgMod.Play(aimName, false, null, function () {
                                aimName = aimNameArr[3][2];
                                standingTime = aimNameArr[3][1];
                                H52D_Framework.OneTimer(standingTime, function () {
                                    _this._storyImgMod.Play(aimName, false, null, function () {
                                        _this.OverStory();
                                    });
                                });
                            });
                        });
                    });
                });
            }));
        };
        //结束动画
        StoryView.prototype.OverStory = function () {
            if (this._storyImgMod != null) {
                this._storyImgMod.Destroy();
            }
            H52D_Framework.BattleManager.Instance.OpenBattle();
            if (H52D_Framework.UIManager.Instance.IsHave("StoryView", H52D_Framework.ViewStoryRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("StoryView", [H52D_Framework.ViewStoryRoot], Laya.Handler.create(this, function () {
                    H52D_Framework.Event.DispatchEvent("StoryEvent");
                }));
            }
        };
        return StoryView;
    }(ui.guidance.StoryViewUI));
    H52D_Framework.StoryView = StoryView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=StoryView.js.map