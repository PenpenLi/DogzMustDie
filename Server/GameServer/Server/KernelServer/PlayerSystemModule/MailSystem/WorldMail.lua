
local CWorldMail = RequireClass("CWorldMail");
function CWorldMail:_constructor(i_tData)
	CWorldMail._super._constructor(self, i_tData);
	self.m_sTitle = i_tData.title;
	self.m_sContent = i_tData.content;
end

function CWorldMail:GetTitle()
	return self.m_sTitle;
end

function CWorldMail:GetContent()
	return self.m_sContent;
end