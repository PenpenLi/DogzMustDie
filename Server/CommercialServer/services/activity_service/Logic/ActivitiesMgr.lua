
local tonumber = tonumber
local ipairs   = ipairs
local CJSON = RequireSingleton("CJSON")
local CCenter = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

local CLottoMgr = RequireSingleton("CLottoMgr")
local CActivitiesMgr = RequireSingleton("CActivitiesMgr")

function CActivitiesMgr:PushActivity(i_nServerID, i_nVersion, i_tData, i_tSpecialServerID)
    local tdata = {
        version = i_nVersion,
        activities = i_tData,
    }
    return CCenter:Send("CT_PushActivity", i_nServerID, tdata, i_tSpecialServerID)
end

function CActivitiesMgr:OnPushActivity(i_tReqBody)
	local serverid = tonumber(i_tReqBody.serverid)
    i_tReqBody.serverid = nil
	local tServerID = CActivitiesMgr:GetServerData(serverid)
	if tServerID then
		local nVersion = 0
		local db_exec_res = false
		local tServerInfo = tServerID[serverid] or tServerID[0]
		local jsonstr = CJSON.Encode(i_tReqBody, true)
		if tServerInfo then
			if jsonstr == tServerInfo.data then
				return true
			else
				nVersion = tServerInfo.m_nVersion
				if tServerID[serverid] then
					db_exec_res = CDBService:UpdateActivity(serverid, nVersion + 1, jsonstr)
				else
					db_exec_res = CDBService:InsertActivity(serverid, jsonstr)
				end
			end
		else
			db_exec_res = CDBService:InsertActivity(serverid, jsonstr)
		end
		if db_exec_res then
			local tAllServerID = self:GetAllServerID()
			return self:PushActivity(serverid, nVersion + 1, i_tReqBody, tAllServerID)
		else
			return false
		end
	else
		return false
	end
end

-- DB serverid列表
function CActivitiesMgr:GetServerData(i_nServerID)
	local tServerInfo = {}
	local tRes = CDBService:SelectActivityByServerID(i_nServerID)
	if tRes then
		for _, res in ipairs(tRes) do
			tServerInfo[res.serverid] = {m_nVersion = res.version, m_sData = res.data};
		end
	else
		return false
	end
	return tServerInfo
end

function CActivitiesMgr:GetAllServerID()
	local tServerID = {}
	local tRes = CDBService:SelectServerID()
	if tRes then
		for _, res in ipairs(tRes) do
			tServerID[res.serverid] = true;
		end
	end
	return tServerID
end

function CActivitiesMgr:PushOneActivity(i_nServerID)
	local tServerID = self:GetServerData(i_nServerID)
	if tServerID then
		local tServerInfo = tServerID[i_nServerID] or tServerID[0]
		if tServerInfo then
			local tData = CJSON.Decode(tServerInfo.m_sData, true)
			for serverid, data in pairs(tServerID) do
				tServerID[serverid] = true
			end
			return self:PushActivity(i_nServerID, tServerInfo.m_nVersion, tData, tServerID)
		end
	end
end
defineS.S_GetActivity = function(i_nServerID)
    CActivitiesMgr:PushOneActivity(i_nServerID)
end

defineS.S_ReportActivity = function(i_tData)
	CDBService:ReportActivity(i_tData)
end

defineS.S_InitLotto = function(i_nKS, i_tData)
	CLottoMgr:OnInit(i_nKS, i_tData)
end

defineS.S_BookLotto = function(i_nKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
	CLottoMgr:Book(i_nKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
end

defineS.S_GetLottoData = function(i_nKS, i_sSpecialID, i_sRoleID)
	CLottoMgr:GetRoleData(i_nKS, i_sSpecialID, i_sRoleID)
end

defineS.S_GetLottoCount = function(i_nKS, i_sSpecialID, i_sRoleID)
	CLottoMgr:GetCount(i_nKS, i_sSpecialID, i_sRoleID)
end

defineS.S_BuyLotto = function(i_nKs, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
	CLottoMgr:Buy(i_nKs, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
end

