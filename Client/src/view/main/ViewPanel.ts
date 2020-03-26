module H52D_Framework {
    /**
     * 功能开启条件
     */
    export function OpenCondition(clickType: E_OpenGrade, word:boolean = true,isShow?:boolean): boolean {
        let open: boolean = false;
        if(isShow==null){
            isShow = true 
        }
        let cfg = OpenGradeConfig[clickType];
        if (!cfg) {
            return open = true;
        }
        else{
            if (OpenGradeConfig[clickType].Level == -1) {
                if (OpenGradeConfig[clickType].Checkpoint == -1) {
                    if (OpenGradeConfig[clickType].OpenDay == -1) {
                        open = true;
                    }
                    else if (MasterPlayer.Instance.days > OpenGradeConfig[clickType].OpenDay) {
                        open = true;
                    }
                    else if(word)   //开服天数不足
                    {
                        TipsLogic.Instance.OpenSystemTips(OpenGradeConfig[clickType].OpenDay + "天开启" + GetInfoAttr.Instance.GetText(cfg.NamaId));
                    }
                }
                else if (MasterPlayer.Instance.player.CunstLevel >= OpenGradeConfig[clickType].Checkpoint) {
                    open = true;
                }
                else if(word)   //关卡不足
                {
                    if(isShow){
                        TipsLogic.Instance.OpenSystemTips(OpenGradeConfig[clickType].Checkpoint + "关开启" + GetInfoAttr.Instance.GetText(cfg.NamaId));
                    }
                }
            }
            else if (MasterPlayer.Instance.player.Level >= OpenGradeConfig[clickType].Level) {
                open = true;
            }
            else if(word)    //等级不足
            {
                let str = Format(SysPromptConfig[10007].strPromptInfo, OpenGradeConfig[clickType].Level, GetInfoAttr.Instance.GetText(cfg.NamaId));
                TipsLogic.Instance.OpenSystemTips(str);
            }
        }

        return open;
    }

    export interface IViewPanel {
        Destroy();
    }

}