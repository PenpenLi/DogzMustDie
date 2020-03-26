-- swjoy顺网vip
local tonumber = tonumber
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode
local table_concat = table.concat
local string_format = string.format
local CURL = RequireSingleton("CURL")
local curl_get = _httpservice.curl_get
local CJSON	= RequireSingleton("CJSON")
local PrintTable = RequireSingleton("CCommonFunction").PrintTable

local sKey = "3401"

local CLogin = RequireSingleton("CLogin")
function CLogin:GetVipInfo(i_tAccountInfo)
	i_tAccountInfo.swjoyVip = 0
	local tSigs = {
		i_tAccountInfo.openid,
		"jxbqp.swjoy.com",
		sKey,
	}
	local tParams = {
		guid = i_tAccountInfo.openid,
		sign = hex_encode(md5(table_concat(tSigs)), 16),
	}
	local url = string_format("jxbqp.swjoy.com/front/vip/getvip.do?%s", CURL.Encode(tParams))
	local rescode, body = curl_get(url)
	if rescode == 200 then
		local ret = CJSON.Decode(body, true)
		if ret then
			if tonumber(ret.status) == 0 then
				i_tAccountInfo.swjoyVip = ret.memberVip
			else
				PrintTable(ret)
			end
		else
			print("ERROR!!! call return body:", body)
		end
	else
		print("ERROR!!! call return rescode:", rescode)
	end
end