--道具系统
local now			= _commonservice.now
local ItemType = RequireEnum("ItemType")
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local ItemUseEnum = RequireEnum("ItemUseEnum")
local CItemConfigMgr = RequireSingleton("CItemConfigMgr")
local CRankManager  = RequireSingleton("CRankManager")
local RankTypeEnum = RequireEnum("RankTypeEnum")
local GameEventEnum	= RequireEnum("GameEventEnum");
local CDataLog      = RequireSingleton("CDataLog")
local ItemLogDesc = RequireEnum("ItemLogDesc")
local CustomspassConfig_S 	= RequireConfig( "CustomspassConfig_S" )


local CItemSystem = RequireClass("CItemSystem")
function CItemSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	self.tItemList = { }
	self.tSaveCaches = { }
	--初始化DB模块
	local tRes = oPlayer:GetPlayerData("CItemSystem")
	for _, tInfo in pairs(tRes.item_role) do
		local oItem = NewClass("CItem", tInfo.itemid, tInfo)
		self.tItemList[tInfo.itemid] = oItem
	end
end

-- 存盘
function CItemSystem:SaveData()
	local oPlayer = self:GetPlayer()
	local nRoleId = oPlayer:GetRoleID()
	for nEnumID, nDbType in pairs( self.tSaveCaches ) do
		local cmd = nil
		cmd = oPlayer:CreateUpdateCmd("item_role")
		cmd:SetWheres("roleid", nRoleId, "=")
		cmd:SetWheres("itemid", nEnumID, "=")
		local tDbInfo = self:GetItemDBInfo( self.tItemList[nEnumID] )
		for key, val in pairs( tDbInfo ) do 
			cmd:SetFields( key, val )
		end			
		cmd:Execute()
	end 
	self.tSaveCaches = { }
end 

function CItemSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SendItemBeginMsg")
	--同步物品信息
	local tGroup = {}
	local nIndex = 0
	for _, oItem in pairs(self.tItemList) do
		table.insert(tGroup, oItem:GetSyncClientData( ))
		nIndex = nIndex + 1
		if nIndex == 50 then
			oPlayer:SendToClient("C_SendGroupItemMsg", tGroup)
			tGroup = {}
			nIndex = 0
		end
	end
	oPlayer:SendToClient("C_SendItemEndMsg", tGroup)
end

-- 检测道具是否足够
function CItemSystem:CheckHasItem( nEnumID, nCount )
	if nCount <= 0 then
		return true
	end 
	if not CItemConfigMgr:IsItem( nEnumID ) then
		return false
	end 	
	local oItem = self.tItemList[nEnumID]
	if not oItem then
		return false
	end
	return oItem:GetCount( ) >= nCount
end

local tSpecialFunc = {
	[ItemEnum.eGold] = function( oPlayer, nEnumID, nCount )
		oPlayer:GetSystem("CEventSystem"):OnEvent( GameEventEnum.AddGold, nCount )
	end,
}

local tOtherItem = {
	[ItemEnum.eExp] = function( oPlayer, nEnumID, nCount )
		nCount = oPlayer:AddExp(nCount)
		return nCount
	end,
}

-- 添加物品
function CItemSystem:AddItem( nEnumID, nCount, tAllAward )
	local oPlayer = self:GetPlayer( ) 
	if not CItemConfigMgr:IsItem( nEnumID ) then
		print( "erro: CItemSystem:AddItem nEnumID is not item", nEnumID )
		return nCount
	end 

	if tSpecialFunc[nEnumID] then
		tSpecialFunc[nEnumID](oPlayer, nEnumID, nCount)
	end 	
	tAllAward = tAllAward or { }
	-- 检测是否是可使用道具 如果是可使用道具则直接使用
	if self:CheckUseItem(nEnumID, nCount, tAllAward) then
		return nCount
	end

	if tOtherItem[nEnumID] then
		nCount = tOtherItem[nEnumID](oPlayer, nEnumID, nCount)
		return nCount
	end 	

	if nEnumID == ItemEnum.eEiamond then
		oPlayer:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.AddEiamond, nCount)
	end

	local nRoleId = oPlayer:GetRoleID()
	local bIsNew = false
	local oItem = self.tItemList[nEnumID]
	if not oItem then
		oItem = NewClass("CItem", nEnumID)
		self.tItemList[nEnumID] = oItem
		bIsNew = true
	end
	oItem:SetCount( oItem:GetCount( ) + nCount )
	if bIsNew then
		local cmd = oPlayer:CreateInsertCmd("item_role")
		cmd:SetFields("roleid", nRoleId)
		local tDbInfo = self:GetItemDBInfo( oItem )
		for key, val in pairs( tDbInfo ) do 
			cmd:SetFields( key, val)
		end 
		cmd:Execute()
		self.tSaveCaches[nEnumID] = nil
	else
		self.tSaveCaches[nEnumID] = 1
	end
	oPlayer:SendToClient("C_UpdateItemCount", nEnumID, oItem:GetCount( ) )
	return nCount
end

-- 减少物品
function CItemSystem:ReduceItem( nEnumID, nCount, nLogType, sOtherLog )
	if not CItemConfigMgr:IsItem( nEnumID ) then
		print( "erro: CItemSystem:Reduce nEnumID is not item", nEnumID )
		return false
	end 
	local oPlayer = self:GetPlayer() 
	local nRoleId = oPlayer:GetRoleID()
	local oItem = self.tItemList[nEnumID]
	if not oItem then
		return false
	end 
	
	local nUseCount = oItem:GetCount( ) - nCount
	if nUseCount < 0 then
		return false
	end 
	oItem:SetCount( nUseCount )
	if nUseCount > 0 then
		self.tSaveCaches[nEnumID] = 1
	else
		local cmd = oPlayer:CreateDeleteCmd("item_role")
		cmd:SetWheres("roleid", nRoleId, "=")
		cmd:SetWheres("itemid", nEnumID, "=")
		cmd:Execute()
		self.tItemList[nEnumID] = nil
		self.tSaveCaches[nEnumID] = nil
	end 
	oPlayer:SendToClient("C_UpdateItemCount", nEnumID, oItem:GetCount( ) )
	-- 这里记录话费钻石记录
	if nEnumID == ItemEnum.eEiamond then
		oPlayer:GetSystem( "CActivitySystem" ):OnCostEiamond(nCount)
	end
	local cost_type = CItemConfigMgr:GetItemName( nEnumID )
	local cost_name = ""
	if nLogType then
		cost_name = ItemLogDesc[nLogType]
		if sOtherLog then
			cost_name = cost_name .. ":" .. sOtherLog
		end
	end
	CDataLog:LogDistCost_log( 
		oPlayer:GetGYYXIF( ), 
		oPlayer:GetOpenID( ), 
		oPlayer:GetRoleID( ), 
		oPlayer:GetLevel( ), 
		cost_type, 
		cost_name, 
		math.abs( nCount ), 
		1 
	)
	return true
end

-- 使用物品
local tUseFunc = {
	-- 使用礼包道具
	[ItemUseEnum.GiftBag] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local nGiftID = tUseEffect[1]
		if nCount > 100 then
			-- 防止策划炸服
			nCount = 100
		end 
		for nIdx = 1, nCount do 
			oItemSystem:GetSystem( "CGiftSystem" ):AddGiftByID(nGiftID, tAllAward)
		end 
	end,
	-- 添加buff
	[ItemUseEnum.AddBuff] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local nBuffID = tUseEffect[1]
		local oPlayer = oItemSystem:GetPlayer( )
		oPlayer:SendToClient( "C_AddBuff", nBuffID )
	end,
	-- 添加MP
	[ItemUseEnum.AddMP] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local nMP = tUseEffect[1]
		local oPlayer = oItemSystem:GetPlayer( )
		oPlayer:SendToClient( "C_AddMP", nMP )
	end,
	-- 添加VIP
	[ItemUseEnum.AddVIP] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local nAddTime = tUseEffect[1]
		local oPlayer = oItemSystem:GetPlayer( )
		oPlayer:GetSystem( "CVipSystem" ):AddVip( nAddTime )
		oPlayer:SendToClient( "C_AddItemVIP", nAddTime )
	end,

	-- 技能触发器
	[ItemUseEnum.Skill] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local oPlayer = oItemSystem:GetPlayer( )
		local tSkillList = oPlayer:GetSystem("CSkillSystem"):GetSKillList( )
		if #tSkillList <= 0 then
			return
		end
		local nSkillID = tSkillList[math.random( 1, #tSkillList )]
		oPlayer:SendToClient( "C_ReleaseSkill", nSkillID )
	end,

	-- 获取关卡金币
	[ItemUseEnum.GetGold] = function( oItemSystem, nEnumID, nCount, tUseEffect, tAllAward )
		local nMultip =  tUseEffect[1]
		local oPlayer = oItemSystem:GetPlayer( )
		local tCustomspassConfig = CustomspassConfig_S[oPlayer:GetDungeonsLevel( )]
		if tCustomspassConfig then
			local tAward = oPlayer:GetSystem("CGiftSystem").GetGiftByID(tCustomspassConfig.waveRewardID)
			if tAward[1] and tAward[1][ItemEnum.eGold] then
				oPlayer:GetSystem("CGiftSystem"):AddGift(1, ItemEnum.eGold, tAward[1][ItemEnum.eGold] * nMultip, tAllAward)
			end 
		end 
	end,
}

-- 检测并且使用物品
function CItemSystem:CheckUseItem(nEnumID, nCount, tAllAward)
	local nType = CItemConfigMgr:GetType( nEnumID )
	if nType ~= ItemType.UseItem then
		return false
	end 
	local dwItemTypes = CItemConfigMgr:GetChildType( nEnumID )
	local tUseEffect = CItemConfigMgr:GetUseEffect( nEnumID )
	if tUseFunc[dwItemTypes] then
		tUseFunc[dwItemTypes]( self, nEnumID, nCount, tUseEffect, tAllAward )
	end 
	return true
end

-- 消耗一组道具
function CItemSystem:CostItemList( tCostLsit, nLogType, sOtherLog)
	-- 检测道具是否足够
	for _, tList in ipairs( tCostLsit ) do
		local nEnumID = tList[1]
		local nCount = tList[2]
		if not self:CheckHasItem( nEnumID, nCount ) then
			return false
		end 
	end 

	-- 消耗道具
	for _, tList in ipairs( tCostLsit ) do
		local nEnumID = tList[1]
		local nCount = tList[2]
		self:ReduceItem( nEnumID, nCount, nLogType, sOtherLog )
	end 
	return true
end

-- 获取存盘信息\
function CItemSystem:GetItemDBInfo( oItem )
	local tDBInfo = {
		["itemid"] = oItem:GetEnumID( ),
		["count"] = oItem:GetCount( ),
	}
	return tDBInfo
end

-- 获取物品数量
function CItemSystem:GetCount( nEnumID )
	local oItem = self.tItemList[nEnumID]
	if not oItem then
		return 0
	end 
	return oItem:GetCount( )
end

-- 请求兑换道具
function CItemSystem:ReqExchangeItem( nEnumID )
	local oPlayer = self:GetPlayer( )
	if not CItemConfigMgr:IsItem( nEnumID ) then
		return false
	end 
	local nType = CItemConfigMgr:GetType( nEnumID )
	if nType ~= ItemType.Exchange then
		return false
	end

	-- 消耗道具
	if not self:ReduceItem( nEnumID, 1, ItemLogEnum.ExchangeItem ) then
		return
	end
	
	local tUseEffect = CItemConfigMgr:GetUseEffect( nEnumID )
	local nGiftID = tUseEffect[1]
	local tAllAward = { }
	oPlayer:GetSystem( "CGiftSystem" ):AddGiftByID(nGiftID, tAllAward)
	oPlayer:SendToClient( "C_ReqExchangeItem", nEnumID, tAllAward )
end

-- 请求兑换道具
defineC.K_ReqExchangeItem = function(oPlayer, nEnumID)
	oPlayer:GetSystem( "CItemSystem" ):ReqExchangeItem( nEnumID )
end