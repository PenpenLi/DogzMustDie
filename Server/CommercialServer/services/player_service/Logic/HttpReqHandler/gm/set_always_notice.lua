
local print = print
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CDBService	  = RequireSingleton("CDBService")

local function set_always_notice(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	local nServerID = tonumber(reqbody.target.server_id)
	local tData = {
		m_sContent = reqbody.cmd.content, 
		m_sLink = reqbody.cmd.link, 
		m_sLinkName = reqbody.cmd.link_name
	}
	if CCenter:Send("CT_SetAlwaysNotice", nServerID, tData) then
		local tRes = CDBService:SelectAlwaysNoticeByServerID(nServerID);
		if tRes then
			if tRes[1] then
				if not CDBService:UpdateAlwaysNoticeInfo(nServerID, tData.m_sContent, tData.m_sLink, tData.m_sLinkName) then
					print("ERROR!!! Update always_notice fail.", nServerID, tData.m_sContent, tData.m_sLink, tData.m_sLinkName)
				end
			else
				if not CDBService:InsertAlwaysNotice(nServerID, tData.m_sContent, tData.m_sLink, tData.m_sLinkName) then
					print("ERROR!!! Insert always_notice fail.", nServerID, tData.m_sContent, tData.m_sLink, tData.m_sLinkName)
				end
			end
		else
			resbody = {
			errno = -2,
			errmsg = "操作失败",
			data = {},
			}
		end
	else
		resbody = {
			errno = -1,
			errmsg = "操作失败",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/set_always_notice", set_always_notice)


