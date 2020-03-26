
local lkey = "9c0318119dc03ec8d8506972a01fec76"
local protocol  = "http"
local host      = "gameapi.game.iqiyi.com"
local api       = "/gamecenter/GCGame.getVipStatus"
local version = "3.0"

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
    i_tAccountInfo.aqiyilevel = 0
	local tParams = {
		game_id = "5843",
		user_id = i_tAccountInfo.openid,
		time = tostring(now(1)),
		agent = "pps",
	}
    local t = {};
	table_insert(t, "game_id=".. tParams.game_id);
	table_insert(t, "&agent=".. tParams.agent);
	table_insert(t, "&user_id=".. tParams.user_id);
	table_insert(t, "&time=".. tParams.time);
	table_insert(t, "&key=".. lkey);
	tParams.sign = hex_encode(md5(table_concat(t)), 16)
	
	local url = make_url(protocol, host, api, tParams)
	local rescode, body = curl_get(url)
	if rescode == 200 then
		local realret = CJSON.Decode(body, true)
		if realret then
            if tonumber(realret.code) == 1 then
                i_tAccountInfo.aqiyilevel = realret.data.is_vip
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