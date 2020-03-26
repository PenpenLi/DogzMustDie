/*
* 邮件配置文件类;
*/
module H52D_Framework {
    export class ConfigSystem {
        private _weaponArr: { [type: number]: any } = {};
        private _mail_Cfg_FB: any;//邮件表副本文件
        private static _inst: ConfigSystem;
        public static get Inst() {
            if (ConfigSystem._inst == null)
                ConfigSystem._inst = new ConfigSystem();
            return ConfigSystem._inst;
        }

        constructor() {
            let gamePar: any = GameParamConfig['WeaponAndMethod'];
            for (let i in gamePar) {
                for (let j in gamePar[i]) {
                    let type: number = gamePar[i][j][1];
                    if (!this._weaponArr[type]) {
                        this._weaponArr[type] = [];
                    }
                    this._weaponArr[type].push(gamePar[i][j][2]);
                }
            }
            this._mail_Cfg_FB = MailConfig;
        }

        // 获取中文信息
        public GetStringInfo(stringId: any) {
            let str = CStrValueConfig.Inst.GetText(stringId);
            return str;
        }

        //  获取邮件标题
        public GetMailTitle(mailType: any) {
            let str: string = '';
            if (this._mail_Cfg_FB[mailType]) {
                if (mailType > 10000) {
                    str = this._mail_Cfg_FB[mailType].dwTitle;
                } else {
                    str = this.GetStringInfo(this._mail_Cfg_FB[mailType].dwTitle);
                }
            }
            return str;
        }

        // 获取邮件正文
        public GetMailContent(mailType: any) {
            let str: string = '';
            if (this._mail_Cfg_FB[mailType]) {
                if (mailType > 10000) {
                    str = this._mail_Cfg_FB[mailType].dwContent
                } else {
                    str = this.GetStringInfo(this._mail_Cfg_FB[mailType].dwContent);
                }

            }
            return str;
        }

        // 添加一条邮件信息
        public SetNewMail(InstId: any, mailTitle: any, mailContent: any) {
            // 运营邮件标记
            this._mail_Cfg_FB[InstId + 10000] = {
                "dwContent": mailContent,
                "dwTitle": mailTitle
            }
        }

        // 获取游戏参数
        public GetGameParmas(text: any) {
            return GameParamConfig[text];
        }

        // 获取物品详细信息
        public GetItemInfo(itemId: any) {
            return ItemConfig[itemId];
        }

        // 获取提示信息
        public GetSysPrompt(cfgId: any, ...args) {
            let str = SysPromptConfig[cfgId].strPromptInfo;
            if (args.length > 0) {
                str = Format(str, ...args);
            }
            return str;
        }

        // // 获取开启等级
        // public GetOpenGradeLv(cfgId: any) {
        //     return OpenGrade_Cfg[cfgId].Level;
        // }

        // 获取属性价值
        public GetQualityValue(qualityId: any) {
            return QualityValue[qualityId].dwValue;
        }

        // 属性对应战斗力
        public GetSword(attrId: any, attrNum: number): number {
            return Math.floor(attrNum * QualityValue[attrId].dwValue);
        }

        // 获取属性名称
        public GetQualityName(qualityId: any) {
            return CStrValueConfig.Inst.GetText(QualityValue[qualityId].dwName);
        }

        // 获取被动技能名称
        public GetPasSkillName(skillId: any) {
            return this.GetStringInfo(PassiveSkillConfig[skillId].nameId);
        }

        // 获取被动技能图标
        public GetPasSkillIcon(skillId: any) {
            return PassiveSkillConfig[skillId].strIcon;
        }

        // 获取被动技能描述ID
        public GetPasSkillDes(skillId: any) {
            return PassiveSkillConfig[skillId].descId;
        }
    }
}
