
--[[
	@brief	H5运营活动DB初始化(gs)
	@author	faye
]]
local CDBCommand = RequireSingleton("CDBCommand");

local function f(i_tRoleInfo, i_tResult)
	local sRoleID = i_tRoleInfo.m_sRoleID
	local bIsNew = i_tRoleInfo.m_bIsNew
	local bRefresh = i_tRoleInfo.m_bRefresh
	local nServerID = i_tRoleInfo.m_nServerID
	
	if bIsNew then
		-- 每日累冲
		local oInsertCmd = CDBCommand:CreateInsertCmd("daytotalcharge", nServerID);
		oInsertCmd:SetFields("roleid", sRoleID);
		oInsertCmd:Execute();
		-- 每日消耗
		oInsertCmd = CDBCommand:CreateInsertCmd("dayconsume", nServerID);
		oInsertCmd:SetFields("roleid", sRoleID);
		oInsertCmd:Execute();
		-- 物品兑换
		oInsertCmd = CDBCommand:CreateInsertCmd("conversion", nServerID);
		oInsertCmd:SetFields("roleid", sRoleID);
		oInsertCmd:Execute();
		--每日转盘活动
		oInsertCmd = CDBCommand:CreateInsertCmd("daydial", nServerID);
		oInsertCmd:SetFields("roleid", sRoleID);
		oInsertCmd:Execute();
	end
	-- 已参与的运营活动
	local oCmd = CDBCommand:CreateSelectCmd("activity_partin", nServerID);
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute();
	if not tRes or not tRes[1] then
		local oCmd = CDBCommand:CreateInsertCmd("activity_partin", nServerID)
		oCmd:SetFields("roleid", sRoleID)
		oCmd:Execute()
	end

	local oCmd = CDBCommand:CreateSelectCmd("conversion", nServerID);
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute();
	if not tRes or not tRes[1] then
		local oCmd = CDBCommand:CreateInsertCmd("conversion", nServerID)
		oCmd:SetFields("roleid", sRoleID)
		oCmd:Execute()
	end

	local oCmd = CDBCommand:CreateSelectCmd("daydial", nServerID);
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute();
	if not tRes or not tRes[1] then
		local oCmd = CDBCommand:CreateInsertCmd("daydial", nServerID)
		oCmd:SetFields("roleid", sRoleID)
		oCmd:Execute()
	end
end

RequireSingleton("CPlayerSystemList"):RegisterSystem("CActivitySystem", f)