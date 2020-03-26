
-- global enum
local GameEventEnum	= RequireEnum("GameEventEnum");
-- global function
local print = print;
local pairs = pairs;
local ipairs = ipairs;
local tonumber = tonumber;
local string_gmatch = string.gmatch;
local string_format = string.format;
local table_insert	= table.insert;
local table_concat	= table.concat;
local now = _commonservice.now;

local tReEnum = {
	[GameEventEnum.GetHeroNum]				= 1,
	[GameEventEnum.HeroDPS]					= 1,
	[GameEventEnum.HeroAllLevel]			= 1,
	[GameEventEnum.LevelCrossing]			= 1,
	[GameEventEnum.AddDayMinute]			= 2,
	[GameEventEnum.CharLastmWeek]			= 2,
	[GameEventEnum.NowBossRank]				= 2,
	[GameEventEnum.LastBossRank]			= 2,
};

local CRankManager  = RequireSingleton("CRankManager")
local CEventSystem = RequireClass("CEventSystem");

local function get_event_db_str(i_tEvents)
	local tTemp = {};
	for nType, nValue in pairs(i_tEvents) do
		table_insert(tTemp, string_format("%d,%d", nType, nValue));
	end
	return table_concat(tTemp, ";");
end
local function parse_event_db_str(i_sEvents)
	local tEvents = {};
	for nType, nValue in string_gmatch(i_sEvents, "(%d+),(%d+)") do
		tEvents[tonumber(nType)] = tonumber(nValue);
	end
	return tEvents;
end

function CEventSystem:Create(i_bDayRefresh, i_bWeekRefresh)
	self.m_tTotalEvents = {};
	self.m_tTodayEvents = {};
	local oPlayer = self:GetPlayer();
	if oPlayer:IsNew() then

	else
		local data = oPlayer:GetPlayerData("CEventSystem")
		if data[1] then
			data = data[1];
			self.m_tTotalEvents = parse_event_db_str(data.event);
			self.m_tTodayEvents = parse_event_db_str(data.dayevent);
		end
		if i_bDayRefresh then
			self:OnDayRefresh( )
			if i_bWeekRefresh then
				self:OnWeekRefresh( )
			end 
		end
	end	
end

function CEventSystem:OnDayRefresh()
	self.m_tTodayEvents = {};
	self.m_bDirty = true
    self:OnEvent( GameEventEnum.AddDayMinute, 0 )
    self.m_tTotalEvents[GameEventEnum.LastBossRank] = self.m_tTotalEvents[GameEventEnum.NowBossRank]
	self.m_tTotalEvents[GameEventEnum.NowBossRank] = 0
	self:OnEvent( GameEventEnum.LastBossRank, self.m_tTotalEvents[GameEventEnum.LastBossRank] )
	self:OnEvent( GameEventEnum.NowBossRank, self.m_tTotalEvents[GameEventEnum.NowBossRank] )
	
	self.m_tTodayEvents[GameEventEnum.ShareNum] = 0
end

function CEventSystem:OnWeekRefresh()
    self:OnEvent( GameEventEnum.CharLastmWeek, self.m_tTotalEvents[GameEventEnum.CharmWeek] )
	self.m_tTotalEvents[GameEventEnum.CharmWeek] = 0
	self.m_bDirty = true
end

function CEventSystem:SaveData()
	if self.m_bDirty then
		local oPlayer = self:GetPlayer();
		local oCmd = oPlayer:CreateUpdateCmd("event");
		oCmd:SetFields("event", get_event_db_str(self.m_tTotalEvents));
		oCmd:SetFields("dayevent", get_event_db_str(self.m_tTodayEvents));
		oCmd:SetWheres("roleid", oPlayer:GetRoleID(), "=");
		oCmd:Execute();
		self.m_bDirty = nil;
	end
end

function CEventSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SendInitEventMsg", self.m_tTotalEvents, self.m_tTodayEvents)
end

function CEventSystem:GetTodayEvents()
	local tTemp = {};
	for k, v in pairs(self.m_tTodayEvents) do
		tTemp[k] = v;
	end
	return tTemp;
end

function CEventSystem:GetTotalEvents()
	local tTemp = {};
	for k, v in pairs(self.m_tTotalEvents) do
		tTemp[k] = v;
	end
	return tTemp;
end

function CEventSystem:OnEvent(i_nEventType, i_nEventValue)
	if i_nEventType == 0 then return end 
	self:CheckEvent(i_nEventType, i_nEventValue)
end

function CEventSystem:CheckEvent(i_nEventType, i_nEventValue)
	local oPlayer = self:GetPlayer();
	if i_nEventType == 0 then return end 
	self.m_bDirty = true
	local nModTyep = tReEnum[i_nEventType]
	if nModTyep == 1 then  -- 成长
		if (not self.m_tTotalEvents[i_nEventType]) or (i_nEventValue > self.m_tTotalEvents[i_nEventType]) then
			self.m_tTotalEvents[i_nEventType] = i_nEventValue;
			self.m_tTodayEvents[i_nEventType] = i_nEventValue;
		end
	elseif nModTyep == 2 then  -- 替换
		self.m_tTotalEvents[i_nEventType] = i_nEventValue;
		self.m_tTodayEvents[i_nEventType] = i_nEventValue;
	elseif nModTyep == 3 then
		if (not self.m_tTotalEvents[i_nEventType]) or (i_nEventValue < self.m_tTotalEvents[i_nEventType]) then
			self.m_tTotalEvents[i_nEventType] = i_nEventValue;
			self.m_tTodayEvents[i_nEventType] = i_nEventValue;
		end
	else 
		self.m_tTotalEvents[i_nEventType] = (self.m_tTotalEvents[i_nEventType] or 0) + i_nEventValue;
		self.m_tTodayEvents[i_nEventType] = (self.m_tTodayEvents[i_nEventType] or 0) + i_nEventValue;	
	end
	CRankManager:OnEvent( oPlayer:GetRoleID( ), i_nEventType, self.m_tTotalEvents[i_nEventType] )
	oPlayer:SendToClient(
		"C_SendEventMsg", 
		{[i_nEventType] = self.m_tTotalEvents[i_nEventType]},
		{[i_nEventType] = self.m_tTodayEvents[i_nEventType]}
	)
end

function CEventSystem:GetEventValue( i_nEventType )
	return self.m_tTotalEvents[i_nEventType] or 0
end

function CEventSystem:GetDayEventValue( i_nEventType )
	return self.m_tTodayEvents[i_nEventType] or 0
end


local tClientOpenEnum = {
	[GameEventEnum.HeroAttack]			= 1,	-- 英雄攻击次数
	[GameEventEnum.PetAttack]			= 1, 	-- 神兽攻击次数
	[GameEventEnum.KillBoss]			= 1,	-- 击杀Boss数量
	[GameEventEnum.KillMonster]			= 1,	-- 累计消灭怪物
	[GameEventEnum.GetClickCritNum]		= 1,	-- 点击暴击次数
	[GameEventEnum.UsePlayerSkill]		= 1,	-- 使用技能数量
	[GameEventEnum.HeroDPS]				= 1,	-- 英雄DPS最大值( 需判断一下 )
}

 -- 触发事件
defineC.K_ReqOnEvent = function (oPlayer, i_nEventType, i_nEventValue)
	if tClientOpenEnum[i_nEventType] ~= 1 then
		return
	end 
	oPlayer:GetSystem("CEventSystem"):OnEvent(i_nEventType, i_nEventValue)
end