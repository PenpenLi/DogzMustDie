--道具系统
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local RankTypeEnum = RequireEnum("RankTypeEnum")
local GameEventEnum	= RequireEnum("GameEventEnum")

local HeroConfig_S = RequireConfig( "HeroConfig_S" )
local HeroUpgrate_S = RequireConfig( "HeroUpgrateConfig_S" )
local HeroAdvance_S = RequireConfig( "HeroAdvanceConfig_S" )
local CRankManager  = RequireSingleton("CRankManager")

local _, tHeroInfoFlag = next( HeroAdvance_S )
local MaxHeroLevel = #tHeroInfoFlag

local CHeroSystem = RequireClass("CHeroSystem")
function CHeroSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	-- 英雄列表
	self.tHeroList = { }
	-- 存盘脏位
	self.tSaveCaches = { }
	-- 记录当前英雄数量
	self.nHeroCount = 0
	-- 记录英雄总等级
	self.nHeroAllLevel = 0
	--初始化DB模块
	local tRes = oPlayer:GetPlayerData("CHeroSystem")
	for _, oHero in pairs(tRes.hero_role) do
		local oHero = NewClass("CHero", oHero.heroid, oHero)
		self.tHeroList[oHero:GetEnumID( )] = oHero
		self.nHeroCount = self.nHeroCount + 1
		self.nHeroAllLevel = self.nHeroAllLevel + oHero:GetLevel( )
	end
end

-- 获取英雄实例
function CHeroSystem:GetHero( nEnumID )
	return self.tHeroList[nEnumID]
end

-- 判断是否已经激活英雄
function CHeroSystem:IsActivate( nEnumID )
	return self.tHeroList[nEnumID] and true or false
end

-- 英雄数量
function CHeroSystem:GetHeroCount( )
	return self.nHeroCount
end

-- 存盘
function CHeroSystem:SaveData()
	local oPlayer = self:GetPlayer()
	local nRoleId = oPlayer:GetRoleID()
	for nEnumID, nDbType in pairs( self.tSaveCaches ) do
		local cmd = oPlayer:CreateUpdateCmd("hero_role")
		cmd:SetWheres("roleid", nRoleId, "=")
		cmd:SetWheres("heroid", nEnumID, "=")
		local tDbInfo = self:GetHeroDBInfo( self.tHeroList[nEnumID] )
		for key, val in pairs( tDbInfo ) do 
			cmd:SetFields( key, val )
		end		
		cmd:Execute()
	end 
	self.tSaveCaches = { }
end 

function CHeroSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SendHeroBeginMsg")
	--同步物品信息
	local tGroup = {}
	local nIndex = 0
	for _, oHero in pairs(self.tHeroList) do
		table.insert(tGroup, oHero:GetSyncClientData( ))
		nIndex = nIndex + 1
		if nIndex == 50 then
			oPlayer:SendToClient("C_SendGroupHeroMsg", tGroup)
			tGroup = {}
			nIndex = 0
		end
	end
	oPlayer:SendToClient("C_SendHeroEndMsg", tGroup)
end

-- 添加一个英雄
function CHeroSystem:AddHero( nEnumID, bBattle )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	local tCfg = HeroConfig_S[nEnumID]
	if not tCfg then
		return
	end 

	-- 不能重复添加英雄
	if self.tHeroList[nEnumID] then
		return 
	end 

	local oHero = NewClass("CHero", nEnumID )
	self.tHeroList[oHero:GetEnumID( )] = oHero
	self.nHeroCount = self.nHeroCount + 1
	self.nHeroAllLevel = self.nHeroAllLevel + oHero:GetLevel( )
	
	oPlayer:ActivateHeroAward( nEnumID )
	-- 通知客户端
	oPlayer:SendToClient("C_AddHero", oHero:GetSyncClientData( ) )

	-- 存盘
	local cmd = oPlayer:CreateInsertCmd("hero_role")
	cmd:SetFields("roleid", nRoleId)
	local tDbInfo = self:GetHeroDBInfo( oHero )
	for key, val in pairs( tDbInfo ) do 
		cmd:SetFields( key, val)
	end
	cmd:Execute()

	-- 需要处理自动上阵
	if bBattle then
		local tBattleArray = oPlayer:GetBattleArray( )
		for nPos = 0, 8 do 
			if not tBattleArray[nPos] then
				oPlayer:SetBattleArray( nPos, nEnumID )
				break
			end 
		end
	end 
	
	CRankManager:RankUpdate(RankTypeEnum.HeroRank, oPlayer:GetRoleID(), self.nHeroCount, -now(1))
	self:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.GetHeroNum, self.nHeroCount)
end

-- 获取存盘信息
function CHeroSystem:GetHeroDBInfo( oHero )
	local tDBInfo = {
		["heroid"] = oHero:GetEnumID( ),
		["level"] = oHero:GetLevel( ),
		["star"] = oHero:GetStar( ),
	}
	return tDBInfo
end

-- 请求激活英雄
function CHeroSystem:ReqActivateHero( nEnumID )

	delog( "CHeroSystem:ReqActivateHero( nEnumID ) Done", nEnumID )
	local oPlayer = self:GetPlayer( )
	if(nEnumID == 501) then 
		oPlayer:SendToClient( "C_ReqActivateHero", nEnumID )
		return
	end
	-- 检测是否已经激活
	if self:IsActivate( nEnumID ) then
		delog( "self:IsActivate( nEnumID )" )
		return
	end 

	local tCfg = HeroConfig_S[nEnumID]
	if not tCfg then
		delog( "not tCfg", type(nEnumID) )
		return
	end 

	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItem( tCfg.needItem, tCfg.needNum, ItemLogEnum.ActivateHero ) then
		delog( "not oPlayer:CostItem( tCfg.needHero, tCfg.needNum, ItemLogEnum.ActivateHero )", tCfg.needItem, tCfg.needNum )
		return
	end 

	-- 添加英雄
	self:AddHero( nEnumID, true )
	-- 通知客户端激活成功
	oPlayer:SendToClient( "C_ReqActivateHero", nEnumID )
end

-- 请求升级英雄
function CHeroSystem:ReqHeroLevelUp( nEnumID, nLevel )
	local oPlayer = self:GetPlayer( )

	if not nLevel then
		delog( "not nLevel" )
		return
	end

	-- 检测是否激活英雄
	if not self:IsActivate( nEnumID ) then
		return
	end 

	local tCfg = HeroConfig_S[nEnumID]
	if not tCfg then
		return
	end 

	-- 英雄等级表
	local tUpgrateCfg = HeroUpgrate_S[tCfg.type]
	local oHero = self:GetHero( nEnumID ) 
	local nCurLevel = oHero:GetLevel( )

	if nCurLevel >= nLevel then
		return
	end

	local nUseCount = tUpgrateCfg[nLevel].ConsumeGold - tUpgrateCfg[nCurLevel].ConsumeGold
	nUseCount = math.floor( nUseCount * tCfg.heroRatio )
	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItem( ItemEnum.eGold, nUseCount, ItemLogEnum.HeroLevelUp ) then
		delog( " not oPlayer:CostItem( ItemEnum.eGold, nUseCount, ItemLogEnum.HeroLevelUp )", nUseCount )
		return
	end 
	self:HeroLevelUp( nEnumID, nLevel )
	oPlayer:SendToClient( "C_ReqHeroLevelUp", nEnumID, nLevel )
end 

-- 英雄升级
function CHeroSystem:HeroLevelUp( nEnumID, nLevel )
	local oPlayer = self:GetPlayer( )
	-- 检测是否激活英雄
	if not self:IsActivate( nEnumID ) then
		return
	end 
	local oHero = self:GetHero( nEnumID ) 
	local nCurLevel = oHero:GetLevel( )

	if nCurLevel >= nLevel then
		return
	end

	oHero:SetLevel(nLevel)
	self.nHeroAllLevel = self.nHeroAllLevel - nCurLevel + nLevel
	self:GetSystem("CEventSystem"):OnEvent(GameEventEnum.HeroAllLevel, self.nHeroAllLevel)
	-- 设置存盘脏位
	self.tSaveCaches[nEnumID] = 1
	oPlayer:SendToClient( "C_HeroLevelUp", nEnumID, nLevel )
end

-- 请求进阶英雄
function CHeroSystem:ReqHeroStarUp( nEnumID )
	delog( " CHeroSystem:ReqHeroStarUp( nEnumID ) Done", nEnumID )
	local oPlayer = self:GetPlayer( )
	-- 检测是否激活英雄
	if not self:IsActivate( nEnumID ) then
		delog( " not self:IsActivate( nEnumID )" )
		return
	end 

	local tCfg = HeroConfig_S[nEnumID]
	if not tCfg then
		delog( "not tCfg" )
		return
	end 

	-- 英雄等级表
	local tAdvanceCfg = HeroAdvance_S[nEnumID]
	local oHero = self:GetHero( nEnumID ) 
	local nCurStar = oHero:GetStar( )

	-- 满级检测
	if not tAdvanceCfg[nCurStar + 1] then
		delog( "not tAdvanceCfg[nCurStar + 1]", nCurStar )
		return
	end 

	local tCurCfg = tAdvanceCfg[nCurStar + 1] 

	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItemList( tCurCfg.Consume, ItemLogEnum.HeroStarUp ) then
		delog( "if not oPlayer:CostItemList( tCurCfg.Consume, ItemLogEnum.HeroStarUp ) then" )
		return
	end 

	-- 设置等级
	oHero:SetStar(nCurStar + 1)

	-- 设置存盘脏位
	self.tSaveCaches[nEnumID] = 1
	oPlayer:SendToClient( "C_ReqHeroStarUp", nEnumID, oHero:GetStar( ) )
end 

-- 请求激活英雄
defineC.K_ReqActivateHero = function ( oPlayer, nEnumID )
	oPlayer:GetSystem( "CHeroSystem" ):ReqActivateHero( nEnumID )
end

-- 请求升级英雄
defineC.K_ReqHeroLevelUp = function ( oPlayer, nEnumID, nLevel )
	oPlayer:GetSystem( "CHeroSystem" ):ReqHeroLevelUp( nEnumID, nLevel )
end

-- 请求进阶英雄
defineC.K_ReqHeroStarUp = function ( oPlayer, nEnumID )
	oPlayer:GetSystem( "CHeroSystem" ):ReqHeroStarUp( nEnumID )
end