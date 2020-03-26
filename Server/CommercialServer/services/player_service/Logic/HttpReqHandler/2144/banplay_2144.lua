-- 禁言/解禁，拉黑/解黑
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local n20yearSecond = 20*12*30*24*60*60;
local function banplay_2144(req, method, query, reqbody)
    --if not CCommonFunction.IsSecInRangeTime(reqbody.time, 5*60) then
    --    return "超时";
    --end
	local nNowSec = now(1)
	local nType = tonumber(reqbody.type)
	local nWaitTime
	if reqbody.keeptime then
		reqbody.keeptime = tonumber(reqbody.keeptime)
	end
    if nType == 0 then	-- 解黑
		nWaitTime = 0
	elseif nType == 1 then	-- 拉黑
        local keeptime = (reqbody.keeptime and reqbody.keeptime > 0) and reqbody.keeptime or n20yearSecond;
		nWaitTime = now(1) + keeptime;
	elseif nType == 2 then -- 禁言
        local keeptime = (reqbody.keeptime and reqbody.keeptime > 0) and reqbody.keeptime or n20yearSecond;
		nWaitTime = now(1) + keeptime;
	else
		return -1;
	end

	if nType >= 2 then
		local res = CDBService:UpdateBanspeakTime(reqbody.qid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.qid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	else
		local res = CDBService:UpdateBanplaytime(reqbody.qid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.qid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banplay", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	end
	return 1
end
CHttpServer:RegisterHandler("/banplay_2144", banplay_2144)