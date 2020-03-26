-- 顺网平台 禁言/解禁，拉黑/解黑
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")
local forever = 2102329599

local function banplay_shunwang(req, method, query, reqbody)
	local nNowSec = now(1)
	local nType = tonumber(reqbody.type)
	local nWaitTime
	if nType == 1 then -- 禁言
		nWaitTime = forever
	elseif nType == 2 then	-- 解禁
		nWaitTime = 0
	elseif nType == 3 then	-- 拉黑
		nWaitTime = forever
	elseif nType == 4 then	-- 解黑
		nWaitTime = 0
	else
		return -1
	end
	if nType < 3 then
		local res = CDBService:UpdateBanspeakTime(reqbody.uid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.uid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
				return 1
			end
		end
	else
		local res = CDBService:UpdateBanplaytime(reqbody.uid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.uid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banplay", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
				return 1
			end
		end
	end
	return -3
end
CHttpServer:RegisterHandler("/banplay_shunwang", banplay_shunwang)