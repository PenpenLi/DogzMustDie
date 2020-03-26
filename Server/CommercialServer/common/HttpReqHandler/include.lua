
local tFiles  = {
    "HttpReqHandler/redofile_self.lua",
    "HttpReqHandler/close.lua",
}

for _, v in ipairs(tFiles) do
    dofile(ServerCfg.common_path .. v)
end


