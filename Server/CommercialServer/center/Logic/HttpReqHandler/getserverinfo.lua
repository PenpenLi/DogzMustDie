
local CHttpServer = RequireSingleton("CHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 获取服务器信息
local function getserverinfo(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "列出服务器成功",
    }
    repeat
        local oKS = CKSManager:GetKSByID(reqbody.serverid)
        if not oKS then
            resbody.ret = 11
            resbody.msg = "查询的服务器不存在"
            break
        end
        local opentime, openday = oKS:GetOpenTimeInfo()
        resbody.info = {
            ip = oKS:GetIP(),
            opentime = opentime,
            openday = openday,
            version = oKS:GetVersion(),
            playernum = oKS:GetOnlineNum()
        }
    until true
    return resbody
end


CHttpServer:RegisterHandler("/getserverinfo", getserverinfo)


