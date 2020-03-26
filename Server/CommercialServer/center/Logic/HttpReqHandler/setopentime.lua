
local CHttpServer   = RequireSingleton("CHttpServer")
local CKSManager	= RequireSingleton("CKSManager")

-- 设置服务器开服时间
local function setopentime(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "关服成功",
    }
    repeat
        if type(reqbody.serverid) ~= "table" then
            resbody.ret = 11
            resbody.msg = "serverid集合不是table"
            break
        end
        reqbody.ts = tonumber(reqbody.ts)
        if not reqbody.ts then
            resbody.ret = 12
            resbody.msg = "开服时间不是时间戳"
            break
        end
        for _, v in ipairs(reqbody.serverid) do
            local oKS = CKSManager:GetKSByID(tonumber(v))
            if oKS then
                oKS:Send("K_SetOpenTime", reqbody.ts)
            end
        end
    until true
    
    return resbody
end

CHttpServer:RegisterHandler("/setopentime", setopentime)


