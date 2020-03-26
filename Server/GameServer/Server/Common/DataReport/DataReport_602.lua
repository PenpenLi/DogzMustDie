
local print		= print
local tostring  = tostring
local pairs = pairs
local now = _commonservice.now
local md5 = _commonservice.md5
local CJSON = RequireSingleton("CJSON")

local hex_encode = _commonservice.hex_encode
local loghttp   = loghttp

local string_format	= string.format
local string_find   = string.find
local table_concat	= table.concat
local table_insert	= table.insert

local CDataReport= RequireSingleton("CDataReport")
local lkey = "KVm5wsjD6sKeEPgID3yqQaLZk3L87Ne1"

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local tChat = {{
		serverId = i_oPlayer:GetServerID(), 
		account = i_oPlayer:GetOpenID(), 
		role = i_oPlayer:GetName(), 
		vip = i_oPlayer:GetVipLevel(), 
		level = i_oPlayer:GetLevel(),
		chat = i_sContent,
		time = now(1),
	}}
	local sChat = CJSON.Encode(tChat)
	
	local tContext = {
		gameId 		= "263", 
		chats  		= sChat,
		time 		= now(1),
	}
	local tSigs = {}
	table_insert(tSigs, tContext.gameId)
	table_insert(tSigs, tContext.chats)
	table_insert(tSigs, tContext.time)
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	loghttp("cm.602.com/v2/push", CJSON.Encode(tContext))
end

