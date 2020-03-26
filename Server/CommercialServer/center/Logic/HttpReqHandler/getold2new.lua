
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CYWHttpServer = RequireSingleton("CYWHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 合服
local function getold2new(req, method, query, reqbody)
    local ret, msg
    local oldid = tonumber(reqbody.oldid)
    if oldid then
        ret = 0
        msg = CKSManager:GetOld2New(oldid)
    else
        ret = 11
        msg = "没有oldid"
    end
    
    return {ret = ret, msg = msg}
end

CHttpServer:RegisterHandler("/getold2new", getold2new)
CYWHttpServer:RegisterHandler("/getold2new", getold2new)


