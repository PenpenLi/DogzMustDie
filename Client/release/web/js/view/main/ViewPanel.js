var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 功能开启条件
     */
    function OpenCondition(clickType, word, isShow) {
        if (word === void 0) { word = true; }
        var open = false;
        if (isShow == null) {
            isShow = true;
        }
        var cfg = H52D_Framework.OpenGradeConfig[clickType];
        if (!cfg) {
            return open = true;
        }
        else {
            if (H52D_Framework.OpenGradeConfig[clickType].Level == -1) {
                if (H52D_Framework.OpenGradeConfig[clickType].Checkpoint == -1) {
                    if (H52D_Framework.OpenGradeConfig[clickType].OpenDay == -1) {
                        open = true;
                    }
                    else if (H52D_Framework.MasterPlayer.Instance.days > H52D_Framework.OpenGradeConfig[clickType].OpenDay) {
                        open = true;
                    }
                    else if (word) //开服天数不足
                     {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.OpenGradeConfig[clickType].OpenDay + "天开启" + H52D_Framework.GetInfoAttr.Instance.GetText(cfg.NamaId));
                    }
                }
                else if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel >= H52D_Framework.OpenGradeConfig[clickType].Checkpoint) {
                    open = true;
                }
                else if (word) //关卡不足
                 {
                    if (isShow) {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.OpenGradeConfig[clickType].Checkpoint + "关开启" + H52D_Framework.GetInfoAttr.Instance.GetText(cfg.NamaId));
                    }
                }
            }
            else if (H52D_Framework.MasterPlayer.Instance.player.Level >= H52D_Framework.OpenGradeConfig[clickType].Level) {
                open = true;
            }
            else if (word) //等级不足
             {
                var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[10007].strPromptInfo, H52D_Framework.OpenGradeConfig[clickType].Level, H52D_Framework.GetInfoAttr.Instance.GetText(cfg.NamaId));
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
        }
        return open;
    }
    H52D_Framework.OpenCondition = OpenCondition;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ViewPanel.js.map