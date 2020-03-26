
local CDBCommand = RequireSingleton("CDBCommand");
local function CEventSystemInsert2DB(i_sRoleID, i_nServerID)
	local oCmd = CDBCommand:CreateInsertCmd("event", i_nServerID);
	oCmd:SetFields("roleid", i_sRoleID);
	oCmd:Execute();
end

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	
	if bIsNew then
		CEventSystemInsert2DB(sRoleID, nServerID)
	else
		local oCmd = CDBCommand:CreateSelectCmd("event", nServerID);
		oCmd:SetWheres("roleid", sRoleID, "=");
		oCmd:SetLimit(1);
		local data = oCmd:Execute();
		if data[1] then
			i_tResult["CEventSystem"] = data
		else
			CEventSystemInsert2DB(sRoleID, nServerID)
		end
	end
	
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CEventSystem", f)