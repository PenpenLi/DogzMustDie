--技能系统
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local RoleSkillUpConfig_S = RequireConfig( "RoleSkillUpConfig_S" )
local PassiveSkillConfig_S = RequireConfig( "PassiveSkillConfig_S" )

local CSkillSystem = RequireClass("CSkillSystem")
function CSkillSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	-- 技能列表
	self.tSkillList = { }
	-- 技能CD
	self.tSkillCDList = { }
	-- 存盘脏位
	self.tSaveCaches = { }
	--初始化DB模块
	local tRes = oPlayer:GetPlayerData("CSkillSystem")
	if tRes then
		self.tSkillList = StrToTable(tRes.skilllist)
		self.tSkillCDList = StrToTable(tRes.skillcdlist)
	end
end

-- 判断是否已经激活技能
function CSkillSystem:IsActivate( nSkillID )
	return self.tSkillList[nSkillID] and true or false
end

-- 获取当前MP上限
function CSkillSystem:GetMaxMP( )
	local nMP = GameParamConfig_S.BaseMaxMp
	for nSkillID, nLevel in pairs( self.tSkillList ) do 
		if nLevel > 0 then
			nMP = nMP + RoleSkillUpConfig_S[nSkillID][1].addMaxMp
		end 
	end 
	return nMP
end

-- 获取当前技能列表
function CSkillSystem:GetSKillList( )
	local tList = { }
	for nSkillID, nLevel in pairs( self.tSkillList ) do 
		if nLevel > 0 then
			table.insert( tList, nSkillID )
		end 
	end 
	return tList
end

-- 存盘
function CSkillSystem:SaveData()
	if not next( self.tSaveCaches ) then
		return
	end
	local oPlayer = self:GetPlayer()
	local nRoleId = oPlayer:GetRoleID()
	local cmd = oPlayer:CreateUpdateCmd("role_skill")
	for key, val in pairs( self.tSaveCaches ) do 
		cmd:SetFields( key, val )
	end 
	cmd:SetWheres("roleid", nRoleId, "=")
	cmd:Execute()
	self.tSaveCaches = { }
end 

function CSkillSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SyncSkillList", self.tSkillList, self.tSkillCDList)
end

-- 请求激活技能
function CSkillSystem:ReqActivateSkill( nSkillID )
	local oPlayer = self:GetPlayer( )
	-- 检测是否已经激活
	if self:IsActivate( nSkillID ) then
		return
	end 

	local tCfg = RoleSkillUpConfig_S[nSkillID]
	if not tCfg then
		return
	end 

	-- 检测角色是否达到需要等级
	if tCfg[1].needRoleLevel > oPlayer:GetLevel() then
		return
	end

	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItem( ItemEnum.eGold, tCfg[1].needGoldNum, ItemLogEnum.SkillActivate) then
		return
	end 

	-- 添加技能
	-- self:AddHero( nSkillID )
	self.tSkillList[nSkillID] = 1
	self.tSaveCaches["skilllist"] = TableToStr(self.tSkillList)
	-- 通知客户端激活成功
	oPlayer:SendToClient( "C_ReqActivateSkill", nSkillID )
end

-- 请求升级技能
function CSkillSystem:ReqSkillLevelUp( nSkillID, nLevel )
	local oPlayer = self:GetPlayer( )
	-- 检测是否激活技能
	if not self:IsActivate( nSkillID ) then
		return
	end 

	local tCfg = RoleSkillUpConfig_S[nSkillID]
	if not tCfg then
		return
	end 

	-- 检测角色是否达到需要等级
	if tCfg[nLevel].needRoleLevel > oPlayer:GetLevel() then
		return
	end
	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItem( ItemEnum.eGold, tCfg[nLevel].needGoldNum, ItemLogEnum.SkillLevelUp ) then
		return
	end 

	-- -- 设置等级
	-- oHero:SetLevel(nLevel)
	self.tSkillList[nSkillID] = nLevel
	self.tSaveCaches["skilllist"] = TableToStr(self.tSkillList)

	-- -- 设置存盘脏位
	-- self.tSaveCaches[nSkillID] = 1
	oPlayer:SendToClient( "C_ReqSkillLevelUp", nSkillID, nLevel )
end 

-- 请求记录技能CD
function CSkillSystem:ReqSkillCD( nSkillID )
	delog( "CSkillSystem:ReqSkillCD Done", type( nSkillID ), nSkillID )
	local oPlayer = self:GetPlayer( )
	-- 检测是否激活技能
	if not self:IsActivate( nSkillID ) then
		return
	end 

	local tCfg = RoleSkillUpConfig_S[nSkillID]
	if not tCfg then
		return
	end 

	self.tSkillCDList[nSkillID] = now(1)
	self.tSaveCaches["skillcdlist"] = TableToStr(self.tSkillCDList)
end

-- 请求激活技能
defineC.K_ReqActivateSkill = function ( oPlayer, nSkillID )
	oPlayer:GetSystem( "CSkillSystem" ):ReqActivateSkill( nSkillID )
end

-- 请求升级技能
defineC.K_ReqSkillLevelUp = function ( oPlayer, nSkillID, nLevel )
	oPlayer:GetSystem( "CSkillSystem" ):ReqSkillLevelUp( nSkillID, nLevel )
end

-- 请求保存技能CD时间搓
defineC.K_ReqSkillCD = function( oPlayer, nSkillID )
	oPlayer:GetSystem( "CSkillSystem" ):ReqSkillCD( nSkillID )
end