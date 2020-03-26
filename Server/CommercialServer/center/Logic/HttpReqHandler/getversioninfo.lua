
local CHttpServer = RequireSingleton("CHttpServer")
local CKSManager = RequireSingleton("CKSManager")

-- 获取服务器版本信息
local function getversioninfo(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "成功",
    }
    repeat
        resbody.info = CKSManager:GetVersionSet()
    until true
    return resbody
end

CHttpServer:RegisterHandler("/getversioninfo", getversioninfo)


