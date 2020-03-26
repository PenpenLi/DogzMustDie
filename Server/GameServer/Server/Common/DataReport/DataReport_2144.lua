
local print		= print
local tostring  = tostring
local pairs = pairs
local now = _commonservice.now
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

local loghttp   = loghttp

local string_format	= string.format
local string_find   = string.find
local table_concat	= table.concat
local table_insert	= table.insert

local CURL  = RequireSingleton("CURL")

local CDataReport = RequireSingleton("CDataReport")

local lkey = "88NzY267zZ!r2567Y332@!67U9@h"

local function report_2144(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

function CDataReport:Report2144_player(i_oPlayer)
	local tContext = {
		gkey = "jxbqp",
		server_id = "s" .. tostring(i_oPlayer:GetServerID()),
		qid = i_oPlayer:GetOpenID(),
		name = i_oPlayer:GetName(),
		level = tostring(i_oPlayer:GetLevel()),
	}
	
	local tSigs = {}
	table_insert(tSigs, tContext.gkey)
	table_insert(tSigs, tContext.level)
	table_insert(tSigs, tContext.name)
	table_insert(tSigs, tContext.qid)
	table_insert(tSigs, tContext.server_id)
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	report_2144("api.web.2144.cn/vendor/level", tContext)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local tContext = {
		gkey = "jxbqp",
		server_id = "s" .. tostring(i_oPlayer:GetServerID()),
		qid = i_oPlayer:GetOpenID(),
		name = i_oPlayer:GetName(),
		type = tostring(i_nType),
		time = tostring(now(1)),
		ip = i_oPlayer:GetIP(),
		content = i_sContent,
	}
	
	if i_nType == 1 or i_nType == 3 then
		if i_oTarPlayer then
			tContext.toqid = i_oTarPlayer:GetOpenID();
			tContext.toname = i_oPlayer:GetName();
		end
	end

	local tSigs = {}
	table_insert(tSigs, tContext.gkey)
	table_insert(tSigs, tContext.server_id)
	table_insert(tSigs, tContext.qid)
	table_insert(tSigs, tContext.name)
	table_insert(tSigs, tContext.type)
	table_insert(tSigs, tContext.toqid or "")
	table_insert(tSigs, tContext.toname or "")
	table_insert(tSigs, tContext.content)
	table_insert(tSigs, tContext.time)
	table_insert(tSigs, tContext.ip)
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	
	report_2144("api.web.2144.cn/vendor/chat", tContext)
end


