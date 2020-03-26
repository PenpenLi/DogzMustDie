--[[
	@brief 邮件管理类(ks)
	@author Hou
]]
local now = _commonservice.now
local RewardConfig_S = RequireConfig("RewardConfig_S")
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager")
local GameParamConfig_S = RequireConfig("GameParamConfig_S")
local MailTextTime 				= GameParamConfig_S.MailStorageMaxTime * 86400			--个人邮件保存时间（s）

local CPlayerManager	= RequireSingleton("CPlayerManager")
local CDBCommand		= RequireSingleton("CDBCommand")
-- 每封邮件最大附件数量
local MaxAffixCntPerMail = 5;
local CMailManager = RequireSingleton("CMailManager")
local CGiftSystem = RequireClass("CGiftSystem")

function CMailManager:Initialize()
	self.m_tWorldMail = {}		-- 全服邮件列表	
	self.m_tSaveNormalMail = {}		-- 保存普通邮件
	if not ServerInfo.isbridge then
		-- 开服时，统一删除所有过期邮件
		local oDeleteCmd = CDBCommand:CreateDeleteCmd("mail_system")
		oDeleteCmd:SetWheres("duetime", now(1), "<=")
		oDeleteCmd:Execute()
		self:LoadWorldMail()
	end
	return true
end

function CMailManager:Update()
	if next(self.m_tSaveNormalMail) then
		------------------------
		local tMailInfo = table.remove(self.m_tSaveNormalMail)
		local oPlayer = CPlayerManager:GetPlayerByRoleID(tMailInfo.roleid)
		if oPlayer then	-- 在线邮件
			oPlayer:GetSystem("CMailSystem"):AddMail(tMailInfo.mailid, tMailInfo.type, tMailInfo.affix, tMailInfo.duetime, tMailInfo.append)
		end
		self:SaveMail(tMailInfo)
	end
end

-- 发送一般邮件
function CMailManager:SendMail(i_sRoleId, i_nType, i_tAffix, i_tAppendInfo)
	local oPlayer = CPlayerManager:GetPlayerByRoleID(i_sRoleId)
	-- 这里检测如果配置的是奖励ID 则转换为道具列表
	if type( i_tAffix ) == "number" then
    	local tCfg = RewardConfig_S[i_tAffix]
    	i_tAffix = tCfg.reWrad
	end
    i_tAffix = i_tAffix or {}
    -- 获取新邮件id
	local sMailId = self:GetNewMailId()
	--个人邮件保存时间（s）
	local nDuetime = now(1) + MailTextTime

	table.insert(self.m_tSaveNormalMail, {
		roleid = i_sRoleId, 
		mailid = sMailId, 
		type = i_nType,
		affix = i_tAffix, 
		duetime = nDuetime, 
		append = i_tAppendInfo
	})
    return true
end

-- 获取新邮件id
function CMailManager:GetNewMailId()
	local nServerId = CGlobalInfoManager:GetServerID()
	local nGlobalNum = CGlobalInfoManager:GetMailNum()
	return string.format("%d%04d", nGlobalNum, nServerId)
end

-- 保存邮件
function CMailManager:SaveMail(i_tMailInfo)
	local oCmd = CDBCommand:CreateInsertCmd("mail_system")
	oCmd:SetFields("id", i_tMailInfo.mailid)
	oCmd:SetFields("roleid", i_tMailInfo.roleid)
	oCmd:SetFields("type", i_tMailInfo.type)
	if #i_tMailInfo.affix > 0 then
		local sAffix = TableToStr(i_tMailInfo.affix)
		oCmd:SetFields("affix", sAffix)
	end
	if i_tMailInfo.append then
		--local sMailAppend = self:MailAppendToString(i_tMailInfo.append)
		local sMailAppend = TableToStr(i_tMailInfo.append)
		oCmd:SetFields("append", sMailAppend)
	end
	oCmd:SetFields("duetime", i_tMailInfo.duetime)
	oCmd:Execute()
end

-- 序列化邮件附加内容
local str_appendtotable1 = "%((.-)%)," 
local str_appendtotable2 = "%[(.-)%],"
function CMailManager:InitMailAppend(i_sAppend)
	local tMailAppend = {}
	local mart
	for str in string.gmatch(i_sAppend, str_appendtotable1) do
		if string.find(str, "%[") then
			local tTemp = {}
			for str1 in string.gmatch(str, str_appendtotable2) do
				table.insert(tTemp, str1)
			end
			tTemp[1] = tonumber(tTemp[1])
			table.insert(tMailAppend, tTemp)
		else
			table.insert(tMailAppend, str)
		end
	end
	return tMailAppend
end

-- 转换成字符串
local str_appendtostring = "(%s),"
local str_appendLine = "[%s],"
-- 返回值字符串：(),(),([],[],),
function CMailManager:MailAppendToString(i_tAppend)
	local tTempS = {}
	for _, info in ipairs(i_tAppend) do
		if type(info) ~= "table" then
			table.insert(tTempS, string.format(str_appendtostring, info))
		else
			local tTemp1 = {}
			for _, info1 in ipairs(info) do
				table.insert(tTemp1, string.format(str_appendLine, info1))
			end
			local str = table.concat(tTemp1)
			table.insert(tTempS, string.format(str_appendtostring, str))
		end
	end
	return table.concat(tTempS)
end

----------- 运营邮件专区 ------------
-- 读取运营邮件
function CMailManager:LoadWorldMail()
	local oCmd = CDBCommand:CreateSelectCmd("worldmail")
	local tRes = oCmd:Execute()
	local nNowTime = now(1)
	if tRes then
		local tData
		for _, res in ipairs(tRes) do
			if nNowTime < res.duetime then
				if res.affix ~= "" then
					res.affix = StrToTable(res.affix)
				else
					res.affix = {}
				end
				self.m_tWorldMail[res.id] = res
			end
		end
	end
end

function CMailManager:GetAllMail()
	return self.m_tWorldMail
end


-- 发送运营邮件
function CMailManager:SendWorldMail(i_sRoleID, i_sTitle, i_sContent, i_tAffix)
	i_tAffix = i_tAffix or {};
	local nNowTime = now(1);
	local nDuetime;
	if #i_tAffix == 0 then
		nDuetime = nNowTime + MailTextTime;
		self:SendWorldOneMail(i_sRoleID, i_sTitle, i_sContent, nDuetime, i_tAffix)
	else
		nDuetime = nNowTime + MailTextTime;
		for i = 1, #i_tAffix, MaxAffixCntPerMail do
			local tAffix = {};
			for j = 0, MaxAffixCntPerMail - 1 do
				table.insert(tAffix, i_tAffix[i+j]);
			end
			self:SendWorldOneMail(i_sRoleID, i_sTitle, i_sContent, nDuetime, tAffix)
		end
	end
    return true
end

function CMailManager:ProfFashion(i_sRoleID, i_tAffix)
	local nPlayerProfID = CPlayerManager:GetProfByRoleID(i_sRoleID);
	if nPlayerProfID then
		local tAffixTemp = {}
		local tAffixRes = {}
		for _, iteminfo in ipairs(i_tAffix) do
			tAffixTemp[iteminfo[1]] = (tAffixTemp[iteminfo[1]] or 0) + iteminfo[2]
		end
		for itemid, _ in pairs(tAffixTemp) do
			local nProfID = CGlobalItemManager:GetProfID(itemid)
			if nProfID ~= 0 and nProfID ~= nPlayerProfID then
				tAffixTemp[itemid] = nil
			end
		end
		for itemid, count in pairs(tAffixTemp) do
			table_insert(tAffixRes, {itemid, count,1,0,0})
		end
		return tAffixRes
	else
		return i_tAffix
	end
end


function CMailManager:SendWorldOneMail(i_sRoleID, i_sTitle, i_sContent, nDuetime, i_tAffix)
	local sMailId = self:GetNewMailId();
	local oMail = {
		id = sMailId,
		roleid = i_sRoleID,
		title = i_sTitle,
		content = i_sContent,
		duetime = nDuetime,
		affix = i_tAffix}
	self.m_tWorldMail[sMailId] = oMail;
	self:SaveWorldMail(sMailId, i_sRoleID, i_sTitle, i_sContent, nDuetime, i_tAffix);	
	if i_sRoleID == "" then
		for _, oPlayer in pairs(CPlayerManager:GetAllPlayer()) do
			oPlayer:GetSystem("CMailSystem"):AddWorldMail(sMailId, i_sTitle, i_sContent, i_tAffix, nDuetime)
		end
	else
		local oPlayer = CPlayerManager:GetPlayerByRoleID(i_sRoleID);
		if oPlayer then
			oPlayer:GetSystem("CMailSystem"):AddWorldMail(sMailId, i_sTitle, i_sContent, i_tAffix, nDuetime)
		end
	end
end

-- 保存全服邮件
function CMailManager:SaveWorldMail(i_sMailId, i_sRoleID, i_sTitle, i_sContent, i_nDuetime, i_tAffix)
	local oCmd = CDBCommand:CreateInsertCmd("worldmail");
	oCmd:SetFields("id", i_sMailId);
	oCmd:SetFields("roleid", i_sRoleID);
	oCmd:SetFields("title", i_sTitle);
	oCmd:SetFields("content", i_sContent);
	oCmd:SetFields("duetime", i_nDuetime);
	if #i_tAffix > 0 then
		local sAffix = TableToStr(i_tAffix)
		oCmd:SetFields("affix", sAffix);
	end
	oCmd:Execute();
end

-- 发送运营（全体和个人）邮件
function CMailManager:SendWorldBusinessMail(i_sRoleID, i_sTitle, i_sContent, i_tAffix, i_bSendOnline)
	if type(i_sRoleID) ~= "string" then return end;
	local tAffix = { }
	if i_tAffix then
	    for _, itemdata in ipairs(i_tAffix) do
	        if itemdata then
	            local arr = string.split(tostring(itemdata[1]), "-");
	            local nType = arr[1]
	            local nID = arr[2]
	            local item = {tonumber(nType), tonumber(nID), tonumber(itemdata[2])}
	            table.insert(tAffix, item)
	        end
	    end	
	end
	-- 是否只发给在线玩家
	if not i_bSendOnline then
		CMailManager:SendWorldMail(i_sRoleID, i_sTitle, i_sContent, tAffix);
	else
		for sRoleID in pairs(CPlayerManager:GetAllPlayer()) do
			CMailManager:SendWorldMail(sRoleID, i_sTitle, i_sContent, tAffix);
		end
	end
end

function CMailManager:Destruct()
	if next(self.m_tSaveNormalMail) then
		for _, info in ipairs(self.m_tSaveNormalMail) do
			self:SaveMail(info)
		end
		self.m_tSaveNormalMail = {}
	end
end