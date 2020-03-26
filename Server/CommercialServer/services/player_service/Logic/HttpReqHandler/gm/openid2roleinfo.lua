
local type = type
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

-- 通过openid查询玩家数据
local function openid2roleinfo(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    repeat
        if type(reqbody.openid) ~= "string" then
            resbody.ret = 11
            resbody.msg = "查询请求的openid不是字符串"
            break
        end
        resbody.info = CDBService:SelectCharDByPfID(reqbody.openid, reqbody.serverid)
    until true
    return resbody
end

CHttpServer:RegisterHandler("/openid2roleinfo", openid2roleinfo)


