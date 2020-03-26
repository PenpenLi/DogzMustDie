
-- KS上Player状态类型
local KSPlayerStateEnum = {
    eConnect            = 1, -- 链接上
    eLogin              = 2, -- 登陆中
    eWaitNew            = 3, -- 等待创建角色
    eLoadData           = 4, -- 读取role数据
    
    eReadDBData         = 11, -- 从数据库读数据中
    
    eInGame             = 5, -- 在游戏中
   
    eWaitReconnect      = 9, -- 等待重连
    
    eDestroy            = 10, -- 销毁
}
RegistEnum("KSPlayerStateEnum", KSPlayerStateEnum)


-- KS上Player bekick 原因
local PlayerBeKickReasonEnum = {
    eBanPlay            = 1,  -- 封号踢人
    eRepeatLogin        = 2,  -- 重复登录踢人
    eGMKick             = 3,  -- GM踢人
    eServerShutdown     = 4,  -- 服务器关闭
    eLoginFailed        = 5,  -- 登陆失败
    eLoginServerError   = 6,  -- 登录服务器错误
    eServerHeavyLoad    = 7,  -- 服务器高负载
	eRename				= 8,  -- 改名成功后踢人
	eLockMac			= 9,  -- 禁止mac    
	eGSError	        = 50, -- GS报错踢人
    eKSHandleCLMsgError = 51, -- KS处理客户端消息错误
    eKSDayRefreshError  = 52, -- KS每日刷新错误
    eKSUpdateError      = 53, -- KSupdate错误
    eToBridgeServer     = 54, -- 离开本服去跨服
    eLeaveBridgeServer  = 55, -- 离开跨服回本服
    eNoPlayerData       = 56, -- 没有player数据
    eNoToken            = 57, -- 没有跨服token
    eInsertPlayerError  = 58, -- 数据库新建player错误
    eTooManyPlayer      = 59, -- 创建角色过多
    eSelectPlayerError  = 60, -- 数据库查询player错误
    ePlayerInBridge     = 61, -- 角色在跨服服务器里
    eKSHandleGSMsgError = 62, -- KS处理GS消息错误
    eNormalServerKick    = 63, -- 普通服申请把在跨服的账号踢掉
	eLoadDBDataError	= 64, -- 在DB线程查询playsystem错误
}
RegistEnum("PlayerBeKickReasonEnum", PlayerBeKickReasonEnum)


