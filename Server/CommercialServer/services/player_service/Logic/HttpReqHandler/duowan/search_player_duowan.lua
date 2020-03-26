-- yy平台角色信息查询
local now 			= _commonservice.now
local CHttpServer 	= RequireSingleton("CHttpServer")
local CDBService 	= RequireSingleton("CDBService")

local timeout = 5 * 60;	-- 超时秒数

local function search_player_duowan(req, method, query, reqbody)
    if reqbody.ts + timeout <= now(1) then
		return -2	-- 请求超时
	end
	local res = CDBService:SelectCharacterByRoleName(reqbody.server, reqbody.nickname)
    if res then
		if res[1] then
			return res[1].pfid
		else
			return -1
		end
    else
        return -3
    end
end

CHttpServer:RegisterHandler("/search_player_duowan", search_player_duowan)


