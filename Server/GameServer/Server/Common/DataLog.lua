
local delog		= delog
local type		= type
local pairs		= pairs
local ipairs	= ipairs
local tostring  = tostring
local string_format = string.format

local logdb     = logdb
local now       = _commonservice.now

local IsNotDataLog = ServerInfo.IsNotDataLog

local dist_id = ServerInfo.serverdistid or 0

local CDataLog = RequireSingleton("CDataLog")

function CDataLog:SetDistrictLogDBIndex(i_sDistrictLogDBIndex)
    self.m_sDistrictLogDBIndex = i_sDistrictLogDBIndex
    delog("district_logindex", self.m_sDistrictLogDBIndex)
end

function CDataLog:SetPublicLogDBIndex(i_sPublicLogDBIndex)
    self.m_sPublicLogDBIndex = i_sPublicLogDBIndex
    delog("Publiclogdbindex", self.m_sPublicLogDBIndex)
end

function CDataLog:GetDistrictLogDBIndex( )
    return self.m_sDistrictLogDBIndex
end

function CDataLog:GetPublicLogDBIndex( )
    return self.m_sPublicLogDBIndex
end

function CDataLog:LogDistrictDB(i_sSql)
    if self.m_sDistrictLogDBIndex then
        logdb(self.m_sDistrictLogDBIndex, i_sSql)
    else
        delog("WARNING!!! districlogdbindex is nil.")
    end
end

function CDataLog:LogPublicDB(i_sSql)
    -- if IsNotDataLog then return end
    if self.m_sPublicLogDBIndex then
        logdb(self.m_sPublicLogDBIndex, i_sSql)
    else
        delog("WARNING!!! publiclogdbindex is nil.")
    end
end

-- 添加账号表
local str_account_log = "insert account_info( gyyx_lf, dist_id, account_id, role_id, role_name, money, vip_lv, sharer, update_time ) values('%s', '%d', '%s', '%s', '%s', '%d', '%d', '%s', NOW())"
function CDataLog:LogDistAccount_log(  gyyx_lf, account_id, role_id, role_name, money, vip_lv, sharer )
    self:LogDistrictDB(string_format( str_account_log, gyyx_lf, dist_id, account_id, role_id, role_name, money, vip_lv, sharer ) )
end

-- 更新账号表
local str_account_update = "update account_info set role_name = '%s', money = '%d', vip_lv = '%d', update_time = NOW()  where role_id = '%s'"
function CDataLog:UpdateDistAccount_log(  role_name, role_id, money, vip_lv )
    self:LogDistrictDB(string_format( str_account_update, role_name, money, vip_lv,  role_id) )
end

-- 创建充值日志
local str_credit_log = "insert credit_log(gyyx_lf, dist_id, account_id, role_id, role_lv, money, source, order_no, update_time ) values('%s', '%d', '%s', '%s', '%d', '%d', '%s', '%s', NOW())"
function CDataLog:LogDistCredit_log( gyyx_lf, account_id, role_id, role_lv, money, source,  order_no )
    self:LogDistrictDB(string_format( str_credit_log, gyyx_lf, dist_id, account_id, role_id, role_lv, money, source, order_no ) )
end

-- 创建角色升级日志
local str_level_log = "insert level_log(gyyx_lf, dist_id, account_id, role_id, role_lv, update_time ) values('%s', '%d', '%s', '%s', '%d', NOW())"
function CDataLog:LogDistLevel_log( gyyx_lf, account_id, role_id, role_lv )
    self:LogDistrictDB(string_format( str_level_log, gyyx_lf, dist_id, account_id, role_id, role_lv ) )
end

-- 创建账号登录/登出日志
local str_login_log = "insert login_log(gyyx_lf, account_id, login_type, client_model, mac, imei, ifa, ifv, online_sec, ip, update_time ) values('%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%d', '%s', NOW())"
function CDataLog:LogPublicLogin_log( gyyx_lf, account_id, login_type, client_model, mac, imei, ifa, ifv, online_sec, ip )
    self:LogDistrictDB(string_format( str_login_log, gyyx_lf, account_id, login_type, client_model, mac, imei, ifa, ifv, online_sec, ip ) )
end

-- 创建账号在线日志
local str_online_log = "insert online_log(gyyx_lf, dist_id, account_id, update_time ) values('%s', '%d', '%s', NOW())"
function CDataLog:LogDistOnline_log( gyyx_lf, account_id )
    self:LogDistrictDB(string_format( str_online_log, gyyx_lf, dist_id, account_id ) )
end

-- 创建分享日志
local str_share_log = "insert share_log(gyyx_lf, dist_id, account_id, share_type, update_time ) values('%s', '%d', '%s', '%s', NOW())"
function CDataLog:LogDistShare_log( gyyx_lf, account_id, share_type )
    self:LogDistrictDB(string_format( str_share_log, gyyx_lf, dist_id, account_id, share_type ) )
end

-- 创建消费日志
local str_cost_log = "insert cost_log(gyyx_lf, dist_id, account_id, role_id, role_lv, cost_type, cost_name, money, quantity, update_time ) values('%s', '%d', '%s', '%s', '%d', '%s', '%s', '%d', '%d', NOW())"
function CDataLog:LogDistCost_log( gyyx_lf, account_id, role_id, role_lv, cost_type, cost_name, money, quantity )
    self:LogDistrictDB(string_format( str_cost_log, gyyx_lf, dist_id, account_id, role_id, role_lv, cost_type, cost_name, money, quantity ) )
end

-- -- 创建玩法日志表
local str_play_log = "insert play_log(gyyx_lf, dist_id, account_id, role_id, role_lv, play_type, play_name, op_type, is_success, use_time, update_time ) values('%s', '%d', '%s', '%s', '%d', '%s', '%s', '%d', '%d', '%d', NOW())"
function CDataLog:LogDistPlay_log( gyyx_lf, account_id, role_id, role_lv, play_type, play_name, op_type, is_success, use_time )
    self:LogDistrictDB(string_format( str_play_log, gyyx_lf, dist_id, account_id, role_id, role_lv, play_type, play_name, op_type, is_success, use_time ) )
end

-------- 以下废弃 仅供参考------------------------
local str_log_mail = "call log_mail('%s', '%d', '%d', '%d', '%s')"
function CDataLog:GameLogGotMail(i_sRoleID, i_sMailID, i_nState, i_nTs, i_sItem)
    -- self:LogGameDB(string_format(str_log_mail, i_sRoleID, i_sMailID, i_nState, i_nTs, i_sItem))
end

local str_log_gold = "call log_gold('%s', '%d', '%d', '%d')"
function CDataLog:GameLogGold(i_sRoleID, i_nValue, i_nType, i_nTs)
    -- self:LogGameDB(string_format(str_log_gold, i_sRoleID, i_nValue, i_nType, i_nTs))
end

local str_log_bindgold = "call log_bindgold('%s', '%d', '%d', '%d')"
function CDataLog:GameLogBindGold(i_sRoleID, i_nValue, i_nType, i_nTs)
    -- self:LogGameDB(string_format(str_log_bindgold, i_sRoleID, i_nValue, i_nType, i_nTs))
end

local str_log_item = "call log_item('%s', '%d', '%d', '%d', '%d')"
function CDataLog:GameLogItem(i_sRoleID, i_nItemID, i_nNum, i_nType, i_nTs)
    -- self:LogGameDB(string_format(str_log_item, i_sRoleID, i_nItemID, i_nNum, i_nType, i_nTs))
end

local str_log_charge_offline = "call log_charge_offline('%d', '%s', '%d', '%s', '%s')"
function CDataLog:GameLogChargeOffline(i_nServerID, i_sRoleID, i_nGold, i_sOrderID, i_nMoney)
    -- self:LogGameDB(string_format(str_log_charge_offline, i_nServerID, i_sRoleID, i_nGold, i_sOrderID, i_nMoney))
end

local str_log_bekick = "call log_bekick('%d', '%s', '%d')"
function CDataLog:GameLogBekick(i_nServerID, i_sRoleID, i_nReason)
    -- self:LogGameDB(string_format(str_log_bekick, i_nServerID, i_sRoleID, i_nReason))
end

local str_log_level = "call log_level('%s', '%d', '%d')"
function CDataLog:GameLogLevelUp(i_sRoleID, i_nLevel, i_nTs)
    -- self:LogGameDB(string_format(str_log_level, i_sRoleID, i_nLevel, i_nTs))
end

local str_log_login = "call log_login('%d', '%s', '%s', '%s', '%s', '%d')"
function CDataLog:GameLogLogin(i_nServerID, i_sOpenID, i_sRoleID, i_sIP, i_sMAC, i_nLevel)
    -- self:LogGameDB(string_format(str_log_login, i_nServerID, i_sOpenID, i_sRoleID, i_sIP, i_sMAC, i_nLevel))
end

local str_log_marry_info = "call log_marry_info('%s', '%s', '%d')"
function CDataLog:GameLogMarryInfo(i_sRoleId, i_sMarryId, i_nType)
    -- self:LogGameDB(string_format(str_log_marry_info, i_sRoleId, i_sMarryId, i_nType))
end


local str_gsp_log_regist = "insert ignore log_account(serverid, pf, openid, ts) values('%d', '%s', '%s', '%d')"
function CDataLog:GspLogRegist(i_nServerID, i_sPF, i_sOpenID)
    -- self:LogGspDB(string_format(str_gsp_log_regist, i_nServerID, i_sPF, i_sOpenID, now(1)))
end

local str_gsp_log_create_char = "insert ignore log_role(serverid, pf, openid, roleid, rolename, ts) values('%d', '%s', '%s', '%s', '%s', '%d')"
function CDataLog:GspLogCreateChar(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_sRoleName)
    -- self:LogGspDB(string_format(str_gsp_log_create_char, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_sRoleName, now(1)))
end

local str_gsp_log_role_rename = "update log_role set rolename = '%s' where roleid = '%s'"
function CDataLog:GspLogRoleRename(i_sRoleID, i_sRoleName)
    -- self:LogGspDB(string_format(str_gsp_log_role_rename, i_sRoleName, i_sRoleID))
end

local str_gsp_log_login = "insert log_login(serverid, pf, openid, roleid, rolelevel, rolevip, rolefaction, ip, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%s', '%d')"
function CDataLog:GspLogPlayerEverydayEnter(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_sIP, i_nCamp)
    -- self:LogGspDB(string_format(str_gsp_log_login, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nCamp, i_sIP, now(1)))
end

local str_gsp_log_enter = "insert log_enter(serverid, pf, openid, roleid, rolelevel, rolevip, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d')"
function CDataLog:GspLogPlayerEveryday5Min(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip)
    -- self:LogGspDB(string_format(str_gsp_log_enter, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, now(1)))
end

local str_gsp_log_out = "update log_role set logout = '%d' where roleid = '%s'"
function CDataLog:GspLogPlayerLogout(i_sRoleID)
    -- self:LogGspDB(string_format(str_gsp_log_out, now(1), i_sRoleID))
end

local str_gsp_log_online = "insert log_online(serverid, number, ts) values('%d', '%d', '%d')"
function CDataLog:GspLogOnlinePlayerNum(i_nServerID, i_nPlayerNum)
    -- self:LogGspDB(string_format(str_gsp_log_online, i_nServerID, i_nPlayerNum, now(1)))
end

local str_gsp_log_charge = "insert log_recharge(serverid, pf, openid, roleid, rolelevel, rolevip, type, amount, gain, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d')"
function CDataLog:GspLogCharge(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nGain)
    -- self:LogGspDB(string_format(str_gsp_log_charge, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nGain, now(1)))
end

local str_gsp_log_server_data = "insert log_daily(serverid, type, number, ts) values('%d', '%d', '%s', '%d')"
function CDataLog:GspLogServerData(i_nServerID, i_nType, i_nAmount)
    -- self:LogGspDB(string_format(str_gsp_log_server_data, i_nServerID, i_nType, i_nAmount, now(1)))
end

local str_gsp_log_grow = "insert log_grow(serverid, pf, openid, roleid, type, subtype, record, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d') on duplicate key update record = '%d', ts = '%d'";
function CDataLog:GspLogGrow(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nType, i_nSubType, i_nLevel)
    -- local nNow = now(1)
    -- self:LogGspDB(string_format(str_gsp_log_grow, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nType, i_nSubType, i_nLevel, nNow, i_nLevel, nNow))
end

local str_gsp_log_pve_in = "insert log_pve_in(serverid, pf, openid, roleid, rolelevel, rolevip, type, subtype, level, record, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d')";
function CDataLog:GspLogPveIn(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord)
    -- local nNow = now(1)
    -- self:LogGspDB(string_format(str_gsp_log_pve_in, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord, nNow))
end

local str_gsp_log_pve_out = "insert log_pve_out(serverid, pf, openid, roleid, rolelevel, rolevip, type, subtype, level, record, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d')";
function CDataLog:GspLogPveOut(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord)
    -- local nNow = now(1)
    -- self:LogGspDB(string_format(str_gsp_log_pve_out, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord, nNow))
end

local str_gsp_log_pvp_in = "insert log_pvp_in(serverid, pf, openid, roleid, rolelevel, rolevip, type, subtype, level, record, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d')";
function CDataLog:GspLogPvpIn(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord)
    -- local nNow = now(1)
    -- self:LogGspDB(string_format(str_gsp_log_pvp_in, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord, nNow))
end

local str_gsp_log_pvp_out = "insert log_pvp_out(serverid, pf, openid, roleid, rolelevel, rolevip, type, subtype, level, record, ts) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d')";
function CDataLog:GspLogPvpOut(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord)
    -- local nNow = now(1)
    -- self:LogGspDB(string_format(str_gsp_log_pvp_out, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nSubType, i_nLevel, i_nRecord, nNow))
end

local str_gsp_log_gem = "insert log_gem(serverid, pf, openid, roleid, rolelevel, rolevip, type, amount, remain, ts, context) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%s')";
local str_context = '{"itemid":"%s","itemnum":"%s"}'
function CDataLog:GspLogGem(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nRemain, i_nItemID, i_nNum)
    -- local nNow = now(1)
    -- local sContext = ""
    -- if i_nItemID then
        -- sContext = string_format(str_context, i_nItemID, i_nNum)
    -- end
    -- self:LogGspDB(string_format(str_gsp_log_gem, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nRemain, nNow, sContext))
end

local str_gsp_log_gem_bind = "insert log_gem_bind(serverid, pf, openid, roleid, rolelevel, rolevip, type, amount, remain, ts, context) values('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%s')";
local str_context = '{"itemid":"%s","itemnum":"%s"}'
function CDataLog:GspLogGemBind(i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nRemain, i_nItemID, i_nNum)
    -- local nNow = now(1)
    -- local sContext = ""
    -- if i_nItemID then
        -- sContext = string_format(str_context, i_nItemID, i_nNum)
    -- end
    -- self:LogGspDB(string_format(str_gsp_log_gem_bind, i_nServerID, i_sPF, i_sOpenID, i_sRoleID, i_nRoleLevel, i_nRoleVip, i_nType, i_nAmount, i_nRemain, nNow, sContext))
end

