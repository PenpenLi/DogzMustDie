
local CHttpServer   = RequireSingleton("CHttpServer")
local CKSManager	= RequireSingleton("CKSManager")
local CWDManager	= RequireSingleton("CWDManager")

-- 设置服务器开服时间
local function set_server_time(req, method, query, content)
    local resbody 
	local nServerID = tonumber(content.target.server_id)
    local oKS = CKSManager:GetKSByID(nServerID)
    if oKS then
        resbody = {
            errno = 0,
            errmsg = "操作成功",
            data = {}
        }
        oKS:Send("K_SetOpenTime", tonumber(content.cmd.time))
		CWDManager:WaitAutoRestart(nServerID)
    else
        resbody = {
            errno = 404,
            errmsg = "没找到服务器",
            data = {}
        }
    end
    
    return resbody
end

CHttpServer:RegisterHandler("/set_server_time", set_server_time)


