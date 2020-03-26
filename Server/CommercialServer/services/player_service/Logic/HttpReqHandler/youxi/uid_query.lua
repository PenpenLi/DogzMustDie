--360 youxi平台角色信息查询
local table_insert = table.insert
local string_gmatch = string.gmatch
local now = _commonservice.now
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
                uid = v.pfid,
				nickname = v.rolename,  
				last_login = v.last_login,
				loginlong = v.loginlong,
                occupation = v.occupation,
                level = v.level,
				is_valid = (now(1) >= v.banplaytime) and "0" or "1",
                exp = v.exp,
				createtime = v.createts,
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


