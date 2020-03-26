
local ipairs = ipairs
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CYWHttpServer = RequireSingleton("CYWHttpServer")
local CKSManager = RequireSingleton("CKSManager")
local CWDManager = RequireSingleton("CWDManager")

-- 列出服务器信息
local function listserver(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "列出服务器成功",
    }
    local tTemp1 = CKSManager:GetKSInfo()
    local tTemp2 = CWDManager:GetWDInfo()
    for _, v in ipairs(tTemp2) do
        table_insert(tTemp1, v)
    end
    resbody.list = tTemp1
    return resbody
end
CHttpServer:RegisterHandler("/listserver", listserver)
CYWHttpServer:RegisterHandler("/listserver", listserver)


