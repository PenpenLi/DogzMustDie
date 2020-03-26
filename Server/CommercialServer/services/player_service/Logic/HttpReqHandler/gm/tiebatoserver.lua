
local now = _commonservice.now
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert
local string_gmatch = string.gmatch
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CJSON	      = RequireSingleton("CJSON")
local CURL	      = RequireSingleton("CURL")
local CDBService  = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

-- 分享成功通知
local function tiebatoserver_share(req, method, query, reqbody)
    print( "tiebatoserver_share Done" )
    local resbody = {
        ret = 0,
        msg = "成功",
    }
    print("============reqbody============",reqbody)
    CCommonFunction.PrintTable(reqbody)
    local sRoleID = reqbody.roleid
    local tbRole = CDBService:SelectCharByRoleID(sRoleID)
    CCommonFunction.PrintTable(tbRole)
    for _,role in pairs(tbRole) do
        print( "CT_TieBaShare Done", role.serverid, role.roleid )
        CCenter:Send("CT_TieBaShare", role.serverid, role.roleid, reqbody)
    end
    return resbody
end
CHttpServer:RegisterHandler("/tiebatoserver_share", tiebatoserver_share)

-- 被邀请成功通知
local function tiebatoserver_invite(req, method, query, reqbody)
    print( "tiebatoserver_invite Done" )
    local resbody = {
        ret = 0,
        msg = "成功",
    }
    print("============reqbody============",reqbody)
	CCommonFunction.PrintTable(reqbody)
    local sRoleID = reqbody.roleid

    return resbody
end
CHttpServer:RegisterHandler("/tiebatoserver_invite", tiebatoserver_invite)


