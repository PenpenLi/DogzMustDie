--签到系统
local now			= _commonservice.now
local SignConfig_S = RequireConfig( "SignConfig_S" )
local SevenConfig_S = RequireConfig( "SevenConfig_S" )
local GameEventEnum	= RequireEnum("GameEventEnum")
local OpenGradeConfig_S = RequireConfig( "OpenGradeConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CCommonFunction = RequireSingleton("CCommonFunction")
local l_nMaxDay = 15

local l_nSevenOpenLevel = OpenGradeConfig_S[12].Checkpoint

local CSignInSystem = RequireClass("CSignInSystem")
function CSignInSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer()
	-- 签到功能参数
	self.nDay = 1
	self.tSignInInfo = {}
	self.tSaveInfo = {}

	-- 七日累计登陆
	self.nSevenFlagDay = 0
	self.nSevenGetFlag = 0

	if oPlayer:IsNew() then

	else
		local res = oPlayer:GetPlayerData("CSignInSystem")
		if res then
			self.nDay = res.day
			self.tSignInInfo = StrToTable( res.signininfo )
			self.nSevenFlagDay = res.sevenday
			self.nSevenGetFlag = res.sevenflag
		end

		if bRefresh then
			local nLogoutTime = CCommonFunction.GetStartsec( oPlayer:GetLogoutTime( ) )
			local nDay = math.floor( ( now(1) - nLogoutTime ) / 86400 )
			local nFlagDay = self.nDay + nDay
			if nFlagDay > l_nMaxDay then
				self.tSignInInfo = { }
				self.tSaveInfo["signininfo"] = ""
				self.nDay = nFlagDay % l_nMaxDay
			else
				self.nDay = nFlagDay
			end 
			self.tSaveInfo["day"] = self.nDay

			-- 七日累计充值
			if self:IsSevenOpen( ) then
				if self.nSevenFlagDay < 7 then
					if (self.nSevenGetFlag == 1) or (self.nSevenFlagDay == 0) then
						self.nSevenFlagDay = self.nSevenFlagDay + 1
						self.tSaveInfo["sevenday"] = self.nSevenFlagDay
						self.nSevenGetFlag = 0
						self.tSaveInfo["sevenflag"] = self.nSevenGetFlag
					end
				end 
			end
		end 
	end 
end

-- 玩家升级
function CSignInSystem:OnDungeonsLevel( nLevel )
	if l_nSevenOpenLevel > nLevel then
		return
	end
	local oPlayer = self:GetPlayer( )
	if self.nSevenFlagDay == 0 then
		if self:IsSevenOpen( ) then
			self.nSevenFlagDay = 1
			self.tSaveInfo["sevenday"] = self.nSevenFlagDay
			oPlayer:SendToClient("C_UpdateSevenInfo", self.nSevenFlagDay, self.nSevenGetFlag )
		end
	end
end

-- 第二天
function CSignInSystem:OnDayRefresh()
	local oPlayer = self:GetPlayer( )
	self.nDay = self.nDay + 1
	if self.nDay > l_nMaxDay then
		self.tSignInInfo = { }
		self.tSaveInfo["signininfo"] = ""
		self.nDay = 1
	end 
	self.tSaveInfo["day"] = self.nDay

	if self:IsSevenOpen( ) then
		if self.nSevenFlagDay < 7 then
			if (self.nSevenGetFlag == 1) or (self.nSevenFlagDay == 0) then
				self.nSevenFlagDay = self.nSevenFlagDay + 1
				self.tSaveInfo["sevenday"] = self.nSevenFlagDay
				self.nSevenGetFlag = 0
				self.tSaveInfo["sevenflag"] = self.nSevenGetFlag
				oPlayer:SendToClient("C_UpdateSevenInfo", self.nSevenFlagDay, self.nSevenGetFlag )
			end
		end 
	end
end

function CSignInSystem:SaveData()
	if next(self.tSaveInfo) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("signin");
        for k, v in pairs(self.tSaveInfo) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.tSaveInfo = {}
	end
end

function CSignInSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SignInSystemInfo", self.nDay, self.tSignInInfo )
	oPlayer:SendToClient("C_UpdateSevenInfo", self.nSevenFlagDay, self.nSevenGetFlag )
end

-- 判断七日登陆是否开启
function CSignInSystem:IsSevenOpen( )
	local oPlayer = self:GetPlayer( )
	local nLevel = oPlayer:GetDungeonsCustoms( )
	return nLevel >= l_nSevenOpenLevel
end

function CSignInSystem:ReqSignIn( bAdvertising )
	local oPlayer = self:GetPlayer( ) 
	-- 检测是否已经签到过了
	if self.tSignInInfo[self.nDay] == 1 then
		return
	end 
	local tCfg = SignConfig_S[self.nDay]

	self.tSignInInfo[self.nDay] = 1
	self.tSaveInfo["signininfo"] = TableToStr(self.tSignInInfo)

	local nReward = tCfg.reward
	local bIsVipDouble = tCfg.isVipDouble
	local tAward = { }
	local nTimes = 1
	if oPlayer:IsVip( ) and (bIsVipDouble == 1) then
		nTimes = 2
	end 
	if bAdvertising then
		nTimes = nTimes * 3
		oPlayer:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.AdvertisingTimes, 1)
		delog("==========", oPlayer:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.AdvertisingTimes ))
	end
	for nIdx = 1, nTimes do 
		oPlayer:GetSystem("CGiftSystem"):AddGiftByID( nReward, tAward)
	end
	oPlayer:SendToClient("C_ReqSignIn", self.tSignInInfo, tAward )
end

function CSignInSystem:ReqSevenSignIn( nDay )
	local oPlayer = self:GetPlayer( ) 

	if nDay then 
		 self.nSevenFlagDay = nDay + 1
	end 
	if self.nSevenFlagDay <= 0 then
		print("1")
		return

	end 
	
	print("self.nSevenFlagDay"..self.nSevenFlagDay)
	--if self.nSevenGetFlag == 1 then
	--	return
	--end 

	local tCfg = SevenConfig_S[self.nSevenFlagDay]
	if not tCfg then
		print("2")
		return
	end 
	
	self.nSevenGetFlag = self.nSevenGetFlag + 1 --QQ广告版天数
	--self.nSevenGetFlag =  1 当天是否领取
	self.tSaveInfo["sevenflag"] = self.nSevenGetFlag

	local tAward = { }
	oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tCfg.reward, tAward)
	oPlayer:SendToClient("C_ReqSevenSignIn", tAward, self.nSevenFlagDay )
end

-- 请求签到
defineC.K_ReqSignIn = function ( oPlayer, bAdvertising )
	oPlayer:GetSystem( "CSignInSystem" ):ReqSignIn( bAdvertising )
end

-- 请求七日签到
defineC.K_ReqSevenSignIn = function ( oPlayer,nDay )
	oPlayer:GetSystem( "CSignInSystem" ):ReqSevenSignIn( nDay)
end

