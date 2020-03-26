
local CHttpServer   = RequireSingleton("CHttpServer")
local CYWHttpServer = RequireSingleton("CYWHttpServer")
local CKSManager	= RequireSingleton("CKSManager")

-- 关闭服务器
local function shutdownserver(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "关服成功",
    }
    CKSManager:ShutdownKSByID(reqbody.serverid)
    return resbody
end
CHttpServer:RegisterHandler("/shutdownserver", shutdownserver)
CYWHttpServer:RegisterHandler("/shutdownserver", shutdownserver)


