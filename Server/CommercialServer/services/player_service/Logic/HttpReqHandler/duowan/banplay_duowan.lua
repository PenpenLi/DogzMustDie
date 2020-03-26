-- yy平台 添加黑名单
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")

local timeout = 5 * 60	-- 超时秒数

local function banplay_duowan(req, method, query, reqbody)
	if reqbody.ts + timeout <= now(1) then
		return -1	-- 请求超时
	end
	local nWaitTime = 2102329599
	local res = CDBService:UpdateBanplaytime(reqbody.accounts, reqbody.server, nWaitTime)
	if res then
		res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.accounts, reqbody.server)
		if res and res[1] then
			CCenter:Send("CT_Banplay", tonumber(reqbody.server), res[1].roleid, nWaitTime)
			return 1
		end
	end
	return -1
end

CHttpServer:RegisterHandler("/banplay_duowan", banplay_duowan)