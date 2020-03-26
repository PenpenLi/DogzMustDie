
-- global function
local print = print
local logfile = logfile
local pairs = pairs
local type  = type
local tonumber = tonumber
local string_len = string.len
local string_sub = string.sub
-- global singleton
local CJSON			= RequireSingleton("CJSON")
local CDBService	= RequireSingleton("CDBService")
-- local
local CHttpServer   = RequireSingleton("CHttpServer")

-- recv request
local function on_recv_request(req, method, path, query, body, ip)
    query = query or "";
	logfile("--recv request--", ip, method, path, query)
    logfile("--recv body", string_len(body), body)
	CDBService:LogOperation(ip, method, path, query, body);
	return CHttpServer:HandleRequest(req, method, path, query, body)
end

function CHttpServer:Initialize()
	self.m_pHttpServer = _httpservice.createserver(ServerCfg.HttpServerIP, ServerCfg.HttpServerPort, on_recv_request)
	return self.m_pHttpServer
end

function CHttpServer:Destruct()
	if self.m_pHttpServer then
		_httpservice.freeserver(self.m_pHttpServer)
		self.m_pHttpServer = nil
	end
end

function CHttpServer:IsDestructOver()
	return not self.m_pHttpServer
end

function CHttpServer:RegisterHandler(i_sPath, i_fHandler)
    self.m_tFuncMap = self.m_tFuncMap or {}
    -- print("Log!!! RegisterHandler.", i_sPath)
    if self.m_tFuncMap[i_sPath] then
        print("ERROR!!! request handler overwrite!", i_sPath)
    end
    self.m_tFuncMap[i_sPath] = i_fHandler
end

function CHttpServer:HandleRequest(i_pReq, i_sMethod, i_sPath, i_sQuery, i_sBody)
    if self.m_tFuncMap[i_sPath] then
        local resbody
        repeat
            local reqbody = CJSON.Decode(i_sBody, true)
            -- if type(reqbody) ~= "table" then
            --     resbody = {
            --         errno = -2,
            --         errmsg = "参数错误",
            --     }
            --     break
            -- end
            resbody = self.m_tFuncMap[i_sPath](i_pReq, i_sMethod, i_sQuery, reqbody);
            if not resbody then
                return;
            end
        until true
        return 200, "OK", CJSON.Encode(resbody, true)
    else
        return 400, "Bad Request"
	end
end


