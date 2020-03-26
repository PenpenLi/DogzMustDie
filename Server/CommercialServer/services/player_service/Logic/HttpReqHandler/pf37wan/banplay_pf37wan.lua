-- 37wan平台 拉黑/解黑
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")

local timeout = 3 * 60	-- 超时秒数

local function banplay_pf37wan(req, method, query, reqbody)
	if reqbody.time + timeout <= now(1) then
		return -9	-- 请求超时
	end
	local nType = tonumber(reqbody.type)
	local nWaitTime
	if nType == 1 then	-- 拉黑
		nWaitTime = 2102329599
	elseif nType == 2 then	-- 解黑
		nWaitTime = 0
	else
		return -1
	end
	local res = CDBService:UpdateBanplaytime(reqbody.login_account, reqbody.server_id, nWaitTime)
	if res then
		res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.login_account, reqbody.server_id)
		if res and res[1] then
			CCenter:Send("CT_Banplay", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			return 1
		end
	end
	return -9
end

CHttpServer:RegisterHandler("/banplay_pf37wan", banplay_pf37wan)