
--enum
dofile("./Server/EnumS/include.lua")

--common
dofile("./Server/Common/include.lua")

--config
dofile("./Server/ConfigS/include.lua")
dofile("./Server/ConfigManager/include.lua")

--class declare
dofile("./Server/KernelServer/Declare.lua")

--module
dofile("./Server/KernelServer/DBModule/include.lua")
dofile("./Server/KernelServer/DBServerModule/include.lua")
dofile("./Server/KernelServer/GlobalInfoModule/include.lua")
dofile("./Server/KernelServer/CommercialModule/include.lua")
dofile("./Server/KernelServer/BridgeModule/include.lua")
dofile("./Server/KernelServer/ClientListenerModule/include.lua")
dofile("./Server/KernelServer/PlayerSystemModule/include.lua")
dofile("./Server/KernelServer/PlayerModule/include.lua")
dofile("./Server/KernelServer/ChatModule/include.lua");
dofile("./Server/KernelServer/ChargeModule/include.lua");
dofile("./Server/KernelServer/ServiceModule/include.lua");

if ServerInfo.isbridge then -- 跨服系统
	
else -- 普通服系统
	dofile("./Server/KernelServer/RankModule/include.lua")
    dofile("./Server/KernelServer/GuildModule/include.lua")
    dofile("./Server/KernelServer/MailModule/include.lua")
    dofile("./Server/KernelServer/TopicModule/include.lua")
	dofile("./Server/KernelServer/ActivityModule/include.lua")
    dofile("./Server/KernelServer/PVPModule/include.lua")
    dofile("./Server/KernelServer/PKLeagueModule/include.lua");

end 