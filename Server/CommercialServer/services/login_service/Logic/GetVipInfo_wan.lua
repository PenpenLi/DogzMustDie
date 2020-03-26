
local gkey = "jxbqp"
local lkey = "J5Yl1C50WuKy3W4NnbGvXJIz6Ol3o53W"
local protocol  = "http"
local host   = "rcapi.360-g.net"
local api    = "/vplan_wan"
local version = "3.0"

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

local function make_url(protocol, host, api, params)
	local url = string_format("%s://%s%s?%s", protocol, host, api, CURL.Encode(params))
	-- print("--url--", url)
	return url
end

local CLogin = RequireSingleton("CLogin")

function CLogin:GetVipInfo(i_tAccountInfo) 
	local time = now(1)
	local tSigs = {}
	table_insert(tSigs, gkey)
	table_insert(tSigs, i_tAccountInfo.openid)
	table_insert(tSigs, time)
	table_insert(tSigs, lkey)
    local tParams = {}
	tParams.sign = hex_encode(md5(table_concat(tSigs)), 16)
    tParams.uid = i_tAccountInfo.openid
	tParams.gkey = gkey
	tParams.time = tostring(time)
	tParams.version = version

	local url = make_url(protocol, host, api, tParams)
	local rescode, body = curl_get(url)
    local ret = {}
	if rescode == 200 then
		local realret = CJSON.Decode(body, true)
		if realret then
            ret = realret
		else
			print("ERROR!!! call return body:", body)
		end
	else
		print("ERROR!!! call return rescode:", rescode)
	end
    
	-- CCommonFunction.PrintTable(ret)
end

-- if not next(res) then
    -- i_tAccountInfo.ok = false
-- else
    -- if res.errno == 0 then
        -- i_tAccountInfo.type    = res.type
        -- i_tAccountInfo.level   = res.level
        -- i_tAccountInfo.is_send  = res.is_send
    -- else
        -- i_tAccountInfo.type  = "N"
    -- end
-- end


