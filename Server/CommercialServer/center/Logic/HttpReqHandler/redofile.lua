
local CHttpServer = RequireSingleton("CHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 热更代码
local function redofile(req, method, query, reqbody)
    if type(reqbody.filename) == "string" then
        if reqbody.serverid == 0 then
            CKSManager:RedoFile(reqbody.filename);
        else
            local oKS = CKSManager:GetKSByID(reqbody.serverid)
            if oKS then
                oKS:RedoFile(reqbody.filename)
            end
        end
        return {
            ret = 0,
            msg = "OK.",
        }
    else
        return {
            ret = 11,
            msg = "ERROR.",
        }
    end
end

CHttpServer:RegisterHandler("/redofile", redofile)


