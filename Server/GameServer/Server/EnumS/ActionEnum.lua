
-- 商业化活动类型枚举
local ActionTypeEnum = { 
    eDayTotalCharge     = 1, -- 每日累冲
    eDayConsume         = 2, -- 每日消耗
    eTenevenDiscounts   = 3, -- 十连优惠
    ePrivilegeDiscount 	= 4, -- 特权打折
	eBoxDiscount 		= 5, -- 宝箱打折
	eConversion 		= 6, -- 道具兑换
	eDrop 				= 7, -- 道具掉落
	eDayDial 			= 8, -- 充值转盘
	eTopic 				= 9, -- 话题先锋
}
RegistEnum("ActionTypeEnum", ActionTypeEnum)
