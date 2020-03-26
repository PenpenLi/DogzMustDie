
local now = _commonservice.now
local table_insert = table.insert
local string_gmatch = string.gmatch
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function uid_query(req, method, query, reqbody)
    local resbody
	local res = CDBService:SelectCharacterByRoleName(reqbody.skey, reqbody.role_name)
    if res and res[1] then
        res = res[1]
		resbody = {
            errno = 0,
            errmsg = "查询成功",
            data = {
                uid = res.pfid,
				nickname = res.role_name,
                sex = res.occupation == 1 and "m" or "f",
				last_login = res.last_login,
				loginlong = res.loginlong,
                group = 0,
                occupation = res.occupation,
                level = res.level,
				is_valid = (now(1) >= res.banplaytime) and "0" or "1",
                exp = res.exp,
				createtime = res.createts,
            }
        }
    else
        resbody = {
            errno = -2,
            errmsg = "无此角色",
        }
    end
    return resbody
end


CHttpServer:RegisterHandler("/uid_query", uid_query)


