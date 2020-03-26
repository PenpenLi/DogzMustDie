
local table_insert = table.insert
local string_gmatch = string.gmatch
local tonumber = tonumber
local next = next
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function player_info(req, method, query, reqbody)
	local tInfo = {};
	for nType in string_gmatch(reqbody.users, "([^,]+)") do
		table_insert(tInfo, nType);
	end
	local bSelect = false
	local resbody = {}
	local serverid = reqbody.server_id
	for _, uid in pairs(tInfo) do
		local res = CDBService:SelectCharByPfIDAndServerID(uid, serverid)
		if res and #res > 0 then
			resbody[uid] = {};
			for _, v in ipairs(res) do
				local data = {
                    qid = uid,
                    level = v.level,
                    name = v.rolename,
                    marry = v.marry,
                    job = v.occupation,
                }
				table_insert(resbody[uid], data)
			end		
		end
	end
    if next(resbody) then
        return resbody
    end
    return -7
end


CHttpServer:RegisterHandler("/player_info", player_info)


