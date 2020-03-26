
RegistSingleton("CCenter", true)
RegistSingleton("CLogin")

dofile("../Center.lua")
dofile("./Logic/DBService.lua")
dofile("./Logic/Login.lua")

local Platform = ServerCfg.Platform or "youxi"
if Platform == "youxi" then
    -- dofile("./Logic/GetVipInfo_youxi.lua")
elseif Platform == "wan" then
    -- dofile("./Logic/GetVipInfo_wan.lua")
elseif Platform == "duowanclouds" then
    dofile("./Logic/GetVipInfo_duowan.lua")
elseif Platform == "swjoy" then
    dofile("./Logic/GetVipInfo_swjoy.lua")
elseif Platform == "pps" then
	dofile("./Logic/GetVipInfo_aqiyi.lua")
elseif Platform == "xunlei" then
	dofile("./Logic/GetVipInfo_xunlei.lua")
end


