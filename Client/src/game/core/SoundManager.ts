module H52D_Framework {
    export class SoundManager {
        private static _inst: SoundManager;
        public static get Instance() {
            if (SoundManager._inst == null)
                SoundManager._inst = new SoundManager();
            return SoundManager._inst;
        }

        /**播放背景音乐 */
        public OnPlayMusic(url: string): void {
            if (StringIsEmpty(url)) {
                return
            }
            if (MasterPlayer.Instance.player.Music) {
                if (SDKManager.Instance.isWx) {
                    WxSoundManager.Inst.OnPlayMusic(url);
                }
                else {
                    Laya.SoundManager.playMusic(url, 0);
                }
            }
        }

        /**停止播放背景音乐 */
        public OnStopMusic(): void {
            if (SDKManager.Instance.isWx) {
                WxSoundManager.Inst.OnStopMusic();
            }
            else {
                Laya.SoundManager.stopMusic();
            }
        }

        /**播放音效,音效可以同时播放多个 */
        public OnPlaySound(url: string, loop: number = 1): void {
            if (StringIsEmpty(url)) {
                return
            }
            if (MasterPlayer.Instance.player.Sound) {
                if (SDKManager.Instance.isWx) {
                    if (this.CheckCountDown(url)) {
                        return;
                    }
                    WxSoundManager.Inst.OnPlaySound(url, loop == 1 ? false : true);
                }
                else {
                    Laya.SoundManager.playSound(url, loop);
                }
            }
        }

        /**停止音效播放 */
        public OnStopSound(url: string): void {
            if (StringIsEmpty(url)) {
                return
            }
            if (SDKManager.Instance.isWx) {
                WxSoundManager.Inst.OnStopSoundByUrl(url);
            }
            else {
                Laya.SoundManager.stopSound(url);
            }
        }

        /**检测音效公共CD */
        private _checkList: Array<string> = [
            "res/sound/gold_sound.mp3",
            "res/sound/tap_sound.mp3",
            "res/sound/effect_hit01.mp3"
        ];
        private _cdList: Array<string> = [];
        private CheckCountDown(url: string): boolean {
            if (this._checkList.indexOf(url) > -1) {
                if (this._cdList.indexOf(url) > -1) {
                    return true;
                }
                else {
                    this._cdList.push(url);
                    Tick.Once(500, this, () => {
                        this._cdList.splice(this._cdList.indexOf(url) - 1, 1);
                    })
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }

    export class WxSoundManager {
        private static _inst: WxSoundManager;
        public static get Inst() {
            if (WxSoundManager._inst == null)
                WxSoundManager._inst = new WxSoundManager();
            return WxSoundManager._inst;
        }

        private _backgroundMusic: any;
        private _soundList: Array<any> = [];

        constructor() {
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onShow(() => {
                    this._backgroundMusic.play();
                })
            }
        }

        /**播放背景音乐 */
        public OnPlayMusic(url: string): void {
            if (!this._backgroundMusic) {
                this._backgroundMusic = Laya.Browser.window.wx.createInnerAudioContext();
                this._backgroundMusic.loop = true;
            }
            let path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            if (this._backgroundMusic.src != path) {
                this._backgroundMusic.src = path;
            }
            this._backgroundMusic.play();
        }

        /**停止播放背景音乐 */
        public OnStopMusic(): void {
            if (this._backgroundMusic) {
                this._backgroundMusic.stop();
            }
        }

        /**播放音效 */
        public OnPlaySound(url: string, loop?: boolean): void {
            let innerAudioContext = Laya.Browser.window.wx.createInnerAudioContext();
            innerAudioContext.loop = loop ? true : false;
            let path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            innerAudioContext.src = path;
            innerAudioContext.play();
            if (!loop) {
                innerAudioContext.onEnded(() => {
                    this.OnStopSoundByObj(innerAudioContext);
                })
            }
            this._soundList.push(innerAudioContext);
        }

        /**根据地址停止音效播放 */
        public OnStopSoundByUrl(url: any): void {
            let path = Laya.URL.basePath + Laya.ResourceVersion.addVersionPrefix(url);
            for (let i = this._soundList.length - 1; i >= 0; i--) {
                if (this._soundList[i].src == path) {
                    this._soundList[i].destroy();
                    this._soundList[i] = null;
                    this._soundList.splice(i, 1);
                }
            }
        }

        /**根据对象停止音效播放 */
        private OnStopSoundByObj(obj: any) {
            for (let i = this._soundList.length - 1; i >= 0; i--) {
                if (this._soundList[i] == obj) {
                    this._soundList[i].destroy();
                    this._soundList[i] = null;
                    this._soundList.splice(i, 1);
                    return;
                }
            }
        }
    }
}