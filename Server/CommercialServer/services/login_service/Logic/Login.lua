
local Platform = ServerCfg.Platform or "youxi"

local table_concat = table.concat
local table_insert = table.insert
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode

local CCommonFunction = RequireSingleton("CCommonFunction")
local CCenter = RequireSingleton("CCenter")
local CDBService = RequireSingleton("CDBService")

local lkey
if Platform == "wan" then
	lkey = "J5Yl1C50WuKy3W4NnbGvXJIz6Ol3o53W"
else
	lkey = "E8m1vhHsW7H09XRs2CBvTwaqDRPGeHkB"
end

local CLogin = RequireSingleton("CLogin")

function CLogin:GetVipInfo()
end

function CLogin:CheckLoginSignWan(i_nServerID, i_tAccountInfo)
	local t = {};
	table_insert(t, "qid="..i_tAccountInfo.openid);
	table_insert(t, "&time="..i_tAccountInfo.time);
	table_insert(t, "&server_id=S"..i_tAccountInfo.serverid);
	table_insert(t, lkey);
	local sign = hex_encode(md5(table_concat(t)), 16)
	if sign == i_tAccountInfo.sign then
		i_tAccountInfo.ok = true
	else
		CCommonFunction.PrintTable(i_tAccountInfo)
	end
end

function CLogin:CheckLoginSignYouxi(i_nServerID, i_tAccountInfo)
	local t = {
		i_tAccountInfo.openid,
		i_tAccountInfo.platform,
		i_tAccountInfo.gkey,
		i_tAccountInfo.serverid,
		i_tAccountInfo.time,
		i_tAccountInfo.is_adult,
		i_tAccountInfo.exts,
		"#",
		lkey,
	}
	local sign = hex_encode(md5(table_concat(t)), 16)
	if sign == i_tAccountInfo.sign then
		i_tAccountInfo.ok = true
	else
		CCommonFunction.PrintTable(i_tAccountInfo)
	end
end

local IsDebug = ServerCfg.IsDebug
function CLogin:PlayerLoginReq(i_nServerID, i_tAccountInfo)
    -- 先验证登陆sign
    if IsDebug then
        i_tAccountInfo.ok = true
    else 
		if Platform == "wan" then
			self:CheckLoginSignWan(i_nServerID, i_tAccountInfo)
		else
			self:CheckLoginSignYouxi(i_nServerID, i_tAccountInfo)
		end
    end
    -- 再验证封号
    if i_tAccountInfo.ok then
        -- 加载玩家禁言时间
        local res = CDBService:SelectBanInfoByPfIDAndServerID(i_tAccountInfo.openid, i_tAccountInfo.serverid)
        if res and res[1] then
            i_tAccountInfo.banspeaktime = res[1].banspeaktime
            i_tAccountInfo.banplaytime = res[1].banplaytime
        end
        -- 查看是否被封mac
        res = CDBService:SelectLockMac(i_tAccountInfo.mac)
        if res and res[1] and res[1].count > 0 then
            i_tAccountInfo.ok = false
        end
    end
    -- 再根据不同平台取不同的平台特权
    if i_tAccountInfo.ok and not IsDebug then
        self:GetVipInfo(i_tAccountInfo)
    end
    -- 返回结果给游戏逻辑服
    CCenter:Send("CT_PlayerLoginRes", i_nServerID, i_tAccountInfo)
end

defineS.S_PlayerLoginReq = function(i_nServerID, i_tAccountInfo)
    CLogin:PlayerLoginReq(i_nServerID, i_tAccountInfo)
end


