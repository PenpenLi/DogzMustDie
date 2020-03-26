
-- 通用GM后台接口
dofile("./Logic/HttpReqHandler/gm/include.lua")
dofile("./Logic/HttpReqHandler/receive.lua")

-- load platform
local Platform = ServerCfg.Platform or "youxi"

-- youxi平台接口
if Platform == "youxi" then
    dofile("./Logic/HttpReqHandler/youxi/include.lua")
-- wan平台接口
elseif Platform == "wan" then
    dofile("./Logic/HttpReqHandler/wan/include.lua")
else
    -- 联运公共接口
    dofile("./Logic/HttpReqHandler/union/include.lua")
end

