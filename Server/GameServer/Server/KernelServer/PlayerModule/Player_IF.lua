---------------
-- Interface --
---------------
-- global function
local now           = _commonservice.now
-- global singleton
local CPlayerManager		= RequireSingleton("CPlayerManager");
local CCommercialService	= RequireSingleton("CCommercialService");
local CDataLog              = RequireSingleton("CDataLog")
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager");
local CDBServerManager 		= RequireSingleton("CDBServerManager")
local CRQCfgMgr				= RequireSingleton "CRoleQualityCfgMgr";
local CRankManager  = RequireSingleton("CRankManager")

local CPlayer = RequireClass("CPlayer");

function CPlayer:SetAccountID(i_sAccountID, i_sOpenID, i_sPf)
	self.m_sAccountID   = i_sAccountID
    self.m_sOpenID      = i_sOpenID
    self.m_sPf          = i_sPf
end
function CPlayer:GetAccountID()
	return self.m_sAccountID;
end

function CPlayer:SetLoginServerID(i_nServerID)
    self.m_nLoginServerID = i_nServerID
end
function CPlayer:GetLoginServerID()
    return self.m_nLoginServerID
end

function CPlayer:GetOpenID()
    return self.m_sOpenID
end

function CPlayer:GetPf()
    return self.m_sPf
end

function CPlayer:GetIP()
	return self.m_sIP;
end

function CPlayer:GetNIP()
    return self.m_nIP
end

function CPlayer:SetMAC(i_sMAC)
    self.m_sMAC = i_sMAC
end
function CPlayer:GetMAC()
	return self.m_sMAC;
end

function CPlayer:IsNew()
	return self.m_nNewFlag == 1;
end

function CPlayer:GetSystem(i_sSystemName)
	return self.m_oSystemMgr:GetSystem(i_sSystemName);
end

function CPlayer:GetRoleID()
	return self.m_sRoleID;
end

function CPlayer:GetName()
	return self.m_sName;
end

function CPlayer:GetProfID()
	return self.m_nProfID;
end

function CPlayer:GetPlatformLevel()
    return 0
end

-- 获取离线时间
function CPlayer:GetLeaveTime( )
	return self.nLeaveTime or 0
end

function CPlayer:ModLevel( nLv )
    self.m_nLevel = self.m_nLevel + nLv
    self:SetSaveDataRole("level", self.m_nLevel)
    self:OnLevelUp( )
end

function CPlayer:SetLevel(i_nLevel)
    self.m_nLevel = i_nLevel
    self:SetSaveDataRole("level", self.m_nLevel)
    self:OnLevelUp( )
end

function CPlayer:OnLevelUp( )
	self.m_oSystemMgr:OnLevelUp(self.m_nLevel)
	self:SendToClient( "C_OnLevelUp", self.m_nLevel )
	CRankManager:OnLevelUp(self)
    CDataLog:LogDistLevel_log( self:GetGYYXIF( ), self:GetOpenID( ), self:GetRoleID( ), self:GetLevel( ) )
end

function CPlayer:GetLevel()
    return self.m_nLevel;
end

function CPlayer:SetExp(i_nExp)
    self.m_nExp = i_nExp;
    self:SetSaveDataRole("exp", self.m_nExp)
	self:SendToClient( "C_OnChangeExp", self.m_nExp )
end

function CPlayer:GetExp()
    return self.m_nExp;
end

-- 阵营
function CPlayer:GetCamp() 
	return self.m_nCamp 
end
function CPlayer:SetCamp(i_nCamp)
	self.m_nCamp = i_nCamp
    self:SetSaveDataRole("camp", i_nCamp)
	CPlayerManager:IncCampNum(i_nCamp)
end

-- 战斗力
function CPlayer:SetCombatPower(i_nCombatPower)
	self.m_nCP = i_nCombatPower;
end
function CPlayer:GetCombatPower()
	return self.m_nCP;
end

-- 系统提示
function CPlayer:SendSystemTips(i_nTipsId, i_tParam)
	self:SendToClient("C_SystemTips", i_nTipsId, i_tParam);
end

function CPlayer:GetLogoutTime()
	return self.m_nLogoutTime;
end

function CPlayer:GetTodayTime()
	return self.m_nTodayTime;
end

function CPlayer:GetLoginNum()
	return self.m_nLoginNum;
end

function CPlayer:GetPlayTime()
	return self.m_nPlayTime;
end

function CPlayer:GetLoginTime()
	return self.m_nLoginTime;
end

function CPlayer:SetLoginTime()
	self.m_nLoginTime = now(1) + 1;
end

function CPlayer:BanSpeak(i_nTime, i_bInit)
    self.m_nBanSpeakTime = i_nTime
    if not i_bInit then
        self:SendToClient("C_BanSpeak", self.m_nBanSpeakTime)
    end
end

function CPlayer:IsBanSpeak()
    return self.m_nBanSpeakTime >= now(1)
end

function CPlayer:GetBanSpeakTime()
    return self.m_nBanSpeakTime
end

function CPlayer:SendDB(i_fCallBack, i_tRoleInfo)
	CDBServerManager:SendDB(i_fCallBack, i_tRoleInfo)
end

function CPlayer:GetPlayerData(i_sModule)
	return CDBServerManager:GetPlayerData(self.m_sRoleID, i_sModule)
end