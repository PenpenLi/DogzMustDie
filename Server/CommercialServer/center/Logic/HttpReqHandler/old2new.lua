
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CYWHttpServer = RequireSingleton("CYWHttpServer")
local CKSManager = RequireSingleton("CKSManager")
local CURL      = RequireSingleton("CURL")

-- 合服
local function old2new(req, method, query, reqbody)
    local tbReqBody = CURL.Decode(query)
    local ret, msg
    local oldid = tonumber(tbReqBody.oldid)
    local newid = tonumber(tbReqBody.newid)
    if oldid and newid then
        if oldid <= newid then
            ret = 13
            msg = "oldid <= newid"
        else
            if CKSManager:SetOld2New(oldid, newid) then
                ret = 0
                msg = "0"  --设置成功
            else
                ret = 12
                msg = "1" --设置失败
            end
        end        
    else
        ret = 11
        msg = "2" --没有oldid或newid
    end
 
    return {ret = ret, msg = msg}
end

CHttpServer:RegisterHandler("/old2new", old2new)
CYWHttpServer:RegisterHandler("/old2new", old2new)


