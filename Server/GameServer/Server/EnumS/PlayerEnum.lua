
-- 玩家信息枚举
local PlayerInfoEnum = {
	eExp		= 1,	-- 经验
	eFightPoint	= 2,	-- 战斗力
	eRelive		= 3,	-- 原地复活次数
	eLevel		= 4,	-- 等级
	ePos		= 5,	-- 坐标
	eScore1v1	= 6,	-- 1v1积分
	eScore3v3	= 7,	-- 3v3积分
	eFightState = 8,	-- 战斗状态
	--eGXGetCnt3v3 = 9,	-- 废弃
	eExtraHP 	= 10,	-- 额外血
	eExtraMP 	= 11,	-- 额外蓝
	eRMCntBuy 	= 12,	-- 已购买打榜次数
	eCamp 		= 13,	-- 阵营
	eBridgeHoleNum = 14,	-- 荻花洞窑击杀boss次数
};
RegistEnum("PlayerInfoEnum", PlayerInfoEnum);

-- 经验产出枚举
local ExpGainEnum = {
	eKillMonster	= 1,	-- 杀怪
	eTaskBonus		= 2,	-- 任务奖励
	eUseItem		= 3,	-- 使用道具
	eSkyLand		= 4,	-- 天地战场
	eLogoutTime		= 5,	-- 离线经验
	eResource		= 6,	-- 资源找回
	eExpItem		= 7,	-- 经验道具奖励
	eSitExp			= 8,	-- 打坐经验
    eFactionFight   = 9,    -- 帮战
    eGuildBoss      = 10,   -- 帮派BOSS战
	eGM			    = 11,   -- gm指令
	eTransmitPower  = 12,	-- 帮派传功
	eMarryPraise    = 13,	-- 情缘点赞
	eHangUp			= 14,	-- H5挂机
};
RegistEnum("ExpGainEnum", ExpGainEnum);

-- log日志描述
local PlayerLogEnum = {
    Dungeons 		= "关卡",
    Topic		 	= "话题先锋",
    PVP		 		= "王者约战",
    WorldBoss	 	= "世界Boss",
    AD	 			= "广告",
}
RegistEnum("PlayerLogEnum", PlayerLogEnum);

-- 公会日志
local GuildLogEnum = {
	AddGuild 		= 1, 	-- 加入公会
	LeaveGuild 		= 2,	-- 离开公会
	Contribution 	= 3,	-- 公会捐献
}
RegistEnum("GuildLogEnum", GuildLogEnum)

