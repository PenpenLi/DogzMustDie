
local print		= print
local tostring  = tostring
local now = _commonservice.now
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode
local loghttp   = loghttp
local string_format	= string.format
local table_concat	= table.concat
local table_insert	= table.insert

local CURL  = RequireSingleton("CURL")

local CDataReport = RequireSingleton("CDataReport")
local lkey = "597tkmMw8)r^ITm(kl__b.SVOl5)4L4"

local function report_37wan(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local tContext = {
		game_key = "jianxia", 
		server_id = tostring(i_oPlayer:GetServerID()), 
		time = tostring(now(1)),
		login_account = i_oPlayer:GetOpenID(), 
		actor = i_oPlayer:GetName(), 
		actor_id = i_oPlayer:GetRoleID(),
		content = i_sContent,
		ip = i_oPlayer:GetIP(),
	}
	if i_oTarPlayer then
		tContext.to_login_account = i_oTarPlayer:GetOpenID();
		tContext.to_actor = i_oTarPlayer:GetName();
	end

	local tSigs = {}
	table_insert(tSigs, lkey)
	table_insert(tSigs, tContext.server_id)
	table_insert(tSigs, tContext.login_account)
	table_insert(tSigs, tContext.actor)
	table_insert(tSigs, tContext.actor_id)
	table_insert(tSigs, tContext.content)
	table_insert(tSigs, tContext.time)
	
    tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
    
	report_37wan("api.gamechat.37.com/postChatV2.php", tContext)
end

