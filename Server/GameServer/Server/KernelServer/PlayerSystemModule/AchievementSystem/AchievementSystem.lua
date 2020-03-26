local string_gmatch = string.gmatch
local table_insert = table.insert
local table_remove = table.remove
local table_concat = table.concat
local tonumber = tonumber
local pairs = pairs
local ItemLogEnum = RequireEnum("ItemLogEnum")
local MailTypeEnum		= RequireEnum("MailTypeEnum")
local GameEventEnum = RequireEnum("GameEventEnum")
local ItemEnum = RequireEnum("ItemEnum")
local CRankManager = RequireSingleton("CRankManager", true)
local CAchievementSystem = RequireClass("CAchievementSystem")
local AchieveConfig_S = RequireConfig("AchieveConfig_S")
local DayAchieveConfig_S = RequireConfig("DayAchieveConfig_S")
local CMailManager = RequireSingleton("CMailManager")
local GameParamConfig = RequireConfig("GameParamConfig_S")

function CAchievementSystem:Create(i_bDayRefresh)
	local oPlayer = self:GetPlayer( )
	-- 延时存储
	self.m_tSaveData = {}
	-- 成就的进度		
	self.m_tAwardRecord = { }

	-- 每日成就进度
	self.m_tDayAwardRecord = { }

	if not oPlayer:IsNew() then
		local tRes = oPlayer:GetPlayerData("CAchievementSystem")
		if tRes then
			self.m_tAwardRecord = StrToTable( tRes.awardrecord )
			self.m_tDayAwardRecord = StrToTable( tRes.dayawardrecord )
			self.m_nDayAchFlag = tRes.dayachflag
		end
		if i_bDayRefresh then
			self:OnDayRefresh()
		end
	end
end

-- 每日刷新
function CAchievementSystem:OnDayRefresh()
	local oPlayer = self:GetPlayer( )
	self.m_tDayAwardRecord = { }
	self:SetSaveData("dayawardrecord", "")
end

-- 获取当前进度
function CAchievementSystem:GetProgress(nEventType)
	return self.m_tAwardRecord[nEventType] or 1
end

-- 获取当前进度
function CAchievementSystem:GetDayProgress(nEventType)
	return self.m_tDayAwardRecord[nEventType] or 1
end

function CAchievementSystem:SetSaveData(i_sKey, i_Value)
    self.m_tSaveData[i_sKey] = i_Value
end

function CAchievementSystem:SaveData()
	if next(self.m_tSaveData) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("nearachieve");
        for k, v in pairs(self.m_tSaveData) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.m_tSaveData = {}
	end
end

function CAchievementSystem:SyncClientData()
	local oPlayer = self:GetPlayer()
	oPlayer:SendToClient("C_AllAchieveOnLine", self.m_tAwardRecord, self.m_tDayAwardRecord)
end

--请求领取成就奖励
function CAchievementSystem:ReqAchievementAward(nEventType, bShare,bAd)
	delog( "CAchievementSystem:ReqAchievementAward Done", nEventType )
	local oPlayer = self:GetPlayer()
	local tCfg = AchieveConfig_S[nEventType]
	if not tCfg then
		delog( "not tCfg" )
		return 
	end 

	-- 获取当前进度
	local nProgress = self:GetProgress(nEventType)
	local tProgCfg = tCfg[nProgress]
	if not tProgCfg then
		delog( "not tProgCfg" )
		return
	end 

	local nEventValue = self:GetSystem("CEventSystem"):GetEventValue( nEventType )
	if nEventValue < tProgCfg.Value then
		delog( "nEventValue < tProgCfg.Value " )
		return
	end 

	self.m_tAwardRecord[nEventType] = nProgress + 1
	self:SetSaveData("awardrecord", TableToStr(self.m_tAwardRecord))

	local tAllAward = { }
	local ntimes = 1
	if bShare == true then
		ntimes = GameParamConfig.AchievementShareGetRewardRate
	end

	if bAd == true then
		ntimes =10
	end
	oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eGold, tProgCfg.Reward[1] * ntimes, tAllAward )
	oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, tProgCfg.Reward[2] * ntimes, tAllAward )

	oPlayer:SendToClient( "C_ReqAchievementAward", nEventType, self.m_tAwardRecord[nEventType], tAllAward, bShare)
end

--请求领取成就奖励
function CAchievementSystem:ReqDayAchievementAward(nEventType, bShare, bAd)
	delog( "CAchievementSystem:ReqDayAchievementAward Done", nEventType )
	local oPlayer = self:GetPlayer()
	local tCfg = DayAchieveConfig_S[nEventType]
	if not tCfg then
		delog( "not tCfg" )
		return 
	end 

	-- 获取当前进度
	local nProgress = self:GetDayProgress(nEventType)
	local tProgCfg = tCfg[nProgress]
	if not tProgCfg then
		delog( "not tProgCfg" )
		return
	end 

	local nEventValue = self:GetSystem("CEventSystem"):GetDayEventValue( nEventType )
	if nEventValue < tProgCfg.Value then
		delog( "nEventValue < tProgCfg.Value ", nEventValue, tProgCfg.Value )
		return
	end 

	self.m_tDayAwardRecord[nEventType] = nProgress + 1
	self:SetSaveData("dayawardrecord", TableToStr(self.m_tDayAwardRecord))
	local tAllAward = { }
	local ntimes = 1
	if bShare == true then
		ntimes = GameParamConfig.AchievementShareGetRewardRate
	end
	if bAd == true then
		ntimes = 10
	end
	print("ntimes:"..ntimes)
	oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eGold, tProgCfg.Reward[1] * ntimes, tAllAward )
	oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, tProgCfg.Reward[2] * ntimes, tAllAward )
	oPlayer:SendToClient( "C_ReqDayAchievementAward", nEventType, self.m_tDayAwardRecord[nEventType], tAllAward, bShare)
end

--请求领取成就奖励
defineC.K_ReqAchievementAward = function( oPlayer, nEventType )
	oPlayer:GetSystem("CAchievementSystem"):ReqAchievementAward(nEventType) 
end

--请求领取每日成就
defineC.K_ReqDayAchievementAward = function( oPlayer, nEventType )
	oPlayer:GetSystem("CAchievementSystem"):ReqDayAchievementAward(nEventType) 
end