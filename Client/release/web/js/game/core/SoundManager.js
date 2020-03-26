var H52D_Framework;
(function (H52D_Framework) {
    var SoundManager = /** @class */ (function () {
        function SoundManager() {
            /**检测音效公共CD */
            this._checkList = [
                "res/sound/gold_sound.mp3",
                "res/sound/tap_sound.mp3",
                "res/sound/effect_hit01.mp3"
            ];
            this._cdList = [];
        }
        Object.defineProperty(SoundManager, "Instance", {
            get: function () {
                if (SoundManager._inst == null)
                    SoundManager._inst = new SoundManager();
                return SoundManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**播放背景音乐 */
        SoundManager.prototype.OnPlayMusic = function (url) {
            if (H52D_Framework.StringIsEmpty(url)) {
                return;
            }
            if (H52D_Framework.MasterPlayer.Instance.player.Music) {
                if (H52D_Framework.SDKManager.Instance.isWx) {
                    WxSoundManager.Inst.OnPlayMusic(url);
                }
                else {
                    Laya.SoundManager.playMusic(url, 0);
                }
            }
        };
        /**停止播放背景音乐 */
        SoundManager.prototype.OnStopMusic = function () {
            if (H52D_Framework.SDKManager.Instance.isWx) {
                WxSoundManager.Inst.OnStopMusic();
            }
            else {
                Laya.SoundManager.stopMusic();
            }
        };
        /**播放音效,音效可以同时播放多个 */
        SoundManager.prototype.OnPlaySound = function (url, loop) {
            if (loop === void 0) { loop = 1; }
            if (H52D_Framework.StringIsEmpty(url)) {
                return;
            }
            if (H52D_Framework.MasterPlayer.Instance.player.Sound) {
                if (H52D_Framework.SDKManager.Instance.isWx) {
                    if (this.CheckCountDown(url)) {
                        return;
                    }
                    WxSoundManager.Inst.OnPlaySound(url, loop == 1 ? false : true);
                }
                else {
                    Laya.SoundManager.playSound(url, loop);
                }
            }
        };
        /**停止音效播放 */
        SoundManager.prototype.OnStopSound = function (url) {
            if (H52D_Framework.StringIsEmpty(url)) {
                return;
            }
            if (H52D_Framework.SDKManager.Instance.isWx) {
                WxSoundManager.Inst.OnStopSoundByUrl(url);
            }
            else {
                Laya.SoundManager.stopSound(url);
            }
        };
        SoundManager.prototype.CheckCountDown = function (url) {
            var _this = this;
            if (this._checkList.indexOf(url) > -1) {
                if (this._cdList.indexOf(url) > -1) {
                    return true;
                }
                else {
                    this._cdList.push(url);
                    H52D_Framework.Tick.Once(500, this, function () {
                        _this._cdList.splice(_this._cdList.indexOf(url) - 1, 1);
                    });
                    return false;
                }
            }
            else {
                return false;
            }
        };
        return SoundManager;
    }());
    H52D_Framework.SoundManager = SoundManager;
    var WxSoundManager = /** @class */ (function () {
        function WxSoundManager() {
            var _this = this;
            this._soundList = [];
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onShow(function () {
                    _this._backgroundMusic.play();
                });
            }
        }
        Object.defineProperty(WxSoundManager, "Inst", {
            get: function () {
                if (WxSoundManager._inst == null)
                    WxSoundManager._inst = new WxSoundManager();
                return WxSoundManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**播放背景音乐 */
        WxSoundManager.prototype.OnPlayMusic = function (url) {
            if (!this._backgroundMusic) {
                this._backgroundMusic = Laya.Browser.window.wx.createInnerAudioContext();
                this._backgroundMusic.loop = true;
            }
            var path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            if (this._backgroundMusic.src != path) {
                this._backgroundMusic.src = path;
            }
            this._backgroundMusic.play();
        };
        /**停止播放背景音乐 */
        WxSoundManager.prototype.OnStopMusic = function () {
            if (this._backgroundMusic) {
                this._backgroundMusic.stop();
            }
        };
        /**播放音效 */
        WxSoundManager.prototype.OnPlaySound = function (url, loop) {
            var _this = this;
            var innerAudioContext = Laya.Browser.window.wx.createInnerAudioContext();
            innerAudioContext.loop = loop ? true : false;
            var path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            innerAudioContext.src = path;
            innerAudioContext.play();
            if (!loop) {
                innerAudioContext.onEnded(function () {
                    _this.OnStopSoundByObj(innerAudioContext);
                });
            }
            this._soundList.push(innerAudioContext);
        };
        /**根据地址停止音效播放 */
        WxSoundManager.prototype.OnStopSoundByUrl = function (url) {
            var path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            for (var i = this._soundList.length - 1; i >= 0; i--) {
                if (this._soundList[i].src == path) {
                    this._soundList[i].destroy();
                    this._soundList[i] = null;
                    this._soundList.splice(i, 1);
                }
            }
        };
        /**根据对象停止音效播放 */
        WxSoundManager.prototype.OnStopSoundByObj = function (obj) {
            for (var i = this._soundList.length - 1; i >= 0; i--) {
                if (this._soundList[i] == obj) {
                    this._soundList[i].destroy();
                    this._soundList[i] = null;
                    this._soundList.splice(i, 1);
                    return;
                }
            }
        };
        return WxSoundManager;
    }());
    H52D_Framework.WxSoundManager = WxSoundManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SoundManager.js.map