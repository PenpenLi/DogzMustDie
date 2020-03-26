
local tonumber = tonumber
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")
local CJSON	      = RequireSingleton("CJSON")

local function send_notice(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "公告成功",
		data = {},
	}
	local serverid = reqbody.target.server_id
	local content = reqbody.cmd.content
	-- local link = reqbody.cmd.link
	CCenter:Send("CT_Notice", tonumber(serverid), {3, content})
	CDBService:InsertAdminLog(reqbody.track.oper, reqbody.target.server_id, reqbody.cmd.name, reqbody.track.ts, CJSON.Encode(reqbody, true), resbody.errno, resbody.errmsg)
    return resbody
end

CHttpServer:RegisterHandler("/send_notice", send_notice)


