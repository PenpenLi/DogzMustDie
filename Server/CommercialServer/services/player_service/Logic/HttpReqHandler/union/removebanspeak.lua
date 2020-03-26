
local type = type
local tonumber = tonumber
local now   = _commonservice.now
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CCenter = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

local function removebanspeak(req, method, query, reqbody)
    local resbody
	local nWaitTime = 0
    local res = CDBService:UpdateBanspeakTime(reqbody.uid, reqbody.skey, nWaitTime)
    if res then
        resbody = {
            errno = 0,
            errmsg = "解禁成功",
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
					errmsg = "没有此玩家解禁失败",
					data = reqbody,
				}
			end
		end
    else
        resbody = {
            errno = -2,
            errmsg = "解禁失败",
			data = reqbody,
        }
    end
    return resbody
end

CHttpServer:RegisterHandler("/removebanspeak", removebanspeak)


