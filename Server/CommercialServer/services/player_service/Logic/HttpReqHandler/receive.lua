
local tonumber = tonumber
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CURL      = RequireSingleton("CURL")
local CJSON = RequireSingleton("CJSON");
local CCenter     = RequireSingleton("CCenter")
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode
local now   = _commonservice.now
local CCommonFunction = RequireSingleton("CCommonFunction")
local sKey = "6cc8fb8082d8ebacc546e8de81d27e8f"
local sPort = "/receive"
--邀请
local function receive(req, method, query, reqbody)
    print("==============query==============",query)
    local tbReqBody = nil
    if method == "GET" then
        tbReqBody = CURL.Decode(query)
    elseif method == "POST" then
        tbReqBody = reqbody
    end
    if not tbReqBody then
        local  resbody = { status= "tbReqBody is nil" }
        return resbody
    end
    local inviter = tbReqBody.inviter           --邀请人的uid，即发送分享链接的人uid
    local invitee = tbReqBody.invitee           --被邀请人的uid，即点击分享链接的人的uid
    local resbody = {
        status= "success"
    }

    -- 检测是新老玩家
    local RoleInfo = CDBService:SelectCharDByPfID(invitee)
    local bNew = true
    for _,v in pairs(RoleInfo) do
       bNew = false
       break
    end

    local tbInvitee = CDBService:SelectCharDByPfID(inviter)
    local bFlag = false
    for k,v in pairs(tbInvitee) do
        if v.inviteeid == invitee then
            bFlag = true
            break
        end
    end

    if not bFlag then
        local nNum = #tbInvitee + 1
        local tbRole = CDBService:SelectCharDByPfID(inviter)
        for _,role in pairs(tbRole) do
            CCenter:Send("CT_SendInviteNum", role.serverid, role.roleid, bNew, invitee)
        end
    else
        print( "receive is self" )
    end
    return resbody
end

CHttpServer:RegisterHandler("/receive", receive)


