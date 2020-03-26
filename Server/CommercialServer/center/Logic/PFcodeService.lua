
-- global function
local logfile   = logfile
local print     = print
-- global singleton
local CCenter		= RequireSingleton("CCenter")
local CKSManager    = RequireSingleton("CKSManager")

function CCenter:GetPFGift(i_nID, i_sRoleID, i_sCode, i_tUsed, i_sPF)
    local PFcodeService = self:GetService("pfcode_service")
    if PFcodeService then
        self:Send2Service(PFcodeService, "S_GetPFGift", i_nID, i_sRoleID, i_sCode, i_tUsed, i_sPF)
    end
end

defineCM.CM_GetPFGift = function(i_oKS, i_sRoleID, i_sCode, i_tUsed, i_sPF)
	CCenter:GetPFGift(i_oKS:GetID(), i_sRoleID, i_sCode, i_tUsed, i_sPF)
end

function CCenter:GetPFGiftRes(i_nServerID, i_sRoleID, i_nErrCode, i_nMainType, i_nSubType)
	local oKS = CKSManager:GetKSByID(i_nServerID)
    if oKS then
        oKS:Send("K_GetPFGiftRes", i_sRoleID, i_nErrCode, i_nMainType, i_nSubType)
	else
		print("ERROR!!! KS is't exist and pfcode result send fail.", i_sRoleID, i_nErrCode, i_nMainType, i_nSubType)
    end
end
defineCT.CT_PFGift = function(i_pSession, i_nServerID, i_sRoleID, i_nErrCode, i_nMainType, i_nSubType)
    CCenter:GetPFGiftRes(i_nServerID, i_sRoleID, i_nErrCode, i_nMainType, i_nSubType)
end