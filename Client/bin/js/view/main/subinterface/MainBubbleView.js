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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    var MainBubbleView = /** @class */ (function (_super) {
        __extends(MainBubbleView, _super);
        function MainBubbleView() {
            var _this = _super.call(this) || this;
            /**英雄对话初始时间 */
            _this._heroHreoTime = 0;
            /**队长技能提示次数 */
            _this._skillBubblNum = 1;
            /**队长技能提示时间 */
            _this._skillBubblTime = 15000;
            _this._bubbleImage = {
                0: _this.bubble_pet,
                1: _this.bubble_hreo,
                2: _this.bubble_monster,
                3: _this.bubble_skill
            };
            _this._cartridge = new H52D_Framework.Cartridge();
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainBubbleView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent("ClearOneBubble", Laya.Handler.create(this, this.ClearOneBubble));
            H52D_Framework.Event.RegistEvent("StartBubbleMonster", Laya.Handler.create(this, this.StartBubbleMonster));
            H52D_Framework.Event.RegistEvent("ClearBubble", Laya.Handler.create(this, this.ClearBubble));
            H52D_Framework.Event.RegistEvent("SetClickPetButton", Laya.Handler.create(this, this.SetClickPetButton));
        };
        MainBubbleView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("ClearOneBubble", Laya.Handler.create(this, this.ClearOneBubble));
            H52D_Framework.Event.RemoveEvent("StartBubbleMonster", Laya.Handler.create(this, this.StartBubbleMonster));
            H52D_Framework.Event.RemoveEvent("ClearBubble", Laya.Handler.create(this, this.ClearBubble));
            H52D_Framework.Event.RemoveEvent("SetClickPetButton", Laya.Handler.create(this, this.SetClickPetButton));
        };
        MainBubbleView.prototype.InitView = function () {
            this.bubble.visible = true;
            for (var i in this._bubbleImage) {
                this._bubbleImage[i].visible = false;
                this._bubbleImage[i].width = 220;
            }
            this._bubbleImage[2].width = 260;
            this.StartBubble();
        };
        /**气泡渐变 */
        MainBubbleView.prototype.SetBubbleScale = function (bubbleType, scale, hideTime) {
            var _this = this;
            //大小
            H52D_Framework.TweenList.to(this, this._bubbleImage[bubbleType], { scaleX: scale, scaleY: scale }, 200, function () {
                _this._bubbleImage[bubbleType].scale(1, 1);
                if (bubbleType == E_BubbleType.eHero)
                    return;
                H52D_Framework.Tick.Clear(_this, _this.SetBubbleAlpha);
                H52D_Framework.Tick.Once(hideTime, _this, _this.SetBubbleAlpha, [bubbleType]);
            }, 0, Laya.Ease.backInOut);
        };
        /**气泡渐变 */
        MainBubbleView.prototype.SetBubbleAlpha = function (bubbleType) {
            var _this = this;
            H52D_Framework.TweenList.to(this, this._bubbleImage[bubbleType], { alpha: 0 }, 1000, function () {
                _this._bubbleImage[bubbleType].visible = false;
                _this._bubbleImage[bubbleType].alpha = 0;
                _this._bubbleImage[bubbleType].scale(0, 0);
                H52D_Framework.BubbleManager.Instance.bMonsterFirst = false;
                H52D_Framework.Tick.Clear(_this, _this.SetBubbleAlpha);
            }, 0, Laya.Ease.linearIn);
        };
        /**强制关闭所有气泡
         * @param bubbleType 不关闭的气泡类型
         */
        MainBubbleView.prototype.ClearBubble = function (bubbleType) {
            if (bubbleType === void 0) { bubbleType = -1; }
            H52D_Framework.Tick.Clear(this, this.SetBubbleAlpha);
            for (var bubble in this._bubbleImage) {
                if (bubbleType != Number(bubble)) {
                    this._bubbleImage[bubble].visible = false;
                    this._bubbleImage[bubble].alpha = 1;
                    this._bubbleImage[bubble].scale(0, 0);
                }
            }
        };
        /**强制关闭指定气泡
         * @param bubbleType 不关闭的气泡类型
         */
        MainBubbleView.prototype.ClearOneBubble = function (bubbleType) {
            this._bubbleImage[bubbleType].visible = false;
            this._bubbleImage[bubbleType].alpha = 1;
            this._bubbleImage[bubbleType].scale(0, 0);
        };
        /**开启所有气泡入口 */
        MainBubbleView.prototype.StartBubble = function () {
            this._heroHreoTime = H52D_Framework.GameParamConfig.HeroTalkInterval * 1000;
            var monsterTime = H52D_Framework.GameParamConfig.MonsterTalkCD * 1000;
            H52D_Framework.Tick.Loop(this._heroHreoTime, this, this.RandTime);
            H52D_Framework.Tick.Loop(monsterTime, this, this.StartBubbleMonster, [E_BubbleType.eMonster, 1, null, true, true]);
            this.clickPet.on(Laya.Event.CLICK, this, this.StartBubblePet, [E_BubbleType.ePet, 1]);
            H52D_Framework.Tick.Loop(this._skillBubblTime, this, this.StartBubbleSkill, [E_BubbleType.eSkill, 1]);
        };
        MainBubbleView.prototype.RandTime = function () {
            var num = Math.random() * 100;
            var heroTalkProbability = H52D_Framework.GameParamConfig.HeroTalkProbability;
            if (!this.CheckCanShowBubble(-1)) {
                return;
            }
            if (num < heroTalkProbability) {
                this.StartBubbleHreo(E_BubbleType.eHero, 1);
                H52D_Framework.Tick.Clear(this, this.RandTime);
            }
            else {
                this._heroHreoTime = H52D_Framework.GameParamConfig.HeroTalkInterval * 1000;
            }
        };
        /**开启技能提示气泡 */
        MainBubbleView.prototype.StartBubbleSkill = function (bubbleType, scale) {
            var _this = this;
            if (scale === void 0) { scale = 1; }
            //引导中
            if (H52D_Framework.Guidance.Instance._bProceeding) {
                return;
            }
            if (this._skillBubblNum >= 5) {
                return;
            }
            this._skillBubblNum++;
            var x = 370;
            var y = 820;
            var str = H52D_Framework.GetInfoAttr.Instance.GetText(7071);
            var hideTime = 4000;
            var html = this._bubbleImage[bubbleType].getChildByName('text');
            var strLen = str.length / 9 >> 0;
            html.width = this._bubbleImage[bubbleType].width - 8;
            this._bubbleImage[bubbleType].height = 64 + strLen * 26;
            H52D_Framework.SetHtmlStyle(html, 20, "#231614", "left", true);
            html.innerHTML = str;
            this._bubbleImage[bubbleType].x = x;
            this._bubbleImage[bubbleType].y = y;
            this._bubbleImage[bubbleType].visible = true;
            this._bubbleImage[bubbleType].alpha = 1;
            this._bubbleImage[bubbleType].scale(0, 0);
            //大小
            H52D_Framework.TweenList.to(this, this._bubbleImage[bubbleType], { scaleX: scale, scaleY: scale }, 200, function () {
                _this._bubbleImage[bubbleType].scale(1, 1);
                H52D_Framework.Tick.Once(hideTime, _this, function () {
                    H52D_Framework.TweenList.to(_this, _this._bubbleImage[bubbleType], { alpha: 0 }, 1000, function () {
                        _this._bubbleImage[bubbleType].visible = false;
                        _this._bubbleImage[bubbleType].alpha = 0;
                        _this._bubbleImage[bubbleType].scale(0, 0);
                    }, 0, Laya.Ease.linearIn);
                });
            }, 0, Laya.Ease.backInOut);
        };
        /**开启英雄气泡 */
        MainBubbleView.prototype.StartBubbleHreo = function (bubbleType, scale, heroTalkId) {
            var _this = this;
            //引导中
            if (H52D_Framework.Guidance.Instance._bProceeding) {
                return;
            }
            //已经有冒泡进行中
            if (!this.CheckCanShowBubble(-1)) {
                return;
            }
            var id = H52D_Framework.BubbleManager.Instance.RandomHeroBubbleID();
            if (id == null) {
                return;
            }
            this.ClearBubble(E_BubbleType.eSkill);
            var heroWord = H52D_Framework.HeroWordConfig[id];
            this._cartridge.Clear();
            var _loop_1 = function (heroTalkId_1) {
                var x = 0;
                var y = 0;
                var cfg = void 0;
                var heroid;
                var str = "";
                var hideTime = 0;
                var idx = heroTalkId_1;
                var func = Laya.Handler.create(this_1, function () {
                    heroid = heroWord[idx].heroid;
                    str = H52D_Framework.GetInfoAttr.Instance.GetText(heroWord[idx].word[1]);
                    hideTime = heroWord[idx].word[2];
                    if (!H52D_Framework.HeroCardManager.Instance.GetHeroCardByid(heroid)) {
                        return;
                    }
                    x = H52D_Framework.HeroCardManager.Instance.GetHeroCardByid(heroid).PosX + 20;
                    y = H52D_Framework.HeroCardManager.Instance.GetHeroCardByid(heroid).PosY - 72;
                    _this.SetBubble(bubbleType, 1, hideTime, str, 20, x, y);
                });
                this_1._cartridge.AddFunc(func);
                hideTime = heroWord[idx].word[2];
                this_1._cartridge.AddDelay(hideTime);
            };
            var this_1 = this;
            for (var heroTalkId_1 in heroWord) {
                _loop_1(heroTalkId_1);
            }
            var funss = Laya.Handler.create(this, function () {
                _this.SetBubbleAlpha(bubbleType);
                _this._heroHreoTime = H52D_Framework.GameParamConfig.HeroTalkCD * 1000;
                H52D_Framework.Tick.Loop(_this._heroHreoTime, _this, _this.RandTime);
            });
            this._cartridge.AddFunc(funss);
            this._cartridge.AddDelay(100);
            this._cartridge.Do();
        };
        /**开启怪物气泡 */
        MainBubbleView.prototype.StartBubbleMonster = function (bubbleType, scale, bubbleId, b, bfirst) {
            if (bfirst === void 0) { bfirst = false; }
            //引导中
            if (H52D_Framework.Guidance.Instance._bProceeding || H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                return;
            }
            //已经有冒泡进行中
            if (!this.CheckCanShowBubble(bubbleType)) {
                return;
            }
            H52D_Framework.BubbleManager.Instance.bMonsterFirst = bfirst;
            H52D_Framework.BubbleManager.Instance.bMonsterBubble = b;
            this.ClearBubble(E_BubbleType.eSkill);
            var x = 0;
            var y = 0;
            var cfg;
            var id = 0;
            var str = "";
            var hideTime = 0;
            var monId = 0;
            if (H52D_Framework.MonsterManager.Instance.monsterList == null || H52D_Framework.MonsterManager.Instance.monsterList[0] == null) {
                return;
            }
            monId = H52D_Framework.MonsterManager.Instance.monsterList[0].vo.id;
            var nameId = H52D_Framework.MonstorConfig[monId].NameId;
            id = bubbleId ? bubbleId : nameId;
            if (!H52D_Framework.MonsterWordConfig[id]) {
                return;
            }
            var MonstorWord = H52D_Framework.MonsterWordConfig[id].word;
            var MonstorCfgLen = H52D_Framework.GetTabLength(MonstorWord);
            var RandId = (Math.random() * MonstorCfgLen) + 1 << 0;
            var strId = H52D_Framework.MonsterWordConfig[id].word[RandId][1];
            str = H52D_Framework.GetInfoAttr.Instance.GetText(strId);
            hideTime = H52D_Framework.MonsterWordConfig[id].word[RandId][2];
            if (H52D_Framework.CustomsManager.Instance.bBoss) {
                x = H52D_Framework.MonsterManager.Instance.monsterList[0].PosX - 200;
                y = H52D_Framework.MonsterManager.Instance.monsterList[0].PosY - 300;
            }
            else {
                x = H52D_Framework.MonsterManager.Instance.monsterList[0].PosX - 150;
                y = H52D_Framework.MonsterManager.Instance.monsterList[0].PosY - 250;
            }
            this.SetBubble(bubbleType, 1, hideTime, str, 20, x, y);
        };
        /**开启神兽气泡 */
        MainBubbleView.prototype.StartBubblePet = function (bubbleType, scale, bubbleId) {
            //引导中
            if (H52D_Framework.Guidance.Instance._bProceeding) {
                return;
            }
            //已经有冒泡进行中
            if (!this.CheckCanShowBubble(bubbleType) || H52D_Framework.PetManager.Instance.CurrentpetID == 0) {
                return;
            }
            this.ClearBubble(E_BubbleType.eSkill);
            var x = 0;
            var y = 0;
            var cfg;
            var str = "";
            var strLen = 0;
            var hideTime = 0;
            var id = bubbleId;
            var petLen = H52D_Framework.GetTabLength(H52D_Framework.PetWordConfig);
            var sceneId = H52D_Framework.SceneManager.Instance.sceneId - 10000;
            id = (Math.random() * petLen) + 1 << 0;
            ;
            str = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PetWordConfig[id].word[1]);
            hideTime = H52D_Framework.PetWordConfig[id].word[2];
            x = H52D_Framework.PetPoint[sceneId][0] + 10;
            y = H52D_Framework.PetPoint[sceneId][1] - 80;
            this.SetBubble(bubbleType, 1, hideTime, str, 18, x, y);
        };
        /**
         * 设置气泡统一接口
         * @param bubbleType 气泡类型
         * @param scale 气泡大小
         * @param hideTime 气泡持续时间
         * @param str 气泡内容
         * @param strScale 气泡内容文字大小
         * @param x 气泡x轴
         * @param y 气泡y轴
         */
        MainBubbleView.prototype.SetBubble = function (bubbleType, scale, hideTime, str, strScale, x, y) {
            var html = this._bubbleImage[bubbleType].getChildByName('text');
            var strLen = str.length / 9 >> 0;
            html.width = this._bubbleImage[bubbleType].width - 6;
            this._bubbleImage[bubbleType].height = 64 + strLen * 24;
            H52D_Framework.SetHtmlStyle(html, strScale, "#231614", "left", true);
            html.innerHTML = str;
            this._bubbleImage[bubbleType].x = x;
            this._bubbleImage[bubbleType].y = y;
            this._bubbleImage[bubbleType].alpha = 1;
            this._bubbleImage[bubbleType].scale(0, 0);
            this._bubbleImage[bubbleType].visible = true;
            this.SetBubbleScale(bubbleType, scale, hideTime);
        };
        MainBubbleView.prototype.CheckCanShowBubble = function (bubbleType) {
            for (var eBubbleType in this._bubbleImage) {
                if (Number(eBubbleType) == E_BubbleType.eSkill) {
                    continue;
                }
                if (bubbleType != Number(eBubbleType)) {
                    var image = this._bubbleImage[eBubbleType];
                    if (image.visible) {
                        return false;
                    }
                }
            }
            return true;
        };
        MainBubbleView.prototype.SetClickPetButton = function (x, y) {
            this.clickPet.x = x;
            this.clickPet.y = y;
        };
        return MainBubbleView;
    }(ui.main.subinterface.MainBubbleViewUI));
    H52D_Framework.MainBubbleView = MainBubbleView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainBubbleView.js.map