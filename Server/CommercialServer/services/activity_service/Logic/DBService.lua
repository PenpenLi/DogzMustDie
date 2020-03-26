
-- global function
local string_format	= string.format
local now = _commonservice.now

-- global singleton
local CDBService = RequireSingleton("CDBService")

local select_activitiy_str = "select `version`, `data` from `activities` where `serverid` = '%d'"
function CDBService:SelectActivityData(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_activitiy_str, i_nServerID))
    if res1 then
        if res2[1] then
            return res2[1].version, res2[1].data
        else
            return 0, ""
        end
    end
end

local insert_activity_str = "insert into `activities` set `serverid` = '%d', `data` = '%s'"
function CDBService:InsertActivity(i_nServerID, i_sData)
    return self:Execute(string_format(insert_activity_str, i_nServerID, i_sData))
end

local update_activity_str = "update `activities` set `data` = '%s', `version` = '%d' where `serverid` = '%d'"
function CDBService:UpdateActivity(i_nServerID, i_nVersion, i_sData)
    return self:Execute(string_format(update_activity_str, i_sData, i_nVersion, i_nServerID))
end


local report_activity_str = "insert `activity_record` set `serverid` = '%s', `roleid` = '%d', `actionid` = '%s', `actiontype` = '%s', `index` = '%s', `info` = '%s', `gold` = '%s', `time` = '%s'"
function CDBService:ReportActivity(i_tData)
	return self:Execute(string_format(report_activity_str, i_tData.serverid, i_tData.roleid, i_tData.actionid, i_tData.actiontype, i_tData.index, i_tData.info, i_tData.gold, i_tData.time))
end

local select_activitiy_by_serverid = "select * from `activities` where `serverid` = '%d' or `serverid` = 0"
function CDBService:SelectActivityByServerID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_activitiy_by_serverid, i_nServerID))
    if res1 then
		return res2
    end
end

local select_activitiy = "select `serverid` from `activities`"
function CDBService:SelectServerID()
    local res1, res2 = self:Execute(select_activitiy)
    if res1 then
		return res2
    end
end

local select_activitiy_oneserverid = "select `serverid` from `activities` where `serverid` = '%d'"
function CDBService:SelectOneServerID(i_nServerID)
    local res1, res2 = self:Execute(string_format(select_activitiy_oneserverid, i_nServerID))
    if res1 then
		if res2[1] then
			return true
		end
    end
end

local delete_activitiy_by_serverid = "delete from `activities` where `serverid` = '%d'"
function CDBService:DeleteActivityID(i_nServerID)
	if self:SelectOneServerID(i_nServerID) then
		return self:Execute(string_format(delete_activitiy_by_serverid, i_nServerID))
	end
end

local select_lotto_str = "select `number`, `serverid`, `name`, `roleid`, `viplv` from `lotto` where `actid` = '%s' and `index` = '%d' and `time` = '%s'"
function CDBService:SelectLotto(i_sSpecID, i_nIndex, i_nTime)
    local res1, res2 = self:Execute(string_format(select_lotto_str, i_sSpecID, i_nIndex, i_nTime))
    if res1 then
        return res2
    end
end
local insert_lotto_str = "insert into `lotto` set `actid` = '%s', `index` = '%d', `time` = '%s', `number` = '%d', `serverid` = '%d', `roleid` = '%s', `name` = '%s', `viplv` = '%d', `ts` = '%s'"
function CDBService:InsertLotto(i_sSpecID, i_nIndex, i_nTime, i_nNumber, i_nServerID, i_sRoleID, i_sRoleName, i_nVipLevel)
    self:Execute(string_format(insert_lotto_str, i_sSpecID, i_nIndex, i_nTime, i_nNumber, i_nServerID, i_sRoleID, i_sRoleName, i_nVipLevel, now(1)))
end
local update_lotto_str = "update `lotto` set `lucky` = '1' where `actid` = '%s' and `index` = '%d' and `time` = '%s' and `number` = '%d'"
function CDBService:UpdateLotto(i_sSpecID, i_nIndex, i_nTime, i_nNumber)
    self:Execute(string_format(update_lotto_str, i_sSpecID, i_nIndex, i_nTime, i_nNumber))
end
