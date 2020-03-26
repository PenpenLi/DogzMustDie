
local CRoleServerIDManager = RequireSingleton("CRoleServerIDManager")


local CMailManager = RequireSingleton("CMailManager");

-- 跨服发送邮件 直接发往本服
function CMailManager:SendMail(i_sRoleId, i_nType, i_tAffix, i_tAppendInfo)
    CRoleServerIDManager:SendMailToRole(i_sRoleId, i_nType, i_tAffix, i_tAppendInfo)
end

function CMailManager:Update()
end
-- 
function CMailManager:SyncWorldMailList()
end


