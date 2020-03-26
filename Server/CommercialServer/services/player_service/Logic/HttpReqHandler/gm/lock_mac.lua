
local now = _commonservice.now
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert
local string_gmatch = string.gmatch
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")
local CJSON	      = RequireSingleton("CJSON")

local function lock_mac(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	
	local nServerId = reqbody.target.server_id;
	local tMacInfo = reqbody.cmd.macdata;
	for _, tInfo in pairs(tMacInfo) do
		local roleid = tInfo.role_id
		local mac = tInfo.mac
		local res = CDBService:SelectMacByRoleId(roleid)
		if res and #res > 0 then
			local online = res[1].online;
			local onserver = res[1].onserver;
			local serverid = res[1].serverid;
			if online == 1 then
				CCenter:Send("CT_Banplay", tonumber(onserver), roleid)
			end	
			CDBService:RecordLockMac(mac, reqbody.cmd.reason, now(1), roleid, serverid)
		end
	end
    return resbody
end

CHttpServer:RegisterHandler("/lock_mac", lock_mac)


