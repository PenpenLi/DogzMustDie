--[[
	@brief 邮件系统类(ks)
	@author Hou and Xu
]]

local next = next
local pairs = pairs
local ipairs = ipairs
local table_insert = table.insert
local table_concat = table.concat
local string_format = string.format
local now = _commonservice.now
local CMailManager				= RequireSingleton("CMailManager")
local CDataLog                  = RequireSingleton("CDataLog")
local GameParamConfig_S			= RequireConfig("GameParamConfig_S")
local MailTextTime 				= GameParamConfig_S.MailStorageMaxTime * 86400			--个人邮件保存时间（s）

local CMailSystem = RequireClass("CMailSystem")
function CMailSystem:Create()
	self.m_tList = {}		-- 邮件列表
	self.m_tLock = {}		-- 邮件锁
	self.m_tDelList = {}	-- 领取并删除
	self:LoadData()
end

function CMailSystem:LoadData()
	local oPlayer = self:GetPlayer()
	local sRoleId = oPlayer:GetRoleID()
	local nCurTime = now(1)
	local tRes1 = oPlayer:GetPlayerData("CMailSystem")
	local tRes = tRes1 and tRes1.mail_system
	if tRes and #tRes > 0 then
		for _, res in ipairs(tRes) do
			if res.duetime > nCurTime then
				res.affix = StrToTable(res.affix)
				if res.append ~= "" then
					res.append = StrToTable(res.append)
				else
					res.append = nil
				end
				self:AddMail(res.id, res.type, res.affix, res.duetime, res.append, true, res.readstate, res.affixstate)
			else
				-- 此处可优化为开服清理
				local oCmd = oPlayer:CreateDeleteCmd("mail_system")
				oCmd:SetWheres("id", res.id, "=")
				oCmd:Execute()
			end
		end
	end
	-- 初始化运营邮件
	local tOperWorldMail = {}
	local tWorldMail = CMailManager:GetAllMail()
	tRes = tRes1 and tRes1.worldmail_oper
	if tRes then
		for _, res in ipairs(tRes) do
			tOperWorldMail[res.mailid] = {res.roleid, res.affixstate, res.deletestate};
		end
	end
	local nCreateTime = oPlayer:GetCreateTime()
	local nNoAffixTime = nCreateTime + MailTextTime;
	local nHaveAffixTime = nCreateTime + MailTextTime;
	for nId, info in pairs(tWorldMail) do
		-- 过滤创建角色之前运营邮件
		local nTime = next(info.affix) and nHaveAffixTime or nNoAffixTime
		if nTime < info.duetime and info.duetime > nCurTime then
			if info.roleid == sRoleId or info.roleid == "" then
				if tOperWorldMail[nId] then
					if tOperWorldMail[nId][3] ~= 1 then
						self:AddWorldMail(nId, info.title, info.content, info.affix, info.duetime, true, 1, tOperWorldMail[nId][2])
					end
				else
					self:AddWorldMail(nId, info.title, info.content, info.affix, info.duetime, true)
				end
			end
		end
	end	
end

-- 增加个人邮件	
function CMailSystem:AddMail(i_sMailId, i_nType, i_tAffix, i_nDuetime, i_tAppendInfo, i_bSyncClient, i_nReadState, i_nAffixstate)
	local oPlayer = self:GetPlayer()
	local tMail = {
		id = i_sMailId,
		roleid = oPlayer:GetRoleID(),
		duetime = i_nDuetime,
		type = i_nType,
		affix = i_tAffix,
		append = i_tAppendInfo,
		readstate = i_nReadState,
		affixstate = i_nAffixstate,
		mailtype = 1,
		}
	self.m_tList[i_sMailId] = NewClass("CPersonMail", tMail)
	if not i_bSyncClient then
		oPlayer:SendToClient("C_AddMail", i_sMailId, i_nType, i_tAffix, i_tAppendInfo)
	end
end

-- 增加运营邮件
function CMailSystem:AddWorldMail(i_sMailId, i_sTitle, i_sContent, i_tAffix, i_nDuetime, i_bSynClient, i_nReadState, i_nAffixstate)
	-- 过滤掉非本职业
	local oPlayer = self:GetPlayer();
	local sRoleID = oPlayer:GetRoleID()
	local tMail = {
		id = i_sMailId,
		roleid = sRoleID,
		title = i_sTitle,
		content = i_sContent,
		duetime = i_nDuetime,
		affix = i_tAffix,
		mailtype = 2,
		readstate = i_nReadState,
		affixstate = i_nAffixstate,
		}
	self.m_tList[i_sMailId] = NewClass("CWorldMail", tMail);
	if not i_bSynClient then
		oPlayer:SendToClient("C_AddWorldMail",{i_sMailId,i_sTitle, i_sContent, i_tAffix});
	end
end

local str_log_mail = "call log_mail('%s', '%d', '%d', '%d', '%s')"
function CMailSystem:DelMails(i_tMailId)
	local oCmd;
	local oPlayer = self:GetPlayer();
	for _, id in ipairs(i_tMailId) do
		local oMail = self.m_tList[id]
		if oMail then
			if oMail:IsPersonType() then
				oCmd = oPlayer:CreateDeleteCmd("mail_system");
				oCmd:SetWheres("id", id, "=");
				oCmd:Execute();
			else
				if oMail:GetReadstate() == 1 then
					oCmd = oPlayer:CreateUpdateCmd("worldmail_oper");
					oCmd:SetFields("affixstate", 1);
					oCmd:SetFields("deletestate", 1);
					oCmd:SetWheres("mailid", id, "=");
					oCmd:SetWheres("roleid", oPlayer:GetRoleID(), "=");
					oCmd:Execute();
				else
					oCmd = oPlayer:CreateInsertCmd("worldmail_oper");
					oCmd:SetFields("mailid", id);
					oCmd:SetFields("roleid", oPlayer:GetRoleID());
					oCmd:SetFields("affixstate", 1);
					oCmd:SetFields("deletestate", 1);
					oCmd:Execute();
				end
			end
			-- 删除邮件加日志，过滤掉无附件邮件
			if #oMail:GetAffix() ~= 0 then
                CDataLog:GameLogGotMail(oPlayer:GetRoleID(), id, 2, now(1), "")
			end
			self.m_tList[id] = nil;
		end
	end
	oPlayer:SendToClient("C_DelMailsRes", i_tMailId);
end

local MaxMailCntPerMsg = 30
local MaxWorldMailCntPerMsg = 10
function CMailSystem:SyncClientData()
	local oPlayer = self:GetPlayer();
	oPlayer:SendToClient("C_MailListStar");
	if next(self.m_tList) then
		local nPerC = 0;
		local nWorC = 0;
		local tPerBuffer = {};
		local tWorBuffer = {};
		for id, oMail in pairs(self.m_tList) do
			if oMail:IsPersonType() then
				nPerC = nPerC + 1;
				if nPerC > MaxMailCntPerMsg then	-- 一条消息发MaxMailCntPerMsg个邮件
					oPlayer:SendToClient("C_MailList", tPerBuffer);
					tPerBuffer = {};
					nPerC = 1;
				end
				table_insert(tPerBuffer, {id, oMail:GetType(), oMail:GetDuetime(), oMail:GetAffix(), oMail:GetReadstate(), oMail:GetAffixstate(), oMail:GetAppend()});
			else
				nWorC = nWorC + 1;
				if nWorC > MaxWorldMailCntPerMsg then	-- 一条消息发MaxWorldMailCntPerMsg个邮件
					oPlayer:SendToClient("C_WorldMailList", tWorBuffer);
					tWorBuffer = {};
					nWorC = 1;
				end
				tWorBuffer[id] = {oMail:GetTitle(), oMail:GetContent(), oMail:GetDuetime(), oMail:GetAffix(), oMail:GetReadstate(), oMail:GetAffixstate()}
			end
		end
		oPlayer:SendToClient("C_MailListEnd", tPerBuffer);
		oPlayer:SendToClient("C_WorldMailListEnd", tWorBuffer);
	end
end

-- 读邮件
function CMailSystem:ReadMail(i_sMailId)
	local oMail = self.m_tList[i_sMailId];
	if not oMail then return end
	if oMail:GetReadstate() ~= 0 then return end
	local oPlayer = self:GetPlayer();
	oMail:SetReadstate(1);
	oPlayer:SendToClient("C_MailState", i_sMailId, 1);
	if oMail:IsPersonType() then
		local oCmd = oPlayer:CreateUpdateCmd("mail_system");
		oCmd:SetFields("readstate", 1)
		oCmd:SetWheres("id", i_sMailId, "=");
		oCmd:Execute();
	else
		local oCmd = oPlayer:CreateInsertCmd("worldmail_oper");
		oCmd:SetFields("mailid", i_sMailId);
		oCmd:SetFields("roleid", oPlayer:GetRoleID());
		oCmd:Execute();
	end
end

function CMailSystem:SetMailAffixState(i_sMailId)
	local oMail = self.m_tList[i_sMailId];
	if not oMail then return end
	local oPlayer = self:GetPlayer();
	self:ReadMail(i_sMailId)
	oMail:SetAffixstate(1);
	oPlayer:SendToClient("C_MailState", i_sMailId, 2);
	-- 如果领取附件并删除有该邮件，则删除
	if self.m_tDelList[i_sMailId] then
		self.m_tDelList[i_sMailId] = nil;
		self:DelMails({i_sMailId})
		return;
	end
	if oMail:IsPersonType() then
		local oCmd = oPlayer:CreateUpdateCmd("mail_system");
		oCmd:SetFields("affixstate", 1)
		oCmd:SetWheres("id", i_sMailId, "=");
		oCmd:Execute();
	else
		local oCmd = oPlayer:CreateUpdateCmd("worldmail_oper");
		oCmd:SetFields("affixstate", 1);
		oCmd:SetWheres("mailid", i_sMailId, "=");
		oCmd:SetWheres("roleid", oPlayer:GetRoleID(), "=");
		oCmd:Execute();
	end
	
end

-- 领取邮件附件
function CMailSystem:GetMailAffix(i_sMailId)
	local oPlayer = self:GetPlayer()
	local oMail = self.m_tList[i_sMailId]
	if not oMail then return end
	-- 为防止异步操作造成多次领取
	if self.m_tLock[i_sMailId] then return end
	local tAffix = oMail:GetAffix()
	local tAllAward = { }
	self:SetMailAffixState(i_sMailId)
	oPlayer:GetSystem("CGiftSystem"):AddGiftByList(tAffix, tAllAward)
	local bDuetime = false
	if oMail:GetDuetime() < now(1) then
		self.m_tList[i_sMailId] = nil
		bDuetime = true
	elseif #oMail:GetAffix() ~= 0 and oMail:GetAffixstate() ~= 1 then
		-- 暂时锁定此操作
		self.m_tLock[i_sMailId] = true
	end
	oPlayer:SendToClient("C_GetMailAffixRes", i_sMailId, tAllAward, bDuetime)
	return i_sMailId
end

-- 领取邮件附件并删除
function CMailSystem:OneKeyGetAllMail(i_tMailId)
	if not i_tMailId then
		i_tMailId = {}
		for nID, _ in pairs(self.m_tList) do
			table_insert(i_tMailId, nID)
		end	
	end
	local tMailDel = {}
	for _, nId in ipairs(i_tMailId) do
		if self:GetMailAffix(nId) then
			self.m_tDelList[nId] = true
		else
			-- 只要领取失败就删除该邮件
			table_insert(tMailDel, nId)
		end
	end
	if next(tMailDel) then
		self:DelMails(tMailDel)
	end
end

-- 领取失败清掉内存对应邮件（m_tGetAffixAndDel）
function CMailSystem:ClearDelList(i_sMailId)
	if self.m_tDelList[i_sMailId] then
		self.m_tDelList[i_sMailId] = nil
	end
end

-- 清除锁
function CMailSystem:ClearLock(i_sMailId)
	self.m_tLock[i_sMailId] = nil
end