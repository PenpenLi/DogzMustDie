
local type = type
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

-- 通过openid查询玩家数据
local function roleid2roleinfo(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    repeat
        if type(reqbody.roleid) ~= "string" then
            resbody.ret = 12
            resbody.msg = "查询请求的roleid不是字符串"
            break
        end
        resbody.info = CDBService:SelectCharByRoleID(reqbody.roleid, reqbody.serverid)
    until true
    return resbody
end

CHttpServer:RegisterHandler("/roleid2roleinfo", roleid2roleinfo)


