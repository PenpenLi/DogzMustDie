
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function list_lockmac(req, method, query, content)
   local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
    local res = CDBService:SelectLockMacInfo()
    if res and #res > 0 then
        for _, tInfo in pairs(res) do
			local data = {
				role_id = tInfo.roleid,
				mac = tInfo.mac,
				skey = tInfo.serverid,
				reason = tInfo.reason,
				lockdate = tInfo.lockdate,
			}
			table_insert(resbody.data, data)
		end
    end
    return resbody
end


CHttpServer:RegisterHandler("/list_lockmac", list_lockmac)


