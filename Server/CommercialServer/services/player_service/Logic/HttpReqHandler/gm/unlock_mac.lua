
local now = _commonservice.now
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert
local string_gmatch = string.gmatch
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")
local CJSON	      = RequireSingleton("CJSON")

local function unlock_mac(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	
	local tLockMac = reqbody.cmd.mac;
	for _, mac in pairs(tLockMac) do
		CDBService:DeleteLockMac(mac)
	end
    return resbody
end

CHttpServer:RegisterHandler("/unlock_mac", unlock_mac)


