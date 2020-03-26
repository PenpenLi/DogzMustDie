
local CDBService = RequireSingleton("CDBService")
local CHttpServer = RequireSingleton("CHttpServer")
local CActivitiesMgr = RequireSingleton("CActivitiesMgr")

-- 删除运营活动
local function activity_del(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "删除运营活动成功",
    }
	local nServerID = tonumber(reqbody.serverid)
	if not CDBService:DeleteActivityID(nServerID) then
		resbody.ret = 1
		resbody.msg = "删除运营活动失败"
	else
		if not CActivitiesMgr:PushOneActivity(nServerID) then
			resbody.ret = 2
			resbody.msg = "推送运营活动失败"
		end
	end
    return resbody
end

CHttpServer:RegisterHandler("/activity_del", activity_del)


