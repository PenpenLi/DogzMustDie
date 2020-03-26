
-- singleton
RegistSingleton("CDBService")
RegistSingleton("CDBCommand")
RegistSingleton("CDBServerManager")
RegistSingleton("CGlobalInfoManager", true)
RegistSingleton("CCommercialService", true)
RegistSingleton("CMailManager", true)

if ServerInfo.isbridge then -- 跨服
    RegistSingleton("CBridgeListener")
else -- 普通服
    RegistSingleton("CBridgeConnector", true)
    RegistSingleton("CActionManager");
	RegistSingleton("CRankManager", true)
    RegistSingleton("CGuildManager", true)
    RegistSingleton("CTopicManager", true)
    RegistSingleton("CPVPManager", true)
    RegistSingleton("CPKLeagueManager", true)
end

RegistSingleton("CServiceConnector", true)
-------------------------------------------
RegistSingleton("CPlayerSystemList")
RegistSingleton("CPlayerManager", true)
RegistSingleton("CClientListener")
RegistSingleton("CChargeManager")

-- class
RegistClass("CDBDeleteCmd")
RegistClass("CDBInsertCmd")
RegistClass("CDBSelectCmd")
RegistClass("CDBUpdateCmd")
RegistClass("CPlayer")
RegistClass("CMailBase")
InheritClass("CPersonMail", "CMailBase")
InheritClass("CWorldMail", "CMailBase")
RegistClass("CDayTotalCharge");
RegistClass("CDayConsume")
RegistClass("CConversionActivity")
RegistClass("CDayDial")



RegistSingleton("CChat");
RegistSingleton("CChatManager"); 

RegistClass("CItem")
RegistClass("CHero")
RegistClass("CGuild")
RegistClass("CGuildMember")

InheritClass("CEventSystem", "CPlayerSystem")
InheritClass("CAchievementSystem", "CPlayerSystem")
InheritClass("CItemSystem", "CPlayerSystem")
InheritClass("CGiftSystem", "CPlayerSystem")
InheritClass("CHeroSystem", "CPlayerSystem")
InheritClass("CMarketSystem", "CPlayerSystem")
InheritClass("CSkillSystem", "CPlayerSystem")
InheritClass("CSignInSystem", "CPlayerSystem")
InheritClass("CPrivilegeSystem", "CPlayerSystem")
InheritClass("CPetSystem", "CPlayerSystem")
InheritClass("CEquipSystem", "CPlayerSystem")
InheritClass("CHandbookSystem", "CPlayerSystem")
InheritClass("CVipSystem", "CPlayerSystem")
InheritClass("CActivitySystem", "CPlayerSystem")
InheritClass("CMaterialsDungeonSystem", "CPlayerSystem")

if ServerInfo.isbridge then

else    
    InheritClass("CMailSystem", "CPlayerSystem")
end
