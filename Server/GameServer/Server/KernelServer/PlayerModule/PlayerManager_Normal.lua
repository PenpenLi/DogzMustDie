
-- global enum
local KSPlayerStateEnum			= RequireEnum("KSPlayerStateEnum");
local PlayerBeKickReasonEnum 	= RequireEnum("PlayerBeKickReasonEnum")
-- global function
local string_format				= string.format;
local string_find				= string.find;
local now						= _commonservice.now;
-- global singleton
local CCommonFunction       	= RequireSingleton("CCommonFunction")
local CDBCommand				= RequireSingleton("CDBCommand");
local CDBService				= RequireSingleton("CDBService");
local CGlobalInfoManager		= RequireSingleton("CGlobalInfoManager");
local CCommercialService		= RequireSingleton("CCommercialService");
local CBridgeConnector			= RequireSingleton("CBridgeConnector");
local CDataReport				= RequireSingleton("CDataReport");
-- global config

-- local 
local CPlayerManager = RequireSingleton("CPlayerManager");

function CPlayerManager:InitSpecial()
	self.m_tLogin		= {};
	self.m_nLoginSeq	= 1;
	self.m_tInviteFlag = { }
	self:ResetBridgeState();
end

function CPlayerManager:UpdateSpecial()
end

function CPlayerManager:GetNewRoleID()
	return string_format("%d%04d", CGlobalInfoManager:GetRoleIndex(), CGlobalInfoManager:GetServerID());
end

function CPlayerManager:SetBridgeState(i_sAccountID, i_bState)
	self.m_tBridgeState[i_sAccountID] = i_bState;
end

function CPlayerManager:GetBridgeState(i_sAccountID)
	return self.m_tBridgeState[i_sAccountID];
end

function CPlayerManager:ResetBridgeState()
	self.m_tBridgeState = {}; 
end

function CPlayerManager:OnDeletePlayer(i_oPlayer)
end

function CPlayerManager:OnCommercialDisconnect()
	for _, oPlayer in pairs(self.m_tLogin) do
		oPlayer:BeKick(PlayerBeKickReasonEnum.eLoginServerError)
	end
	self.m_tLogin = {}
end

function CPlayerManager:PlayerLogin(i_oPlayer, i_tAccountInfo, i_bNoInit2Client)
	if not i_bNoInit2Client and self:IsHeavyLoad() then
		i_oPlayer:BeKick(PlayerBeKickReasonEnum.eServerHeavyLoad)
		return
	end
    logfile("Log. player login req.", i_tAccountInfo.openid, i_oPlayer:GetIP())

	i_oPlayer.m_bNoInit2Client = i_bNoInit2Client;
	i_oPlayer.m_deviceId = i_tAccountInfo.deviceId or "没有设备ID"
	self.m_tLogin[self.m_nLoginSeq] = i_oPlayer;
	i_tAccountInfo.loginseq = self.m_nLoginSeq;
	self.m_nLoginSeq = self.m_nLoginSeq + 1;
	if i_bNoInit2Client then -- 从跨服返回
		i_tAccountInfo.ok = true;
		self:PlayerLoginRes(i_tAccountInfo);
	else
		i_tAccountInfo.ok = false
		CCommercialService:PlayerLogin(i_tAccountInfo);
	end
end

function CPlayerManager:PlayerLoginRes(i_tAccountInfo)
	local oPlayer = self.m_tLogin[i_tAccountInfo.loginseq];
	self.m_tLogin[i_tAccountInfo.loginseq] = nil;
    logfile("Log. player login res1.", i_tAccountInfo.openid, oPlayer:GetIP())
	if not oPlayer.m_pSession then return end;
    logfile("Log. player login res2.", i_tAccountInfo.openid, oPlayer:GetIP())
	if not i_tAccountInfo.ok then
        if i_tAccountInfo.bantime then
            oPlayer:BeKick(PlayerBeKickReasonEnum.eBanPlay, i_tAccountInfo.bantime - now(1))
        else
            oPlayer:BeKick(PlayerBeKickReasonEnum.eLoginFailed)
        end
        return
    end
    logfile("Log. player login res3.", i_tAccountInfo.openid, oPlayer:GetIP())
	local sAccountID = string_format("%s%04d", i_tAccountInfo.openid, i_tAccountInfo.serverid);
    sAccountID = CCommonFunction.ProtectSql(sAccountID)
	local oAnotherPlayer = self:GetPlayerByAccountID(sAccountID);
	oPlayer.m_tLoginData = i_tAccountInfo
	if oAnotherPlayer then
		oAnotherPlayer:ReplaceBy(oPlayer);
		return;
	end
	if self:GetBridgeState(sAccountID) then
		print("ERROR!!! player is in bridge", sAccountID);
		oPlayer:BeKick(PlayerBeKickReasonEnum.ePlayerInBridge);
        CBridgeConnector:KickPlayer(sAccountID)
		return;
	end

	oPlayer:SetMAC(i_tAccountInfo.mac)
    oPlayer:SetLoginServerID(i_tAccountInfo.serverid)
	oPlayer:SetDBID(CGlobalInfoManager:GetServerID());
	oPlayer:SetLoginTime();
	    
	local oSelectCmd = oPlayer:CreateSelectCmd("role");
	oSelectCmd:SetWheres("accountid", sAccountID, "=");
	oSelectCmd:SetLimit(1);
	local res = oSelectCmd:Execute();
	if res then
		self:SetPlayer2AccountID(oPlayer, sAccountID, i_tAccountInfo.openid, i_tAccountInfo.pf or "unknown");
		if res[1] then
			local nBanPlay = i_tAccountInfo.banplaytime
            if nBanPlay and nBanPlay >= now(1) then
                oPlayer:BeKick(PlayerBeKickReasonEnum.eBanPlay, nBanPlay-now(1))
                return
            end
			-- 禁言时间
			res[1].banspeak = i_tAccountInfo.banspeaktime
			oPlayer:SetBaseInfo(res[1]);
			
			if oPlayer.m_bNoInit2Client then
				oPlayer:ClientCreate();
			else
                oPlayer:SendToClient("C_LoadCharListMsg", 1);
                oPlayer:LogLogin()
			end
			
		else
			if oPlayer.m_bNoInit2Client then
				oPlayer:BeKick(PlayerBeKickReasonEnum.eNoPlayerData);
			else
                oPlayer:SetState(KSPlayerStateEnum.eWaitNew);
                oPlayer:SendToClient("C_LoadCharListMsg", 0, "", i_tAccountInfo.is_havechar);
   				oPlayer:LogLogin( )
				-- 数据上报
				local tData = {
					channel = "0",
					poster = "0",
					site = "0",
					ip = oPlayer.m_sIP,
				}
				CDataReport:DataReport("game_enter", tData, {oPlayer})
			end
		end
	else
		oPlayer:BeKick(PlayerBeKickReasonEnum.eSelectPlayerError);
	end
end


local nNameMaxLen = 24
local str_name = "s%d.%s";
local sql_count_rolename = "select count(*) as count from role where `rolename` = '%s'";
local sql_count_accountid = "select count(*) as count from role where `accountid` = '%s'";
defineC.K_CreateCharReqMsg = function(i_oPlayer, i_sRoleName, i_nProfID, i_nHeadID, sInviteRoleID)
	delog( "defineC.K_CreateCharReqMsg, ", i_sRoleName, i_nProfID, i_nHeadID);
	if i_oPlayer then
		print("recv K_CreateCharReqMsg", i_oPlayer:GetAccountID(), i_sRoleName, i_nProfID, i_nHeadID);
	end
	local sAccountID = i_oPlayer:GetAccountID();
	local nRoleID = CPlayerManager:GetNewRoleID();
	-- 帮助玩家去一个名字
	if type(i_sRoleName) ~= "string" then 
		i_sRoleName = nRoleID
	end
	if type(i_nProfID) ~= "number" then return end;
	if type(i_nHeadID) ~= "number" then return end;
	i_oPlayer.sInviteRoleID = sInviteRoleID
	if not sAccountID then return end;
	if #i_sRoleName > nNameMaxLen then return end;
	-- 检测是否有英文标点
	if string_find(i_sRoleName, "%p") then
		i_oPlayer:SendSystemTips(30034)
		return;
	end
    i_sRoleName = CCommonFunction.ProtectSql(i_sRoleName)
	--i_sRoleName = string_format(str_name, i_oPlayer:GetLoginServerID(), i_sRoleName);
	-- rolename exist
	local i_sCmd = string_format(sql_count_rolename, i_sRoleName);
	local res = CDBService:Execute(i_sCmd, CGlobalInfoManager:GetServerID());
	if not res then return end;
	if res[1].count > 0 then
		i_oPlayer:SendToClient("C_CreateCharResMsg", 1);
		return;
	end;
	i_sCmd = string_format(sql_count_accountid, sAccountID);
	-- role num too many
	res = CDBService:Execute(i_sCmd, CGlobalInfoManager:GetServerID());
	if not res then return end;
	if res[1].count > 0 then
		i_oPlayer:SendToClient("C_CreateCharResMsg", 2);
		i_oPlayer:BeKick(PlayerBeKickReasonEnum.eTooManyPlayer);
		return;
	end
	-- 这里是新玩家进入的地图ID
	local nBornMap = 0
	-- insert to db
	local nowTime		= now(1);
	local info = {
		accountid	= sAccountID;
		roleid		= nRoleID;
		rolename	= i_sRoleName;
		mapid		= nBornMap;
		roleprof	= i_nProfID;
		-- 这里头像默认是0
		rolehead	= 0;
		createtime	= nowTime;
		refreshtime	= nowTime;
		newflag		= 1;
	};
    
	local oInsertCmd	= CDBCommand:CreateInsertCmd("role");
	oInsertCmd:SetFields("accountid",	info.accountid);
	oInsertCmd:SetFields("roleid",		info.roleid);
	oInsertCmd:SetFields("rolename",	info.rolename);
	oInsertCmd:SetFields("mapid",		info.mapid);
	oInsertCmd:SetFields("roleprof",	info.roleprof);
	oInsertCmd:SetFields("rolehead",	info.rolehead);
	oInsertCmd:SetFields("createtime",	info.createtime);
	oInsertCmd:SetFields("refreshtime",	info.refreshtime);
    
	res = oInsertCmd:Execute(true);
	if not res then i_oPlayer:BeKick(PlayerBeKickReasonEnum.eInsertPlayerError) return end;
	-- success
	i_oPlayer:SetBaseInfo(info);
	i_oPlayer:SendToClient("C_LoadCharListMsg", 1);
    
    CCommercialService:ReportPlayerCreateChar(i_oPlayer)
	local tData = {
		rolename = i_sRoleName,
		channel = "0",
		poster = "0",
		site = "0",
		ip = i_oPlayer.m_sIP,
		prof = tostring(i_nProfID),
	}
	CDataReport:DataReport("create_role", tData, {i_oPlayer})
    CPlayerManager:AddOneRegistNum()
    delog( "*********************Create:", info.roleid, sAccountID, sInviteRoleID )
    if (not sInviteRoleID) or (sInviteRoleID == "") then
    	sInviteRoleID = CPlayerManager.m_tInviteFlag[sAccountID]
    	CPlayerManager.m_tInviteFlag[sAccountID] = nil
		print( "not sInviteRoleID", sInviteRoleID )
	end
	
end


function CPlayerManager:PlayerOnInviteFlag(i_sRoleID, bNew, invitee)
	local sAccID = string_format("%s%04d", invitee, ServerInfo.serverid)
	if bNew then
		self.m_tInviteFlag[sAccID] = i_sRoleID
	else		
		local oDBCmd = CDBCommand:CreateSelectCmd("role")
		oDBCmd:SetWheres("accountid", sAccID, "=")
		oDBCmd:SetLimit(1)
		local res = oDBCmd:Execute()
		local data = res[1]
		if not data then
			return 
		end
		delog( "data.roleid :", data.roleid  )
		delog( "OnInvite 1 =======", true, i_sRoleID, data.roleid  )
    	self:OnInvite( true, i_sRoleID, data.roleid )
	end
end
