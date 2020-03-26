
RegistSingleton("CCenter", true)
RegistSingleton("CActivitiesMgr")

RegistSingleton("CLottoMgr")
RegistClass("CLotto")
RegistClass("CSubLotto")

dofile("../Center.lua")
dofile("./Logic/DBService.lua")
dofile("./Logic/Lotto.lua")
dofile("./Logic/ActivitiesMgr.lua")
dofile("./Logic/HttpReqHandler/include.lua")


