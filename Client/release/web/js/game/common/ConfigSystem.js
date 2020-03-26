/*
* 邮件配置文件类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var ConfigSystem = /** @class */ (function () {
        function ConfigSystem() {
            this._weaponArr = {};
            var gamePar = H52D_Framework.GameParamConfig['WeaponAndMethod'];
            for (var i in gamePar) {
                for (var j in gamePar[i]) {
                    var type = gamePar[i][j][1];
                    if (!this._weaponArr[type]) {
                        this._weaponArr[type] = [];
                    }
                    this._weaponArr[type].push(gamePar[i][j][2]);
                }
            }
            this._mail_Cfg_FB = H52D_Framework.MailConfig;
        }
        Object.defineProperty(ConfigSystem, "Inst", {
            get: function () {
                if (ConfigSystem._inst == null)
                    ConfigSystem._inst = new ConfigSystem();
                return ConfigSystem._inst;
            },
            enumerable: true,
            configurable: true
        });
        // 获取中文信息
        ConfigSystem.prototype.GetStringInfo = function (stringId) {
            var str = H52D_Framework.CStrValueConfig.Inst.GetText(stringId);
            return str;
        };
        //  获取邮件标题
        ConfigSystem.prototype.GetMailTitle = function (mailType) {
            var str = '';
            if (this._mail_Cfg_FB[mailType]) {
                if (mailType > 10000) {
                    str = this._mail_Cfg_FB[mailType].dwTitle;
                }
                else {
                    str = this.GetStringInfo(this._mail_Cfg_FB[mailType].dwTitle);
                }
            }
            return str;
        };
        // 获取邮件正文
        ConfigSystem.prototype.GetMailContent = function (mailType) {
            var str = '';
            if (this._mail_Cfg_FB[mailType]) {
                if (mailType > 10000) {
                    str = this._mail_Cfg_FB[mailType].dwContent;
                }
                else {
                    str = this.GetStringInfo(this._mail_Cfg_FB[mailType].dwContent);
                }
            }
            return str;
        };
        // 添加一条邮件信息
        ConfigSystem.prototype.SetNewMail = function (InstId, mailTitle, mailContent) {
            // 运营邮件标记
            this._mail_Cfg_FB[InstId + 10000] = {
                "dwContent": mailContent,
                "dwTitle": mailTitle
            };
        };
        // 获取游戏参数
        ConfigSystem.prototype.GetGameParmas = function (text) {
            return H52D_Framework.GameParamConfig[text];
        };
        // 获取物品详细信息
        ConfigSystem.prototype.GetItemInfo = function (itemId) {
            return H52D_Framework.ItemConfig[itemId];
        };
        // 获取提示信息
        ConfigSystem.prototype.GetSysPrompt = function (cfgId) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var str = H52D_Framework.SysPromptConfig[cfgId].strPromptInfo;
            if (args.length > 0) {
                str = H52D_Framework.Format.apply(void 0, [str].concat(args));
            }
            return str;
        };
        // // 获取开启等级
        // public GetOpenGradeLv(cfgId: any) {
        //     return OpenGrade_Cfg[cfgId].Level;
        // }
        // 获取属性价值
        ConfigSystem.prototype.GetQualityValue = function (qualityId) {
            return H52D_Framework.QualityValue[qualityId].dwValue;
        };
        // 属性对应战斗力
        ConfigSystem.prototype.GetSword = function (attrId, attrNum) {
            return Math.floor(attrNum * H52D_Framework.QualityValue[attrId].dwValue);
        };
        // 获取属性名称
        ConfigSystem.prototype.GetQualityName = function (qualityId) {
            return H52D_Framework.CStrValueConfig.Inst.GetText(H52D_Framework.QualityValue[qualityId].dwName);
        };
        // 获取被动技能名称
        ConfigSystem.prototype.GetPasSkillName = function (skillId) {
            return this.GetStringInfo(H52D_Framework.PassiveSkillConfig[skillId].nameId);
        };
        // 获取被动技能图标
        ConfigSystem.prototype.GetPasSkillIcon = function (skillId) {
            return H52D_Framework.PassiveSkillConfig[skillId].strIcon;
        };
        // 获取被动技能描述ID
        ConfigSystem.prototype.GetPasSkillDes = function (skillId) {
            return H52D_Framework.PassiveSkillConfig[skillId].descId;
        };
        return ConfigSystem;
    }());
    H52D_Framework.ConfigSystem = ConfigSystem;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ConfigSystem.js.map