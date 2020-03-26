--[[ T-特权表.xlsm 特权表
[n] : 特权ID
name : 特权名称
description : 特权描述
PurchaseConsumption : 购买消耗
type : 特权类型
parameter : 特权参数
continueTime : 特权持续时间
isActive : 是否主动
]]
return {
[1] = { name=5101, description=5111, PurchaseConsumption={2,50}, type=1, parameter={}, continueTime=43200, isActive=1, },
[2] = { name=5102, description=5112, PurchaseConsumption={2,50}, type=2, parameter={1}, continueTime=30, isActive=1, },
[3] = { name=5103, description=5113, PurchaseConsumption={2,100}, type=2, parameter={2}, continueTime=43200, isActive=1, },
[4] = { name=5104, description=5114, PurchaseConsumption={2,100}, type=3, parameter={500}, continueTime=0, isActive=1, },
[5] = { name=5105, description=5115, PurchaseConsumption={2,150}, type=4, parameter={2000}, continueTime=86400, isActive=1, },
}