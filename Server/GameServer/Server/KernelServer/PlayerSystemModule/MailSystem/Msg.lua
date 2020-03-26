local type = type;
local CMailManager	= RequireSingleton("CMailManager");


-- 读取个人邮件请求
defineC.K_ReadPersonalMail = function (oPlayer, sMailId)
	oPlayer:GetSystem("CMailSystem"):ReadMail(sMailId);
end

-- 领取个人邮件附件
defineC.K_GetMailAffix = function (oPlayer, sMailId)
	oPlayer:GetSystem("CMailSystem"):GetMailAffix(sMailId);
end

-- 删除个人邮件请求
defineC.K_DelMailsReq = function (oPlayer, tMailId)
	if type(tMailId) ~= "table" then return end;
	oPlayer:GetSystem("CMailSystem"):DelMails(tMailId);
end

-- 一键领取邮件附件并删除
defineC.K_GetMailAffixAndDel = function (oPlayer, i_nType, tMailId)
	-- i_nType 为1是个人，为2是世界，为3是所有
	oPlayer:GetSystem("CMailSystem"):OneKeyGetAllMail(tMailId);
end


-- 领取运营邮件附件
defineC.K_GetWorldMailAffix = function (i_oPlayer, i_sMailId)
	i_oPlayer:GetSystem("CMailSystem"):GetMailAffix(i_sMailId);
end

-- 删除运营邮件状态
defineC.K_DelWorldMail = function (i_oPlayer, i_tMailId)
	if type(i_tMailId) ~= "table" then return end;
	i_oPlayer:GetSystem("CMailSystem"):DelMails(i_tMailId);
end

-- 读取运营邮件请求
defineC.K_ReadWorldMail = function (i_oPlayer, i_sMailId)
	i_oPlayer:GetSystem("CMailSystem"):ReadMail(i_sMailId);
end