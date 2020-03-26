
local type = type
local CHttpServer = RequireSingleton("CHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 踢人
local function kickplayer(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "踢人成功",
    }
    repeat
        local nNewServerID = CKSManager:GetOld2New(reqbody.serverid)
        local tID2KS = CKSManager:GetKSByID()
        if not tID2KS then
            resbody.ret = 11
            resbody.msg = "踢人请求的服务器不存在"
            break
        end
        if type(reqbody.roleid) ~= "string" then
            resbody.ret = 12
            resbody.msg = "踢人请求roleid不是字符串"
            break
        end
        for _,oKS in pairs(tID2KS) do
            oKS:KickPlayer(reqbody.roleid)
        end
    until true;
    return resbody
end

CHttpServer:RegisterHandler("/kickplayer", kickplayer)


