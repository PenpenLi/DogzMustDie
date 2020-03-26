--购买商店物品使用条件
local ShopEnum = {
	ePlayerLevel = 1,		--人物等级
	-- eGuildLevel	= 2,		--帮派等级
};
RegistEnum("ShopEnum", ShopEnum);


--商店消耗物品
local ShopCostEnum = {
	eMoney	= 1,			--金钱
	-- eGuildHonor	= 2,		--帮派荣誉
	eItem = 3,				--道具
};
RegistEnum("ShopCostEnum", ShopCostEnum);