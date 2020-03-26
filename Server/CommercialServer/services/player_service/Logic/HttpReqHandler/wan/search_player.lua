--360 wan平台角色信息查询
local table_insert = table.insert
local string_gmatch = string.gmatch
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")
local now = _commonservice.now

local function search_player(req, method, query, reqbody)
    local resbody
	local res = CDBService:SelectCharacterByRoleName(reqbody.server_id, reqbody.rolename)
    if res then
		if res[1] then
			return res[1].pfid
		else
			return -1
		end
    else
        return -1
    end
end


CHttpServer:RegisterHandler("/search_player", search_player)


