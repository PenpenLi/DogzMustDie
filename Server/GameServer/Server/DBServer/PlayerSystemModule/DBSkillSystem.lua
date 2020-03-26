local CDBCommand = RequireSingleton("CDBCommand");

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	local nPlatformLevel = i_tRoleInfo.m_nPlatformLevel
	
	i_tResult["CSkillSystem"] = {}
	if bIsNew then
		local cmd = CDBCommand:CreateInsertCmd("role_skill", nServerID)
		cmd:SetFields("roleid", sRoleID)
		cmd:Execute()
	else
		local oCmd = CDBCommand:CreateSelectCmd("role_skill", nServerID)
		oCmd:SetWheres("roleid", sRoleID, "=")
		local tRes = oCmd:Execute()
		i_tResult["CSkillSystem"] = tRes[1]
	end
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CSkillSystem", f)