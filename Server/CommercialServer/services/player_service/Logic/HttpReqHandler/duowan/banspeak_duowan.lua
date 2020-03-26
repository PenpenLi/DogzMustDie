-- yy平台 禁言
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")

local timeout = 5 * 60	-- 超时秒数

local function banspeak_duowan(req, method, query, reqbody)
	local nNowSec = now(1)
	if reqbody.ts + timeout <= nNowSec then
		return -1	-- 请求超时
	end
	local nWaitTime = nNowSec + tonumber(reqbody.keeptime) * 60
	local res = CDBService:UpdateBanspeakTime(reqbody.accounts, reqbody.server, nWaitTime)
	if res then
		res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.accounts, reqbody.server)
		if res and res[1] then
			CCenter:Send("CT_Banspeak", tonumber(reqbody.server), res[1].roleid, nWaitTime)
			return 1
		end
	end
	return -1
end
CHttpServer:RegisterHandler("/banspeak_duowan", banspeak_duowan)