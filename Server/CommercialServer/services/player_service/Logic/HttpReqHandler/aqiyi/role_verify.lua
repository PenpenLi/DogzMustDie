
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function role_verify(req, method, query, reqbody)
    local resbody
	local res = CDBService:SelectCharByPfIDAndServerID(reqbody.user_id, reqbody.server_id)
    if res and res[1] then
        resbody = {
            success = true,
            data = {
                name = res[1].rolename,
                level = res[1].level,
            }
        }
    else
        resbody = {
            success = false,
            data = -1,
        }
    end

	return resbody
end


CHttpServer:RegisterHandler("/role_verify", role_verify)


