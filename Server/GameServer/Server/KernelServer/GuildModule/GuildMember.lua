-- 阵营玩家类
local CDBCommand		= RequireSingleton("CDBCommand")
local CGuildMember = RequireClass("CGuildMember")
function CGuildMember:_constructor(sRoleID, nGuildID)
	self.sRoleID		= sRoleID
	self.nGuildID		= nGuildID
	self.sRoleName		= ""
	self.nDungeonsLevel = 1
	self.nContribution	= 0			-- 捐献值
	self.nRank = 0
	-- 存盘缓存
	self.tSaveData = { }
end

-- 获取排名
function CGuildMember:GetRank( )
	return self.nRank
end

function CGuildMember:SetRank( nRank )
	self.nRank = nRank
end

-- 关服处理
function CGuildMember:Destruct( )
	-- 暂时不需要做什么
end

function CGuildMember:SetSaveData( Key, val )
	self.tSaveData[Key] = val
end

-- 保存数据
function CGuildMember:SaveData( )
	if next(self.tSaveData) then
        local oUpdateCmd = CDBCommand:CreateUpdateCmd("guild_role")
        for k, v in pairs(self.tSaveData) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", self.sRoleID, "=")
        oUpdateCmd:Execute()
        self.tSaveData = {}
	end
end

function CGuildMember:GetClientInfo( )
	local tSync = {
		self.sRoleID,
		self.nGuildID,
		self.sRoleName,
		self.nDungeonsLevel,
		self.nContribution,
	}
	return tSync
end

-- 初始化玩家数据
function CGuildMember:InitPlayerInfo(oPlayer)
	self.sRoleID		= oPlayer:GetRoleID()
	self.sRoleName		= oPlayer:GetName()
	self.nDungeonsLevel = oPlayer:GetDungeonsCustoms( )
	self.nContribution = 0
	-- 添加DB信息
	local cmd = CDBCommand:CreateInsertCmd("guild_role")
	cmd:SetFields("roleid", self.sRoleID)
	cmd:SetFields("rolename", self.sRoleName)	
	cmd:SetFields("guildid", self.nGuildID)
	cmd:SetFields("dungeons", self.nDungeonsLevel)
	cmd:SetFields("contribution", 0)
	cmd:Execute()
end

-- 解析DB数据
function CGuildMember:UnpackData(data)
	self.sRoleID		= data.roleid
	self.sRoleName		= data.rolename
	self.nGuildID		= data.guildid
	self.nDungeonsLevel = data.dungeons
	self.nContribution	= data.contribution
end

-- 设置玩家名字
function CGuildMember:SetRoleName( sName )
	self.sRoleName		= sName
	self:SetSaveData( "rolename", sName )
end

-- 设置公会ID
function CGuildMember:SetGuildID( nGuildID )
	self.nGuildID = nGuildID
	self:SetSaveData( "guildid", nGuildID )
end

-- 增加贡献值
function CGuildMember:ModContribution( nContribution )
	self.nContribution = self.nContribution + nContribution
	self:SetSaveData( "contribution", nContribution )
end

-- 更换公会
function CGuildMember:ChgGuild(oGuild)
	local nGuildID = oGuild:GetGuildID( )
	self:SetGuildID( nGuildID )
	self.nContribution = 0
	self:SetSaveData( "contribution", 0 )
end

-- 获取贡献值
function CGuildMember:GetContribution( )
	return self.nContribution
end

-- 玩家改名通知
function CGuildMember:OnPlayerRename( sName )
	self:SetRoleName( sName )
end

-- 玩家改名通知
function CGuildMember:OnDungeonsLevel( nDungeonsLevel )
	self.nDungeonsLevel	= nDungeonsLevel
	self:SetSaveData( "dungeons", nDungeonsLevel )
end