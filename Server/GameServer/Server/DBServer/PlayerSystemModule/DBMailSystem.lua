
local CDBCommand = RequireSingleton("CDBCommand")

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	
	local oCmd = CDBCommand:CreateSelectCmd("mail_system", nServerID)
	oCmd:SetWheres("roleid", sRoleID, "=")
	local tRes = oCmd:Execute()
	i_tResult["CMailSystem"] = {}
	i_tResult["CMailSystem"]["mail_system"] = tRes
	
	local oCmd = CDBCommand:CreateSelectCmd("worldmail_oper", nServerID);
	oCmd:SetWheres("roleid", sRoleID, "=");
	tRes = oCmd:Execute();
	i_tResult["CMailSystem"]["worldmail_oper"] = tRes	
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CMailSystem", f)