--道具系统
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local EquipConfig_S = RequireConfig( "EquipConfig_S" )
local OpenGradeConfig_S = RequireConfig( "OpenGradeConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CustomspassConfig_S = RequireConfig( "CustomspassConfig_S" )
local GameEventEnum = RequireEnum("GameEventEnum")
local MailTypeEnum      = RequireEnum("MailTypeEnum")
local CMailManager = RequireSingleton("CMailManager")

local eEnumID 	= 1 -- 配置ID
local eLock 	= 2 -- 锁头
local eNew		= 3 -- 新获得标记
local eUse		= 4 -- 是否佩戴

-- 套装关系映射表
local tGroupMapping = { }
for nEnumID, tCfg in pairs( EquipConfig_S ) do 
	local equipGroup = tCfg.equipGroup 
	if equipGroup > 0 then 
		if not tGroupMapping[equipGroup] then 
			tGroupMapping[equipGroup] = { } 
		end 
		local equipLevel = tCfg.equipLevel
		tGroupMapping[equipGroup][equipLevel] = nEnumID
	end 
end 

local CEquipSystem = RequireClass("CEquipSystem")
function CEquipSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	self.nInstFlag = 0
	-- 存盘脏位
	self.tSaveCaches = { }
	-- 装备列表
	self.tEquipList = { }
	self.tUseList = { }
	-- 记录当前装备数量
	self.nEquipCount = 0

	local res = oPlayer:GetPlayerData("CEquipSystem")
	if res then
		local tData = StrToTable( res.equipinfo )
		for nInstID, tInfo in ipairs( tData ) do
			local nNewInstID = self:GetNewInstID( )
			self.tEquipList[nNewInstID] = tInfo
			self.nEquipCount = self.nEquipCount + 1
			if tInfo[eUse] == 1 then
				self:ReqUseEquip( nNewInstID, true )
			end 
		end 
	end 
end

-- 获取新的实力ID
function CEquipSystem:GetNewInstID( )
	self.nInstFlag = self.nInstFlag + 1
	return self.nInstFlag
end

-- 装备数量
function CEquipSystem:GetEquipCount( )
	return self.nEquipCount
end

-- 存盘
function CEquipSystem:SaveData()
	if next(self.tSaveCaches) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("equip_role");
        for k, v in pairs(self.tSaveCaches) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.tSaveCaches = {}
	end
end

-- 判断功能是否开启
function CEquipSystem:IsOpen( )
	local oPlayer = self:GetPlayer( ) 
	return oPlayer:GetDungeonsCustoms( ) >= OpenLevel
end 

function CEquipSystem:Update(i_nDeltaMsec)
end

function CEquipSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( )                 
	oPlayer:SendToClient("C_SendEquipInfo", self.tEquipList, self.tUseList)
end

-- 添加装备
function CEquipSystem:AddEquip( nEnumID )
	local oPlayer = self:GetPlayer( ) 
	if not EquipConfig_S[nEnumID] then
		return 
	end 

	-- 检测背包是否满了
	if self.nEquipCount >= GameParamConfig_S.EquipMaxNum then
		local tAllAward = {
			{2, nEnumID, 1},
		}
		CMailManager:SendMail(
			oPlayer:GetRoleID( ), 
			MailTypeEnum.PackMax, 
			tAllAward
			)
		return
	end 

	local nInstID = self:GetNewInstID( )
	local tEquip = {
		 [eEnumID] 	= nEnumID,
		 [eLock] 	= 0,
		 [eNew]		= 1,
		 [eUse]		= 0,
	}

	self.tEquipList[nInstID] = tEquip
	self.nEquipCount = self.nEquipCount + 1
	self.tSaveCaches["equipinfo"] = TableToStr( self.tEquipList )
	oPlayer:SendToClient("C_AddEquip", nInstID, self.tEquipList[nInstID] )
end

-- 删除装备
function CEquipSystem:DelEquip( nInstID )
	local oPlayer = self:GetPlayer( ) 
	local tInfo = self.tEquipList[nInstID]
	if not tInfo then
		return false
	end 

	local nEnumID = tInfo[eEnumID]
	local tCfg = EquipConfig_S[nEnumID]
	-- 当前穿戴的装备无法删除
	if self.tUseList[tCfg.equipType] == nInstID then
		return false
	end 

	local nLock = tInfo[eLock]
	if nLock == 1 then
		return false
	end

	self.tEquipList[nInstID] = nil
	self.nEquipCount = self.nEquipCount - 1
	self.tSaveCaches["equipinfo"] = TableToStr( self.tEquipList )

	oPlayer:SendToClient("C_DelEquip", nInstID)
	return true
end

-- 出售装备
function CEquipSystem:ReqSellEquip( nInstID )
	local oPlayer = self:GetPlayer( ) 
	local tInfo = self.tEquipList[nInstID]
	if not tInfo then
		return
	end 
	local nEnumID = tInfo[eEnumID]
	local tCfg = EquipConfig_S[nEnumID]
	-- 删除道具
	if not self:DelEquip( nInstID ) then
		return
	end 
	local tAllAward = { }
	oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, tCfg.sellNum, tAllAward )
	oPlayer:SendToClient( "C_ReqSellEquip", tAllAward )
end

-- 请求穿戴装备
function CEquipSystem:ReqUseEquip( nInstID, bNotSync )
	local oPlayer = self:GetPlayer( ) 
	local tInfo = self.tEquipList[nInstID]
	if not tInfo then
		return
	end 

	local nEnumID = tInfo[eEnumID]
	local tCfg = EquipConfig_S[nEnumID]

	local nOldInstID = self.tUseList[tCfg.equipType]
	if nOldInstID then
		local tOldInfo = self.tEquipList[nOldInstID]
		tOldInfo[eUse] = 0
	end

	self.tUseList[tCfg.equipType] = nInstID
	tInfo[eUse] = 1
	if not bNotSync then
		oPlayer:SendToClient( "C_ReqUseEquip", tCfg.equipType, nInstID )
	end
end

-- 请求设置锁头
function CEquipSystem:ReqLockEquip( nInstID, nLock )
	local oPlayer = self:GetPlayer( ) 
	if not ( ( nLock == 1 ) or ( nLock == 0 ) ) then
		return
	end 
	local tInfo = self.tEquipList[nInstID]
	if not tInfo then
		return
	end 
	tInfo[eLock] = nLock
	self.tSaveCaches["equipinfo"] = TableToStr( self.tEquipList )
	oPlayer:SendToClient( "C_ReqLockEquip", nInstID, nLock)
end

-- 请求合成装备
function CEquipSystem:ReqCompoundEquip( nEquipGroup )
	local oPlayer = self:GetPlayer( ) 

	local tGroupList = tGroupMapping[nEquipGroup]
	if not tGroupList then
		return
	end 

	local nDungeonsLevel = oPlayer:GetDungeonsLevel( )

	-- 获取当前可合成等级
	local nLevel = CustomspassConfig_S[nDungeonsLevel].composeEquipLevel

	-- 获取配置ID
	local nEnumID = tGroupList[nLevel]
	if not nEnumID then
		return
	end 

	local tCfg = EquipConfig_S[nEnumID]
	-- 消耗合成的材料
	if not oPlayer:CostItem(ItemEnum.EquipCompound, tCfg.composeNeedNum, ItemLogEnum.CompoundEquip) then
		return
	end 

	self:AddEquip( nEnumID )

	oPlayer:SendToClient( "C_ReqCompoundEquip", nEnumID)
end

-- 请求设置锁头
function CEquipSystem:ReqLookEquip( nInstID )
	local oPlayer = self:GetPlayer( ) 
	local tInfo = self.tEquipList[nInstID]
	if not tInfo then
		return
	end 
	if tInfo[eNew] == 0 then
		return
	end 
	tInfo[eNew] = 0
	self.tSaveCaches["equipinfo"] = TableToStr( self.tEquipList )
end

-- 请求出售装备
defineC.K_ReqSellEquip = function ( oPlayer, nInstID )
	oPlayer:GetSystem( "CEquipSystem" ):ReqSellEquip( nInstID )
end

-- 请求穿戴装备
defineC.K_ReqUseEquip = function ( oPlayer, nInstID )
	oPlayer:GetSystem( "CEquipSystem" ):ReqUseEquip( nInstID )
end

-- 请求设置锁头
defineC.K_ReqLockEquip = function ( oPlayer, nInstID, nLock )
	oPlayer:GetSystem( "CEquipSystem" ):ReqLockEquip( nInstID, nLock )
end

-- 请求合成装备
defineC.K_ReqCompoundEquip = function ( oPlayer, nEquipGroup )
	oPlayer:GetSystem( "CEquipSystem" ):ReqCompoundEquip( nEquipGroup )
end

-- 请求设置锁头
defineC.K_ReqLookEquip = function ( oPlayer, nInstID )
	oPlayer:GetSystem( "CEquipSystem" ):ReqLookEquip( nInstID )
end
