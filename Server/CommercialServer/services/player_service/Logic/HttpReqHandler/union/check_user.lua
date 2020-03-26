
local now = _commonservice.now
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
                uid = v.pfid,
                nickname = v.rolename,
                sex = v.occupation == 1 and "m" or "f",
                last_login = v.last_login,
                loginlong = v.loginlong,
                group = 0,
                occupation = v.occupation,
                level = v.level,
                is_valid = (now(1) >= v.banplaytime) and "0" or "1",
                exp = v.exp,
                createtime = v.createts,
                roleid = v.roleid,
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


