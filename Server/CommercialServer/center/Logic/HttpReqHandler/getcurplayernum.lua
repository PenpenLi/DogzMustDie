
local CHttpServer = RequireSingleton("CHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 通过openid查询玩家数据
local function getcurplayernum(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    repeat
        if reqbody.serverid == 0 then
            resbody.ret = 11
            resbody.msg = "不能查询多服的数据"
        else
            local oKS = CKSManager:GetKSByID(reqbody.serverid)
            if oKS then
                resbody.num = oKS:GetOnlineNum()
            else
                resbody.ret = 11
                resbody.msg = "查询请求的服务器不存在"
            end
        end
    until true
    return resbody
end

CHttpServer:RegisterHandler("/getcurplayernum", getcurplayernum)


