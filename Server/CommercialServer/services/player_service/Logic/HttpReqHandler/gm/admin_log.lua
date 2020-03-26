
local ipairs = ipairs
local pairs = pairs
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")

local function admin_log(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
    local res 
	if reqbody.cmd.type == "" then
		res = CDBService:SelectFromAdminLogNoType(reqbody.cmd.start_time, reqbody.cmd.end_time, reqbody.target.server_id)
	else
		res = CDBService:SelectFromAdminLog(reqbody.cmd.start_time, reqbody.cmd.end_time, reqbody.target.server_id, reqbody.cmd.type)
	end
    if res then
        resbody.data = res
    end
    
    return resbody
end

CHttpServer:RegisterHandler("/admin_log", admin_log)


