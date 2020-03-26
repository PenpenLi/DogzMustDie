var H52D_Framework;
(function (H52D_Framework) {
    /** 背景逻辑累 */
    var ViewUILogic = /** @class */ (function () {
        function ViewUILogic() {
            this.isAuto = true;
            this.mpValueFull = false;
            /** 半屏显示 */
            this._halfPanel = true;
            this.angleTime = Number.MAX_VALUE;
            /** 小仙女运行 */
            this.angleRun = true;
            /** 广告上次观看的时间戳 */
            this.adTimeStamp = 0;
            /** 广告开启状态, 1关闭, 2观看, 3领奖 */
            this.adState = 2;
        }
        Object.defineProperty(ViewUILogic, "Instance", {
            get: function () {
                if (ViewUILogic._inst == null) {
                    ViewUILogic._inst = new ViewUILogic();
                }
                return ViewUILogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        ViewUILogic.prototype.Initialize = function () {
            this.EventInit();
        };
        ViewUILogic.prototype.FrameHander = function () {
            //全局心跳函数
            H52D_Framework.Tick.Loop(1000, this, this.OnFrameHander);
        };
        /** 零点刷新 */
        ViewUILogic.prototype.OnDay = function () {
            H52D_Framework.MasterPlayer.Instance.dayInviteNum = 0;
            H52D_Framework.MasterPlayer.Instance.invitaVipFlag = 0;
            H52D_Framework.Event.DispatchEvent("ZeroRefresh");
        };
        ViewUILogic.prototype.EventInit = function () {
            H52D_Framework.Event.RegistEvent("OpenRank", Laya.Handler.create(this, this.OpenRank));
            //系统设置中改名成功
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_RoleRename", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ChgHeadID", this);
            //小仙女领奖
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAngelBeats", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReleaseSkill", this);
        };
        ViewUILogic.prototype.OpenRank = function () {
            H52D_Framework.UIManager.Instance.CreateUI("RankView", [H52D_Framework.ViewUpRoot]);
        };
        /** 全局心跳事件 */
        ViewUILogic.prototype.OnFrameHander = function () {
            //小天使
            if (H52D_Framework.MasterPlayer.Instance.player.CustomsId && H52D_Framework.OpenCondition(E_OpenGrade.ANGLE, false)) {
                this.AngleControl();
            }
            //活动列表显示红点
            H52D_Framework.MainActionLogic.Instance.ShowRedPoint();
            //体力恢复
            if (H52D_Framework.MemoryLogic.Instance.Power < H52D_Framework.GameParamConfig["PowerMax"]) {
                H52D_Framework.MemoryLogic.Instance.PowerUpdate();
            }
        };
        /** 天使时间初始化 */
        ViewUILogic.prototype.AngleTimeInit = function () {
            this.angleTime = 0;
            this.angleRun = true;
            this.angleOpenTime = Math.round(Number(H52D_Framework.GameParamConfig["FairyGenerationTime"][1]) + Math.random() * (Number(H52D_Framework.GameParamConfig["FairyGenerationTime"][2]) - Number(H52D_Framework.GameParamConfig["FairyGenerationTime"][1])));
            this.angleLeaveTime = Number(H52D_Framework.GameParamConfig["FairyGenerationFlyTime"]);
        };
        /** 小天使停止 */
        ViewUILogic.prototype.AngleStop = function () {
            this.angleTime = Number.MAX_VALUE;
        };
        /** 小天使立即开启 */
        ViewUILogic.prototype.AngleStart = function () {
            this.angleTime = this.angleOpenTime - 2;
        };
        ViewUILogic.prototype.AngleControl = function () {
            if (!this.angleRun) {
                return;
            }
            if (this.angleTime < this.angleOpenTime || (this.angleTime > this.angleOpenTime && this.angleTime < this.angleOpenTime + this.angleLeaveTime)) {
                ++this.angleTime;
            }
            else if (this.angleTime == this.angleOpenTime) {
                //小天使开启
                H52D_Framework.Event.DispatchEvent("AngleOpen", this.AngleRandomId());
                ++this.angleTime;
            }
            else if (this.angleTime == this.angleOpenTime + this.angleLeaveTime) {
                //小天使离开
                H52D_Framework.Event.DispatchEvent("AngleLeave");
                this.angleTime = 0;
            }
        };
        ViewUILogic.prototype.AngleRandomId = function () {
            var id = 0;
            var weight = [];
            var totleWeight = 0;
            this.angleType = H52D_Framework.IsAD() ? 2 : 1;
            //只有在有看广告次数时，才寻找技能解锁情况
            var unlock = false;
            if (H52D_Framework.AdvertisingManager.Instance.hasAngleTimes) {
                var length_1 = H52D_Framework.MainRoleLogic.Instance.roleSkill.length;
                for (var i = 0; i < length_1; i++) {
                    if (H52D_Framework.MainRoleLogic.Instance.IsSkillUnlocked(i)) {
                        unlock = true;
                        break;
                    }
                }
            }
            var config = H52D_Framework.FairyConfig[this.angleType];
            for (var _id in config) {
                //如果没有次数，就把必须看广告类型屏蔽掉
                if (!H52D_Framework.AdvertisingManager.Instance.hasAngleTimes) {
                    if (config[_id]["fairyType"] == H52D_Framework.AdStage.MustWatch) {
                        continue;
                    }
                }
                if (_id != "4" || unlock) {
                    totleWeight += Number(config[_id]["treasureweight"]);
                    weight.push([Number(_id), totleWeight]);
                }
            }
            var num = Math.random() * totleWeight >> 0;
            for (var i in weight) {
                id = weight[i][0];
                if (weight[i][1] >= num) {
                    break;
                }
            }
            return id;
        };
        Object.defineProperty(ViewUILogic.prototype, "halfPanel", {
            get: function () {
                return this._halfPanel;
            },
            /**半屏显示*/
            set: function (b) {
                this._halfPanel = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "listView", {
            get: function () {
                return this._listView;
            },
            set: function (view) {
                this._listView = view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "customWave", {
            get: function () {
                return this._customWave;
            },
            set: function (btn) {
                this._customWave = btn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "roleLvUp", {
            get: function () {
                return this.btn_role;
            },
            set: function (btn) {
                this.btn_role = btn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "CampRed", {
            get: function () {
                return this.camp_red;
            },
            set: function (btn) {
                this.camp_red = btn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "FirstSkillCd", {
            get: function () {
                return this.first_skill_cd;
            },
            set: function (value) {
                this.first_skill_cd = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewUILogic.prototype, "OpenPanel", {
            get: function () {
                return this._openPanel;
            },
            set: function (value) {
                this._openPanel = value;
            },
            enumerable: true,
            configurable: true
        });
        /** 系统设置中改名成功 */
        ViewUILogic.prototype.C_RoleRename = function (newName) {
            H52D_Framework.MasterPlayer.Instance.player.Name = newName[0];
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PLAYER_NAME_UPDATE);
        };
        /** 系统设置中修改头像 */
        ViewUILogic.prototype.C_ChgHeadID = function (newHead) {
            H52D_Framework.MasterPlayer.Instance.player.HeadId = newHead[0];
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PLAYER_HEAD_UPDATE);
        };
        /** 请求领取小仙女奖励 */
        ViewUILogic.prototype.K_ReqAngelBeats = function (id, redAdvertising) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqAngelBeats', this.angleType, id, redAdvertising);
        };
        /** 释放技能 */
        ViewUILogic.prototype.C_ReleaseSkill = function (buf) {
            //技能ID：0-5
            var nidx = buf[0] - 1;
            var SkillID = H52D_Framework.MainRoleLogic.Instance.GetSkillID(nidx);
            var nNameID = H52D_Framework.ActiveSkillConfig[SkillID].nameId;
            var s = H52D_Framework.SysPromptConfig[30057].strPromptInfo;
            var skill = H52D_Framework.GetInfoAttr.Instance.GetText(nNameID);
            var msg = H52D_Framework.Format(s, skill);
            H52D_Framework.TipsLogic.Instance.OpenTips(msg, 2);
            H52D_Framework.Event.DispatchEvent("OnSkillClick", [nidx, true]);
        };
        /** 小仙女奖励回调 */
        ViewUILogic.prototype.C_ReqAngelBeats = function (value) {
            var nType = value[0];
            var nId = value[1];
            var bAdversiting = value[2];
            var allAward = value[3];
            var fairyType = 2;
            if (nId != null) {
                fairyType = H52D_Framework.FairyConfig[nType][nId].fairyType;
            }
            if (H52D_Framework.IsAD() && this.isWatch && (fairyType == 1 || fairyType == 3)) {
                H52D_Framework.AdvertisingManager.Instance.AddAdvertisingTimes(AdvertisementType.angelBeats);
            }
            if (H52D_Framework.GetTabLength(allAward) != 0) {
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(allAward);
            }
            this.angleTime = 0;
        };
        ViewUILogic.prototype.Destroy = function () {
            H52D_Framework.Event.DispatchEvent("ClearMainView");
        };
        return ViewUILogic;
    }());
    H52D_Framework.ViewUILogic = ViewUILogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ViewUILogic.js.map