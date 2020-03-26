
-- global function
local dofile = dofile
local pairs = pairs
local print = print
local ProtectedCall = ProtectedCall

local CPlayerSystemList = RequireSingleton("CPlayerSystemList")

function CPlayerSystemList:Initialize()
	return true
end

function CPlayerSystemList:RegisterSystem(i_sSystemName, i_sFunName)
	self.m_tSysList = self.m_tSysList or {}
	self.m_tSysList[i_sSystemName] = i_sFunName
end

function CPlayerSystemList:LoadData(i_tRoleInfo, i_tResult)
	local bRes = true
	for sSystemName, f in pairs(self.m_tSysList) do
		if not ProtectedCall(function () f(i_tRoleInfo, i_tResult) end) then
			print("ERROR!!! DBsystem Init Fail.", sSystemName)
			bRes = false
			break
		end
	end
	return bRes
end

dofile("./Server/DBServer/PlayerSystemModule/DBPlayer.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBItemSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBHeroSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBSkillSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBEventSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBMailSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBSignInSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBPrivilegeSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBPetSystem.lua")
dofile("./Server/DBServer/PlayerSystemModule/DBAchievementSystem.lua");
dofile("./Server/DBServer/PlayerSystemModule/DBEquipSystem.lua");
dofile("./Server/DBServer/PlayerSystemModule/DBHandbookSystem.lua");
dofile("./Server/DBServer/PlayerSystemModule/DBVipSystem.lua");
dofile("./Server/DBServer/PlayerSystemModule/DBActivitySystem.lua");
dofile("./Server/DBServer/PlayerSystemModule/DBMaterialsDungeonSystem.lua");

if not ServerInfo.isbridge then
end
