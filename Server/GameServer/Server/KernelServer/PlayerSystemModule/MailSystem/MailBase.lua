
local CMailBase = RequireClass("CMailBase");
function CMailBase:_constructor(i_tData)
	self.m_sId 			= i_tData.id;
	self.m_sRoleID 		= i_tData.roleid;
	self.m_nDuetime		= i_tData.duetime;
	self.m_tAffix 		= i_tData.affix;
	self.m_tReadstate	= i_tData.readstate or 0
	self.m_tAffixstate 	= i_tData.affixstate or 0
	self.m_nMailType 	= i_tData.mailtype;	-- 1为个人邮件，2为运营邮件
end

-- 获取过期时间
function CMailBase:GetDuetime()
	return self.m_nDuetime
end

-- 获取读状态
function CMailBase:GetReadstate()
	return self.m_tReadstate
end

-- 更改邮件读状态
function CMailBase:SetReadstate(i_nState)
	self.m_tReadstate = i_nState;
end

-- 获取Roleid
function CMailBase:GetRoleID()
	return self.m_sRoleID;
end

-- 获取邮件类型（个人/运营）
function CMailBase:IsPersonType()
	return self.m_nMailType == 1
end

-- 获取附件内容
function CMailBase:GetAffix()
	return self.m_tAffix
end

-- 获取附件领取状态
function CMailBase:GetAffixstate()
	return self.m_tAffixstate;
end

-- 更改附件领取状态
function CMailBase:SetAffixstate(i_nState)
	self.m_tAffixstate = i_nState;
end