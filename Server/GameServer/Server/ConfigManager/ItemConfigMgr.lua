local ItemConfig_S = RequireConfig( "ItemConfig_S" )
local StringInfoConfig_S = RequireConfig( "StringInfoConfig_S" )
local CItemConfigMgr = RequireSingleton("CItemConfigMgr")

function CItemConfigMgr:IsItem( nItemID )	
	return ItemConfig_S[nItemID] and true or false
end

-- 获取物品类型
function CItemConfigMgr:GetType( nItemID )
	return ItemConfig_S[nItemID].dwItemType
end

-- 获取物品子类型
function CItemConfigMgr:GetChildType( nItemID )
	return ItemConfig_S[nItemID].dwItemTypes
end

-- 获取物品品质
function CItemConfigMgr:GetQuality( nItemID )
	return ItemConfig_S[nItemID].dwItemQuality
end

-- 获取使用条件
function CItemConfigMgr:GetUseCondition( nItemID )
	return ItemConfig_S[nItemID].dwUseCondition
end

-- 获取使用效果
function CItemConfigMgr:GetUseEffect( nItemID )
	return ItemConfig_S[nItemID].dwUseEffect
end

-- 获取物品名字
function CItemConfigMgr:GetItemName( nItemID )
	local nStr = ItemConfig_S[nItemID].dwItemName
	local tCfg = StringInfoConfig_S[nStr]
	if not tCfg then
		return ""
	end
	return tCfg.s
end