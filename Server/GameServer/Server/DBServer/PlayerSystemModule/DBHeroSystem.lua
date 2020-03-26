local CDBCommand = RequireSingleton("CDBCommand");

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	local nPlatformLevel = i_tRoleInfo.m_nPlatformLevel
	
	i_tResult["CHeroSystem"] = {}
	if bIsNew then
		i_tResult["CHeroSystem"]["hero_role"] = { }
	else
		-- 获取玩家物品
		local oCmd = CDBCommand:CreateSelectCmd("hero_role", nServerID)
		oCmd:SetWheres("roleid", sRoleID, "=")
		local tRes = oCmd:Execute()
		i_tResult["CHeroSystem"]["hero_role"] = tRes
	end
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CHeroSystem", f)