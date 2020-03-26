-- 阵营类
local now = _commonservice.now

local GuildLogEnum = RequireEnum("GuildLogEnum")
local CDBCommand		= RequireSingleton("CDBCommand")
local GangLevelUpConfig_S = RequireConfig( "GangLevelUpConfig_S" )
local CRankManager  = RequireSingleton("CRankManager")

local MinRank = 1000

local CGuild = RequireClass("CGuild")
function CGuild:_constructor(nGuildID, data)
	-- 存盘缓存
	self.tSaveData = { }
    self.nGuildID = nGuildID    
    self.tPlayerList = { }
    self.tOnliePlayerList = { }
    self.nPlayerCount = 0
    self.tRank = { }
	if data then
		self.nLevel = data.level
    	self.nContribution = data.contribution
	else
		self.nLevel = 1
		self.nContribution = 0
	end 	
end

function CGuild:SetSaveData( Key, val )
	self.tSaveData[Key] = val
end

function CGuild:SaveData( )
	if next(self.tSaveData) then
        local oUpdateCmd = CDBCommand:CreateUpdateCmd("guild")
        for k, v in pairs(self.tSaveData) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("id", self.nGuildID, "=")
        oUpdateCmd:Execute()
        self.tSaveData = {}
	end
	for _, oGuildMember in pairs(self.tPlayerList) do
		oGuildMember:SaveData( )
	end
end

function CGuild:Destruct( )
	for _, oGuildMember in pairs(self.tPlayerList) do
		oGuildMember:Destruct( )
	end
end

-- 获取公会ID
function CGuild:GetGuildID(  )
	return self.nGuildID
end

-- 获取玩家公会信息
function CGuild:GetGuildMember( sRoleID )
	return self.tPlayerList[sRoleID]
end

-- 获取通知客户端信息
function CGuild:GetClientInfo( )
	local tSync = {
		self.nGuildID,
		self.nPlayerCount,
		self.nLevel,
		self.nContribution,
	}
	return tSync
end

-- 获取玩家列表
function CGuild:GetPlayerList( )
	return self.tPlayerList
end

-- 获取排行榜
function CGuild:GetRankList( )
	return self.tRank
end

-- 添加DB玩家数据
function CGuild:AddDBPlayer(data)
	local oGuildMember = NewClass("CGuildMember", data.roleid, data.guildid)
	oGuildMember:UnpackData(data)
	local sRoleID = oGuildMember.sRoleID
	self.tPlayerList[sRoleID] = oGuildMember
	self.nPlayerCount = self.nPlayerCount + 1
	self:RankUpdate(sRoleID)
end

-- 增加公会贡献值
function CGuild:ModContribution( nContribution )
	self.nContribution = self.nContribution + nContribution

	-- 如果没有满级 检测是否能升级
	if GangLevelUpConfig_S[self.nLevel + 1] then
		local nNeedExp = GangLevelUpConfig_S[self.nLevel].GangExp
		if self.nContribution > nNeedExp then
			self.nLevel = self.nLevel + 1
			self.nContribution = self.nContribution - nNeedExp
			self:SetSaveData( "level", self.nLevel )
		end 
	end

	self:SetSaveData( "contribution", nContribution )
end

-- 添加玩家
function CGuild:AddPlayer( oPlayer, oGuildMember )
	local sRoleID = oPlayer:GetRoleID( )
	oPlayer:SetGuildID(self.nGuildID)
	-- 判断是否加入过公会
	if not oGuildMember then
		oGuildMember = NewClass("CGuildMember", sRoleID, self.nGuildID)
		oGuildMember:InitPlayerInfo(oPlayer)
	else
		oGuildMember:ChgGuild(self)
	end 
	self.tPlayerList[sRoleID] = oGuildMember
	self.tOnliePlayerList[sRoleID] = oPlayer
	self.nPlayerCount = self.nPlayerCount + 1
	self:RankUpdate(sRoleID)
	self:AddGuildLog( GuildLogEnum.AddGuild, {oPlayer:GetName( )})
	
	-- 刷新排行榜数据
	CRankManager:OnChangeCamp(oPlayer)
end

-- 退出公会( 变更公会调用 )
function CGuild:DelPlayer( oPlayer )
	local sRoleID = oPlayer:GetRoleID( )
	local oGuildMember = self.tPlayerList[sRoleID]
	if not oGuildMember then
		return nil
	end 
	self:RankRemovalPlayer(sRoleID)
	self.tPlayerList[sRoleID] = nil
	self.tOnliePlayerList[sRoleID] = nil
	self.nPlayerCount = self.nPlayerCount - 1
	oPlayer:SetGuildID(0)
	oGuildMember:SetGuildID(0)
	self:AddGuildLog( GuildLogEnum.LeaveGuild, {oPlayer:GetName( )})
	return oGuildMember
end

-- 玩家上线
function CGuild:PlayerOnlie(oPlayer)
	local sRoleID = oPlayer:GetRoleID( )
	self.tOnliePlayerList[sRoleID] = oPlayer
end

-- 玩家离开
function CGuild:PlayerLeave(oPlayer)
	local sRoleID = oPlayer:GetRoleID( )
	self.tOnliePlayerList[sRoleID] = nil
end

-- 玩家添加公会贡献值
function CGuild:AddContribution( oPlayer, nContribution )
	local sRoleID = oPlayer:GetRoleID( )
	local oGuildMember = self.tPlayerList[sRoleID]
	if not oGuildMember then
		return
	end 
	self:ModContribution(nContribution)
	oGuildMember:ModContribution(nContribution)
	self:RankUpdate(sRoleID)
end

-- 通知客户端添加公会日志
function CGuild:AddGuildLog(nLogType, tLogData)
	for sRoleID, oPlayer in pairs( self.tOnliePlayerList ) do 
		oPlayer:SendToClient( "C_AddGuildLog", nLogType, tLogData )
	end 
end

-- 获取贡献值
function CGuild:GetContribution( sRoleID )
	local oGuildMember = self.tPlayerList[sRoleID]
	if not oGuildMember then
		return 0 
	end 
	return oGuildMember:GetContribution( )
end

-- 获取排名
function CGuild:GetRank( sRoleID )
	local oGuildMember = self.tPlayerList[sRoleID]
	if not oGuildMember then
		return 0 
	end 
	return oGuildMember:GetRank( )
end

-- 排行榜刷新
function CGuild:RankUpdate(sRoleID)
    local nCurRank = self:GetRank( sRoleID )
    local nNewVal = self:GetContribution( sRoleID )
	local oGuildMember = self.tPlayerList[sRoleID]

    -- 如果已在榜内
    if nCurRank > 0 then
        local bCanUpdate = false
        local nPos = nCurRank
        while nPos > 1 do
            -- 获取上一名的信息
            local nLastVal = self:GetContribution(self.tRank[nPos - 1])
            if nLastVal >= nNewVal then
            	break
            end 
            nPos = nPos - 1
        end
        if nPos ~= nCurRank then
        	oGuildMember:SetRank(nPos)
            for i = nCurRank - 1, nPos, -1 do
            	local roleid = self.tRank[i]
            	local oMember = self:GetGuildMember( roleid )
            	oMember:SetRank( oMember:GetRank( ) + 1 )
                self.tRank[i + 1] = self.tRank[i]
            end
            self.tRank[nPos] = sRoleID
        end
    else -- 没在榜内
        local nNum = #self.tRank
        local nPos = nNum + 1
        while nPos > 1 do
            -- 获取上一名的信息
            local nLastVal = self:GetContribution(self.tRank[nPos - 1])
            if nLastVal >= nNewVal then
            	break
            end 
            nPos = nPos - 1
        end
        if nPos > MinRank then -- 没进榜
            return
        end
        table.insert(self.tRank, nPos, sRoleID)
        oGuildMember:SetRank(nPos)
        -- 去掉垫底的
        if nNum == MinRank then
            local roleid = table.remove(self.tRank)
        	local oMember = self:GetGuildMember( roleid )
        	oMember:SetRank( 0 )
        end
        for i = nPos + 1, #self.tRank do
        	local roleid = self.tRank[i]
        	local oMember = self:GetGuildMember( roleid )
        	oMember:SetRank( oMember:GetRank( ) + 1 )
        end
    end
end

-- 将玩家从排行榜移除
function CGuild:RankRemovalPlayer(sRoleID)
	local oGuildMember = self:GetGuildMember( sRoleID )
    local nRank = oGuildMember:GetRank( )
    -- 本来就没有进榜 何来移除
    if nRank <= 0 then
        return
    end
	oGuildMember:SetRank( 0 )
    table.remove(self.tRank, nRank)
    for i = nRank, #self.tRank do
		local roleid = self.tRank[i]
		local oMember = self:GetGuildMember( roleid )
		oMember:SetRank( i )
    end
end