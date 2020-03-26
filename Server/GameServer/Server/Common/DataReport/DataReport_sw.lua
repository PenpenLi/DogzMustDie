
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
local lkey = "swjoyDLErolerl&54&43lLd7U9@h"

local function report_duowan(i_sPath, i_sUrl, i_tContext)
	local urlstr = string_format("%s%s", i_sUrl, i_sPath)
    loghttp(urlstr, CURL.Encode(i_tContext))
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	-- if IsNotDataReport then return end
	local tContext = {
		server_id = tostring(i_oPlayer:GetServerID()), 
		from_uid = tostring(i_oPlayer:GetOpenID()), 
		from_role = i_oPlayer:GetName(), 
		content = i_sContent,
		ip = i_oPlayer:GetIP(),
		time = tostring(now(1)),
		type = tostring(i_nType),
	}
	if i_oTarPlayer then
		tContext.to_uid = tostring(i_oTarPlayer:GetOpenID());
		tContext.to_role = i_oTarPlayer:GetName();
	end

	local tSigs = {}
	table_insert(tSigs, tostring(i_oPlayer:GetServerID()))
	table_insert(tSigs, tostring(i_oPlayer:GetOpenID()))
	table_insert(tSigs, i_oPlayer:GetName())
	table_insert(tSigs, tContext.type)
	table_insert(tSigs, tContext.to_uid or "")
	table_insert(tSigs, tContext.to_role or "")
	table_insert(tSigs, tContext.content)
	table_insert(tSigs, tostring(tContext.time))
	table_insert(tSigs, tostring(tContext.ip))
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	
	report_duowan("/chat.do", "jxbqp.swjoy.com/push", tContext)
end

