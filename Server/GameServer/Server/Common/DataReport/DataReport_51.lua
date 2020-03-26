
local print		= print
local tostring  = tostring
local pairs = pairs
local now = _commonservice.now
local md5 = _commonservice.md5
local base64_encode = _commonservice.base64_encode;
local CJSON = RequireSingleton("CJSON")

local hex_encode = _commonservice.hex_encode
local loghttp   = loghttp

local string_format	= string.format
local string_find   = string.find
local string_gsub   = string.gsub
local table_concat	= table.concat
local table_insert	= table.insert
local string_len    = string.len


local CURL  = RequireSingleton("CURL")
local serverid  = tostring(ServerInfo.serverid)

local Platform = ServerInfo.Platform
local CDataReport = RequireSingleton("CDataReport")

local flag_key = "bc67f773a72ba3353a0117aae522ebb8"

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
    i_sContent = string_gsub(i_sContent, "|", "*")
	local tInfo = {
        tostring(i_oPlayer:GetServerID()), -- server_id = 
        i_oPlayer:GetRoleID(), -- role_id = 
		i_oPlayer:GetName(), -- role_name = 
        i_oPlayer:GetOpenID(), -- account_name = 
        tostring(i_oPlayer:GetLevel()), -- level = 
        "0", -- gold = 
        i_oPlayer:GetIP(), -- ip_addr = 
        tostring(now(1)), -- chat_time = 
		tostring(i_nType), -- channel = 
		i_sContent, -- chat_content = 
	}

    local tParam = {
        site = "51game",
        game = "jxbqp",
        time = tostring(now(1)),
        info = CURL.Encode(table_concat(tInfo, "|") .. "\n")
    }
    local tSigs = {}
    table_insert(tSigs, "game")
	table_insert(tSigs, tParam.game)
    table_insert(tSigs, "info")
	table_insert(tSigs, tParam.info)
    table_insert(tSigs, "site")
	table_insert(tSigs, tParam.site)
    table_insert(tSigs, "time")
	table_insert(tSigs, tParam.time)
	table_insert(tSigs, flag_key)
	tParam.flag = hex_encode(md5(table_concat(tSigs)), 16, true)

    loghttp("gameapi.51.com/chatlog/monitor", CURL.Encode(tParam))
end


