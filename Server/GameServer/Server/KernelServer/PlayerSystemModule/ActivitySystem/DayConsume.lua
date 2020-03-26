--[[
	@brief	每日消耗活动(ks)
	@author	faye
]]
-- global enum
local ItemLogEnum	 = RequireEnum("ItemLogEnum")
local MailTypeEnum	 = RequireEnum("MailTypeEnum")
-- global function
local print			= print
local pairs			= pairs
local ipairs		= ipairs
local tonumber		= tonumber
local math_floor	= math.floor
local now			= _commonservice.now
local NewClass      = NewClass
-- global singleton
local CMailManager  = RequireSingleton("CMailManager")

-- local
local CDayConsume	= RequireClass("CDayConsume")

function CDayConsume:_constructor(i_tData)
	self.m_ConfigData = i_tData
	self.nFlag = 0
	self.tConsume = { }
end

function CDayConsume:InitData(i_ActivitySystem,bFlage)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	if bFlage then
		self.nFlag = 0
		self.tConsume = { }
		self:SaveData(i_ActivitySystem)
		return
	end
	local oCmd = oPlayer:CreateSelectCmd("dayconsume")
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute()
	if tRes and tRes[1] then
		self.nFlag = tRes[1].consumenum
		self.tConsume = StrToTable(tRes[1].awardstate)
	end
end

function CDayConsume:OnDayRefresh(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()
	-- 隔天自动发邮件
	for indx, tbAward in pairs(self.m_ConfigData.award) do
		if self.tConsume[indx] ~= 1 then
			if self.nFlag >= tbAward.value then
				CMailManager:SendMail(sRoleID, MailTypeEnum.DayConsume, tbAward.items)
			end
		end
	end

	self.nFlag = 0
	self.tConsume = { }
	self:SaveData(i_ActivitySystem)
end

function CDayConsume:SaveData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	local oUpdateCmd = oPlayer:CreateUpdateCmd("dayconsume");
    oUpdateCmd:SetFields("consumenum", self.nFlag)
	oUpdateCmd:SetFields("awardstate", TableToStr(self.tConsume))
    oUpdateCmd:SetWheres("roleid", sRoleID, "=");
    oUpdateCmd:Execute()
    oPlayer:SendToClient("C_DayConsumeInfo", self.nFlag, self.tConsume)	
end

function CDayConsume:SyncClientData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	oPlayer:SendToClient("C_DayConsumeInfo", self.nFlag, self.tConsume)	
end

-- 消耗钻石
function CDayConsume:OnCostEiamond(i_ActivitySystem, nCount)
	if now(1) < self.m_ConfigData.svst or now(1) > self.m_ConfigData.svot then
		return
	end
	self.nFlag = self.nFlag + nCount
	self:SaveData(i_ActivitySystem)
end

function CDayConsume:GetAward(i_ActivitySystem,i_nIndex)
	delog( "CDayConsume:GetAward(i_ActivitySystem,i_nIndex)", i_nIndex )
    local oPlayer = i_ActivitySystem:GetPlayer()
    if oPlayer:GetLevel() < self.m_ConfigData.level then
        delog("ERROR!!! action level limited")
        return
    end
    local tbAward = self.m_ConfigData.award[i_nIndex]
    if not tbAward then
    	return
    end 

    if self.tConsume[i_nIndex] == 1 then
    	return
    end 

    -- 消耗不够
    if self.nFlag < tbAward.value then
    	return
    end 
    self.tConsume[i_nIndex] = 1
	self:SaveData(i_ActivitySystem)
	local tAllAward = { }
	oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(tbAward.items, tAllAward)
	oPlayer:SendToClient( "C_DayConsumeGetAward", i_nIndex, tAllAward)
end


