
local type = type
local ipairs = ipairs
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

-- 通过openid查询玩家数据
local function rolenames2roleid(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "查询成功",
    }
    repeat
        if type(reqbody.rolenames) ~= "table" then
            resbody.ret = 11
            resbody.msg = "查询请求的rolenames不是数组"
            break
        end
        local list = {}
        for _, v in ipairs(reqbody.rolenames) do
            local res = CDBService:SelectCharacterByRoleName(v)
            if res then
                res.rolename = v
                table_insert(list, res)
            end
        end
        resbody.list = list
    until true
    return resbody
end

CHttpServer:RegisterHandler("/rolenames2roleid", rolenames2roleid)


