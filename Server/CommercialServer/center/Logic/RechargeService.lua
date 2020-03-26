
-- global function
local logfile   = logfile
local print     = print
local pairs     = pairs
local ipairs    = ipairs
local type		= type
-- global singleton
local CCenter		= RequireSingleton("CCenter")
local CKSManager    = RequireSingleton("CKSManager")

function CCenter:Recharge(i_nServerID, i_sRoleID, i_nGold, i_sOrderID, i_nMoney, i_tData)
    local nNewServerID = CKSManager:GetOld2New(tonumber(i_nServerID));
    local oKS = CKSManager:GetKSByID(tonumber(nNewServerID));
    if oKS then
		local sOrderID = i_sOrderID
		if type(sOrderID) == "number" then
			sOrderID = "gm_operator"
		end
        local bRes = oKS:Send("K_Charge", i_sRoleID, i_nGold, sOrderID, i_nMoney, i_tData)
        print("===bRes===", bRes);
		if bRes then
			local RechargeService = self:GetService("recharge_service")
			if RechargeService then
				self:Send2Service(RechargeService, "S_RechargeRes", i_sOrderID)
			end
		end
    end
end

defineCT.CT_Recharge = function(i_pSession, i_nServerID, i_sRoleID, i_nGold, i_sOrderID, i_nMoney, i_tData)
    CCenter:Recharge(i_nServerID, i_sRoleID, i_nGold, i_sOrderID, i_nMoney, i_tData)
end


