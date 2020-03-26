
local tFiles  = {
    "Enum.lua",
    "Class.lua",
    "Singleton.lua",
    
    "Declare.lua",
    
    "CommonFunction.lua",
    "Schedule.lua",
    "JSON.lua",
    "URL.lua",
    "WeightMethod.lua",
    
    "DBService.lua",
    "HttpServer.lua",
    "HttpReqHandler/include.lua",
    "main.lua",
}

for _, v in ipairs(tFiles) do
    dofile(ServerCfg.common_path .. v)
end


