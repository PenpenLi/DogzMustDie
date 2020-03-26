-- 事件中心枚举类型
local GameEventEnum = {
	AddGold			= 1,	-- 累计获得金币
	AddClick		= 2,	-- 累计点击怪物次数
	Charm			= 3,	-- 魅力值
	ChangeName		= 4,	-- 改名次数
 	HeroAttack		= 5, 	-- 英雄攻击次数
 	PetAttack		= 6, 	-- 神兽攻击次数
 	AddEiamond		= 7,	-- 累计获得钻石
 	AddDayMinute	= 8,	-- 累计在线分钟
 	KillBoss		= 9, 	-- 击杀Boss数量
 	GetHeroNum		= 10,	-- 解锁英雄数量
 	HeroDPS			= 11,	-- 英雄DPS最大值
 	KillMonster		= 12,	-- 累计消灭怪物
 	GetClickCritNum	= 13, 	-- 点击暴击次数
 	HeroAllLevel	= 14,	-- 英雄总等级
 	LevelCrossing	= 15,	-- 关卡数
 	PetAllLevel		= 16,	-- 神兽总等级
 	UsePlayerSkill	= 17,	-- 使用技能数量
 	JoinTopicNum	= 18,	-- 参加话题先锋次数
 	UsePrivilege	= 19,	-- 使用特权次数
 	GangDonateTimes	= 20,	-- 帮会捐献次数
	CharmWeek		= 21,	-- 魅力每周值
	CharLastmWeek	= 22,	-- 魅力上周周值
	WinCustoms		= 23,	-- 通关次数
	Teneven			= 24,	-- 十连优惠
	NowBossRank 	= 25,	-- 今日世界boss伤害
	LastBossRank 	= 26,	-- 昨日世界boss伤害
	ShareNum		= 27,	-- 分享总次数
	InvitationNum	= 28,	-- 邀请总人数
	OneLottery		= 29,	-- 单抽累计次数
	LadderTimes		= 30,	-- 挑战天梯次数
	BuyLadderTimes	= 31,	-- 购买挑战天梯次数
	VipFlagTimes	= 32,	-- vip奖励次数
	AdvertisingTimes= 33,	-- 看广告次数
	LadderAdverTimes= 34,	-- 天梯看广告次数
}

RegistEnum("GameEventEnum", GameEventEnum)