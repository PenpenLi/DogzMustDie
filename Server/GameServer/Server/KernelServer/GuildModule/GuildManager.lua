
local now = _commonservice.now
local ItemLogEnum = RequireEnum("ItemLogEnum")
local GuildLogEnum = RequireEnum("GuildLogEnum")
local ItemEnum = RequireEnum("ItemEnum")
local GangConfig_S = RequireConfig("GangConfig_S")
local CDBCommand		= RequireSingleton("CDBCommand")
local GangDonateConfig_S = RequireConfig( "GangDonateConfig_S" )
local CGuildManager = RequireSingleton("CGuildManager")
local GameParamConfig_S= RequireConfig("GameParamConfig_S")
local CRankManager  = RequireSingleton("CRankManager")
-- 存盘时间间隔
local i_nSaveDateTime = 2 * 60000

-- 记录工会数量
local nMaxGuildNum = 0
for nGuildID, tCfg in ipairs(GangConfig_S) do
	nMaxGuildNum = nMaxGuildNum + 1
end 

-- local
local CGuildManager = RequireSingleton("CGuildManager")

function CGuildManager:Initialize()
	-- 阵营列表
	self.m_tGuilds = {}
	self:LoadData()
	return true
end

function CGuildManager:LoadData()
	-- 加载帮会列表
	local tRes = CDBCommand:CreateSelectCmd("guild"):Execute()
	if not tRes then
		return
	end

	-- 读取阵营数据
	for nGuildID, data in ipairs( tRes ) do 
		local oGuild = NewClass("CGuild",nGuildID, data)
		self.m_tGuilds[data.id] = oGuild
	end 

	-- 扩充阵营
	local nCount = #self.m_tGuilds
	if nCount < nMaxGuildNum then
		for nGuildID = nCount + 1, nMaxGuildNum do 
			local oGuild = NewClass("CGuild", nGuildID)
			self.m_tGuilds[nGuildID] = oGuild
			local cmd = CDBCommand:CreateInsertCmd("guild")
        	cmd:SetFields("id", nGuildID)
        	cmd:SetFields("level", 1)
        	cmd:Execute()
		end 
	end 

	-- 读取玩家数据
	tRes = CDBCommand:CreateSelectCmd("guild_role"):Execute()
	if not tRes then
		return
	end

	-- 读取阵营数据
	for _, data in ipairs( tRes ) do 
		self.m_tGuilds[data.guildid]:AddDBPlayer(data)
	end 
end 

function CGuildManager:SaveData( )
	for _, oGuild in pairs(self.m_tGuilds) do
		oGuild:SaveData()
	end
end

local nSaveTime = i_nSaveDateTime
function CGuildManager:Update(i_nDeltaTime)
	nSaveTime = nSaveTime - i_nDeltaTime
	if nSaveTime <= 0 then
		nSaveTime = i_nSaveDateTime
		self:SaveData( )
	end
end

-- 关服前保存日志
function CGuildManager:Destruct()
	self:SaveData( )
	for _, oGuild in pairs(self.m_tGuilds) do
		oGuild:Destruct( )
	end
end

-- 玩家上线
function CGuildManager:PlayerOnlie( oPlayer )
	local nGuildID = oPlayer:GetGuildID()
	local oGuild = self.m_tGuilds[nGuildID]
	if not oGuild then
		return 
	end
	oGuild:PlayerOnlie(oPlayer)
end

-- 玩家下线
function CGuildManager:PlayerLeave( oPlayer )
	local nGuildID = oPlayer:GetGuildID()
	local oGuild = self.m_tGuilds[nGuildID]
	if not oGuild then
		return
	end 
	oGuild:PlayerLeave(oPlayer)
end

-- 获取公会玩家信息
function CGuildManager:GetGuildMember( oPlayer )
	local nGuildID = oPlayer:GetGuildID()
	local oGuild = self.m_tGuilds[nGuildID]
	if not oGuild then
		return nil
	end 
	return oGuild:GetGuildMember( oPlayer:GetRoleID( ) )
end

-- 获取公会实例
function CGuildManager:GetGuild( nGuildID )
	return self.m_tGuilds[nGuildID]
end

-- 改名通知
function CGuildManager:OnPlayerRename( oPlayer, sName )
	local oGuildMember = self:GetGuildMember( oPlayer )
	if not oGuildMember then
		return
	end 
	oGuildMember:OnPlayerRename( sName )
end

-- 通关通知
function CGuildManager:OnDungeonsLevel( oPlayer, nDungeonsLevel )
	local oGuildMember = self:GetGuildMember( oPlayer )
	if not oGuildMember then
		return
	end 
	oGuildMember:OnDungeonsLevel( nDungeonsLevel )
end

-- 请求加入阵营
function CGuildManager:ReqAddGuild(oPlayer, nGuildID)
	delog( "CGuildManager:ReqAddGuild Done", type(nGuildID), nGuildID )
	if not self.m_tGuilds[nGuildID] then
		delog("not self.m_tGuilds[nGuildID]")
		return
	end

	-- 获取老公会ID
	local nOldGuildID = oPlayer:GetGuildID()
	if nOldGuildID > 0 then
		if not oPlayer:CostItem( ItemEnum.eEiamond ,GameParamConfig_S.GangChangeConsume, ItemLogEnum.ChangeGuild ) then
			return
		end 
		local oOldGuild = self.m_tGuilds[nOldGuildID]
		local oGuildMember = oOldGuild:DelPlayerDelPlayer(oPlayer)
		self.m_tGuilds[nGuildID]:AddPlayer(oPlayer, oGuildMember)
	else
		-- 将玩家加入阵营
		self.m_tGuilds[nGuildID]:AddPlayer(oPlayer)
	end
	
	oPlayer:SendToClient( "C_ReqAddGuild", nGuildID, self.m_tGuilds[nGuildID]:GetClientInfo( ) )
end

-- 请求阵营列表
function CGuildManager:ReqGuildList(oPlayer)
	local tGuildList = { }
	for nGuildID, oGuild in pairs(self.m_tGuilds) do 
		tGuildList[nGuildID] = oGuild:GetClientInfo()
	end 
	oPlayer:SendToClient( "C_ReqGuildList", tGuildList )
end

-- 请求阵营成员列表
function CGuildManager:ReqGuildPlayerList(oPlayer, nGuildID)
	local oGuild =self.m_tGuilds[nGuildID]
	if not oGuild then
		return
	end 
	local tArrayList = { }
	local tRank = oGuild:GetRankList( )
	for nRank, roleid in ipairs(tRank) do 
		local oGuildMember = oGuild:GetGuildMember(roleid)
		table.insert( tArrayList, oGuildMember:GetClientInfo( ) )
		if nRank >= 100 then
			break
		end
	end 

	local nMyRank = oGuild:GetRank( oPlayer:GetRoleID( ) )
	oPlayer:SendToClient( "C_ReqGuildPlayerList", nGuildID, tArrayList, nMyRank )
end

-- 请求捐献
function CGuildManager:ReqContribution(oPlayer, nType)
	local tCfg = GangDonateConfig_S[nType]
	if not tCfg then
		return
	end 
	local sRoleID = oPlayer:GetRoleID( )
	local nGuildID = oPlayer:GetGuildID()
	local oGuild = self.m_tGuilds[nGuildID]

	-- 检测是否有公会
	if not oGuild then
		return
	end 

	local oGuildMember = oGuild:GetGuildMember(sRoleID)
	-- 检测公会里是否有这个人 如果没有就见了鬼了
	if not oGuildMember then
		return
	end 
	local nNowTimes = oPlayer:GetContribution(nType)
	-- 检测每日捐献次数
	if tCfg.num > 0 then
		if nNowTimes >= tCfg.num then
			return
		end
	end

	-- 消耗道具
	if not oPlayer:CostItem( tCfg.consume[1], tCfg.consume[2], ItemLogEnum.GuildContribution ) then
		return
	end 

	-- 添加次数
	oPlayer:SetContribution(nType, nNowTimes + 1)

	-- 添加公会热度
	oGuild:AddContribution(oPlayer, tCfg.heat)
	oGuild:AddGuildLog( GuildLogEnum.Contribution, {oPlayer:GetName( ), nType} )
	oPlayer:SendToClient( "C_ReqContribution", nType, oGuild:GetClientInfo( ) )
end

-- 请求阵营列表
function CGuildManager:ReqGuildInfo(oPlayer)

	local sRoleID = oPlayer:GetRoleID( )
	local nGuildID = oPlayer:GetGuildID()
	local oGuild = self.m_tGuilds[nGuildID]

	-- 检测是否有公会
	if not oGuild then
		return
	end 

	oPlayer:SendToClient( "C_ReqGuildInfo", oGuild:GetClientInfo( ) )
end

-- 请求当前公会信息
defineC.K_ReqGuildInfo = function(oPlayer)
	CGuildManager:ReqGuildInfo(oPlayer)
end

-- 请求阵营列表
defineC.K_ReqGuildList = function(oPlayer)
	CGuildManager:ReqGuildList(oPlayer)
end

-- 请求加入阵营
defineC.K_ReqAddGuild = function(oPlayer, nGuildID)
	CGuildManager:ReqAddGuild(oPlayer, nGuildID)
end

-- 请求阵营成员列表
defineC.K_ReqGuildPlayerList = function(oPlayer, nGuildID)
	CGuildManager:ReqGuildPlayerList(oPlayer, nGuildID)
end

-- 请求捐献
defineC.K_ReqContribution = function(oPlayer, nType)
	CGuildManager:ReqContribution(oPlayer, nType)
end



