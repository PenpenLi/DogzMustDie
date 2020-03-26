
local type = type
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

-- 通过openid查询玩家数据
local function rolename2roleinfo(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    repeat
        if type(reqbody.rolename) ~= "string" then
            resbody.ret = 12
            resbody.msg = "查询请求的name不是字符串"
            break
        end
        resbody.info = CDBService:SelectCharacterByRoleName(reqbody.rolename, reqbody.serverid)
    until true
    return resbody
end

CHttpServer:RegisterHandler("/rolename2roleinfo", rolename2roleinfo)
