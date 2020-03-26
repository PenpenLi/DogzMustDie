--图鉴系统
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local RelationConfig_S = RequireConfig( "RelationConfig_S" )
local HandbookUpConfig_S = RequireConfig( "HandbookUpConfig_S" )
local HandbookTeamConfig_S = RequireConfig( "HandbookTeamConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CHandbookSystem = RequireClass("CHandbookSystem")

-- 图鉴类型枚举
local eHeroType     = 1 -- 英雄
local ePetType      = 2 -- 神兽

function CHandbookSystem:Create()
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )

	-- 图鉴存盘脏位
	self.tSaveHandbook = { }

	--玩家图鉴等级列表
	self.tHandbookList = {}

	--玩家套装图鉴等级列表
	self.tSuitHandbookList = {}

	local res = oPlayer:GetPlayerData("CHandbookSystem")
	if res then
		self.tHandbookList = StrToTable( res.handbooklist )
		self.tSuitHandbookList = StrToTable( res.suithandbooklist )
	end 
end

--上线同步
function CHandbookSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( )                 
	oPlayer:SendToClient("C_SendHandbookInfo", self.tHandbookList, self.tSuitHandbookList)
end

-- 存盘
function CHandbookSystem:SaveData()
	if next(self.tSaveHandbook) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("handbook_role");
        for k, v in pairs(self.tSaveHandbook) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.tSaveHandbook = {}
	end
end

--获取图鉴等级
function CHandbookSystem:GetHandbookLv( eHandbookType, nHandbookID )
	return self.tHandbookList[eHandbookType][nHandbookID] or 0
end

--获取套装图鉴等级
function CHandbookSystem:GetSuitHandbookLv( eHandbookType, nSuitHandbookID )
	return self.tSuitHandbookList[eHandbookType][nSuitHandbookID] or 0
end

--获取图鉴等级上限
function CHandbookSystem:GetMaxLv()
	return #HandbookUpConfig_S
end

-- 升级图鉴 
function CHandbookSystem:ReqUpgeadeHandbook( eHandbookType, nHandbookID )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )

	if not self.tHandbookList[eHandbookType] then
		self.tHandbookList[eHandbookType] = { }
	end

	--满级了
	if self:GetHandbookLv( eHandbookType, nHandbookID) == self:GetMaxLv() then
		delog("CHandbookSystem:ReqUpgeadeHandbook Handbook is MaxLv!", eHandbookType, nHandbookID)
		return
	end
	local nUpgeade = self:GetHandbookLv(eHandbookType, nHandbookID) + 1
	local nNeedNum = HandbookUpConfig_S[nUpgeade].NeedItemNum

	-- 消耗升级的材料
	if not oPlayer:CostItem(nHandbookID, nNeedNum, ItemLogEnum.UpgeadeHandbook) then
		delog("CHandbookSystem:ReqUpgeadeHandbook UpgeadeHandbook not CostItem!", eHandbookType, nHandbookID)
		return
	end 

	--升级图鉴
	
	if not self.tHandbookList[eHandbookType][nHandbookID] then
		self.tHandbookList[eHandbookType][nHandbookID] = 0
	end
	self.tHandbookList[eHandbookType][nHandbookID] = self.tHandbookList[eHandbookType][nHandbookID] + 1

	self.tSaveHandbook["handbooklist"] = TableToStr( self.tHandbookList ) 
	oPlayer:SendToClient("C_ReqUpgeadeHandbook", eHandbookType, nHandbookID, self.tHandbookList[eHandbookType][nHandbookID])
end

-- 升级套装图鉴
function CHandbookSystem:ReqUpgeadeSuitHandbook( eHandbookType, nSuitHandbookID )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )

	if not self.tSuitHandbookList[eHandbookType] then
		self.tSuitHandbookList[eHandbookType] = { }
	end

	--满级了
	if self:GetSuitHandbookLv( eHandbookType, nSuitHandbookID) == self:GetMaxLv() then
		delog("CHandbookSystem:ReqUpgeadeSuitHandbook SuitHandbook is MaxLv!", eHandbookType, nSuitHandbookID)
		return
	end

	local tHandbookTeam = HandbookTeamConfig_S[nSuitHandbookID].HandbookTeam
	local nUpgeade = self:GetSuitHandbookLv( eHandbookType, nSuitHandbookID) + 1


	for _,nHandbookID in ipairs(tHandbookTeam) do
		if self:GetHandbookLv( eHandbookType, nHandbookID) < nUpgeade then
			delog("CHandbookSystem:ReqUpgeadeSuitHandbook SuitHandbook HandbookLv < nUpgeade !", eHandbookType, nSuitHandbookID, self:GetHandbookLv( eHandbookType, nHandbookID), nUpgeade)
			return
		end
	end

	--升级套装图鉴
	if not self.tSuitHandbookList[eHandbookType][nSuitHandbookID] then
		self.tSuitHandbookList[eHandbookType][nSuitHandbookID] = 0
	end
	self.tSuitHandbookList[eHandbookType][nSuitHandbookID] = self.tSuitHandbookList[eHandbookType][nSuitHandbookID] + 1

	self.tSaveHandbook["suithandbooklist"] = TableToStr( self.tSuitHandbookList ) 
	oPlayer:SendToClient("C_ReqUpgeadeSuitHandbook", eHandbookType, nSuitHandbookID, self.tSuitHandbookList[eHandbookType][nSuitHandbookID])
end

-- 请求升级图鉴
defineC.K_ReqUpgeadeHandbook = function ( oPlayer, eHandbookType, nHandbookID )
	oPlayer:GetSystem( "CHandbookSystem" ):ReqUpgeadeHandbook( eHandbookType, nHandbookID )
end

-- 请求升级套装图鉴
defineC.K_ReqUpgeadeSuitHandbook = function ( oPlayer, eHandbookType, nSuitHandbookID )
	oPlayer:GetSystem( "CHandbookSystem" ):ReqUpgeadeSuitHandbook( eHandbookType, nSuitHandbookID )
end