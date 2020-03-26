-- 360wan平台检测是否有角色存在
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function active(req, method, query, reqbody)
    local res = CDBService:SelectCharByPfIDAndServerID(reqbody.qid, reqbody.server_id)
    if res and #res > 0 then
        return 1;
    else
        return 0;
    end
end


CHttpServer:RegisterHandler("/active", active)


