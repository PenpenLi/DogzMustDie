/**
 * 所有配置表调用接口，请按规则添加
 */
module H52D_Framework {
    import ConfigManager = H52D_Framework.ConfigManager;

    /**永久成就表 */
    export let AchieveConfig;
    /** 主动技能表 */
    export let ActiveSkillConfig;
    /**  */
    export let ActivityConfig;
    /** 旁白表 */
    export let AsideConfig;
    /** 角色表 */
    export let CastingConfig;
    /** 钻石充值表 */
    export let ChargeConfig;
    /**充值反馈表 */
    export let ChargeReturnConfig;
    /** 时段记忆表 */
    export let CopyConfig;
    /** 关卡表 */
    export let CustomspassConfig;
    /**每日成就表 */
    export let DayAchieveConfig;
    /** 时空法器基础表 */
    export let EquipConfig;
    /** 小仙女表 */
    export let FairyConfig;
    /** 基金表 */
    export let FoundationConfig;
    /** 参数表 */
    export let GameParamConfig;
    /** 阵营升级表 */
    export let GangLevelUpConfig;
    /** 阵营基础表*/
    export let GangConfig;
    /**阵营捐献表 */
    export let GangDonateConfig;
    /**英雄组表 */
    export let GroupConfig;
    /** GM */
    export let GmConfig;
    /** 英雄进阶表 */
    export let HeroAdvanceConfig;
    /**  */
    export let HeroPeckConfig;
    /** 英雄基础表 */
    export let HeroConfig;
    /** 英雄升级表 */
    export let HeroUpgrateConfig;
    /**英雄对话表 */
    export let HeroWordConfig;
    /** 邀请表 */
    export let InvitationConfig;
    /** 道具表 */
    export let ItemConfig;
    /** 王者约战表 */
    export let KickingConfig;
    /**天梯段位表 */
    export let LadderConfig;
    /**物品链接表 */
    export let LineConfig;
    /** 抽奖表 */
    export let LotteryConfig;
    /**  */
    export let Mail;
    /**邮件 */
    export let MailConfig;
    /** 商店表 */
    export let MarketConfig;
    /** 怪物表 */
    export let MonstorConfig;
    /**怪物语言库表 */
    export let MonsterWordConfig;
    /** 开放等级表 */
    export let OpenGradeConfig;
    /** 被动技能表 */
    export let PassiveSkillConfig;
    /**神兽基础表 */
    export let PetConfig;
    /**赠送表 */
    export let PresentConfig;
    /** 特权表 */
    export let PrivilegeConfig;
    /** 属性表 */
    export let QualityValue;
    /** 随机姓名表 */
    export let RandomNameConfig;
    /** 奖励表 */
    export let RewardConfig;
    /**怪物语言库表 */
    export let PetWordConfig;
    /** 主角升级表 */
    export let RoleLevelUpConfig;
    /** 主角技能升级表 */
    export let RoleSkillUpConfig;
    /** 场景动画 */
    export let SceneAnimConfig;
    /** 场景表 */
    export let SceneConfig;
    /** 敏感词表 */
    export let SensitiveWords;
    /**七日登入表 */
    export let SevenConfig;
    /** 签到表 */
    export let SignConfig;
    /** 状态/buff表 */
    export let StatusConfig;
    /**剧情表 */
    export let StoryConfig;
    /** 国际化配置表 */
    export let StringInfoConfig;
    /** 我要变强表 */
    export let StrongerConfig;
    /** 时空法器套装表*/
    export let SuitConfig;
    /** 系统提示信息 */
    export let SysPromptConfig;

    /**英雄图鉴升级表 */
    export let HandbookUpConfig;
    /**英雄组合图鉴表 */
    export let HandbookTeamConfig;

    /**图鉴关系表 */
    export let RelationConfig;

    export class GameConfig {

        private static _data: Object;

        public static data(key: string): any {
            GameConfig._data[key];
        }

        constructor(cls: ConfigManager) {
            this.Init(cls);
        }

        /** 批量修改配置 */
        private ReplaceParameter(Cfg, tParam, bKey?) {
            if (bKey) {
                for (let i in Cfg) {
                    let tLine = Cfg[i]

                    for (let l in tLine) {
                        let tL = tLine[l]
                        for (let key in tParam) {
                            let val = tParam[key]
                            tL[key] = tL[val]
                        }
                    }
                }
            } else {
                for (let i in Cfg) {
                    let tLine = Cfg[i]
                    for (let key in tParam) {
                        let val = tParam[key]
                        tLine[key] = tLine[val]
                    }
                }
            }
        }

        public Init(cls: ConfigManager) {
            ActiveSkillConfig = cls.Get("ActiveSkillConfig");
            ActivityConfig = cls.Get("ActivityConfig");
            AsideConfig = cls.Get("AsideConfig");
            CastingConfig = cls.Get("CastingConfig");
            ChargeConfig = cls.Get("ChargeConfig");
            CopyConfig = cls.Get("CopyConfig");
            CustomspassConfig = cls.Get("CustomspassConfig");
            FairyConfig = cls.Get("FairyConfig");
            FoundationConfig = cls.Get("FoundationConfig");
            GameParamConfig = cls.Get("GameParamConfig");
            GangConfig = cls.Get("GangConfig");
            GangLevelUpConfig = cls.Get("GangLevelUpConfig");
            GangDonateConfig = cls.Get("GangDonateConfig");
            GmConfig = cls.Get("GmConfig");
            HeroAdvanceConfig = cls.Get("HeroAdvanceConfig");
            HeroConfig = cls.Get("HeroConfig");
            HeroUpgrateConfig = cls.Get("HeroUpgrateConfig");
            HeroPeckConfig = cls.Get("HeroPeckConfig");
            InvitationConfig = cls.Get("InvitationConfig");
            ItemConfig = cls.Get("ItemConfig");
            KickingConfig = cls.Get("KickingConfig");
            LotteryConfig = cls.Get("LotteryConfig");
            Mail = cls.Get("Mail");
            MarketConfig = cls.Get("MarketConfig");
            MailConfig = cls.Get("MailConfig");
            MonstorConfig = cls.Get("MonstorConfig");
            OpenGradeConfig = cls.Get("OpenGradeConfig");
            PassiveSkillConfig = cls.Get("PassiveSkillConfig");
            PrivilegeConfig = cls.Get("PrivilegeConfig");
            PetConfig = cls.Get("petConfig");
            QualityValue = cls.Get("QualityValue");
            RandomNameConfig = cls.Get("RandomNameConfig");
            RewardConfig = cls.Get("RewardConfig");
            RoleLevelUpConfig = cls.Get("RoleLevelUpConfig");
            RoleSkillUpConfig = cls.Get("RoleSkillUpConfig");
            SceneConfig = cls.Get("SceneConfig");
            SensitiveWords = cls.Get("SensitiveWords");
            SignConfig = cls.Get("SignConfig");
            StatusConfig = cls.Get("StatusConfig");
            StringInfoConfig = cls.Get("StringInfoConfig");
            StrongerConfig = cls.Get("StrongerConfig");
            SysPromptConfig = cls.Get("SysPromptConfig");
            PresentConfig = cls.Get("PresentConfig");
            PetConfig = cls.Get("petConfig");
            LineConfig = cls.Get("Line");
            DayAchieveConfig = cls.Get("DayAchieveConfig");
            AchieveConfig = cls.Get("AchieveConfig");
            GroupConfig = cls.Get("GroupConfig");
            HeroWordConfig = cls.Get("HeroWordConfig");
            MonsterWordConfig = cls.Get("MonsterWordConfig");
            PetWordConfig = cls.Get("PetWordConfig");
            SceneAnimConfig = cls.Get("SceneAnimConfig");
            EquipConfig = cls.Get("EquipConfig");
            SuitConfig = cls.Get("SuitConfig");
            ChargeReturnConfig = cls.Get("ChargeReturnConfig");
            SevenConfig = cls.Get("SevenConfig");
            StoryConfig = cls.Get("StoryConfig");
            LadderConfig = cls.Get("LadderConfig");
            HandbookUpConfig= cls.Get("HandbookUpConfig");
            HandbookTeamConfig= cls.Get("HandbookTeamConfig");
            RelationConfig= cls.Get("RelationConfig");
            
            // 如果不是百度平台需要特殊处理
            if (IsNotBaiDuSdk()) {
                this.ReplaceParameter(StoryConfig, {
                    ["strFlieName"]: "strFlieName_fei",
                    ["AnimaName"]: "AnimaName_fei",
                    ["sound"]: "sound_fei",
                    ["shake"]: "shake_fei",
                }, true)

                this.ReplaceParameter(ActiveSkillConfig, {
                    ["actionEffect"]: "actionEffect_fei",
                })

                this.ReplaceParameter(EquipConfig, {
                    ["equipIcon"]: "equipIcon_fei",
                })

                this.ReplaceParameter(GangConfig, {
                    ["stricon"]: "stricon_fei",
                })

                this.ReplaceParameter(ItemConfig, {
                    ["strIconID_B"]: "strIconID_Bfei",
                })

                this.ReplaceParameter(GroupConfig, {
                    ["talkid"]: "talkid_fei",
                })

                this.ReplaceParameter(AsideConfig, {
                    ["strtext"]: "strtext_fei",
                }, true)
            }
        }
    }
}