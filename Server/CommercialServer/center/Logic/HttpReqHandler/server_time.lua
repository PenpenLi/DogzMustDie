
local now = _commonservice.now
local CHttpServer   = RequireSingleton("CHttpServer")
local CKSManager	= RequireSingleton("CKSManager")

-- 设置服务器开服时间
local function server_time(req, method, query, content)
    local resbody 
    local oKS = CKSManager:GetKSByID(tonumber(content.target.server_id))
    if oKS then
        resbody = {
            errno = 0,
            errmsg = "操作成功",
        }
        local nNowTime = now(1)
        local nOpenTime = oKS:GetOpenTime()
        local bOpenTimeBeSet = oKS:GetOpenTimeBeSet()
        if bOpenTimeBeSet then
            if nNowTime >= nOpenTime then
                resbody.data = {
                    switch = "on",
                    time = tostring(nOpenTime),
                }
            else
                resbody.data = {
                    switch = "off",
                    time = tostring(nOpenTime),
                }   
            end
        else
            resbody.data = {
                switch = "off",
                time = "0",
            }
        end
    else
        resbody = {
            errno = 404,
            errmsg = "没找到服务器",
            data = {
                switch = "off",
                time = "0",
            }
        }
    end
    
    return resbody
end

CHttpServer:RegisterHandler("/server_time", server_time)


