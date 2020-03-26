
local type = type
local tonumber = tonumber
local string_match = string.match
local now   = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CRechargeService = RequireSingleton("CRechargeService")
local CCommonFunction   = RequireSingleton("CCommonFunction")
local CURL = RequireSingleton("CURL");
local CJSON = RequireSingleton("CJSON");
local Platform = ServerCfg.Platform or "youxi"
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

local function get_recharge_info(req, method, query, reqbody)
	-- print("=====rechargenew=====", reqbody["commonParam"], req, method, query, reqbody);
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    if reqbody.roleid and reqbody.roleid ~= "" then
    	resbody.info = CDBService:SelectChargeInfoByRoleid(reqbody.roleid)
    else
    	resbody.info = CDBService:SelectPlayerChargeInfo()
    end
    return resbody
end

CHttpServer:RegisterHandler("/get_recharge_info", get_recharge_info)