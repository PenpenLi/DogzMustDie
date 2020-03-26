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
    H52D_Framework.AddViewResource("HeroWar", [
        { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS } //ui_action	
    ]);
    var HeroWar = /** @class */ (function (_super) {
        __extends(HeroWar, _super);
        function HeroWar(buf) {
            var _this = _super.call(this) || this;
            /**选择的上阵位置 */
            _this._HasHeroList = [];
            _this._Lveffect = {};
            _this.bool = true;
            _this._heroAvatarMap = {};
            /** 拖拽物 */
            _this.nDragHeroID = null;
            /** 记录拖拽物坐标 */
            _this.tDragPos = [0, 0];
            /** 记录之前的位置颜色 */
            _this.sFlagColorSkin = [];
            _this._heroPathFlagMap = {};
            _this.old_heroid = 0;
            _this.bGuidanceButton = true;
            //正在布阵当中
            H52D_Framework.HeroPosition.Instance._bHeroWar = true;
            _this.BackGround.skin = "res/ui/ui_noPack/img-daguanchangjing-huantixiangfeng.png";
            _this._heroAvatarMap = {};
            _this._heroPathFlagMap = {};
            _this.nDragHeroID = null;
            _this.sFlagColorSkin = [];
            _this.dragHeroIcon.visible = false;
            _this.heroView = buf[1];
            H52D_Framework.HeroPosition.Instance.InitPosInfo();
            H52D_Framework.Event.RegistEvent("ExchangePlace", Laya.Handler.create(_this, _this.NewTeach_changewar));
            H52D_Framework.Event.RegistEvent("btn_closes", Laya.Handler.create(_this, _this.Btn_Close));
            H52D_Framework.Event.RegistEvent('Destroy', Laya.Handler.create(_this, _this.OnDestroy));
            H52D_Framework.Event.RegistEvent('OnMouseUp', Laya.Handler.create(_this, _this.MouseUp));
            H52D_Framework.Event.RegistEvent('SaveWar', Laya.Handler.create(_this, _this.NewTeach_war));
            H52D_Framework.Event.RegistEvent('PutHero', Laya.Handler.create(_this, _this.PutHero));
            H52D_Framework.Event.RegistEvent('fsTen', Laya.Handler.create(_this, _this.NewTeach_wars));
            H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [false]);
            // 缓存已有英雄列表
            for (var nHeroID in H52D_Framework.HeroManager.Instance.Herolist) {
                _this._HasHeroList.push(nHeroID);
            }
            _this.Btn_save.on(Laya.Event.CLICK, _this, _this.SaveBtnClick);
            //引导按钮
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 1000, _this.Btn_save);
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 2000, _this.dragpos0);
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 3000, _this.dragpos4);
            for (var pos = 0; pos <= 8; pos++) {
                _this["dragpos" + pos].on(Laya.Event.MOUSE_DOWN, _this, _this.CurMouseDown, [pos]);
            }
            _this.UpdatePosView();
            _this.UpateHeroLsit();
            _this.INfo();
            _this.bgbox.on(Laya.Event.MOUSE_MOVE, _this, _this.MouseMove);
            return _this;
        }
        HeroWar.prototype.INfo = function () {
            this.tixing.text = H52D_Framework.GetInfoAttr.Instance.GetText(7011);
        };
        HeroWar.prototype.OnDestroy = function () {
            //关闭正在布阵当中
            H52D_Framework.HeroPosition.Instance._bHeroWar = false;
            this.MouseUp();
            this.offAll();
            for (var pos in this._heroAvatarMap) {
                var mod = this._heroAvatarMap[pos];
                if (mod != null) {
                    mod.Destroy();
                }
            }
            this._heroAvatarMap = {};
            this._heroPathFlagMap = {};
            H52D_Framework.Event.RemoveEvent("ExchangePlace", Laya.Handler.create(this, this.NewTeach_changewar));
            H52D_Framework.Event.RemoveEvent("btn_closes", Laya.Handler.create(this, this.Btn_Close));
            H52D_Framework.Event.RemoveEvent('Destroy', Laya.Handler.create(this, this.OnDestroy));
            H52D_Framework.Event.RemoveEvent('OnMouseUp', Laya.Handler.create(this, this.MouseUp));
            H52D_Framework.Event.RemoveEvent('SaveWar', Laya.Handler.create(this, this.NewTeach_war));
            H52D_Framework.Event.RemoveEvent('PutHero', Laya.Handler.create(this, this.PutHero));
            H52D_Framework.Event.RemoveEvent('fsTen', Laya.Handler.create(this, this.NewTeach_wars));
        };
        /** 拾取英雄 */
        HeroWar.prototype.DragHero = function (nHeroID, bShowDrag) {
            var _this = this;
            this.dragHeroIcon.visible = true;
            this.nDragHeroID = nHeroID;
            this.old_heroid = nHeroID;
            var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
            if (this._heroAvatarMap[-1]) {
                this._heroAvatarMap[-1].Destroy();
                this._heroAvatarMap[-1] = null;
                delete this._heroAvatarMap[-1];
            }
            var info_cfg = hero.heroCfg;
            var path = info_cfg.strFacadeModel;
            var tPosInfo = this.GetDirAndScale(nHeroID); //获取方向和坐标
            this._heroAvatarMap[-1] = new H52D_Framework.Avatar(this.dragHeroMod);
            this._heroAvatarMap[-1].Load(path, tPosInfo[0], tPosInfo[1] * 2, 0, 0, Laya.Handler.create(this, function () {
                _this._heroAvatarMap[-1].visible = true;
                _this._heroAvatarMap[-1].Play(H52D_Framework.AnimationName.idle, true);
                _this._heroAvatarMap[-1].SetOrder(10);
            }));
            if (!H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID)) {
                //let mod:Laya.View=this._heroAvatarMap[-1]
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen01.mp3");
            this.UpdatePosView(true, bShowDrag);
        };
        /** 列表按下事件 */
        HeroWar.prototype.ListHeadDown = function (nHeroID, item, event) {
            H52D_Framework.Tick.Once(300, this, this.OneListHeadDown, [nHeroID, this.List_head._childs[1].value, item, event]);
        };
        /** 列表按下事件 */
        HeroWar.prototype.OneListHeadDown = function (nHeroID, scrollBarY, item, event) {
            if (this.List_head._childs[1].value != scrollBarY) {
                return;
            }
            var bool = false;
            this.dragHeroIcon.x = this.List_head.x + item.x + 120;
            this.dragHeroIcon.y = this.List_head.y + item.y - this.List_head._childs[1].value + 120;
            this.List_head._childs[0];
            this.List_head.scrollBar.stopDrag();
            this.List_head.scrollBar.stopScroll();
            bool = H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID);
            this.DragHero(nHeroID, bool);
        };
        /** 按住阵容上的英雄 */
        HeroWar.prototype.CurMouseDown = function (pos) {
            var tPositionWar = H52D_Framework.HeroPosition.Instance.PositionWar;
            var nCurHeroID = tPositionWar[pos];
            if (nCurHeroID == null) {
                return;
            }
            var dragpos = this["dragpos" + pos];
            this._opos = pos;
            this.dragHeroIcon.x = dragpos.x + dragpos.width / 2;
            this.dragHeroIcon.y = dragpos.y + dragpos.height - 15;
            this.DragHero(nCurHeroID, true);
        };
        /** 鼠标移动事件 */
        HeroWar.prototype.MouseMove = function (event) {
            if (this.nDragHeroID == null) {
                return;
            }
            this.dragHeroIcon.x = event.currentTarget.mouseX;
            this.dragHeroIcon.y = event.currentTarget.mouseY;
            // 记录坐标
            this.tDragPos[0] = event.currentTarget.mouseX;
            this.tDragPos[1] = event.currentTarget.mouseY;
            var nNowPos = this.GetJionPos();
            if (nNowPos != this.sFlagColorSkin[0]) {
                if (this.sFlagColorSkin[0] != null) {
                    var dragpos = this["Pos_" + this.sFlagColorSkin[0]];
                    dragpos.skin = this.sFlagColorSkin[1];
                }
            }
            if (nNowPos != null) {
                if (nNowPos != this.sFlagColorSkin[0]) {
                    var dragpos = this["Pos_" + nNowPos];
                    var strSkin = dragpos.skin;
                    this.sFlagColorSkin = [nNowPos, dragpos.skin];
                    dragpos.skin = "ui_hero/img-yingxiong-tuozhaua-bg.png";
                }
            }
            else {
                this.sFlagColorSkin = [];
            }
        };
        /** 鼠标抬起事件 */
        HeroWar.prototype.MouseUp = function () {
            this.dragHeroIcon.visible = false;
            this.sFlagColorSkin = [];
            H52D_Framework.Tick.Clear(this, this.OneListHeadDown);
            if (this.nDragHeroID == null) {
                this.UpdatePosView();
                return;
            }
            // 记录ID
            var nDragHeroID = this.nDragHeroID;
            this.nDragHeroID = null;
            var nNowPos = this.GetJionPos();
            this.tDragPos = [0, 0];
            if (nNowPos == null) {
                this.UpdatePosView();
                return;
            }
            var tPositionWar = H52D_Framework.HeroPosition.Instance.PositionWar;
            var nCurHeroID = tPositionWar[nNowPos];
            // 当前位置与拖拽的相同
            if (nCurHeroID == nDragHeroID) {
                this.UpdatePosView();
                return;
            }
            if (nCurHeroID != nDragHeroID) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen02.mp3");
            }
            // 放置英雄
            this.PutHero(nNowPos, nDragHeroID);
            var bool = H52D_Framework.HeroPosition.Instance.IsInSaveWar(nNowPos, nDragHeroID);
            var hero_id = H52D_Framework.HeroPosition.Instance.PositionWar[this._opos];
            if (bool) {
                if (hero_id) {
                    this.WarEffect(this._opos);
                }
            }
            //新手引导
            H52D_Framework.Guidance.Instance.Trigger_SaveWar();
        };
        HeroWar.prototype.PutHero = function (nNowPos, nDragHeroID) {
            // 放置英雄
            H52D_Framework.HeroPosition.Instance.PutHero(nNowPos, nDragHeroID);
            H52D_Framework.HeroPosition.Instance.bChange = true;
            this.UpdatePosView();
            this.UpateHeroLsit();
            this.WarEffect(nNowPos);
            var oldhero = this.old_heroid;
        };
        /** 获取当前在哪个位置上 */
        HeroWar.prototype.GetJionPos = function () {
            if (this.tDragPos[0] == 0 && this.tDragPos[1] == 0) {
                return null;
            }
            var nNowX = this.tDragPos[0];
            var nNowY = this.tDragPos[1];
            for (var pos = 0; pos <= 8; pos++) {
                var dragpos = this["dragpos" + pos];
                dragpos.localToGlobal;
                if (dragpos.x < nNowX && dragpos.x + dragpos.width > nNowX && dragpos.y < nNowY && dragpos.y + dragpos.height > nNowY) {
                    return pos;
                }
            }
            return null;
        };
        /** 打开英雄详情面板 */
        HeroWar.prototype.OpenView = function (nHeroID) {
            if (this.nDragHeroID != null) {
                return;
            }
            H52D_Framework.HeroManager.Instance.OpenView(nHeroID);
        };
        /** 刷新位置信息 */
        HeroWar.prototype.UpdatePosView = function (bDrag, bShowDrag) {
            var tPositionWar = H52D_Framework.HeroPosition.Instance.PositionWar;
            var _loop_1 = function (pos) {
                var PosBtn = this_1["Pos_" + pos];
                var Mod = this_1["mod" + pos];
                if (bDrag) {
                    PosBtn.scale(1.3, 1.3);
                }
                else {
                    PosBtn.scale(1, 1);
                }
                var nHeroID = tPositionWar[pos];
                if ((bDrag && bShowDrag && nHeroID == this_1.nDragHeroID)) {
                    Mod.alpha = 0.5;
                }
                else {
                    Mod.alpha = 1;
                }
                if ((nHeroID == null)) {
                    if ((this_1._heroAvatarMap[pos] != null) && this_1._heroAvatarMap[pos].loaded) {
                        this_1._heroAvatarMap[pos].visible = false;
                    }
                    this_1._heroPathFlagMap[pos] = "";
                    PosBtn.skin = "ui_hero/img-yingxiong-renwuyuan-bg.png";
                }
                else {
                    if (pos == 4) {
                        PosBtn.skin = "ui_hero/img-yingxiong-duizhang-bg.png";
                    }
                    else {
                        PosBtn.skin = "ui_hero/img-yingxiong-xuanzhong-bg.png";
                    }
                    var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
                    var info_cfg = hero.heroCfg;
                    var path = info_cfg.strFacadeModel;
                    if (this_1._heroPathFlagMap[pos] != path) {
                        if (this_1._heroAvatarMap[pos]) {
                            this_1._heroAvatarMap[pos].Destroy();
                            this_1._heroAvatarMap[pos] = null;
                            delete this_1._heroAvatarMap[pos];
                        }
                        this_1._heroPathFlagMap[pos] = path;
                        var tPosInfo = this_1.GetDirAndScale(nHeroID);
                        this_1._heroAvatarMap[pos] = new H52D_Framework.Avatar(Mod);
                        this_1._heroAvatarMap[pos].Load(path, tPosInfo[0], tPosInfo[1], 0, 0, Laya.Handler.create(this_1, function (_heroAvatarMap) {
                            _heroAvatarMap.visible = true;
                            _heroAvatarMap.Play(H52D_Framework.AnimationName.idle, true);
                            _heroAvatarMap.SetOrder(pos);
                        }));
                    }
                }
            };
            var this_1 = this;
            for (var pos = 0; pos <= 8; pos++) {
                _loop_1(pos);
            }
            this.SetMainskillIcon(tPositionWar[4]);
        };
        /** 获取方向和坐标 */
        HeroWar.prototype.GetDirAndScale = function (nHeroID) {
            var dir = 1;
            var scale = H52D_Framework.HeroConfig[nHeroID].modelScale;
            return [dir, scale];
        };
        HeroWar.prototype.UpateHeroLsit = function () {
            H52D_Framework.HeroManager.Instance.WarSort(this._HasHeroList); //
            this.List_head.array = this._HasHeroList;
            this.List_head.vScrollBarSkin = "";
            this.List_head.renderHandler = new Laya.Handler(this, this.SetHandler);
        };
        HeroWar.prototype.SetHandler = function (item, index) {
            var nHeroID = this._HasHeroList[index];
            var tcfg = H52D_Framework.HeroConfig[nHeroID];
            var nx = tcfg.heroRatio;
            var colorID = tcfg.quality;
            var ntype = tcfg.type;
            var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
            var bg_color = item.getChildByName("background");
            var btn_01 = item.getChildByName("Btn_skill");
            var bg_k = btn_01.getChildByName("background_k");
            var duihao = btn_01.getChildByName("hero_zhiwei");
            var heroinfo = btn_01.getChildByName("Btn_Info");
            var head = btn_01.getChildByName("HeadIcon");
            var hp = btn_01.getChildByName("Hp");
            var hurt = btn_01.getChildByName("Hurt");
            var hero_type = btn_01.getChildByName("Hero_Type");
            ;
            var gowar = btn_01.getChildByName("IsGoWar");
            var type_bg = btn_01.getChildByName("Hero_Type_bg");
            var lv = hero.Level;
            duihao.skin = "";
            var herolist = H52D_Framework.HeroPosition.Instance.HeroWar;
            var a = H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID);
            if (a) {
                duihao.skin = H52D_Framework.BaseDefine.HeroWar_pos[2];
                if (herolist[nHeroID] == 4) {
                    duihao.skin = H52D_Framework.BaseDefine.HeroWar_pos[1];
                }
            }
            bg_color.skin = H52D_Framework.BaseDefine.QualityList[colorID];
            bg_k.skin = H52D_Framework.BaseDefine.BackGround_k[colorID];
            hero_type.skin = H52D_Framework.BaseDefine.HeroTypeIcon[ntype];
            var bool = H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID);
            gowar.visible = bool;
            type_bg.skin = "ui_hero/icon-renwu-leixing-bg.png";
            var star = hero.Star = 0 ? 1 : (hero.Star);
            var base_f;
            if (hero.Star == 0) {
                star = 1;
                var base = H52D_Framework.HeroAdvanceConfig[nHeroID][star].Attr;
                base_f = 0;
                var basenum = nx * (base_f + 1);
                hp.text = hero.attr.GetAttributeValue(1);
                hurt.text = hero.attr.GetAttributeValue(2);
            }
            else {
                var base = H52D_Framework.HeroAdvanceConfig[nHeroID][star].Attr;
                base_f = base[1][2] / 10000;
                var basenum = nx * (base_f + 1);
                hp.text = hero.attr.GetAttributeValue(1);
                hurt.text = hero.attr.GetAttributeValue(2);
            }
            btn_01.on(Laya.Event.MOUSE_UP, this, this.OpenView, [nHeroID]);
            btn_01.on(Laya.Event.MOUSE_DOWN, this, this.ListHeadDown, [nHeroID, item]);
            head.skin = hero.HeadIcon; //----------		
            //引导按钮
            if (index == 0 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_8 + 1000, bg_color);
                this.bGuidanceButton = false;
            }
        };
        /** 点击保存按钮 */
        HeroWar.prototype.SaveBtnClick = function () {
            var heroposInfo = H52D_Framework.HeroPosition.Instance.PositionWar;
            var bool = H52D_Framework.HeroPosition.Instance.bChange;
            if (heroposInfo[4] == null) {
                H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [false]);
                H52D_Framework.HeroPosition.Instance.bChange = false;
                if (H52D_Framework.ViewUILogic.Instance.OpenPanel == E_OpenGrade.HERO) {
                    if (this.heroView._child == "HeroWar") {
                        H52D_Framework.Event.DispatchEvent("PanelClose");
                    }
                }
                //弹出面板 保存失败 提示队长不能保存
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("必须有队长才能保存！！");
                return;
            }
            if (!bool) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("阵容未发生改变！！");
                return;
            }
            H52D_Framework.HeroManager.Instance.HeroWarInfo(heroposInfo);
            H52D_Framework.HeroPosition.Instance.bChange = false;
        };
        /**关闭按钮 弹出提示框 */
        HeroWar.prototype.Btn_Close = function (ShowView) {
            var _this = this;
            var nremind = H52D_Framework.SysPromptConfig[10012].strPromptInfo;
            H52D_Framework.TipsLogic.Instance.OpenMessageBox(nremind, Laya.Handler.create(this, function () {
                _this.SaveBtnClick();
                H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [false]);
                if (H52D_Framework.ViewUILogic.Instance.OpenPanel == E_OpenGrade.HERO) {
                    if (_this.heroView._child == "HeroWar") {
                        H52D_Framework.Event.DispatchEvent("PanelClose");
                    }
                    else {
                        if (H52D_Framework.HeroPosition.Instance.PositionWar[4] == null) {
                            return;
                        }
                        else {
                            ShowView.run();
                        }
                    }
                }
                else {
                    ShowView.run();
                }
            }), Laya.Handler.create(this, function () {
                H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [false]);
                H52D_Framework.HeroPosition.Instance.bChange = false;
                if (H52D_Framework.ViewUILogic.Instance.OpenPanel == E_OpenGrade.HERO) {
                    if (_this.heroView._child == "HeroWar") {
                        H52D_Framework.Event.DispatchEvent("PanelClose");
                    }
                    else {
                        ShowView.run();
                    }
                }
                else {
                    ShowView.run();
                }
            }));
        };
        /**新手教程 保存 */
        HeroWar.prototype.NewTeach_war = function () {
            this.SaveBtnClick();
        };
        /**改变阵容英雄 */
        HeroWar.prototype.NewTeach_changewar = function () {
            this.CurMouseDown(0);
        };
        /**获取第1个位置的英雄 */
        HeroWar.prototype.NewTeach_wars = function () {
            var item = this.List_head._childs[0]._childs[0];
            var NheroID = Number(this.List_head.array[0]);
            var btn_01 = item.getChildByName("Btn_skill");
            this.ListHeadDown(NheroID, item, event);
            btn_01.on(Laya.Event.MOUSE_DOWN, this, this.ListHeadDown, [NheroID, item]);
        };
        /***播放特效 */
        HeroWar.prototype.WarEffect = function (pos) {
            var _this = this;
            if (this._Lveffect[pos]) {
                this._Lveffect[pos].Destroy();
            }
            var PosBtn = this["Pos_" + pos];
            this._Lveffect[pos] = new H52D_Framework.Avatar(PosBtn);
            this._Lveffect[pos].Load("res/effect/effect_state_buzhen/effect_state_buzhen.sk", 1, 1, 60, 36, Laya.Handler.create(this, function () {
                _this._Lveffect[pos].Play("effect_state_buzhen", false, true, function () {
                    _this._Lveffect[pos].Destroy();
                });
            }));
        };
        /**设置队长技能图片 */
        HeroWar.prototype.SetMainskillIcon = function (nHeroID) {
            if (nHeroID) {
                this.L.visible = true;
                this.main_skillName.visible = true;
                var skill_ID = H52D_Framework.HeroConfig[nHeroID].heroBigSkill;
                var skill_Info = H52D_Framework.ActiveSkillConfig[skill_ID];
                this.Skill_Icon.skin = "ui_icon/" + skill_Info.strIcon;
                this.Skill_Icon.on(Laya.Event.CLICK, this, this.OpenView, [nHeroID]);
            }
            else {
                this.L.visible = false;
                this.main_skillName.visible = false;
                this.Skill_Icon.skin = "";
            }
        };
        return HeroWar;
    }(ui.heroList.HeroWarUI));
    H52D_Framework.HeroWar = HeroWar;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroWar.js.map