
local print		= print
local tostring  = tostring
local pairs = pairs
local now = _commonservice.now
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode
local loghttp   = loghttp
local log360 = log360
local IsNotDataReport = ServerInfo.IsNotDataReport

local string_format	= string.format
local string_find   = string.find
local table_concat	= table.concat
local table_insert	= table.insert

local CURL  = RequireSingleton("CURL")
local serverid  = tostring(ServerInfo.serverid)

local Platform = ServerInfo.Platform
local CDataReport = RequireSingleton("CDataReport")
local lkey = "E8m1vhHsW7H09XRs2CBvTwaqDRPGeHkB"
local gkey = "jxbqp"
local url = "rcapi.youxi.com"

local function report_360(i_sPath, i_tContext)
	local urlstr = string_format("%s%s", url, i_sPath)
    loghttp(urlstr, CURL.Encode(i_tContext))
end

function CDataReport:Report360_player(i_oPlayer)
    if IsNotDataReport then return end
	local tContext = {
		qid = i_oPlayer:GetOpenID(),
		server_id = serverid,
		gkey = gkey,
		level = tostring(i_oPlayer:GetLevel()),
		name = i_oPlayer:GetName(),
		job = tostring(i_oPlayer:GetProfID()),
	}
	local t = {
		gkey,
		tContext.job,
		tContext.level,
		tContext.name,
		tContext.qid,
		serverid,
		lkey}

	tContext.sign = hex_encode(md5(table_concat(t)), 16)
	report_360("/player_youxi", tContext)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
    if IsNotDataReport then return end
	local tContext = {
		qid = i_oPlayer:GetOpenID(),
		server_id = serverid,
		gkey = gkey,
		name = i_oPlayer:GetName(),
		type = tostring(i_nType),
		content = i_sContent,
		ip = i_oPlayer:GetIP(),
		time = tostring(now(1)),
	}

	if i_nType == 1 or i_nType == 3 then
		if i_oTarPlayer then
			tContext.toqid = i_oTarPlayer:GetOpenID()
			tContext.toname = i_oTarPlayer:GetName()
		end
	end
	local t = {
		gkey,
		serverid,
		tContext.qid,
		tContext.name,
		tContext.type,
		tContext.toqid or "",
		tContext.toname or "",
		tContext.content,
		tContext.time,
		tContext.ip,
		lkey}
	tContext.sign = hex_encode(md5(table_concat(t)), 16)
	report_360("/chat_youxi", tContext)
end

