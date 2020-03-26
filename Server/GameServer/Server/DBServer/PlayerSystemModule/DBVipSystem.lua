
local CDBCommand = RequireSingleton("CDBCommand")
local function CSignInSystemInsert2DB(i_sRoleID, i_nServerID)
	local oCmd = CDBCommand:CreateInsertCmd("vip", i_nServerID)
	oCmd:SetFields("roleid", i_sRoleID)
	oCmd:SetFields("expirationtime", 0)
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
		local oCmd = CDBCommand:CreateSelectCmd("vip", nServerID)
		oCmd:SetWheres("roleid", sRoleID, "=")
		oCmd:SetLimit(1)
		local res = oCmd:Execute()
		if res[1] then
			i_tResult["CVipSystem"] = res[1]
		else
			CSignInSystemInsert2DB(sRoleID, nServerID)
		end
	end
	
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CVipSystem", f)