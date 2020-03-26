
local CDBCommand = RequireSingleton("CDBCommand")
local function CSignInSystemInsert2DB(i_sRoleID, i_nServerID)
	local oCmd = CDBCommand:CreateInsertCmd("equip_role", i_nServerID)
	oCmd:SetFields("roleid", i_sRoleID)
	oCmd:SetFields("equipinfo", "")
	oCmd:Execute()
end

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	
	if bIsNew then
		CSignInSystemInsert2DB(sRoleID, nServerID)
	else
		local oCmd = CDBCommand:CreateSelectCmd("equip_role", nServerID)
		oCmd:SetWheres("roleid", sRoleID, "=")
		oCmd:SetLimit(1)
		local res = oCmd:Execute()
		if res[1] then
			i_tResult["CEquipSystem"] = res[1]
		else
			CSignInSystemInsert2DB(sRoleID, nServerID)
		end
	end
	
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CEquipSystem", f)