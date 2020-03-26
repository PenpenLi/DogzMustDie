
local string_sub = string.sub
local string_len = string.len
local table_insert = table.insert
local Platform = ServerCfg.Platform
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function online(req, method, query, reqbody)
	local resbody
	local res = CDBService:SelectOnlineNumByServerID(reqbody.target.server_id)
    if res and #res > 0 then
        resbody = {
            errno = 0,
            errmsg = "操作成功",
            data = res[1].cnt
        }
    end
    return resbody
end


CHttpServer:RegisterHandler("/online", online)


