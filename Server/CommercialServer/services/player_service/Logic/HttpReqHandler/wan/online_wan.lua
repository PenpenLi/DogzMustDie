
local string_sub = string.sub
local string_len = string.len
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function online_wan(req, method, query, reqbody)
	local resbody
	local res = CDBService:SelectOnlineNumByServerID(reqbody.server_id)
    if res then
        if res[1] then
            res = res[1]
            resbody = res.cnt;
        else
            resbody = -3;
        end
    else
        resbody = -5;
    end
    return resbody
end


CHttpServer:RegisterHandler("/online_wan", online_wan)


