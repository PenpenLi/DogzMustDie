
local tonumber = tonumber
local now = _commonservice.now
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CDBService 	  = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function get_user_online(req, method, query, reqbody)
	local resbody
    local res = CDBService:SelectCharByPfIDAndServerID(reqbody.uid, reqbody.skey)
    if res and res[1] then
        local res = res[1]
        resbody = {
            errno = 0,
            errmsg = "查询成功",
            data = {
                uid = res.pfid,
                total_online = res.loginlong
            }
        }
        if CCommonFunction.IsSecInToday(res.last_login) then
            resbody.data.day_online = res.todaytime
        else
            resbody.data.day_online = 0
        end
        if res.last_login > res.last_logout then
            resbody.data.lastlogin_online = now(1) - res.last_login
        else
            resbody.data.lastlogin_online = res.last_logout - res.last_login
        end
    else
        resbody = {
            errno = -1,
            errmsg = "参数错误",
        }
    end
    return resbody
end

CHttpServer:RegisterHandler("/get_user_online", get_user_online)


