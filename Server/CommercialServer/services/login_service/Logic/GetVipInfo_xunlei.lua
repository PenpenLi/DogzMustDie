
local protocol  = "http"
local host      = "websvr.niu.xunlei.com"
local api       = "/queryGameJinzuanVip.gameUserInfo"

local tonumber = tonumber
local tostring = tostring
local now = _commonservice.now
local string_format = string.format
local table_concat = table.concat
local table_insert = table.insert
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

local curl_get = _httpservice.curl_get
local CURL		= RequireSingleton("CURL")
local CJSON		= RequireSingleton("CJSON")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function make_url(protocol, host, api, params)
	local url = string_format("%s://%s%s?%s", protocol, host, api, CURL.Encode(params))
	-- print("--url--", url)
	return url
end

local CLogin = RequireSingleton("CLogin")
function CLogin:GetVipInfo(i_tAccountInfo)
    i_tAccountInfo.swjoyVip = 0
	local tParams = {
		gameid = "000346",
		customerid = i_tAccountInfo.openid,
		time = tostring(now(1)),
	}
    local t = {};
	table_insert(t, tParams.gameid);
	table_insert(t, tParams.customerid);
	table_insert(t, tParams.time);
	table_insert(t, "hyidn87d678p0dj7");
	tParams.sign = hex_encode(md5(table_concat(t)), 16)
	
	local url = make_url(protocol, host, api, tParams)
	local rescode, body = curl_get(url)
	if rescode == 200 then
		local realret = CJSON.Decode(body, true)
		if realret then
            if tonumber(realret.code) == 0 then
				if tonumber(realret.isJinzuanVip) == 1 then
					i_tAccountInfo.swjoyVip = tonumber(realret.jinzuanLevel) or 0
				end;
				if tonumber(realret.isAnnualMember) == 1 then
					i_tAccountInfo.swjoyVip = i_tAccountInfo.swjoyVip + 100 
				end
            else
                CCommonFunction.PrintTable(realret)
            end
		else
			print("ERROR!!! call return body:", body)
		end
	else
		print("ERROR!!! call return rescode:", rescode)
	end
end
