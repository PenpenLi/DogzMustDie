
-- global function
local pairs			= pairs;
local ipairs		= ipairs;
local print			= print;
local logfile       = logfile
local type			= type;
local now			= _commonservice.now;
local math_floor	= math.floor;
local table_insert  = table.insert
local string_format	= string.format;
local string_gmatch = string.gmatch;
local table_concat = table.concat;
local NewClass		= NewClass;
local ProtectedCall = ProtectedCall;
-- global enum
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum");
local PlayerBeKickReasonEnum = RequireEnum("PlayerBeKickReasonEnum")
local KSPlayerStateEnum	= RequireEnum("KSPlayerStateEnum");
local GameEventEnum	= RequireEnum("GameEventEnum")
local MailTypeEnum      = RequireEnum("MailTypeEnum")
-- global singleton
local CSchedule				= RequireSingleton("CSchedule");
local CDBCommand 			= RequireSingleton("CDBCommand");
local CDataReport 			= RequireSingleton("CDataReport");
local CGlobalInfoManager	= RequireSingleton("CGlobalInfoManager");
local CBridgeConnector 		= RequireSingleton("CBridgeConnector", true);
local CMailManager          = RequireSingleton("CMailManager")
local CDataLog              = RequireSingleton("CDataLog")
local CCommonFunction       = RequireSingleton("CCommonFunction")
-- local 
local Sec2Week = RequireSingleton("CCommonFunction").Sec2Week;

-- local RankTitleID = {27,28}	-- 跨服排行称号

local CPlayerManager = RequireSingleton("CPlayerManager");
function CPlayerManager:Initialize()
	self.m_tSession2Player	= {};
	self.m_tRoleID2Player	= {};
	self.m_tRoleName2Player	= {};
	self.m_tAccountID2Player= {};
	self.m_nSessionNum		= 0;
	self.m_nPlayerNum		= 0;

	-- 缓存当天邀请玩家映射表
	self.m_tDayInviteMapping = { }
	self.m_tDayInviteNum = { }

	
	self.m_tIP 			= {};	-- IP表
	self.m_nIP			= 0;	-- IP个数(去重)
	self.m_tMAC			= {};	-- MAC表
	self.m_nMAC			= 0;	-- MAC个数(去重)
	-- 定时5分钟记录1次
	CSchedule:AddTask({}, ScheduleTaskCycleTypeEnum.eMinute, 5, 0, self.ReportOnlineNum, {self});
	-- 定时5分钟记录1次,每天00:00点开始每5分钟记录发送一次且每服的发送时间需保持一致
	local nNow = now(1)
	nNow = ((nNow - nNow%300) + 300) * 1000
	CSchedule:AddTask({m_nTime = nNow}, ScheduleTaskCycleTypeEnum.eMinute, 5, 0, self.DataReportOnlineNum, {self});
	
	-- 根据普通服还是跨服服初始化不同的数据
	self:InitSpecial();
    
    -- 初始化联运服务器需要统计的数据
    self:InitUnionDataLog()

	return true;
end

-- 初始化联运服务器需要统计的数据
function CPlayerManager:InitUnionDataLog()
    self.m_nTodayMaxPlayerNum = 0 -- 当天最大同时在线
    self.m_nTodayMinPlayerNum = 0 -- 当天最小同时在线
    self.m_nTodayRegistNum = 0 -- 当天注册数
    self.m_tTodayLogin = {} -- 当天登录表
    self.m_nTodayLoginNum = 0 -- 当天登陆数
end

function CPlayerManager:GetTodayMaxPlayerNum()
    return self.m_nTodayMaxPlayerNum
end

function CPlayerManager:GetTodayMinPlayerNum()
    return self.m_nTodayMinPlayerNum
end

function CPlayerManager:GetTodayRegistNum()
    return self.m_nTodayRegistNum
end

function CPlayerManager:GetTodayLoginNum()
    return self.m_nTodayLoginNum
end

function CPlayerManager:AddOneRegistNum()
    self.m_nTodayRegistNum = self.m_nTodayRegistNum + 1
end

function CPlayerManager:UnionOnDayRefresh()
    -- local year, month, day = CCommonFunction.Sec2Calendar(now(1) - 600)
    -- local date = year * 10000 + month * 100 + day
    -- -- 记数据库
    -- local cmd = CDBCommand:CreateInsertCmd("union_data_log")
    -- cmd:SetFields("date", date)
    -- cmd:SetFields("registnum", self.m_nTodayRegistNum)
    -- cmd:SetFields("loginnum", self.m_nTodayLoginNum)
    -- cmd:SetFields("maxonlinenum", self.m_nTodayMaxPlayerNum)
    -- cmd:Execute()
    
    -- self:InitUnionDataLog()
    
    -- self.m_nTodayMaxPlayerNum = self.m_nPlayerNum
    -- self.m_nTodayMinPlayerNum = self.m_nPlayerNum
    -- for roleid, _ in pairs(self.m_tRoleID2Player) do
    --     self.m_tTodayLogin[roleid] = true
    --     self.m_nTodayLoginNum = self.m_nTodayLoginNum + 1
    -- end
end

function CPlayerManager:ReportOnlineNum()
    CDataLog:GspLogOnlinePlayerNum(CGlobalInfoManager:GetServerID(), self.m_nPlayerNum)
end

function CPlayerManager:DataReportOnlineNum()
	CDataReport:DataReport("online", {rolecount = tostring(self.m_nPlayerNum)})
end

-- 上线记录ip 及 mac
function CPlayerManager:AddIpAndMac(i_sIP, i_sMAC)
	if self.m_tIP[i_sIP] then
		self.m_tIP[i_sIP] = self.m_tIP[i_sIP] + 1;
	else
		self.m_tIP[i_sIP] = 1;
		self.m_nIP = self.m_nIP + 1;
	end
	if self.m_tMAC[i_sMAC] then
		self.m_tMAC[i_sMAC] = self.m_tMAC[i_sMAC] + 1;
	else
		self.m_tMAC[i_sMAC] = 1;
		self.m_nMAC = self.m_nMAC + 1;
	end
end

-- 下线记录ip 及 mac
function CPlayerManager:DelIpAndMac(i_sIP, i_sMAC)
	self.m_tIP[i_sIP] = self.m_tIP[i_sIP] - 1;
	if self.m_tIP[i_sIP] == 0 then
		self.m_tIP[i_sIP] = nil;
		self.m_nIP = self.m_nIP - 1;
	end
	self.m_tMAC[i_sMAC] = self.m_tMAC[i_sMAC] - 1;
	if self.m_tMAC[i_sMAC] == 0 then
		self.m_tMAC[i_sMAC] = nil;
		self.m_nMAC = self.m_nMAC - 1;
	end
end

local interval	= 1000;
local update	= interval;
function CPlayerManager:Update(i_nDeltaMsec)
	update = update - i_nDeltaMsec;
	if update > 0 then return end;
	update = interval - update;
    for roleid, player in pairs(self.m_tRoleID2Player) do
		if not ProtectedCall(function() player:Update(update) end) then
			player:BeKick(PlayerBeKickReasonEnum.eKSUpdateError)
		end
	end
	update = interval;
	
	-- 根据普通服还是跨服服更新不同的数据
	self:UpdateSpecial();
end
function CPlayerManager:OnDayRefresh()
    self.m_tDayInviteMapping = { }
    self.m_tDayInviteNum = { }

	local tOnlinePlayer = {}
	for roleid, player in pairs(self.m_tRoleID2Player) do
		table_insert(tOnlinePlayer, roleid)
		if not ProtectedCall(function() player:OnDayRefresh() end) then
			player:BeKick(PlayerBeKickReasonEnum.eKSDayRefreshError)
		end
	end
	local tData = {
		detailroles = table_concat(tOnlinePlayer, ";")
	}
	CDataReport:DataReport("detailrole", tData)
    
    self:UnionOnDayRefresh()
end

-- 推送运营活动
function CPlayerManager:OnPushActivities()
    for roleid, player in pairs(self.m_tRoleID2Player) do
		if not ProtectedCall(function() player:GetSystem("CActivitySystem"):OnPushActivities() end) then
			print("WARNING!!! OnPushActivities err.", roleid)
		end
	end
end

---- 活动开始
function CPlayerManager:ForActivityStart(i_id)
    for roleid, player in pairs(self.m_tRoleID2Player) do
		if not ProtectedCall(function() player:GetSystem("CActivitySystem"):ForActivityStart(i_id) end) then
			print("WARNING!!! ForActivityStart err.", roleid)
		end
	end
end

function CPlayerManager:Destruct()
    self.m_nDestructTime = now(1)
	for _, player in pairs(self.m_tSession2Player) do
		player:BeKick(PlayerBeKickReasonEnum.eServerShutdown)
	end
end

-- make sure all player write to db
function CPlayerManager:IsDestructOver()
    if now(1) > self.m_nDestructTime + 120 then
        print("ERROR!!! CPlayerManager:Destruct > 120 sec", self.m_nPlayerNum)
        return true
    end
	return self.m_nPlayerNum == 0;
end;


function CPlayerManager:NewPlayer(i_pSession, sip, nip)
	local oPlayer = NewClass("CPlayer", i_pSession, sip, nip);
	self.m_tSession2Player[i_pSession] = oPlayer;
	self.m_nSessionNum = self.m_nSessionNum + 1;
	print("enter session num:", self.m_nSessionNum, sip, i_pSession);
	return oPlayer;
end


function CPlayerManager:GetPlayerBySession(i_pSession)
	return self.m_tSession2Player[i_pSession];
end

function CPlayerManager:ReplacePlayerA2B(i_oPlayerA, i_oPlayerB)
    print("switch session", i_oPlayerA.m_pSession, i_oPlayerB.m_pSession)
    if i_oPlayerA.m_pSession then
        self.m_tSession2Player[i_oPlayerA.m_pSession] = i_oPlayerB
    end
	self.m_tSession2Player[i_oPlayerB.m_pSession] = i_oPlayerA;
    i_oPlayerA.m_pSession, i_oPlayerB.m_pSession = i_oPlayerB.m_pSession, i_oPlayerA.m_pSession
end

function CPlayerManager:SetPlayer2AccountID(i_oPlayer, i_sAccountID, i_sOpenID, i_sPf)
	i_oPlayer:SetAccountID(i_sAccountID, i_sOpenID, i_sPf);
	self.m_tAccountID2Player[i_sAccountID] = i_oPlayer;
end

function CPlayerManager:GetPlayerByAccountID(i_sAccountID)
	return self.m_tAccountID2Player[i_sAccountID];
end

function CPlayerManager:SetPlayer2RoleID(i_oPlayer)
	self.m_tRoleID2Player[i_oPlayer:GetRoleID()] = i_oPlayer;
	self.m_tRoleName2Player[i_oPlayer:GetName()] = i_oPlayer;
	self:AddIpAndMac(i_oPlayer:GetIP(), i_oPlayer:GetMAC());
	self.m_nPlayerNum = self.m_nPlayerNum + 1;
	print("enter player num:", self.m_nPlayerNum, i_oPlayer:GetRoleID(), i_oPlayer:GetIP());
    if self.m_nPlayerNum > self.m_nTodayMaxPlayerNum then
        self.m_nTodayMaxPlayerNum = self.m_nPlayerNum
    end
    if not self.m_tTodayLogin[i_oPlayer:GetRoleID()] then
        self.m_tTodayLogin[i_oPlayer:GetRoleID()] = true
        self.m_nTodayLoginNum = self.m_nTodayLoginNum + 1
    end
end

function CPlayerManager:GetPlayerByRoleID(i_sRoleID)
	return self.m_tRoleID2Player[i_sRoleID];
end

function CPlayerManager:GetProfByRoleID(i_sRoleID)
	local oPlayer = self.m_tRoleID2Player[i_sRoleID];
	local nPlayerProfID
	if oPlayer then
		nPlayerProfID = oPlayer:GetProfID()
	else
		local oSelectCmd = CDBCommand:CreateSelectCmd("role")
		oSelectCmd:SetFields("roleprof")
		oSelectCmd:SetWheres("roleid", i_sRoleID, "=")
		oSelectCmd:SetLimit(1)
		local res = oSelectCmd:Execute()
		if res and res[1] then
			nPlayerProfID = res[1].roleprof
		end
	end
	return nPlayerProfID
end

function CPlayerManager:GetPlayerByName(i_sRoleName)
	return self.m_tRoleName2Player[i_sRoleName];
end

function CPlayerManager:Disconnect(i_pSession, i_sErrStr)
	local oPlayer = self.m_tSession2Player[i_pSession];
	self.m_tSession2Player[i_pSession] = nil;
	oPlayer:OnDisconnect();
	self.m_nSessionNum = self.m_nSessionNum - 1;
	print("leave session num:", self.m_nSessionNum, oPlayer:GetAccountID(), oPlayer:GetIP(), i_pSession, i_sErrStr);
end

function CPlayerManager:DeletePlayer(i_oPlayer)
	local sAccountID = i_oPlayer:GetAccountID()
	if sAccountID then
		self.m_tAccountID2Player[sAccountID] = nil;
		if self.m_tRoleID2Player[i_oPlayer:GetRoleID()] then
			self.m_tRoleID2Player[i_oPlayer:GetRoleID()] = nil;
			self.m_tRoleName2Player[i_oPlayer:GetName()] = nil;
			self:DelIpAndMac(i_oPlayer:GetIP(), i_oPlayer:GetMAC());
			self.m_nPlayerNum = self.m_nPlayerNum - 1;
			print("leave player num:", self.m_nPlayerNum, i_oPlayer:GetRoleID(), i_oPlayer:GetIP());
            if self.m_nPlayerNum < self.m_nTodayMinPlayerNum then
                self.m_nTodayMinPlayerNum = self.m_nPlayerNum
            end
            local nTime = now( 1 ) - i_oPlayer:GetLoginTime( )
            CDataLog:LogPublicLogin_log( i_oPlayer:GetGYYXIF( ), i_oPlayer:GetOpenID( ), 1, "", i_oPlayer:GetMAC( ), i_oPlayer.m_deviceId, "", "", nTime, i_oPlayer.m_sIP )
		end
		self:OnDeletePlayer(i_oPlayer);
	end
end

function CPlayerManager:GetPlayerNum()
	return self.m_nPlayerNum;
end

function CPlayerManager:IsHeavyLoad()
    return self.m_nPlayerNum > 2000
end

function CPlayerManager:GetAllPlayer()
	local tTempPlayer = {};
	for sRoleID, oPlayer in pairs(self.m_tRoleID2Player) do
		tTempPlayer[sRoleID] = oPlayer;
	end
	return tTempPlayer;
end

local malloc	= _memoryservice.malloc;
local free		= _memoryservice.free;
local fancy_encode = _codeservice.fancy_encode;
-- 广播消息
local msgLen = 4096;
function CPlayerManager:SendMsgToAllClient(i_sMsg, ...)
	local pData = malloc(msgLen);
	if pData then
		local nLen = fancy_encode(pData, msgLen, i_sMsg, ...);
		if nLen > 0 then
			for _, oPlayer in pairs(self.m_tRoleID2Player) do
				oPlayer:SendDataToClient(pData, nLen);    
			end
		else
			print("ERROR!!! CPlayerManager:SendMsgToAllClient.", i_sMsg);
		end
		free(pData);
	end
end

-- 广播系统提示
function CPlayerManager:SendSystemTipsToAll(i_nTipsID, i_tParams)
	CPlayerManager:SendMsgToAllClient("C_SystemTips", i_nTipsID, i_tParams)
end
--发送阵营消息
function CPlayerManager:SendMsgToGroupPlayer(i_tPlayer, i_sMsg, ...)		
	if #i_tPlayer == 0 then return end;	
	local pData = malloc(msgLen);	
	if pData then
		local nLen = fancy_encode(pData, msgLen, i_sMsg, ...);
		if nLen > 0 then
			for _, oPlayer in ipairs(i_tPlayer) do				
				oPlayer:SendDataToClient(pData, nLen);
			end
		else
			print("ERROR!!!, CPlayerManager:SendMsgToGroupPlayer.", i_sMsg);
		end
		free(pData);
	end
end


defineC.K_EnterKSReqMsg = function(i_oPlayer, i_tAccountInfo, i_bNoInit2Client)
    i_oPlayer:SetState(KSPlayerStateEnum.eLogin)
	CPlayerManager:PlayerLogin(i_oPlayer, i_tAccountInfo, i_bNoInit2Client);
end

defineC.K_PlayerCreate = function(i_oPlayer)
	i_oPlayer:ClientCreate();
end

defineS.K_SystemTipsToAll = function (i_nMsgID, i_tParams)
    CPlayerManager:SendSystemTipsToAll(i_nMsgID, i_tParams)
end

-- 全服广播
defineS.K_SendMsgToAllClient = function(  i_Msg, ... )
	CPlayerManager:SendMsgToAllClient( i_Msg, ... )
end 

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

--连心跳包收发
defineC.K_HeartBeat = function(i_oPlayer)
	i_oPlayer:SendToClient("C_HeartBeat");
end

--ping包收发
defineC.K_Ping = function(i_oPlayer)
    i_oPlayer:SendToClient("C_Pong", now(1))
end

-- 邀请玩家成功通知
function CPlayerManager:OnInvite( bNew, sRoleID, sInviteRoleID )
	delog( "CPlayerManager:OnInvite Done", bNew, sRoleID, sInviteRoleID )
	
	if not sRoleID then
		delog( "not sRoleID" )
		return
	end 
	if sRoleID == "" then
		delog( "sRoleID == " )
		return
	end
	local oPlayer = self:GetPlayerByRoleID( sRoleID )
	local oTarget = self:GetPlayerByRoleID( sInviteRoleID )

	delog("-===============" , oPlayer and 1 or 0)

	if not self.m_tDayInviteMapping[sRoleID] then
		self.m_tDayInviteMapping[sRoleID] = { }
	end 

	-- 每天每个人只能被邀请一次
	if not sInviteRoleID or self.m_tDayInviteMapping[sRoleID][sInviteRoleID] then
		delog( "self.m_tDayInviteMapping[sRoleID][sInviteRoleID]" )
		return
	else
		self.m_tDayInviteMapping[sRoleID][sInviteRoleID] = 1
		delog( "m_tDayInviteMapping == ", self.m_tDayInviteMapping[sRoleID][sInviteRoleID] )
	end

	-- 当日人数累加
	if not self.m_tDayInviteNum[sRoleID] then
		self.m_tDayInviteNum[sRoleID] = 1
	else
		self.m_tDayInviteNum[sRoleID] = self.m_tDayInviteNum[sRoleID] + 1
		delog( "m_tDayInviteNum == ", self.m_tDayInviteNum[sRoleID])
	end 
	local sTangetName = ""
	-- 累计邀请新人
	local nInvitationNum = 0
	if bNew then
		if oPlayer then
			if oTarget then
				sTangetName = oTarget:GetName( )
			end
			oPlayer:OnEvent( GameEventEnum.InvitationNum, 1 )
			nInvitationNum = oPlayer:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.InvitationNum )
			oPlayer:ReqGetInviteVip( true )
		else
			local oDBCmd = CDBCommand:CreateSelectCmd("event")
			oDBCmd:SetWheres("roleid", sRoleID, "=")
			oDBCmd:SetLimit(1)
			local res = oDBCmd:Execute()
			local data = res[1]
			if data then
				local tEvents = {}
				for nType, nValue in string.gmatch(data.event, "(%d+),(%d+)") do
					tEvents[tonumber(nType)] = tonumber(nValue)
				end
				tEvents[GameEventEnum.InvitationNum] = ( tEvents[GameEventEnum.InvitationNum] or 0 ) + 1
				nInvitationNum = tEvents[GameEventEnum.InvitationNum]
				local tTemp = {}
				for nType, nValue in pairs(tEvents) do
					table.insert(tTemp, string.format("%d,%d", nType, nValue))
				end
				local sEvents = table.concat(tTemp, ";")
				local oCmd = CDBCommand:CreateUpdateCmd("event")
				oCmd:SetWheres("roleid", sRoleID, "=")
				oCmd:SetFields("event", sEvents)
				oCmd:Execute()
			end

			local oDBCmd = CDBCommand:CreateSelectCmd("role_info");
			oDBCmd:SetWheres("roleid", sRoleID, "=");
			oDBCmd:SetLimit(1);
			local res = oDBCmd:Execute()
			local data = res[1]
			if data then
				local invitaviptimes = data.invitaviptimes + 1 
				local oCmd = CDBCommand:CreateUpdateCmd("role_info")
				oCmd:SetWheres("roleid", sRoleID, "=")
				oCmd:SetFields("invitaviptimes", invitaviptimes)
				oCmd:Execute()
				CMailManager:SendMail(sRoleID, MailTypeEnum.OnInviteVip, 69, {sTangetName})
			end
		end
	end
	if oPlayer then
		delog("C_OnInvite == ", self.m_tDayInviteNum[sRoleID], bNew, sTangetName)
		oPlayer:SendToClient( "C_OnInvite", self.m_tDayInviteNum[sRoleID], bNew, sTangetName )
	end

end

-- 获取当日邀请人数
function CPlayerManager:GetDayInviteNum(sRoleID)
	return self.m_tDayInviteNum[sRoleID] or 0
end
