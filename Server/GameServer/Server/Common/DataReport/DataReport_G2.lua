
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

local CDataReport= RequireSingleton("CDataReport")
local lkey = "E8m1vhHsW7H09XRs2CBvTwaqDRPGeHkB";   --

local function report_G2(i_sUrl, i_tContext)
	local urlstr = string_format("%s?%s", i_sUrl, CURL.Encode(i_tContext))
    loghttp(urlstr)
end

-- i_nType : 1 私聊；2 喇叭；3 邮件；4 世界；5 国家；6 工会/帮会；7 队伍；8 附近；9 其他
function CDataReport:Reportchat(i_oPlayer, i_nType, i_sContent, i_oTarPlayer)
	local tChat = {
		pid = "1",
		gkey = "jxbqp",
		level = tostring(i_oPlayer:GetLevel()),
		name = i_oPlayer:GetName(),
		playid = i_oPlayer:GetRoleID(),		
		qid = i_oPlayer:GetOpenID(),	
		server_id = tostring(i_oPlayer:GetServerID()), 	
		toptype = "1",		
		topvalue = "0",		
	}

	local tSigs = {}
	table_insert(tSigs, tContext.gkey)
	table_insert(tSigs, tContext.level)
	table_insert(tSigs, tContext.name)
	table_insert(tSigs, tContext.playid)
	table_insert(tSigs, tContext.qid)
	table_insert(tSigs, tContext.server_id)
	table_insert(tSigs, tContext.toptype)
	table_insert(tSigs, tContext.topvalue)
	table_insert(tSigs, lkey)
	tContext.sign = hex_encode(md5(table_concat(tSigs)), 16)
	report_G2("api.mas.g2.cn/updatePlayerInfo.php", tContext)
end

