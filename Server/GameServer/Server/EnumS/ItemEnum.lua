
-- 物品对应ID
local ItemEnum = {
	eGold 			= 1,	-- 金币
	eEiamond 		= 2,	-- 钻石
	eExp 			= 3,	-- 经验
	eBlueEiamond	= 4,	-- 蓝钻
	Power			= 5,	-- 副本体力
	EquipCompound	= 2201,	-- 装备晶石
	Lottery			= 2301,	-- 代抽卷
	--FirstCharge	= 2301,	-- 首次充值领取卷
}
RegistEnum("ItemEnum", ItemEnum)

--物品使用类型
local ItemType = {
	Resources 		= 1,	-- 资源
	Material 		= 2,	-- 材料
	UseItem 		= 3,	-- 可使用
	Exchange 		= 4,	-- 可兑换
}
RegistEnum("ItemType", ItemType)

--物品使用类型
local ItemUseEnum = {
	GiftBag = 31,	-- 礼包
	AddBuff = 32,	-- 添加buff
	AddMP 	= 33,	-- 添加MP
	AddVIP 	= 34,	-- 添加VIP
	Skill 	= 35,	-- 技能触发器
	GetGold = 36,	-- 获取关卡金币

}
RegistEnum("ItemUseEnum", ItemUseEnum)

--道具系统记录日志使用各种操作类型
local ItemLogEnum = {
	ActivateHero 		= 1,		-- 激活英雄
	HeroLevelUp 		= 2,		-- 升级英雄
	HeroStarUp 			= 3,		-- 进阶英雄
	MarketBuyCost 		= 4,		-- 商店购买
	SkillLevelUp 		= 5,		-- 技能升级
	SkillActivate 		= 6,		-- 激活技能
	Lottery 			= 7,		-- 抽奖
	AddPrivilege 		= 8,		-- 添加特权
	GuildContribution 	= 9,		-- 帮会捐献
	ChangeGuild 		= 10,		-- 更换阵营
	CompoundEquip 		= 11,		-- 装备合成
	PvpDefeated 		= 12,		-- pvp失败
	ExchangeItem 		= 13,		-- 兑换道具
	BuyFund 			= 14,		-- 购买基金
	GiveGifts 			= 15,		-- 赠送礼物	
	BuyLadderTimes 		= 16,		-- 天梯挑战次数
	UpgeadeHandbook 	= 17,		-- 升级图鉴
	Dungeon 			= 18, 		-- 挑战副本
	ContiCharge			= 19, 		-- 每日转盘
	DayDialCost			= 20,		-- 每日转盘消耗
	BuyDungeonTimes		= 21,		-- 购买挑战副本次数
	BuyPowerTimes		= 22,		-- 购买体力次数
}
RegistEnum("ItemLogEnum", ItemLogEnum)

local ItemLogDesc = {
	[ItemLogEnum.ActivateHero]			= "激活英雄",
	[ItemLogEnum.HeroLevelUp]			= "升级英雄",
	[ItemLogEnum.HeroStarUp]			= "进阶英雄",
	[ItemLogEnum.MarketBuyCost]			= "商店购买",
	[ItemLogEnum.SkillLevelUp]			= "技能升级",
	[ItemLogEnum.SkillActivate]			= "激活技能",
	[ItemLogEnum.Lottery]				= "抽奖",
	[ItemLogEnum.AddPrivilege]			= "添加特权",
	[ItemLogEnum.GiveGifts]				= "赠送礼物",
	[ItemLogEnum.GuildContribution]		= "帮会捐献",
	[ItemLogEnum.ChangeGuild]			= "更换阵营",
	[ItemLogEnum.CompoundEquip]			= "装备合成",
	[ItemLogEnum.PvpDefeated]			= "pvp失败",
	[ItemLogEnum.ExchangeItem]			= "兑换道具",
	[ItemLogEnum.BuyFund]				= "购买基金",
	[ItemLogEnum.BuyLadderTimes]		= "天梯挑战次数",
	[ItemLogEnum.UpgeadeHandbook]		= "升级图鉴",
	[ItemLogEnum.Dungeon]				= "挑战副本",
	[ItemLogEnum.ContiCharge]			= "每日转盘",
	[ItemLogEnum.DayDialCost]			= "每日转盘",
	[ItemLogEnum.BuyDungeonTimes]		= "购买挑战副本次数",
	[ItemLogEnum.BuyPowerTimes]			= "购买体力次数",
}
RegistEnum("ItemLogDesc", ItemLogDesc)

