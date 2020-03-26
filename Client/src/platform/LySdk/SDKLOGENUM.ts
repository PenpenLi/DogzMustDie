// SDK上报类型美剧    
enum SDKLOGENUM {
    eSelServer = 0,     // 选服
    eEndLoading,        // 加载完成
    eLevelUp,           // 角色升级（创角时也要上报）
    eEnterGame,         // 进入游戏（创角时也要上报）
    eRoleUpdate,        // 角色有索引属性更新时
    eChargeSuccess,     // 支付成功
    eCreate,            // 创建角色
    ePreCreateRole,     // 到达游戏内创建角色场景时
    eLoginSuccess,      //登录成功
}