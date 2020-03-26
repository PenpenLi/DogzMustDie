
-- global function
local print = print
local now   = _commonservice.now
local replyrequest	= _httpservice.replyrequest
local CJSON			= RequireSingleton("CJSON")
local CCenter		= RequireSingleton("CCenter")

-- global singleton
local CDBService = RequireSingleton("CDBService")
local CPlayerService = RequireSingleton("CPlayerService")

function CPlayerService:Initialize()
	self.m_nIndex = 0;
	self.m_tReq = {}
	local res = CDBService:SelectFromGlobalinfo();
	if res and res[1] then
		self.m_nIndex = res[1].playerserviceindex;
	end
	return true
end

function CPlayerService:GetNewIndex()
	local nNewIndex = self.m_nIndex
	self.m_nIndex = self.m_nIndex + 1
	if not CDBService:UpdateGlobalinfoPlayerServiceIndex(self.m_nIndex) then
		print("ERROR!!! Update playerserviceindex to Globalinfo fail", self.m_nIndex)
	end
	return nNewIndex
end

function CPlayerService:AddHttpReq(i_nNewIndex, i_pReq)
	self.m_tReq[i_nNewIndex] = i_pReq
end

local res_format_yy = {
    ["yy_guild_list"] = true,
    ["yy_guild_memberlist"] = true,
    ["yy_guild_membernum"] = true,
    ["yy_guild_roleguildinfo"] = true,
    ["yy_guild_setnotice"] = true,
    ["yy_guild_changeleader"] = true,
    ["yy_guild_destory"] = true,
}

function CPlayerService:ReqRespond(i_nIndex, i_tData, i_sOperName)
	local pReq = self.m_tReq[i_nIndex]
	if pReq then
		if i_tData then
            local resbody
            if res_format_yy[i_sOperName] then
                resbody = {
                    status = 200,
                    message = "操作成功",
                    data = i_tData
                }
            else
                resbody = {
                    errno = 0,
                    errmsg = "操作成功",
                    data = i_tData,
                }
            end
			replyrequest(pReq, 200, "OK", CJSON.Encode(resbody, true))
		else
			replyrequest(pReq, 503, "Service Unavailable")
		end
		self.m_tReq[i_nIndex] = nil
	end
end

function CPlayerService:Destruct()
	for _, pReq in pairs(self.m_tReq) do
		replyrequest(pReq, 503, "Service Unavailable")
	end
	self.m_tReq = {}
end

function CPlayerService:GetAlwaysNotice(i_nServerID)
	local tRes = CDBService:SelectAlwaysNoticeByServerID(i_nServerID);
	if tRes and tRes[1] then
		local tData = {
			m_sContent = tRes[1].content, 
			m_sLink = tRes[1].link, 
			m_sLinkName = tRes[1].linkname
		}
		CCenter:Send("CT_SetAlwaysNotice", i_nServerID, tData)
	end
end

function CPlayerService:GetInviteNum(i_tData)
	local tbInvitee = CDBService:SelectByInviteID(i_tData.pfid)
	local nNum = 0
	if tbInvitee then
		nNum = #tbInvitee
	end
	CCenter:Send("CT_SendInviteNum", i_tData.serverid, i_tData.roleid, nNum)
end

defineS.S_PlayerCreateChar = function(i_tData)
    CDBService:CreateChar(i_tData)
end
defineS.S_PlayerRename = function(i_sNewName, i_sOldName)
    CDBService:OnCharRename(i_sNewName, i_sOldName)
end

defineS.S_PlayerChangeCharInfo = function(i_tData)
    CDBService:OnCharInfoChange(i_tData)
end

defineS.S_PlayerEverydayEnter = function(i_tData)
    CDBService:OnPlayerEverydayEnter(i_tData)
end

defineS.S_PlayerServiceCallRes = function(i_nIndex, i_tData, i_sOperName)
    CPlayerService:ReqRespond(i_nIndex, i_tData, i_sOperName)
end

defineS.S_GetAlwaysNotice = function(i_nServerID)
	CPlayerService:GetAlwaysNotice(i_nServerID)
end

defineS.S_GetInviteNum = function(i_tData)
	CPlayerService:GetInviteNum(i_tData)
end