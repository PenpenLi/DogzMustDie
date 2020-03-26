
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function check_user(req, method, query, reqbody)
    local resbody
    local res = CDBService:SelectCharByPfIDAndServerID(reqbody.uid, reqbody.skey)
    if res and #res > 0 then
        resbody = {
            errno = 0,
            errmsg = "查询成功",
            data = {}
        }
        for _, v in ipairs(res) do
            local data = {
                uid = reqbody.uid,
                nickname = v.rolename,
                createtime = v.createts,
                occupation = v.occupation,
                level = v.level,
                exp = v.exp,
            }
            table_insert(resbody.data, data)
        end
    else
        resbody = {
            errno = -1,
            errmsg = "未创建角色",
        }
    end
    return resbody
end


CHttpServer:RegisterHandler("/check_user", check_user)


