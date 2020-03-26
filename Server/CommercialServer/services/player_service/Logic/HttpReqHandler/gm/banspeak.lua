
local type = type
local tonumber = tonumber
local now           = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CCenter     = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

-- 禁言/解禁
local function banspeak(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "禁言成功",
    }
    repeat
        if type(reqbody.roleid) ~= "string" then
            resbody.ret = 12
            resbody.msg = "禁言/解禁请求roleid不是字符串"
            break
        end
        reqbody.sec = tonumber(reqbody.sec)
        if not reqbody.sec then
            resbody.ret = 13
            resbody.msg = "禁言/解禁请求sec不是数字"
            break
        end
        local nWaitTime = 0
        if reqbody.sec > 0 then
            nWaitTime = now(1) + reqbody.sec
        end
        CDBService:UpdateChatBanTime(reqbody.roleid, nWaitTime)
        CCenter:Send("CT_Banspeak",reqbody.roleid,nWaitTime)
    until true
    
    return resbody
end

CHttpServer:RegisterHandler("/banspeak", banspeak)


