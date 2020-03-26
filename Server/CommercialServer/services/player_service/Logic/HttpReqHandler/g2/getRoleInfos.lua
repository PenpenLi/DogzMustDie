
local table_insert = table.insert
local string_gmatch = string.gmatch
local tonumber = tonumber
local next = next
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function getRoleInfos(req, method, query, reqbody)
	local tInfo = {};
	for nType in string_gmatch(reqbody.users, "([^,]+)") do
		table_insert(tInfo, nType);
	end
	local resbody = {}
	local serverid = reqbody.server_id
	for _, uid in pairs(tInfo) do
		local res = CDBService:SelectCharByPfIDAndServerID(uid, serverid)
		if res and #res > 0 then
			resbody[uid] = {};			
			for _, v in ipairs(res) do
				local data = {
                    level = v.level,
                    name = v.rolename,
                    toptype = 0,
                    topvalue = 0,
                }
				table_insert(resbody[uid], data)
			end		
		end
	end
	if not next(resbody) then
		resbody = {
			errno = -7,
			errmsg = "玩家都不存在",
        }
	end
	return resbody
end


CHttpServer:RegisterHandler("/getRoleInfos", getRoleInfos)


