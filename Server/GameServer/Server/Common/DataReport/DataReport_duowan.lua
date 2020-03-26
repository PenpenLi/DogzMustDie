
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

local CURL  = RequireSingleton("CURL")
local serverid  = tostring(ServerInfo.serverid)

local Platform = ServerInfo.Platform
local CDataReport = RequireSingleton("CDataReport")
local lkey = "054a1a8b592d6b2d8d1cf1f2036f9f9f";

local function report_duowan(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

function CDataReport:ReportDuowan_player(i_oPlayer)
	local tJson_data = {
		game_event = "level_change",
		role_name = i_oPlayer:GetName(),
		role_level = tostring(i_oPlayer:GetLevel()),
		fight_cap = tostring(i_oPlayer:GetCombatPower()),
		job = tostring(i_oPlayer:GetProfID()),
	}
	
	local str = CJSON.Encode(tJson_data)
	local tContext = {
		act = "/game_profile", 
		ya_appid = "udblogin",
		udbid = tostring(i_oPlayer:GetOpenID()),
		pas = "",
		pro = "logingame",
		gam = "JXQYBQP",
		gse = "s" .. tostring(i_oPlayer:GetServerID()),
		json_data = str,
	}
	report_duowan("stat.game.yy.com/data.do", tContext)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local tContext = {
		chat_content = i_sContent,
		from_user_role_name = i_oPlayer:GetName(),
		game_scene_id = tostring(i_oPlayer:GetMap():GetCfgID()),
		server_id = "s" .. tostring(i_oPlayer:GetServerID()),
		game_id = "JXQYBQP",
	}
	
	if i_nType == 1 or i_nType == 3 then
		if i_oTarPlayer then
			tContext.to_user_role_name = i_oTarPlayer:GetName();
			tContext.message_type = "1";
		else
			tContext.message_type = "2";
		end
	else
		tContext.to_user_role_name = i_oPlayer:GetName();
		tContext.message_type = "2";
	end
	report_duowan("client.garbage.game.yy.com/collect.do", tContext)
end


