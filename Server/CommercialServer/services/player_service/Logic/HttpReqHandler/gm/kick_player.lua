
local now = _commonservice.now
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert
local string_gmatch = string.gmatch
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CJSON	      = RequireSingleton("CJSON")
local CDBService  = RequireSingleton("CDBService")

local function kick_player(req, method, query, reqbody)
	local resbody
	local tRoleID = {}
	if reqbody.target.status == "role_id" then
		-- 解析roleid
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
	end
	resbody = {
			errno = 0,
			errmsg = "踢号成功",
			data = {},
		}
	CCenter:Send("CT_Kickplay", tonumber(reqbody.target.server_id), tRoleID)
	CDBService:InsertAdminLog(reqbody.track.oper, reqbody.target.server_id, reqbody.cmd.name, reqbody.track.ts, CJSON.Encode(reqbody, true), resbody.errno, resbody.errmsg)
    return resbody
end

CHttpServer:RegisterHandler("/kick_player", kick_player)


