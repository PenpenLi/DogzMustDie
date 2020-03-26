
-- global function
local print = print
local logfile = logfile
local pairs = pairs
local type  = type
local tonumber = tonumber
local string_len = string.len
local string_sub = string.sub
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

-- global singleton
local CJSON			= RequireSingleton("CJSON")
local CDBService	= RequireSingleton("CDBService")
-- local
local CYWHttpServer   = RequireSingleton("CYWHttpServer")

-- recv request
local function on_recv_request(req, method, path, query, body, ip)
    query = query or "";
	logfile("--recv request--", ip, method, path, query)
    logfile("--recv body", string_len(body), body)
	CDBService:LogOperation(ip, method, path, query, body);
	return CYWHttpServer:HandleRequest(req, method, path, query, body)
end

function CYWHttpServer:Initialize()
	self.m_pHttpServer = _httpservice.createserver("0.0.0.0", ServerCfg.YWHttpServerPort, on_recv_request)
	return self.m_pHttpServer
end

function CYWHttpServer:Destruct()
	if self.m_pHttpServer then
		_httpservice.freeserver(self.m_pHttpServer)
		self.m_pHttpServer = nil
	end
end

function CYWHttpServer:IsDestructOver()
	return not self.m_pHttpServer
end

function CYWHttpServer:RegisterHandler(i_sPath, i_fHandler)
    self.m_tFuncMap = self.m_tFuncMap or {}
    self.m_tFuncMap[i_sPath] = i_fHandler
end

function CYWHttpServer:HandleRequest(i_pReq, i_sMethod, i_sPath, i_sQuery, i_sBody)
    print("--", i_pReq, i_sMethod, i_sPath, i_sQuery, i_sBody)
    if self.m_tFuncMap[i_sPath] then
        local resbody
        repeat
            local reqbody = CJSON.Decode(i_sBody)
            if type(reqbody) ~= "table" then
                resbody = {
                    errno = -1,
                    errmsg = "参数错误",
                }
                break
            end
            local sig = hex_encode(md5(i_sPath .. "#" .. reqbody.ts .. "#" .. "oIxhPjLhS5_RGu"), 16)
            if sig ~= reqbody.sig then
                print("yw sig error", sig, reqbody.sig)
                 resbody = {
                    errno = -2,
                    errmsg = "sig错误",
                }
                break
            end
            resbody = self.m_tFuncMap[i_sPath](i_pReq, i_sMethod, i_sQuery, reqbody)
            if not resbody then
                return
            end
        until true
        return 200, "OK", CJSON.Encode(resbody)
    else
        return 400, "Bad Request"
	end
end


