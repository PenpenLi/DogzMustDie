
local CCenter   = RequireSingleton("CCenter")
local CKSManager   = RequireSingleton("CKSManager")
local CKS       = RequireClass("CKS")

function CCenter:PlayerLoginReq(i_nServerID, i_tAccountInfo)
    local LoginService = self:GetService("login_service")
    if LoginService then
        self:Send2Service(LoginService, "S_PlayerLoginReq", i_nServerID, i_tAccountInfo)
    else
        self:PlayerLoginRes(i_nServerID, i_tAccountInfo)
    end
end
defineCM.CM_PlayerLogin = function(i_oKS, i_tAccountInfo)
    CCenter:PlayerLoginReq(i_oKS:GetID(), i_tAccountInfo)
end

function CCenter:PlayerLoginRes(i_nServerID, i_tAccountInfo)
    local oKS = CKSManager:GetKSByID(i_nServerID)
    if oKS then
        oKS:Send("K_PlayerLoginRes", i_tAccountInfo)
    end
end
defineCT.CT_PlayerLoginRes = function(i_pSession, i_nServerID, i_tAccountInfo)
    CCenter:PlayerLoginRes(i_nServerID, i_tAccountInfo)
end