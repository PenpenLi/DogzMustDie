
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
local lkey = "BIKvVI1NRn1NiH9G";
local gameId = "000346";
local function report_xunlei(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

local function report_xunlei_chat(i_sPath, i_sUrl, i_tContext)
	local urlstr = string_format("%s%s", i_sUrl, i_sPath)
    loghttp(urlstr, CURL.Encode(i_tContext))
end

function CDataReport:ReportXunLei_player(i_oPlayer)
	local tContext = {
		userId = i_oPlayer:GetOpenID(),
		gameId = "000346",
		serverId = tostring(i_oPlayer:GetServerID()),
		roleId = i_oPlayer:GetRoleID(),
		roleName = i_oPlayer:GetName(),
		roleLevel = tostring(i_oPlayer:GetLevel()),
		autoLevel = "0",
	}
	report_xunlei("rct.niu.xunlei.com/r/gamerole", tContext)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local sTime = tostring(now(1));
	local tContext = {
		gameid = "000346",
		time = sTime,
	}
	local tbl = {
		["data"] = {{
			serverid = tostring(i_oPlayer:GetServerID()),
			userid = i_oPlayer:GetOpenID(),
			roleid = i_oPlayer:GetRoleID(),
			rolename =  i_oPlayer:GetName(),
			rolelevel = tostring(i_oPlayer:GetLevel()),
			msgtime = sTime,
			msgip = i_oPlayer:GetIP(),
			msgcontent = i_sContent,
			msgchannel = tostring(i_nType),
		}}
	}
	local str = CJSON.Encode(tbl, true)
	
	tContext.info = str;
	local tSigs = {}
	table_insert(tSigs, "000346")
	table_insert(tSigs, sTime)
	table_insert(tSigs, lkey)
	
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	report_xunlei_chat("/chatrecord.do", "lychat.niu.xunlei.com:9876/lychat", tContext)
end


