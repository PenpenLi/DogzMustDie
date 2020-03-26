-- 禁言/解禁，拉黑/解黑
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")


local function banplay_51(req, method, query, reqbody)
	local nNowSec = now(1)
	local nWaitTime
	if reqbody.time then
		reqbody.time = tonumber(reqbody.time)
	end
	if reqbody.action == "unspeakable" then -- 禁言
		if reqbody.time <= nNowSec then
            --时间不对
			return -1;
		end
		nWaitTime = reqbody.time
	elseif reqbody.action == "speakable" then	-- 解禁
		nWaitTime = 0
	elseif reqbody.action == "lock" then	-- 拉黑
		if reqbody.time <= nNowSec then
            --时间不对
			return -1;
		end
		nWaitTime = reqbody.time
	elseif reqbody.action == "unlock" then	-- 解黑
		nWaitTime = 0
	else
        --参数不对
		return -2;
	end
	if reqbody.action == "unspeakable" or reqbody.action == "speakable" then
		local res = CDBService:UpdateBanspeakTime(reqbody.account_name, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.account_name, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	else
		local res = CDBService:UpdateBanplaytime(reqbody.account_name, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.account_name, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banplay", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	end
	return "success";
end
CHttpServer:RegisterHandler("/banplay_51", banplay_51)