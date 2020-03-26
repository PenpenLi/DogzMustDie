var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 技能模型类
     * @author zhangyusong
     */
    var SkillModel = /** @class */ (function () {
        /**
         * 技能
         * @param item
         * @param index
         **/
        function SkillModel() {
        }
        /**
         * 设置技能
         * @param item 技能面板
         * @param index 技能索引1-6
         */
        SkillModel.prototype.SetData = function (item, index) {
            this.index = index;
            var roleSkillUp = H52D_Framework.RoleSkillUpConfig[this.index + 1];
            this.list = [];
            for (var roletype in roleSkillUp) {
                var vo = new H52D_Framework.SkillVo(roleSkillUp[roletype]["roleSkillId"]);
                vo.unlock = false;
                this.list.push(vo);
            }
            this.currVo = this.list[0];
            this.item = item;
            this.maski = new Laya.Sprite();
            this.cdPic = this.item.getChildByName("cd_pic");
            this.item.getChildByName("cd_circle").mask = this.maski;
            this.effectCd = new H52D_Framework.Avatar(this.item.getChildByName("effect_bg"));
            this.effectCd.Load(H52D_Framework.EffectDefine.jncd, 1, 1, 46, 44);
            this.continuousTimeNode = this.item.getChildByName("cd_time");
            this.continuousTimeNode["text"] = "";
            this.conMpNode = this.item.getChildByName("conMp");
            this.cdTimeCurrent = 0;
            this.continuousTimeCurrent = 0;
            this.mpvalue = 0;
            this.countdown = false;
            this.level = 0;
            this._canplay = false;
        };
        Object.defineProperty(SkillModel.prototype, "view", {
            get: function () {
                return this.item;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillModel.prototype, "vo", {
            get: function () {
                return this.currVo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillModel.prototype, "level", {
            set: function (value) {
                this._level = value;
                this.currVo = this.list[value == 0 ? 0 : value - 1];
                this.cdPic.skin = this.currVo.strIcon;
                this.conMpNode.text = this.currVo.conMp.toString();
                this.lock = value == 0;
            },
            enumerable: true,
            configurable: true
        });
        /** 更新法力值,影响开启状态 */
        SkillModel.prototype.UpdateMp = function (mp) {
            if (this.lock)
                return;
            if ((!this.currVo) || (!this.currVo.conMp)) {
                return;
            }
            this.mpvalue = mp;
            if (!this.countdown) {
                this.available = this.mpvalue >= this.currVo.conMp;
                if (this._canplay) {
                    if (this.mpvalue >= this.currVo.conMp) {
                        this._canplay = false;
                        this.effectCd.PlayOnce();
                    }
                }
            }
            this.conMpNode.color = this.mpvalue >= this.currVo.conMp ? "#2dbcff" : "#ff2d2c";
        };
        /** 更新冷却时间,影响冷却状态 */
        SkillModel.prototype.UpdateCd = function (cd) {
            if (this.lock)
                return;
            //主线
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                this.timeSplus = cd;
                //获得当前时间
                var currTime = H52D_Framework.Time.serverSecodes - this.timeSplus >> 0;
                //持续释放技能
                if (currTime < this.currVo.continuousTime) {
                    this.continuousTimeCurrent = this.currVo.continuousTime - currTime;
                    this.StartUse();
                }
                //冷却技能
                else if (currTime < this.currVo.cdTime) {
                    this.currVo.continuousTime = 0;
                    this.cdTimeCurrent = this.currVo.cdTime - (currTime - this.currVo.continuousTime);
                    this.StartUse();
                }
            }
            //副本，清零
            else {
                this.continuousTimeCurrent = 0;
                this.cdTimeCurrent = 0;
                this.FrameContinuousTime();
            }
        };
        Object.defineProperty(SkillModel.prototype, "lock", {
            get: function () {
                return this._lock;
            },
            /** 锁定状态 */
            set: function (value) {
                this._lock = value;
                this.item.getChildByName("cd_lock")["visible"] = value;
                if (this.countdown) {
                    this.item.getChildByName("cd_mask")["visible"] = true;
                }
                else {
                    this.item.getChildByName("cd_mask")["visible"] = value;
                }
                if (value) {
                    this.item.mouseEnabled = false;
                    this.conMpNode.color = "#ff2d2c";
                    this.drawSector(0, true);
                }
                else {
                    this.conMpNode.text = this.currVo.conMp.toString();
                }
            },
            enumerable: true,
            configurable: true
        });
        SkillModel.prototype.Destroy = function () {
            this.continuousTimeCurrent = 0;
            this.cdTimeCurrent = 0;
            this.FrameContinuousTime();
        };
        Object.defineProperty(SkillModel.prototype, "available", {
            get: function () {
                return this._available;
            },
            /** 可使用状态 */
            set: function (value) {
                this._available = value;
                this.item.mouseEnabled = value;
                this.item.getChildByName("cd_mask")["visible"] = !value;
                //开启状态
                this.drawSector(value ? 1 : 0, true);
            },
            enumerable: true,
            configurable: true
        });
        /** 开启使用，持续时间内释放技能 */
        SkillModel.prototype.StartUse = function (excess) {
            if (excess === void 0) { excess = false; }
            if (this.lock) {
                return;
            }
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.SPELL_SKILL, [this.index]);
            this.countdown = true;
            this._canplay = true;
            this.available = false;
            this.cd = true;
            this.item.getChildByName("cd_mask")["visible"] = false;
            this.continuousTimeNode["text"] = this.currVo.continuousTime > 0 ? this.currVo.continuousTime.toString() : "";
            // 额外技能,保留剩余CD时间
            if (excess) {
                //在持续时间内
                if (this.continuousTimeCurrent > 0) {
                    this.cdTimeCurrent = this.currVo.cdTime - (this.currVo.continuousTime - this.continuousTimeCurrent);
                }
                else {
                    this.cdTimeCurrent = this.cdTimeCurrent - this.currVo.continuousTime;
                }
                if (this.cdTimeCurrent < 0) {
                    this.cdTimeCurrent = 0;
                }
                this.continuousTimeCurrent = this.currVo.continuousTime;
                this.FirstcdTime();
            }
            else {
                if (this.continuousTimeCurrent == 0) {
                    this.continuousTimeCurrent = this.currVo.continuousTime;
                }
                if (this.cdTimeCurrent == 0) {
                    this.cdTimeCurrent = this.currVo.cdTime;
                    this.FirstcdTime();
                }
            }
            H52D_Framework.Tick.Clear(this, this.FrameContinuousTime);
            H52D_Framework.Tick.Loop(100, this, this.FrameContinuousTime);
        };
        /** 持续倒计时帧函数，0.1秒 */
        SkillModel.prototype.FrameContinuousTime = function () {
            this.continuousTimeCurrent -= 0.1;
            if (this.continuousTimeCurrent > 0) {
                this.ShowTimeText(this.continuousTimeCurrent);
                this.drawSector((this.currVo.continuousTime - this.continuousTimeCurrent) / this.currVo.continuousTime, false);
            }
            else {
                this.continuousTimeCurrent = 0;
                this.item.getChildByName("cd_mask")["visible"] = true;
                this.drawSector(1, false);
                this.FrameCdTime();
            }
        };
        /** 冷却倒计时*/
        SkillModel.prototype.FrameCdTime = function () {
            this.cdTimeCurrent -= 0.1;
            if (this.cdTimeCurrent > 0) {
                this.ShowTimeText(this.cdTimeCurrent);
                this.drawSector((this.currVo.cdTime - this.cdTimeCurrent) / this.currVo.cdTime, true);
                this.FirstcdTime();
            }
            else {
                this.cdTimeCurrent = 0;
                this.countdown = false;
                this.continuousTimeNode["text"] = "";
                this.drawSector(0, true);
                this.UpdateMp(this.mpvalue);
                this.FirstcdTime();
                H52D_Framework.Tick.Clear(this, this.FrameContinuousTime);
                if (this.mpvalue >= this.currVo.conMp) {
                    this.effectCd.PlayOnce();
                }
            }
        };
        /** 显示时间文字 */
        SkillModel.prototype.ShowTimeText = function (time) {
            var surplustime = Math.ceil(time);
            if (surplustime > 0) {
                if (surplustime < 60) {
                    this.continuousTimeNode["text"] = surplustime;
                }
                else {
                    var t = void 0;
                    if (surplustime < 60) {
                        t = surplustime < 10 ? "0" + surplustime : String(surplustime);
                    }
                    else {
                        this.continuousTimeNode["text"] = (surplustime / 60 >> 0) + ":" + surplustime % 60;
                        var m = (surplustime / 60 >> 0) < 10 ? "0" + (surplustime / 60 >> 0) : String(surplustime / 60 >> 0);
                        var s = surplustime % 60 < 10 ? "0" + surplustime % 60 : String(surplustime % 60);
                        t = m + ":" + s;
                    }
                    this.continuousTimeNode["text"] = t;
                }
            }
        };
        /** 画扇形,即为露出的部分 */
        SkillModel.prototype.drawSector = function (percentage, dir) {
            this.maski.graphics.clear();
            if (percentage > 0 && percentage < 1) {
                if (dir) {
                    this.maski.graphics.drawPie(52, 52, 74, -90, -90 + 360 * percentage, '#0');
                }
                else {
                    this.maski.graphics.drawPie(52, 52, 74, -90 + 360 * percentage, 270, '#0');
                }
            }
            else if (percentage >= 1) {
                this.maski.graphics.drawCircle(52, 52, 74, '#0');
            }
        };
        SkillModel.prototype.FirstcdTime = function () {
            if (this.index == 1) {
                H52D_Framework.ViewUILogic.Instance.FirstSkillCd = this.cdTimeCurrent;
            }
        };
        return SkillModel;
    }());
    H52D_Framework.SkillModel = SkillModel;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillModel.js.map