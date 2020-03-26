/**
 * 所有配置表调用接口，请按规则添加
 */
var H52D_Framework;
(function (H52D_Framework) {
    var GameConfig = /** @class */ (function () {
        function GameConfig(cls) {
            this.Init(cls);
        }
        GameConfig.data = function (key) {
            GameConfig._data[key];
        };
        /** 批量修改配置 */
        GameConfig.prototype.ReplaceParameter = function (Cfg, tParam, bKey) {
            if (bKey) {
                for (var i in Cfg) {
                    var tLine = Cfg[i];
                    for (var l in tLine) {
                        var tL = tLine[l];
                        for (var key in tParam) {
                            var val = tParam[key];
                            tL[key] = tL[val];
                        }
                    }
                }
            }
            else {
                for (var i in Cfg) {
                    var tLine = Cfg[i];
                    for (var key in tParam) {
                        var val = tParam[key];
                        tLine[key] = tLine[val];
                    }
                }
            }
        };
        GameConfig.prototype.Init = function (cls) {
            var _a, _b, _c, _d, _e, _f, _g;
            H52D_Framework.ActiveSkillConfig = cls.Get("ActiveSkillConfig");
            H52D_Framework.ActivityConfig = cls.Get("ActivityConfig");
            H52D_Framework.AsideConfig = cls.Get("AsideConfig");
            H52D_Framework.CastingConfig = cls.Get("CastingConfig");
            H52D_Framework.ChargeConfig = cls.Get("ChargeConfig");
            H52D_Framework.CopyConfig = cls.Get("CopyConfig");
            H52D_Framework.CustomspassConfig = cls.Get("CustomspassConfig");
            H52D_Framework.FairyConfig = cls.Get("FairyConfig");
            H52D_Framework.FoundationConfig = cls.Get("FoundationConfig");
            H52D_Framework.GameParamConfig = cls.Get("GameParamConfig");
            H52D_Framework.GangConfig = cls.Get("GangConfig");
            H52D_Framework.GangLevelUpConfig = cls.Get("GangLevelUpConfig");
            H52D_Framework.GangDonateConfig = cls.Get("GangDonateConfig");
            H52D_Framework.GmConfig = cls.Get("GmConfig");
            H52D_Framework.HeroAdvanceConfig = cls.Get("HeroAdvanceConfig");
            H52D_Framework.HeroConfig = cls.Get("HeroConfig");
            H52D_Framework.HeroUpgrateConfig = cls.Get("HeroUpgrateConfig");
            H52D_Framework.HeroPeckConfig = cls.Get("HeroPeckConfig");
            H52D_Framework.InvitationConfig = cls.Get("InvitationConfig");
            H52D_Framework.ItemConfig = cls.Get("ItemConfig");
            H52D_Framework.KickingConfig = cls.Get("KickingConfig");
            H52D_Framework.LotteryConfig = cls.Get("LotteryConfig");
            H52D_Framework.Mail = cls.Get("Mail");
            H52D_Framework.MarketConfig = cls.Get("MarketConfig");
            H52D_Framework.MailConfig = cls.Get("MailConfig");
            H52D_Framework.MonstorConfig = cls.Get("MonstorConfig");
            H52D_Framework.OpenGradeConfig = cls.Get("OpenGradeConfig");
            H52D_Framework.PassiveSkillConfig = cls.Get("PassiveSkillConfig");
            H52D_Framework.PrivilegeConfig = cls.Get("PrivilegeConfig");
            H52D_Framework.PetConfig = cls.Get("petConfig");
            H52D_Framework.QualityValue = cls.Get("QualityValue");
            H52D_Framework.RandomNameConfig = cls.Get("RandomNameConfig");
            H52D_Framework.RewardConfig = cls.Get("RewardConfig");
            H52D_Framework.RoleLevelUpConfig = cls.Get("RoleLevelUpConfig");
            H52D_Framework.RoleSkillUpConfig = cls.Get("RoleSkillUpConfig");
            H52D_Framework.SceneConfig = cls.Get("SceneConfig");
            H52D_Framework.SensitiveWords = cls.Get("SensitiveWords");
            H52D_Framework.SignConfig = cls.Get("SignConfig");
            H52D_Framework.StatusConfig = cls.Get("StatusConfig");
            H52D_Framework.StringInfoConfig = cls.Get("StringInfoConfig");
            H52D_Framework.StrongerConfig = cls.Get("StrongerConfig");
            H52D_Framework.SysPromptConfig = cls.Get("SysPromptConfig");
            H52D_Framework.PresentConfig = cls.Get("PresentConfig");
            H52D_Framework.PetConfig = cls.Get("petConfig");
            H52D_Framework.LineConfig = cls.Get("Line");
            H52D_Framework.DayAchieveConfig = cls.Get("DayAchieveConfig");
            H52D_Framework.AchieveConfig = cls.Get("AchieveConfig");
            H52D_Framework.GroupConfig = cls.Get("GroupConfig");
            H52D_Framework.HeroWordConfig = cls.Get("HeroWordConfig");
            H52D_Framework.MonsterWordConfig = cls.Get("MonsterWordConfig");
            H52D_Framework.PetWordConfig = cls.Get("PetWordConfig");
            H52D_Framework.SceneAnimConfig = cls.Get("SceneAnimConfig");
            H52D_Framework.EquipConfig = cls.Get("EquipConfig");
            H52D_Framework.SuitConfig = cls.Get("SuitConfig");
            H52D_Framework.ChargeReturnConfig = cls.Get("ChargeReturnConfig");
            H52D_Framework.SevenConfig = cls.Get("SevenConfig");
            H52D_Framework.StoryConfig = cls.Get("StoryConfig");
            H52D_Framework.LadderConfig = cls.Get("LadderConfig");
            H52D_Framework.HandbookUpConfig = cls.Get("HandbookUpConfig");
            H52D_Framework.HandbookTeamConfig = cls.Get("HandbookTeamConfig");
            H52D_Framework.RelationConfig = cls.Get("RelationConfig");
            // 如果不是百度平台需要特殊处理
            if (H52D_Framework.IsNotBaiDuSdk()) {
                this.ReplaceParameter(H52D_Framework.StoryConfig, (_a = {},
                    _a["strFlieName"] = "strFlieName_fei",
                    _a["AnimaName"] = "AnimaName_fei",
                    _a["sound"] = "sound_fei",
                    _a["shake"] = "shake_fei",
                    _a), true);
                this.ReplaceParameter(H52D_Framework.ActiveSkillConfig, (_b = {},
                    _b["actionEffect"] = "actionEffect_fei",
                    _b));
                this.ReplaceParameter(H52D_Framework.EquipConfig, (_c = {},
                    _c["equipIcon"] = "equipIcon_fei",
                    _c));
                this.ReplaceParameter(H52D_Framework.GangConfig, (_d = {},
                    _d["stricon"] = "stricon_fei",
                    _d));
                this.ReplaceParameter(H52D_Framework.ItemConfig, (_e = {},
                    _e["strIconID_B"] = "strIconID_Bfei",
                    _e));
                this.ReplaceParameter(H52D_Framework.GroupConfig, (_f = {},
                    _f["talkid"] = "talkid_fei",
                    _f));
                this.ReplaceParameter(H52D_Framework.AsideConfig, (_g = {},
                    _g["strtext"] = "strtext_fei",
                    _g), true);
            }
        };
        return GameConfig;
    }());
    H52D_Framework.GameConfig = GameConfig;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GameConfig.js.map