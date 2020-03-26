
local now = _commonservice.now
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert
local string_gmatch = string.gmatch
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")
local CJSON	      = RequireSingleton("CJSON")

local function chat_ban(req, method, query, reqbody)
	local resbody
	-- 解析roleid
	local tRoleID = {}
	for sRoleID in string_gmatch(reqbody.target.role_id, "(%d+)") do
		table_insert(tRoleID, sRoleID)
	end
	if #tRoleID == 0 then
		resbody = {
			errno = -1,
			errmsg = "参数错误",
			data = {},
		}
		return resbody
	end
	
	-- reqbody.cmd.type 为1是禁言，为2是解除
	local nWaitTime = 0
	if reqbody.cmd.type == "1" then
		nWaitTime = now(1) + reqbody.cmd.time
	end
	for _, sRoleID in ipairs(tRoleID) do
		local res = CDBService:UpdateChatBanTime(sRoleID, nWaitTime)
		if res then
			resbody = {
				errno = 0,
				errmsg = "禁言成功",
				data = {},
			}
			CCenter:Send("CT_Banspeak", tonumber(reqbody.target.server_id), sRoleID, nWaitTime)
		else
			resbody = {
				errno = -2,
				errmsg = "禁言失败",
				data = {},
			}
		end
	end
	CDBService:InsertAdminLog(reqbody.track.oper, reqbody.target.server_id, reqbody.cmd.name, reqbody.track.ts, CJSON.Encode(reqbody, true), resbody.errno, resbody.errmsg)
    return resbody
end

CHttpServer:RegisterHandler("/chat_ban", chat_ban)


