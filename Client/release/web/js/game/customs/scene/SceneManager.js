var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 场景管理类;
     * @author zhangyusong
     */
    var SceneManager = /** @class */ (function () {
        function SceneManager() {
            this.firstId = 10001;
            this.firstSound = false;
            this._scene = null;
            H52D_Framework.Event.RegistEvent("PET", Laya.Handler.create(this, this.LoadPet));
            H52D_Framework.Event.RegistEvent("PlayMusic", Laya.Handler.create(this, this.PlaySound));
            H52D_Framework.Event.RegistEvent("StoryEvent", Laya.Handler.create(this, this.SceneLoad));
        }
        Object.defineProperty(SceneManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new SceneManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "sceneId", {
            get: function () {
                return this.datavo.sceneId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "Datavo", {
            get: function () {
                return this.datavo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 场景创建
         * @param sceneId 场景ID
         */
        SceneManager.prototype.Create = function (sceneId) {
            var _this = this;
            //先销毁       
            this.Destroy(Laya.Handler.create(this, function () {
                _this.firstSound = _this.firstId == sceneId;
                _this.PlaySound();
                _this.datavo = new H52D_Framework.SceneVo(sceneId);
                //加载场景Loading
                var customsOrder = -1;
                if (H52D_Framework.CustomsManager.Instance.CustomsVo) {
                    customsOrder = H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder;
                }
                var b = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.story, customsOrder);
                if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs && H52D_Framework.Guidance.Instance.storyData[customsOrder] && !b) {
                    H52D_Framework.Guidance.Instance.PlayStory(customsOrder);
                }
                else {
                    H52D_Framework.CustomsManager.Instance.OpenAside(H52D_Framework.CustomsManager.Instance.CustomsVo.asideB, function () {
                        _this.SceneLoad();
                    });
                }
            }));
        };
        SceneManager.prototype.SceneLoad = function () {
            if (H52D_Framework.CustomsManager.Instance.first) { //开始不加载
                H52D_Framework.CustomsManager.Instance.first = false;
            }
            else {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.SHOW_SCENE, [this.datavo]);
                //延迟容错
                H52D_Framework.Tick.Once(3000, this, function () {
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE);
                });
            }
            // 通知刷新UI层
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT);
            this.currentScene = this.datavo.strSceneFileName;
            H52D_Framework.UIManager.Instance.CreateUI(this.currentScene, [H52D_Framework.SceneRoot], Laya.Handler.create(this, this.CreateComplete));
        };
        SceneManager.prototype.PlaySound = function () {
            if (H52D_Framework.MasterPlayer.Instance.player.Music) {
                var index = 0;
                if (this.firstSound) {
                    index = 0;
                    this._lastMusic = index;
                }
                else {
                    do {
                        index = (Math.random() * 3 >> 0);
                    } while (this._lastMusic == index);
                    this._lastMusic = index;
                }
                H52D_Framework.SoundManager.Instance.OnPlayMusic(H52D_Framework.soundScene[index]);
            }
            else {
                H52D_Framework.SoundManager.Instance.OnStopMusic();
            }
        };
        SceneManager.prototype.CreateComplete = function (view) {
            this._scene = view;
            //将角色层赋 值
            H52D_Framework.AvatarRoot = this._scene.getChildByName("avatarRoot");
            H52D_Framework.AvatarEffectRoot = this._scene.getChildByName("effectRoot");
            switch (H52D_Framework.CustomsManager.Instance.CustomsType) {
                case Customs_Type.Customs:
                    this.LoadCustoms();
                    break;
                case Customs_Type.Boss:
                    this.LoadWroldBoss();
                    break;
                case Customs_Type.Memory:
                    this.LoadMermoy();
                    break;
                case Customs_Type.Kicking:
                    this.LoadLadderAndKicKing();
                    break;
                case Customs_Type.Ladder:
                    this.LoadLadderAndKicKing();
                    break;
                case Customs_Type.MatchElection:
                    this.LoadMatchElection();
                    break;
                case Customs_Type.MatchChampion:
                    this.LoadMatchChampion();
                    break;
            }
        };
        /**加载主线关卡 */
        SceneManager.prototype.LoadCustoms = function () {
            var _this = this;
            this.LoadHero(function () {
                _this.LoadMonster(function () {
                    _this.LoadPet();
                    _this.LoadCamp();
                    _this.LoadComplete();
                });
            });
        };
        /**加载世界Boss */
        SceneManager.prototype.LoadWroldBoss = function () {
            var _this = this;
            this.LoadHero(function () {
                _this.LoadMonster(function () {
                    _this.LoadPet();
                    _this.LoadCamp();
                    _this.LoadComplete();
                    H52D_Framework.AdvertisingManager.Instance.IsBuyBossBuff = false;
                    H52D_Framework.Tick.Once(1000, _this, function () {
                        H52D_Framework.UIManager.Instance.CreateUI("WroldBossBuffView", [H52D_Framework.ViewUpRoot]);
                    });
                });
            });
        };
        /**加载记忆副本 */
        SceneManager.prototype.LoadMermoy = function () {
            var _this = this;
            this.LoadHero(function () {
                _this.LoadMonster(function () {
                    _this.LoadPet();
                    _this.LoadCamp();
                    // this.LoadComplete();
                });
            });
            H52D_Framework.Tick.Once(200, this, function () {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE);
                H52D_Framework.Event.DispatchEvent("DeputyFireStart");
            });
        };
        /**加载天梯  王者 */
        SceneManager.prototype.LoadLadderAndKicKing = function () {
            H52D_Framework.BattlefieldManager.Instance.LoadBattle();
            H52D_Framework.Tick.Once(200, this, function () {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE);
                H52D_Framework.Event.DispatchEvent("DeputyFireStart");
            });
        };
        /**加载PK联赛海选现场 */
        SceneManager.prototype.LoadMatchElection = function () {
            var _this = this;
            this.LoadHero(function () {
                _this.LoadMonster(function () {
                    _this.LoadPet();
                    //this.LoadCamp();
                    _this.LoadComplete();
                });
            });
            H52D_Framework.Tick.Once(200, this, function () {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE);
                H52D_Framework.Event.DispatchEvent("DeputyFireStart");
            });
        };
        /**加载Pk联赛决赛 */
        SceneManager.prototype.LoadMatchChampion = function () {
            H52D_Framework.BattlefieldManager.Instance.LoadBattle();
            H52D_Framework.Tick.Once(200, this, function () {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE);
                H52D_Framework.Event.DispatchEvent("DeputyFireStart");
            });
        };
        /**
         * 场景更新
         */
        SceneManager.prototype.Update = function () {
            this.LoadMonster(function () {
                // 通知刷新UI层
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT);
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
            });
        };
        /** 战斗初始化,加载英雄 */
        SceneManager.prototype.LoadHero = function (callBack) {
            H52D_Framework.BattleManager.Instance.Initialize(Laya.Handler.create(this, callBack));
        };
        /** 战斗初始化,加载怪物  */
        SceneManager.prototype.LoadMonster = function (callBack, boss) {
            if (boss === void 0) { boss = false; }
            H52D_Framework.MonsterManager.Instance.Initialize(Laya.Handler.create(this, callBack));
        };
        /** 战斗初始化,加载宠物  */
        SceneManager.prototype.LoadPet = function () {
            var id = 0;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                id = H52D_Framework.MemoryLogic.Instance.GetPetID(Customs_Type.Memory);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //使用和PVP相同的
                id = H52D_Framework.KickingLogic.Instance.petId;
            }
            else {
                id = H52D_Framework.PetManager.Instance.CurrentpetID;
            }
            if (id > 0) {
                H52D_Framework.BPetManager.Instance.LoadBPet(id, this.datavo.sceneId);
            }
        };
        /** 战斗初始化,加载大船  */
        SceneManager.prototype.LoadCamp = function () {
            if (H52D_Framework.MasterPlayer.Instance.player.CampID > 0) {
                H52D_Framework.BCampManager.Instance.LoadBCamp();
            }
        };
        /**加载完成，触发战斗流程 */
        SceneManager.prototype.LoadComplete = function () {
            this.PlaySound();
            H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            //先关闭场景加载页面，再加载旁白，再打开百度小贴士，最后发起战斗
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CLOSE_SCENE, function () {
                H52D_Framework.CustomsManager.Instance.OpenAside(H52D_Framework.CustomsManager.Instance.CustomsVo.aside, function () {
                    //开始战斗
                    if (H52D_Framework.CustomsManager.Instance.CustomsType != Customs_Type.Boss) {
                        if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                            return;
                        }
                        //百度小贴士
                        if (H52D_Framework.CustomsManager.Instance.CustomsVo.tie[1] || H52D_Framework.CastingConfig[H52D_Framework.LoginLogic.Instance.profid]["tips_" + H52D_Framework.CustomsManager.Instance.CustomsVo.customsId]) {
                            H52D_Framework.Event.DispatchEvent("BaiDuXiaoTieShi");
                        }
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
                    }
                });
            });
        };
        /**销毁场景 */
        SceneManager.prototype.Destroy = function (callBack) {
            var _this = this;
            H52D_Framework.Event.DispatchEvent("ClearBubble");
            H52D_Framework.Event.DispatchEvent("StopBubbleMonster");
            if (this.currentScene) {
                H52D_Framework.UIManager.Instance.DestroyUI(this.currentScene, [H52D_Framework.SceneRoot], Laya.Handler.create(this, function () {
                    _this.ClearRoot(H52D_Framework.AvatarRoot);
                    _this.ClearRoot(H52D_Framework.AvatarEffectRoot);
                    _this.ClearRoot(H52D_Framework.EffectRoot);
                    _this.ClearRoot(H52D_Framework.SceneRoot);
                    if (callBack) {
                        callBack.run();
                    }
                }));
            }
            else {
                callBack.run();
            }
            H52D_Framework.ViewUILogic.Instance.Destroy();
            H52D_Framework.BattleManager.Instance.Destroy();
            H52D_Framework.MonsterManager.Instance.Destroy();
        };
        SceneManager.prototype.ClearRoot = function (root) {
            if (root) {
                var childList = root._childs;
                for (var i in childList) {
                    var _childs = childList[i];
                    if (_childs._emitter == null) {
                        _childs.destroy(true);
                    }
                }
                root.destroyChildren();
            }
        };
        return SceneManager;
    }());
    H52D_Framework.SceneManager = SceneManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SceneManager.js.map