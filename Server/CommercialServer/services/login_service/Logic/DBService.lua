
-- global function
local string_format	= string.format
local now       = _commonservice.now

-- global singleton
local CDBService = RequireSingleton("CDBService")

local select_baninfo_by_pfid_serverid_str = "select `banspeaktime`, `banplaytime` from `characters` where `pfid` = '%s' and `serverid` = '%s' limit 1"
function CDBService:SelectBanInfoByPfIDAndServerID(i_sPfID, i_nServerID)
    local res1, res2 = self:Execute(string_format(select_baninfo_by_pfid_serverid_str, i_sPfID, i_nServerID))
    if res1 then
        return res2
    end
end

local char_login_time = "update `characters` set last_login = '%s' where serverid = '%d' and pfid = '%s'"
function CDBService:OnPlayerLogin(i_tData)	
	local nNow = now()
	self:Execute(string_format(char_login_time, nNow, i_tData.serverid, i_tData.pfid))
end

local select_lock_mac_str = "select count(*) as count from `lock_mac` where `mac` = '%s'"
function CDBService:SelectLockMac(i_sMac)
    local res1, res2 = self:Execute(string_format(select_lock_mac_str, i_sMac))
    if res1 then
        return res2
    end
end