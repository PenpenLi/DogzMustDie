
local type = type
local tonumber = tonumber
local string_sub = string.sub
local string_len = string.len
local now   = _commonservice.now
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CCenter = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

local function banspeak(req, method, query, reqbody)
    local resbody
    local nWaitTime = 0
    if tonumber(reqbody.wait_time) == 0 then
        nWaitTime = 2102329599
    else
        nWaitTime = now(1) + reqbody.wait_time
    end
    local res = CDBService:UpdateBanspeakTime(reqbody.uid, reqbody.skey, nWaitTime)
    if res then
        resbody = {
            errno = 0,
            errmsg = "禁言成功",
            data = reqbody,
        }
        local res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.uid, reqbody.skey)
        if res then
            if res[1] then
                res = res[1]
                CCenter:Send("CT_Banspeak", tonumber(reqbody.skey), res.roleid, nWaitTime)
            else
                resbody = {
                    errno = -3,
                    errmsg = "没有此玩家禁言失败",
                    data = reqbody,
                }
            end
        end
    else
        resbody = {
            errno = -2,
            errmsg = "禁言失败",
            data = reqbody,
        }
    end
    return resbody
end
CHttpServer:RegisterHandler("/banspeak", banspeak)


