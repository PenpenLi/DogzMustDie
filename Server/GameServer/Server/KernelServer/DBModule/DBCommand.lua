
-- global function
local NewClass = NewClass;

--local
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager", true);
local CDBCommand = RequireSingleton("CDBCommand");

function CDBCommand:CreateSelectCmd(i_sTableName, i_nDBID)
	i_nDBID = i_nDBID or CGlobalInfoManager:GetServerID();
	return NewClass("CDBSelectCmd", i_sTableName, i_nDBID);
end

function CDBCommand:CreateInsertCmd(i_sTableName, i_nDBID)
	i_nDBID = i_nDBID or CGlobalInfoManager:GetServerID();
	return NewClass("CDBInsertCmd", i_sTableName, i_nDBID);
end

function CDBCommand:CreateUpdateCmd(i_sTableName, i_nDBID)
	i_nDBID = i_nDBID or CGlobalInfoManager:GetServerID();
	return NewClass("CDBUpdateCmd", i_sTableName, i_nDBID);
end

function CDBCommand:CreateDeleteCmd(i_sTableName, i_nDBID)
	i_nDBID = i_nDBID or CGlobalInfoManager:GetServerID();
	return NewClass("CDBDeleteCmd", i_sTableName, i_nDBID);
end


