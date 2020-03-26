
local CDBCommand = RequireSingleton("CDBCommand");

local function CAchievementSystemInsertToDB(i_sRoleID, i_nServerID)
	local oCmd = CDBCommand:CreateInsertCmd("nearachieve", i_nServerID);
	oCmd:SetFields("roleid", i_sRoleID);
	oCmd:Execute();
end
local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	if bIsNew then
		CAchievementSystemInsertToDB(sRoleID, nServerID)
	else
		local oCmd = CDBCommand:CreateSelectCmd("nearachieve", nServerID);
		oCmd:SetWheres("roleid", sRoleID, "=");
		oCmd:SetLimit(1);
		local tRes = oCmd:Execute();
		if tRes and tRes[1] then
			i_tResult["CAchievementSystem"] = tRes[1]
		else
			CAchievementSystemInsertToDB(sRoleID, nServerID)
		end
	end
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CAchievementSystem", f)