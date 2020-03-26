--签到系统
local now			= _commonservice.now
local SignConfig_S = RequireConfig( "SignConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )

local MailTypeEnum		= RequireEnum("MailTypeEnum")
local GameEventEnum		= RequireEnum("GameEventEnum")
local CCommonFunction = RequireSingleton("CCommonFunction")
local CMailManager = RequireSingleton("CMailManager")
local CRankManager  = RequireSingleton("CRankManager")
local l_nMaxDay = 15

local l_nSevenOpenLevel = 10

local CVipSystem = RequireClass("CVipSystem")
function CVipSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer()
	-- VIP过期时间  -1 为永久
	self.nExpirationTime = 0
	self.tSaveInfo = { }
	if oPlayer:IsNew() then
		
	else
		local res = oPlayer:GetPlayerData("CVipSystem")
		if res then
			self.nExpirationTime = res.expirationtime
		end
		if bRefresh then
			self:OnDayRefresh( )
		end 
	end 
end

-- 第二天
function CVipSystem:OnDayRefresh( )
	if self:IsVip( ) then
		local oPlayer = self:GetPlayer()
		local sRoleID = oPlayer:GetRoleID()
		if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.VipFlagTimes ) == 1 then
			delog("oPlayer:OnEvent( GameEventEnum.VipFlagTimes, 1 )")
			return
		end
		oPlayer:OnEvent( GameEventEnum.VipFlagTimes, 1 )
    	CMailManager:SendMail(sRoleID, MailTypeEnum.VipGift, GameParamConfig_S.VipDailyFreeReward)
	end 
end

-- 是否是VIP
function CVipSystem:IsVip( )
	if self.nExpirationTime == -1 then
		return true
	end
	return self.nExpirationTime > now(1)
end

-- 是否是永久VIP
function CVipSystem:IsPerpetualVip( )
	return self.nExpirationTime == -1
end

-- 获取vip时间
function CVipSystem:GetExpirationTime( )
	return self.nExpirationTime
end

function CVipSystem:SaveData()
	if next(self.tSaveInfo) then
		local oPlayer = self:GetPlayer()
		local sRoleID = oPlayer:GetRoleID()
        local oUpdateCmd = oPlayer:CreateUpdateCmd("vip")
        for k, v in pairs(self.tSaveInfo) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=")
        oUpdateCmd:Execute()
        self.tSaveInfo = {}
	end
end

function CVipSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_VipInfo", self.nExpirationTime )
end

-- 添加VIP
function CVipSystem:AddVip( nAddTime )
	local oPlayer = self:GetPlayer()
	if self.nExpirationTime == -1 then
		delog("addVIP--1", nAddTime);
		return
	end
	if nAddTime == -1 then
		self.nExpirationTime = nAddTime
		local sRoleID = oPlayer:GetRoleID()
    	CMailManager:SendMail(sRoleID, MailTypeEnum.VipGift, GameParamConfig_S.VipDailyFreeReward)
	elseif nAddTime > 0 then
		if self.nExpirationTime > now(1) then
			self.nExpirationTime = self.nExpirationTime + nAddTime
		else
			self.nExpirationTime = now(1) + nAddTime
		end 
	else
		delog("addVIP--2", nAddTime);
		return	
	end 

    self.tSaveInfo["expirationtime"] = self.nExpirationTime
    delog("===============111111111111")
	oPlayer:SendToClient("C_AddVip", self.nExpirationTime)
	CRankManager:OnVipLvUp(oPlayer:GetRoleID( ), self.nExpirationTime)
end