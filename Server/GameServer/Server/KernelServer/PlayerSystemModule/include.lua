dofile("./Server/KernelServer/PlayerSystemModule/ItemSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/GiftSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/HeroSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/MarketSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/SkillSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/EventSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/AchievementSystem/include.lua");
dofile("./Server/KernelServer/PlayerSystemModule/MailSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/SignInSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/PrivilegeSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/PetSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/EquipSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/HandbookSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/VipSystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/ActivitySystem/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/MaterialsDungeonSystem/include.lua")

--在此填入要注册的玩家系统
local CPlayerSystemList = RequireSingleton("CPlayerSystemList")

function CPlayerSystemList:Initialize()
	self.m_tSysList = 
	{
		"CEventSystem",			-- 事件系统
		"CAchievementSystem";	-- 成就系统
		"CItemSystem",			-- 道具系统
		"CGiftSystem",			-- 奖励系统
		"CMailSystem",			-- 邮件系统
		"CSkillSystem",			-- 技能系统
		"CHeroSystem",			-- 英雄系统
		"CMarketSystem",		-- 商城系统
		"CSkillSystem",			-- 技能系统
		"CSignInSystem",		-- 签到系统		
		"CPrivilegeSystem",		-- 特权系统
		"CPetSystem",			-- 宠物系统
		"CEquipSystem",			-- 装备系统
		"CHandbookSystem",		-- 图鉴系统
		"CVipSystem",			-- VIP系统
		"CActivitySystem",		-- 运营后台
		"CMaterialsDungeonSystem", -- 材料副本
	}
	return true
end

function CPlayerSystemList:GetSysList()
	return self.m_tSysList
end
