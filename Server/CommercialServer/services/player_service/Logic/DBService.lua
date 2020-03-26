
-- global function
local string_format	= string.format
local table_insert = table.insert
local table_concat = table.concat
local now       = _commonservice.now

-- global singleton
local CDBService = RequireSingleton("CDBService")


local create_char_str = "insert `characters` set `pfid` = '%s', `serverid` = '%d', `roleid` = '%s', `rolename` = '%s', `createts` = '%s', `occupation` = '%s', `level` = '%s', `exp` = '%s'"
function CDBService:CreateChar(i_tData)
    self:Execute(string_format(create_char_str, i_tData.pfid, i_tData.serverid, i_tData.roleid, i_tData.rolename, i_tData.ts, i_tData.occupation, i_tData.level, i_tData.exp))
end
local char_rename_str = "update `characters` set rolename = '%s' where rolename = '%s'"
function CDBService:OnCharRename(i_sNewName, i_sOldName)
    self:Execute(string_format(char_rename_str, i_sNewName, i_sOldName))
end

local str_key_value_equal = "`%s` = '%s'";
local str_key_value_add_equal = "`%s` = `%s` + '%s'";
local str_key_symbol_value = "`%s` %s '%s'";
local str_update_where = "update `characters` set %s where %s";
function CDBService:OnCharInfoChange(i_tData)
	local tFields = {};
	local tWheres = {};
	for key, value in pairs(i_tData) do
		if key == "roleid" then
			table_insert(tWheres, string_format(str_key_symbol_value, key, "=", value));
		elseif key == "charge" then
			table_insert(tFields, string_format(str_key_value_add_equal, key, key, value));
		else
			table_insert(tFields, string_format(str_key_value_equal, key, value));
		end
	end
	local strFields = table_concat(tFields, ", ");
	local strWheres = table_concat(tWheres, " and ");
	local strFinal = string_format(str_update_where, strFields, strWheres) 
	self:Execute(strFinal)
end

local str_insert_login_record = "insert into `login_record` set %s"
function CDBService:OnPlayerEverydayEnter(i_tData)
    local tFields = {}
    for key, value in pairs(i_tData) do
        table_insert(tFields, string_format(str_key_value_equal, key, value))
    end
    local strFinal = string_format(str_insert_login_record, table_concat(tFields, ", "))
    self:Execute(strFinal)
end

local select_char_by_pfid_serverid_str = "select * from `characters` where `pfid` = '%s' and `serverid` = '%s' limit 1"
function CDBService:SelectCharByPfIDAndServerID(i_sPfID, i_nServerID)
    local res1, res2 = self:Execute(string_format(select_char_by_pfid_serverid_str, i_sPfID, i_nServerID))
    if res1 then
        return res2
    end
end

local select_character_mac_by_roleid_str = "select `onserver`, `online`, `mac`, `serverid` from `characters` where `roleid` = '%s'"
function CDBService:SelectMacByRoleId(i_sRoleID)
    local res1, res2 = self:Execute(string_format(select_character_mac_by_roleid_str, i_sRoleID))
    if res1 then
        return res2
    end
end

local select_character_by_rolename = "select * from `characters` where `rolename` = '%s'"
function CDBService:SelectCharacterByRoleName( i_sRoleName, i_nServerID)
    local res1, res2 = self:Execute(string_format(select_character_by_rolename, i_sRoleName))
    if res1 then
        return res2
    end
end

local update_banspeaktime_by_pfid_serverid_str = "update `characters` set banspeaktime = '%s' where `pfid` = '%s' and `serverid` = '%s'"
function CDBService:UpdateBanspeakTime(i_sPfID, i_nServerID, i_nWaitTime)
    return self:Execute(string_format(update_banspeaktime_by_pfid_serverid_str, i_nWaitTime, i_sPfID, i_nServerID))
end

local select_roleid_by_openid_str = "select `roleid` from `characters` where `pfid` = '%s' and `serverid` = '%s' limit 1"
function CDBService:SelectRoleIDByPfIDAndServerID(i_sPfID, i_nServerID)
    local res1, res2 = self:Execute(string_format(select_roleid_by_openid_str, i_sPfID, i_nServerID))
    if res1 then
        return res2
    end
end

local select_char_by_openid_str = "select * from `characters` where `pfid` = '%s'"
function CDBService:SelectCharDByPfID(i_sPfID)
    local res1, res2 = self:Execute(string_format(select_char_by_openid_str, i_sPfID))
    if res1 then
        return res2
    end
end

local select_online_char_by_serverid_str = "select `pfid`, `roleid`, `rolename`, `level`, `ip` from `characters` where `onserver` = '%s' and `online` = 1"
function CDBService:SelectOnlineCharByServerID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_online_char_by_serverid_str, i_nServerID))
    if res1 then
        return res2
    end
end

local select_online_num_by_serverid_str = "select count(*) as cnt from `characters` where `onserver` = '%s' and `online` = 1"
function CDBService:SelectOnlineNumByServerID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_online_num_by_serverid_str, i_nServerID))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_key = "select `pfid`, `roleid`, `rolename` from `characters` where `serverid` = '%s' and `%s` like '%%%s%%' limit 100"
function CDBService:SelectLikeCharByServerID(i_nServerID, i_sKeyType, i_sKeyWord)
    local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_key, i_nServerID, i_sKeyType, i_sKeyWord))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_ip = "select `pfid`, `roleid`, `rolename` from `characters` where `onserver` = '%s' and `online` = 1 and `ip` = '%s'"
function CDBService:SelectOnlineCharByServerIDAndIP(i_nServerID, i_nIP)
	local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_ip, i_nServerID, i_nIP))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_id = "select `pfid`, `roleid`, `rolename` from `characters` where `onserver` = '%s' and `pfid` = '%s'"
function CDBService:SelectCharByServerIDAndAccount(i_nServerID, i_sAccount)
	local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_id, i_nServerID, i_sAccount))
    if res1 then
        return res2
    end
end

local select_char_by_roleid = "select * from `characters` where `roleid` = '%s' limit 1"
function CDBService:SelectCharInfoByRoleId(i_sRoleId, i_sType)
	local tRes = {};
	if i_sType == "base" then
		local res1, res2 = self:Execute(string_format(select_char_by_roleid, i_sRoleId))
		if res1 then
			tRes["base"] = res2;
		end
	end
	return tRes
end

local update_banplaytime_by_pfid_serverid_str = "update `characters` set banplaytime = '%s' where `pfid` = '%s' and `serverid` = '%s'"
function CDBService:UpdateBanplaytime(i_sPfID, i_nServerID, i_nWaitTime)
    return self:Execute(string_format(update_banplaytime_by_pfid_serverid_str, i_nWaitTime, i_sPfID, i_nServerID))
end

local update_chatban_by_roleid_str = "update `characters` set banspeaktime = '%s' where `roleid` = '%s'"
function CDBService:UpdateChatBanTime(i_sRoleId, i_nWaitTime)
    return self:Execute(string_format(update_chatban_by_roleid_str, i_nWaitTime, i_sRoleId))
end

local update_lockplayer_by_roleid_str = "update `characters` set banplaytime = '%s' where `roleid` = '%s'"
function CDBService:UpdateLockPlayerTime(i_sRoleId, i_nWaitTime)
    return self:Execute(string_format(update_lockplayer_by_roleid_str, i_nWaitTime, i_sRoleId))
end

local insert_into_adminlog = "insert into `admin_log` set `oper` = '%s', `serverid` = '%s', `type` = '%s', `time` = '%s', `post_data` = '%s', `errno` = '%d', `errmsg` = '%s'"
function CDBService:InsertAdminLog(i_sOper, i_sServerID, i_sType, i_sTime, i_sPostData, i_nErrno, i_sErrMsg)
    return self:Execute(string_format(insert_into_adminlog, i_sOper, i_sServerID, i_sType, i_sTime, i_sPostData, i_nErrno, i_sErrMsg))
end

local select_from_adminlog = "select `oper`, `time`, `errno`, `errmsg`, `type`, `post_data` from `admin_log` where `time` >= '%s' and `time` <= '%s' and `serverid` = '%s' and `type` = '%s'"
function CDBService:SelectFromAdminLog(i_sStartTime, i_sEndTime, i_sServerID, i_sType)
    local res1, res2 = self:Execute(string_format(select_from_adminlog, i_sStartTime, i_sEndTime, i_sServerID, i_sType))
    if res1 then
        return res2
    end
end

local select_from_adminlog_notype = "select `oper`, `time`, `errno`, `errmsg`, `type`, `post_data` from `admin_log` where `time` >= '%s' and `time` <= '%s' and `serverid` = '%s'"
function CDBService:SelectFromAdminLogNoType(i_sStartTime, i_sEndTime, i_sServerID)
    local res1, res2 = self:Execute(string_format(select_from_adminlog_notype, i_sStartTime, i_sEndTime, i_sServerID))
    if res1 then
        return res2
    end
end

local create_lock_char_mac_str = "insert `lock_mac` set `mac` = '%s', `reason` = '%s', `lockdate` = '%d', `roleid` = '%s', `serverid` = '%d'"
function CDBService:RecordLockMac(i_sMac, i_sReason, i_sLockDate, i_sRoleId, i_nServerID)
    return self:Execute(string_format(create_lock_char_mac_str, i_sMac, i_sReason, i_sLockDate, i_sRoleId, i_nServerID))
end

local delete_lock_char_mac_str = "delete from `lock_mac` where `mac` = '%s'"
function CDBService:DeleteLockMac(i_sMac)
    return self:Execute(string_format(delete_lock_char_mac_str, i_sMac))
end

local select_lock_mac_str = "select count(*) as count from `lock_mac` where `mac` = '%s'"
function CDBService:SelectLockMac(i_sMac)
    local res1, res2 = self:Execute(string_format(select_lock_mac_str, i_sMac))
    if res1 then
        return res2
    end
end

local select_lock_mac_info_str = "select `roleid`, `mac`, `reason`, `lockdate`, `serverid` from `lock_mac`"
function CDBService:SelectLockMacInfo()
    local res1, res2 = self:Execute(select_lock_mac_info_str)
    if res1 then
        return res2
    end
end

local select_from_globalinfo = "select * from `globalinfo`"
function CDBService:SelectFromGlobalinfo()
    local res1, res2 = self:Execute(select_from_globalinfo)
    if res1 then
        return res2
    end
end

local update_globalinfo_playerserviceindex = "update `globalinfo` set `playerserviceindex` = '%s'"
function CDBService:UpdateGlobalinfoPlayerServiceIndex(i_nIndex)
    return self:Execute(string_format(update_globalinfo_playerserviceindex, i_nIndex));
end

local update_always_notice_by_serverid = "update `always_notice` set `content` = '%s', `link` = '%s', `linkname` = '%s' where `serverid` = '%s'"
function CDBService:UpdateAlwaysNoticeInfo(i_sServerID, i_sContent, i_sLink, i_sLinkname)
    return self:Execute(string_format(update_always_notice_by_serverid, i_sContent, i_sLink, i_sLinkname, i_sServerID));
end


local select_always_notice_by_serverid = "select * from `always_notice` where `serverid` = '%s'"
function CDBService:SelectAlwaysNoticeByServerID(i_sServerID)
    local res1, res2 = self:Execute(string_format(select_always_notice_by_serverid, i_sServerID))
    if res1 then
        return res2
    end
end

local insert_into_always_notice = "insert into `always_notice` values('%s', '%s', '%s', '%s')"
function CDBService:InsertAlwaysNotice(i_sServerID, i_sContent, i_sLink, i_sLinkname)
    return self:Execute(string_format(insert_into_always_notice, i_sServerID, i_sContent, i_sLink, i_sLinkname))
end

local select_roleid_by_rolename = "select `roleid` from `characters` where `serverid` = '%s' and `rolename` = '%s'"
function CDBService:SelectRoleIdByServerIDAndRoleName(i_sServerID, i_sRoleName)
    local res1, res2 = self:Execute(string_format(select_roleid_by_rolename, i_sServerID, i_sRoleName))
    if res1 then
        return res2
    end
end

local select_chargeinfo_by_time = "select * from `recharge` where `ts` >= '%s' and `ts` <= '%s'"
function CDBService:SelectChargeInfoByTime(i_sStart, i_sEnd)
    local res1, res2 = self:Execute(string_format(select_chargeinfo_by_time, i_sStart, i_sEnd))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_create_str = "select pfid, rolename, level, createts from `characters` where `serverid` = %d and `createts` >= %d and `createts` <= %d"
function CDBService:SelectCharByServerIDAndCreates(i_nServerID, i_nStartTime, i_nOverTime)
    local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_create_str, i_nServerID, i_nStartTime, i_nOverTime))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_create_limit_str = "select pfid, rolename, level, createts from `characters` where `serverid` = %d and `createts` >= %d and `createts` <= %d limit %d, %d"
function CDBService:SelectCharByServerIDAndCreatesLimit(i_nServerID, i_nStartTime, i_nOverTime, i_nLimitStart, i_nLimit)
    local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_create_limit_str, i_nServerID, i_nStartTime, i_nOverTime, i_nLimitStart, i_nLimit))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_login_str = "select pfid, rolename, level, ts from `login_record` where `serverid` = '%d' and `logindate` = '%d'"
function CDBService:SelectCharByServerIDAndLogin(i_nServerID, i_nLoginDate)
    local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_login_str, i_nServerID, i_nLoginDate))
    if res1 then
        return res2
    end
end

local select_char_by_serverid_and_login_limit_str = "select pfid, rolename, level, ts from `login_record` where `serverid` = '%d' and `logindate` = '%d' limit %d, %d"
function CDBService:SelectCharByServerIDAndLoginLimit(i_nServerID, i_nLoginDate, i_nLimitStart, i_nLimit)
    local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_login_limit_str, i_nServerID, i_nLoginDate, i_nLimitStart, i_nLimit))
    if res1 then
        return res2
    end
end

local select_welfare_by_roleid_str = "select * from `welfare` where `roleid` = '%s' limit 1"
function CDBService:SelectWelfareByRoleID(i_sRoleID)
    local res1, res2 = self:Execute(string_format(select_welfare_by_roleid_str, i_sRoleID))
    if res1 then
        return res2
    end
end

local insert_welfare_str = "insert `welfare` set `serverid` = '%d', `pfid` = '%s', `roleid` = '%s', `rolename` = '%s', `oper` = '%s', `ts` = '%d'"
function CDBService:InsertWelfare(i_tData)
    return self:Execute(string_format(insert_welfare_str, i_tData.serverid, i_tData.pfid, i_tData.roleid, i_tData.rolename, i_tData.oper, i_tData.ts))
end


local select_welfarecount_by_serverid_str = "select count(*) as count from `welfare` where `serverid` = '%d'"
function CDBService:SelectWelfareCountByPfID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_welfarecount_by_serverid_str, i_nServerID))
    if res1 then
        return res2
    end
end


local delete_welfare_str = "delete from `welfare` where `roleid` = '%s'"
function CDBService:DeleteWelfare(i_sRoleid)
    return self:Execute(string_format(delete_welfare_str, i_sRoleid))
end

local select_welfare_by_serverid_str = "select * from `welfare` where `serverid` = '%d'"
function CDBService:SelectWelfareByServerID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_welfare_by_serverid_str, i_nServerID))
    if res1 then
        return res2
    end
end

local select_char_by_roleid_str = "select * from `characters` where `roleid` = '%s' limit 1"
function CDBService:SelectCharByRoleID(i_sRoleID)
    local res1, res2 = self:Execute(string_format(select_char_by_roleid_str, i_sRoleID))
    if res1 then
        return res2
    end
end

local select_inviteeid_by_inviterid_str = "select * from `invite_relation` where `inviterid` = '%s'"
function CDBService:SelectByInviteID(i_sInviteID)
    local res1, res2 = self:Execute(string_format(select_inviteeid_by_inviterid_str, i_sInviteID))
    if res1 then
        return res2
    end
end

local insert_invitee_str = "insert `invite_relation` set `inviterid` = '%s', `inviteeid` = '%s'"
function CDBService:InsertInvitee(i_sInviteID,i_sInviteeID)
    return self:Execute(string_format(insert_invitee_str, i_sInviteID, i_sInviteeID))
end


local select_char_by_pfid__str = "select * from `characters` where `pfid` = '%s' and `online` = '%d'"
function CDBService:SelectRoleByInviterID(i_sPfID)
    local res1, res2 = self:Execute(string_format(select_char_by_pfid__str, i_sPfID, 1))
    if res1 then
        return res2
    end
end