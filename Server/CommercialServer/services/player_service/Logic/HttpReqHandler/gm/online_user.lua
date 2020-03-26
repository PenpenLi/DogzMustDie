
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function online_user(req, method, query, content)
    local resbody = {
        errno = 0,
        errmsg = "操作成功",
        data = {}
    }
    local res = CDBService:SelectOnlineCharByServerID(content.target.server_id)
    if res and #res > 0 then        
        for _, v in ipairs(res) do
            local data = {
                account_id = v.pfid,
                role_id = v.roleid,
                role_name = v.rolename,
                level = v.level,
                ip = v.ip,
            }
            table_insert(resbody.data, data)
        end
    end
    return resbody
end


CHttpServer:RegisterHandler("/online_user", online_user)


