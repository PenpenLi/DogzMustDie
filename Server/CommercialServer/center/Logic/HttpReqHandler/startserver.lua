
local CHttpServer   = RequireSingleton("CHttpServer")
local CYWHttpServer = RequireSingleton("CYWHttpServer")
local CWDManager    = RequireSingleton("CWDManager")

-- 开启服务器
local function startserver(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "开服成功",
    }
    CWDManager:StartServer(reqbody.serverid)
    return resbody
end

CHttpServer:RegisterHandler("/startserver", startserver)
CYWHttpServer:RegisterHandler("/startserver", startserver)


