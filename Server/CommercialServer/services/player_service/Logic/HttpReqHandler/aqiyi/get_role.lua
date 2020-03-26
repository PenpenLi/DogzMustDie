
local string_gmatch = string.gmatch
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local Sec2Calendar = RequireSingleton("CCommonFunction").Sec2Calendar


local function get_role(req, method, query, reqbody)
    local resbody = {
        status = 0,
        message = "请求成功",
        data = {}
    }
    local have_role = false
    for serverid in string_gmatch(reqbody.server_ids, "(%d+)") do
        local res = CDBService:SelectCharByPfIDAndServerID(reqbody.user_id, serverid)
        if res and res[1] then
            have_role = true
            resbody.data[serverid] ={ 
                {
                    name = res[1].rolename,
                    level = res[1].level,
                    create_time = Sec2Calendar(res[1].createts, true),
                }
            }
        end
    end
    if not have_role then
        resbody.status = -6
        resbody.message = "用户不存在"
    end

	return resbody
end


CHttpServer:RegisterHandler("/get_role", get_role)


