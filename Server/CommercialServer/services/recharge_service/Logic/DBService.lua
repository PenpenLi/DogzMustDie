
-- global function
local string_format	= string.format
local tostring		= tostring

-- global singleton
local CDBService = RequireSingleton("CDBService")

local select_roleid_by_pfid_serverid_str = "select `roleid`, `rolename` from `characters` where `pfid` = '%s' and `serverid` = '%s' limit 1"
function CDBService:SelectRoleIDByPfIDAndServerID(i_sPfID, i_nServerID)
    local res1, res2 = self:Execute(string_format(select_roleid_by_pfid_serverid_str, i_sPfID, i_nServerID))
	if res1 then
		return res2
	end
end

local insert_charge_by_roleid = "insert into `recharge` (`roleid`,`rolename`,`pfid`,`serverid`,`orderid`,`coins`,`moneys`,`ts`)values('%s','%s','%s','%d','%s','%s','%s','%d')"
function CDBService:InsertChargeByRoleID(i_sRoleID, i_sRoleName, i_sPfID, i_nServerID, i_sOrderID, i_nCoins, i_nRmb, i_nTime)
    return self:Execute(string_format(insert_charge_by_roleid, i_sRoleID, i_sRoleName, i_sPfID, i_nServerID, i_sOrderID, tostring(i_nCoins), tostring(i_nRmb), i_nTime))
end

local select_roleid_by_orderid = "select `roleid` from `recharge` where `orderid` = '%s'"
function CDBService:SelectRoleIDByOrderID(i_sOrderID)
    local res1, res2 = self:Execute(string_format(select_roleid_by_orderid, i_sOrderID))
	if res1 then
		return res2
	end
end

local select_player_charge_info = "select * from `recharge`"
function CDBService:SelectPlayerChargeInfo()
    local res1, res2 = self:Execute(string_format(select_player_charge_info))
	if res1 then
		return res2
	end
end

local select_charge_info_byroleid = "select * from `recharge` where `roleid` = '%s'"
function CDBService:SelectChargeInfoByRoleid(roleid)
    local res1, res2 = self:Execute(string_format(select_charge_info_byroleid,roleid))
	if res1 then
		return res2
	end
end


-- 充值返回更新状态
local update_chargestate_by_orderid = "update `recharge` set `state` = 1 where `orderid` = '%s'"
function CDBService:UpdateChargeStateByOrderid(i_sOrderID)
    return self:Execute(string_format(update_chargestate_by_orderid, i_sOrderID))
end

local select_rechargeinfo_by_state = "select `roleid`, `serverid`, `orderid`, `coins`, `moneys` from `recharge` where `state` = 0"
function CDBService:SelectRechargeInfoByState()
    local res1, res2 = self:Execute(select_rechargeinfo_by_state)
	if res1 then
		return res2
	end
end

local select_char_by_serverid_and_id = "select * from `characters` where `roleid` = '%s' limit 1"
function CDBService:SelectCharInfoByRoleId(i_nServerID, i_sRoleId)
	local res1, res2 = self:Execute(string_format(select_char_by_serverid_and_id, i_sRoleId))
	if res1 then
		return res2
	end
end

local insert_virtual_recharge = "insert into `virtual_recharge` (`serverid`,`roleid`,`rolename`,`pfid`,`orderid`,`coins`,`money`,`oper`,`ts`)values('%d', '%s','%s','%s','%d','%s','%s','%s','%d')"
function CDBService:InsertVirtualCharge(i_nServerID, i_sRoleID, i_sRoleName, i_sPfID, i_nOrderID, i_nCoins, i_nRmb, i_sOper, i_nTime)
    return self:Execute(string_format(insert_virtual_recharge, i_nServerID, i_sRoleID, i_sRoleName, i_sPfID, i_nOrderID, tostring(i_nCoins), tostring(i_nRmb), i_sOper, i_nTime))
end

local select_virtual_recharge_by_state = "select * from `virtual_recharge` where `state` = 0"
function CDBService:SelectVirtualRechargeInfoByState()
    local res1, res2 = self:Execute(select_virtual_recharge_by_state)
	if res1 then
		return res2
	end
end

local update_globalinfo_rechargeserviceindex = "update `globalinfo` set `rechargeserviceindex` = '%d'"
function CDBService:UpdateGlobalinfoRechargeServiceIndex(i_nIndex)
    return self:Execute(string_format(update_globalinfo_rechargeserviceindex, i_nIndex));
end

local select_from_globalinfo = "select * from `globalinfo`"
function CDBService:SelectFromGlobalinfo()
    local res1, res2 = self:Execute(select_from_globalinfo)
    if res1 then
        return res2
    end
end

-- 虚拟充值返回更新状态
local update_virtualchargestate_by_orderid = "update `virtual_recharge` set `state` = 1 where `orderid` = '%d'"
function CDBService:UpdateVirtualChargeStateByOrderid(i_nOrderID)
    return self:Execute(string_format(update_virtualchargestate_by_orderid, i_nOrderID))
end

local select_virtual_recharge_by_time = "select * from `virtual_recharge` where `serverid` = '%d' and `ts` >= '%d' and `ts` <= '%d'"
function CDBService:SelectVirtualRechargeInfoByTime(i_nServerID, i_nStartTime, i_nEndTime)
    local res1, res2 = self:Execute(string_format(select_virtual_recharge_by_time, i_nServerID, i_nStartTime, i_nEndTime))
	if res1 then
		return res2
	end
end