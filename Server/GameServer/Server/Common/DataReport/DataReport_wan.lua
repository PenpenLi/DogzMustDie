
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
local serverid  = "S" .. tostring(ServerInfo.serverid)

local Platform = ServerInfo.Platform
local CDataReport = RequireSingleton("CDataReport")

local lwankey = "J5Yl1C50WuKy3W4NnbGvXJIz6Ol3o53W"
local gwankey = "jxbqp"
local wanurl = "game.api.1360.com"

local function report_360wan(i_sPath, i_tContext)
	local urlstr = string_format("%s%s", wanurl, i_sPath)
    loghttp(urlstr, CURL.Encode(i_tContext))
end

function CDataReport:Reportwan_player(i_oPlayer)
    if IsNotDataReport then return end
	local tContext = {
		qid = i_oPlayer:GetOpenID(),
		server_id = serverid,
		gkey = gwankey,
		level = tostring(i_oPlayer:GetLevel()),
		name = i_oPlayer:GetName(),
		job = tostring(i_oPlayer:GetProfID()),
	}
	local t = {
		gwankey,
		tContext.job,
		tContext.level,
		tContext.name,
		tContext.qid,
		serverid,
		lwankey}
	tContext.sign = hex_encode(md5(table_concat(t)), 16)
	report_360wan("/player", tContext)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
    if IsNotDataReport then return end
	local tContext = {
		qid = i_oPlayer:GetOpenID(),
		server_id = serverid,
		gkey = gwankey,
		name = i_oPlayer:GetName(),
		type = tostring(i_nType),
		content = i_sContent,
		time = tostring(now(1)),
		ip = i_oPlayer:GetIP(),
	}
	
	if i_nType == 1 or i_nType == 3 then
		if i_oTarPlayer then
			tContext.toqid = i_oTarPlayer:GetOpenID()
			tContext.toname = i_oTarPlayer:GetName()
		end
	end
	local t = {
		gwankey,
		serverid,
		tContext.qid,
		tContext.name,
		tContext.type,
		tContext.toqid or "",
		tContext.toname or "",
		tContext.content,
		tContext.time,
		tContext.ip,
		lwankey}
	tContext.sign = hex_encode(md5(table_concat(t)), 16)
	report_360wan("/chat", tContext)
end

