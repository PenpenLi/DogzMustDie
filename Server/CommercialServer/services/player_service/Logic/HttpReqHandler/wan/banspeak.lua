
local type = type
local tonumber = tonumber
local string_sub = string.sub
local string_len = string.len
local now   = _commonservice.now
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CCenter = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

local function banspeak(req, method, query, reqbody)
	local resbody
    local res = CDBService:SelectCharByPfIDAndServerID(reqbody.qid, reqbody.server_id)
	local nType = tonumber(reqbody.type)
    if res and res[1] then
        res = res[1];
        if tonumber(res.banspeaktime) > now(1) then
			if nType ~= 0 then
				return -4;
			end
		elseif nType == 0 then
			return -5;
        end
        local nWaitTime = 0
		if nType ~= 0 then
			if tonumber(reqbody.keeptime) == 0 then
				nWaitTime = 2102329599
			else
				nWaitTime = now(1) + reqbody.keeptime
			end
		end
        local res = CDBService:UpdateBanspeakTime(reqbody.qid, reqbody.server_id, nWaitTime)
        if res then
            resbody = 1;
            local res = CDBService:SelectRoleIDByPfIDAndServerID(reqbody.qid, reqbody.server_id)
            if res then
                if res[1] then
                    res = res[1]
                    CCenter:Send("CT_Banspeak", tonumber(reqbody.server_id), res.roleid, nWaitTime)
                else
                    resbody = -3;
                end
            end
        else
            resbody = -2;
        end
    else
        resbody = -1;
    end
    return resbody
end
CHttpServer:RegisterHandler("/banspeak", banspeak)


