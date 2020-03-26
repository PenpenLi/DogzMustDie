

local CHttpServer = RequireSingleton("CHttpServer")
local CActivitiesMgr = RequireSingleton("CActivitiesMgr")

-- 发运营活动
local function activity(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "推送运营活动成功",
    }
    repeat
        if not CActivitiesMgr:OnPushActivity(reqbody) then
            resbody.ret = 1
            resbody.msg = "推送运营活动失败"
        end
    until true
    return resbody
end

CHttpServer:RegisterHandler("/activity", activity)


