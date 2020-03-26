-- 禁言/解禁，拉黑/解黑
local tonumber 		= tonumber
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CCenter 		= RequireSingleton("CCenter")
local CDBService 	= RequireSingleton("CDBService")


local function banplay_602(req, method, query, reqbody)
    local resbody = {
		status = 200,
		message = "操作成功",
		data = {},
	}
	local nNowSec = now(1)
	local nType = tonumber(reqbody.type)
	local nWaitTime
	if reqbody.time then
		reqbody.time = tonumber(reqbody.time)
	end
	if nType == 1 then -- 禁言
		if reqbody.time <= nNowSec then
			resbody = {
		        status = 301,
		        message = "时间不对",
	        }
            return resbody;
		end
		nWaitTime = reqbody.time
	elseif nType == 2 then	-- 解禁
		nWaitTime = 0
	elseif nType == 3 then	-- 拉黑
		if reqbody.time <= nNowSec then
			resbody = {
		        status = 301,
		        message = "时间不对",
	        }
            return resbody;
		end
		nWaitTime = reqbody.time
	elseif nType == 4 then	-- 解黑
		nWaitTime = 0
	else
		resbody = {
		    status = 300,
		    message = "类型错误",
	    }
        return resbody;
	end
	if nType < 3 then
		local res = CDBService:UpdateBanspeakTime(reqbody.uid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.uid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	else
		local res = CDBService:UpdateBanplaytime(reqbody.uid, reqbody.server_id, nWaitTime)
		if res then
			res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.uid, reqbody.server_id)
			if res and res[1] then
				CCenter:Send("CT_Banplay", tonumber(reqbody.server_id), res[1].roleid, nWaitTime)
			end
		end
	end
	return resbody
end
CHttpServer:RegisterHandler("/banplay_602", banplay_602)