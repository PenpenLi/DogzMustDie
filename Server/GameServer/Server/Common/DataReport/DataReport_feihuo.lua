
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
local table_concat	= table.concat
local table_insert	= table.insert
local string_len    = string.len


local CURL  = RequireSingleton("CURL")
local serverid  = tostring(ServerInfo.serverid)

local Platform = ServerInfo.Platform
local CDataReport = RequireSingleton("CDataReport")
local lkey = "feihuojxbqpfeiqu344";

local function report_feihuo(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local sName = CURL.Encode(i_oPlayer:GetName());
	local sContent = CURL.Encode(i_sContent)
	local tContext = {
		userid = i_oPlayer:GetOpenID(),
		rolename = base64_encode(sName, string_len(sName)),
		time = tostring(now(1)),
		gameid = "84",
		serverid = tostring(i_oPlayer:GetServerID()),
		content = base64_encode(sContent, string_len(sContent)),
	}
	if i_nType == 1 or i_nType == 3 then
		if i_oTarPlayer then
			tContext.type = "1";
		else
			tContext.type = "2";
		end
	else
		tContext.type = "2";
	end

	local tSigs = {}
	table_insert(tSigs, tContext.content)
	table_insert(tSigs, tContext.gameid)
	table_insert(tSigs, tContext.rolename)
	table_insert(tSigs, tContext.serverid)
	table_insert(tSigs, tContext.time)
	table_insert(tSigs, tContext.type)
	table_insert(tSigs, tContext.userid)
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	
	report_feihuo("plat.feihuo.com/talk/index", tContext)
end


