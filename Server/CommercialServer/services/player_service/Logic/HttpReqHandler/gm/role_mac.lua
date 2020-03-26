
local table_insert = table.insert
local string_gmatch = string.gmatch
local string_format = string.format
local tonumber = tonumber
local next = next
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function role_mac(req, method, query, reqbody)
	local tInfo = {};
	local nServerId = reqbody.target.server_id;
	for nRoleId in string_gmatch(reqbody.target.role_id, "([^,]+)") do
		table_insert(tInfo, nRoleId);
	end
	local bSelect = false
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	for _, roleid in pairs(tInfo) do
		local res = CDBService:SelectMacByRoleId(roleid)
		if res and #res > 0 then
			resbody.data[roleid] = res[1].mac;		
		end
	end
	return resbody
end

CHttpServer:RegisterHandler("/role_mac", role_mac)


