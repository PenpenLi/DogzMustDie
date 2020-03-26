
if ServerInfo.isbridge then
    dofile("./Server/KernelServer/MailModule/MailManager_Bridge.lua")
else
    dofile("./Server/KernelServer/MailModule/MailManager_Normal.lua")
end
