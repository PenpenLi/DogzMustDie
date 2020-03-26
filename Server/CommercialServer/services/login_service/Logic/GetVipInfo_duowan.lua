
local tonumber = tonumber
local tostring = tostring
local table_insert = table.insert
local table_concat = table.concat
local string_format = string.format
local now = _commonservice.now
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

local curl_get = _httpservice.curl_get
local CURL		= RequireSingleton("CURL")
local CJSON		= RequireSingleton("CJSON")
local CCommonFunction = RequireSingleton("CCommonFunction")

local CLogin = RequireSingleton("CLogin")

local game = "JXQYBQP"
local taskid = "1001"
local lkey = "054a1a8b592d6b2d8d1cf1f2036f9f9f"
function CLogin:GetVipInfo(i_tAccountInfo)
    i_tAccountInfo.duowanlevel = 0
    local time = tostring(now(1))
    local tSigs = {}
	table_insert(tSigs, game)
	table_insert(tSigs, i_tAccountInfo.openid)
	table_insert(tSigs, taskid)
    table_insert(tSigs, "")
	table_insert(tSigs, time)
	table_insert(tSigs, lkey)
    
    local tParams = {}
    tParams.game = game
    tParams.account = i_tAccountInfo.openid
    tParams.taskId = taskid
    tParams.value = ""
    tParams.time = time
	tParams.sign = hex_encode(md5(table_concat(tSigs)), 16, true)
    
    local url = string_format("http://proxy.udblogin.game.yy.com/yy/lobbygift/query/queryInfo.do?%s", CURL.Encode(tParams))
    
    local rescode, body = curl_get(url)
	if rescode == 200 then
		local ret = CJSON.Decode(body, true)
		if ret then
            if tonumber(ret.status) == 200 then
                i_tAccountInfo.duowanlevel = tonumber(ret.data)
            else
                CCommonFunction.PrintTable(ret)
            end
		else
			print("ERROR!!! call return body:", body)
		end
	else
		print("ERROR!!! call return rescode:", rescode)
	end
end


