-- 37wan平台 禁言/解禁
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")

local timeout = 3 * 60	-- 有效性秒数差

local function banspeak_pf37wan(req, method, query, reqbody)
	local nNowSec = now(1)
	if reqbody.time + timeout <= nNowSec then
		return -9	-- 请求超时
	end
	local nType = tonumber(reqbody.type)
	local nWaitTime
	if nType == 1 then -- 禁言
		if tonumber(reqbody.keeptime) == 0 then
			nWaitTime = 2102329599
		else
			nWaitTime = nNowSec + reqbody.keeptime * 60
		end
	elseif nType == 2 then	-- 解禁
		nWaitTime = 0
	else
		return -1
	end
	local res = CDBService:UpdateBanspeakTime(reqbody.login_account, reqbody.server_id, nWaitTime)
	if res then
		res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.login_account, reqbody.server_id)
		if res and res[1] then
			CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			return 1
		end
	end
	return -9
end
CHttpServer:RegisterHandler("/banspeak_pf37wan", banspeak_pf37wan)