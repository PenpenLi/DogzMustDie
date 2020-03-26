
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CActivitiesMgr = RequireSingleton("CActivitiesMgr")

-- 发运营活动
local function activity_push_fromdb(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "推送运营活动成功",
    }
	if not CActivitiesMgr:PushOneActivity(tonumber(reqbody.serverid)) then
		resbody.ret = 1
		resbody.msg = "推送运营活动失败"
	end
    return resbody
end

CHttpServer:RegisterHandler("/activity_push_fromdb", activity_push_fromdb)


