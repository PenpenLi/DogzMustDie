
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CDBService  = RequireSingleton("CDBService")

local function rich_rank(req, method, query, reqbody)
	return {
        errno = -3,
        errmsg = "查询失败",
    }
end

CHttpServer:RegisterHandler("/rich_rank", rich_rank)