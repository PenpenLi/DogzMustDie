
local CPersonMail = RequireClass("CPersonMail");
function CPersonMail:_constructor(i_tData)
	CPersonMail._super._constructor(self, i_tData);
	self.m_nType = i_tData.type;
	self.m_tAppend = i_tData.append;
end

-- 获取邮件类型（根据此类型前端获得title和content）
function CPersonMail:GetType()
	return self.m_nType;
end

-- 获取附加信息
function CPersonMail:GetAppend()
	return self.m_tAppend
end