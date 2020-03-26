
-- global function
local logfile   = logfile
local print     = print
local pairs     = pairs
local ipairs    = ipairs
local table_insert = table.insert
-- global singleton
local CCenter		= RequireSingleton("CCenter")
local CKSManager    = RequireSingleton("CKSManager")

local LimitServerID = 9000
defineCT.CT_PushActivity = function(i_pSession, i_nServerID, i_tData, i_tSpecialServerID)
	local tServerID = {}
	if i_nServerID == 0 then
		for serverid, oKS in pairs(CKSManager.m_tID2KS) do
			if serverid < LimitServerID and (not i_tSpecialServerID[serverid]) then
				table_insert(tServerID, oKS);
			end
		end
	else
		local oKS = CKSManager:GetKSByID(i_nServerID)
		if oKS then
			table_insert(tServerID, oKS);
		end
	end	
	for _, oKS in ipairs(tServerID) do	
		oKS:Send("K_PushActivities", i_tData)
	end
end

function CCenter:GetActivity(i_nServerID)
    local ActivityService = self:GetService("activity_service")
    if ActivityService then
        self:Send2Service(ActivityService, "S_GetActivity", i_nServerID)
    end
end


function CCenter:ReportActivityInfo(i_tData)
    local ActivityService = self:GetService("activity_service")
    if ActivityService then
        self:Send2Service(ActivityService, "S_ReportActivity", i_tData)
    end
end

defineCM.CM_ReportActivityInfo = function(i_oKS, i_tData)
	CCenter:ReportActivityInfo(i_tData)
end

defineCM.CM_InitLotto = function(i_oKS, i_tData)
    CCenter:ActivityServiceOnInit(i_oKS, i_tData)
end

function CCenter:ActivityServiceOnInit(i_oKS, i_tData)
	local ActivityService = self:GetService("activity_service")
    if ActivityService then
		local nKs = i_oKS:GetID()
        self:Send2Service(ActivityService, "S_InitLotto", nKs, i_tData)
    end
end

defineCM.CM_BookLotto = function(i_oKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
	CCenter:ActivityServiceBookLotto(i_oKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
end

function CCenter:ActivityServiceBookLotto(i_oKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
	local ActivityService = self:GetService("activity_service")
    if ActivityService then
		local nKs = i_oKS:GetID()
        self:Send2Service(ActivityService, "S_BookLotto", nKs, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
    end
end

defineCT.CT_BookLottoRes = function(i_pSession, i_nKS, i_sRoleID, i_sActionID, i_tRes)
	local oKS = CKSManager:GetKSByID(i_nKS)
    if oKS then
		oKS:Send("K_BookLottoRes", i_sRoleID, i_sActionID, i_tRes)
    end
end

defineCM.CM_GetLottoData = function(i_oKS, i_sSpecialID, i_sRoleID)
	CCenter:ActivityServiceGetLottoData(i_oKS, i_sSpecialID, i_sRoleID)
end

function CCenter:ActivityServiceGetLottoData(i_oKS, i_sSpecialID, i_sRoleID)
	local ActivityService = self:GetService("activity_service")
    if ActivityService then
		local nKs = i_oKS:GetID()
        self:Send2Service(ActivityService, "S_GetLottoData", nKs, i_sSpecialID, i_sRoleID)
    end
end

defineCT.CT_GetLottoDataRes = function(i_pSession, i_nKS, i_sRoleID, i_sActionID, i_tData)
	local oKS = CKSManager:GetKSByID(i_nKS)
    if oKS then
		oKS:Send("K_GetLottoDataRes", i_sRoleID, i_sActionID, i_tData)
    end
end

defineCM.CM_GetLottoCount = function(i_oKS, i_sSpecialID, i_sRoleID)
	CCenter:ActivityServiceGetLottoCount(i_oKS, i_sSpecialID, i_sRoleID)
end

function CCenter:ActivityServiceGetLottoCount(i_oKS, i_sSpecialID, i_sRoleID)
	local ActivityService = self:GetService("activity_service")
    if ActivityService then
		local nKs = i_oKS:GetID()
        self:Send2Service(ActivityService, "S_GetLottoCount", nKs, i_sSpecialID, i_sRoleID)
    end
end

defineCT.CT_GetLottoCountRes = function(i_pSession, i_nKS, i_sRoleID, i_sActionID, i_tData)
	local oKS = CKSManager:GetKSByID(i_nKS)
    if oKS then
		oKS:Send("K_GetLottoCountRes", i_sRoleID, i_sActionID, i_tData)
    end
end

defineCT.CT_LottoLuckyInfo = function(i_pSession, i_tServerMap, i_nActionID, i_nIndex, i_nTime, i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount)
	for i_nKS, _ in pairs(i_tServerMap) do
		local oKS = CKSManager:GetKSByID(i_nKS)
		if oKS then
			oKS:Send("K_LottoLuckyInfo", i_nActionID, i_nIndex, i_nTime, i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount)
		end
	end
end

defineCM.CM_BuyLotto = function(i_oKS, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
    CCenter:ActivityServiceBuyLotto(i_oKS, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
end

function CCenter:ActivityServiceBuyLotto(i_oKS, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
	local ActivityService = self:GetService("activity_service")
    if ActivityService then
		local nKs = i_oKS:GetID()
        self:Send2Service(ActivityService, "S_BuyLotto", nKs, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
    end
end

defineCT.CT_SubAward = function(i_pSession, i_nKS, i_sRoleID, i_sTitle, i_sContent, i_tItems)
	CCenter:SendMail(i_nKS, i_sRoleID, i_sTitle, i_sContent, i_tItems)
end