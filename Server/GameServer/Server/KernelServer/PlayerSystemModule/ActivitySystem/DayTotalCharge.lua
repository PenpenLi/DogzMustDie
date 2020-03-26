--[[
	@brief	每日累计充值活动(ks)
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
local CCommonFunction = RequireSingleton("CCommonFunction")
local CPlayerManager  = RequireSingleton("CPlayerManager")
local CMailManager  = RequireSingleton("CMailManager")
local ActionTypeEnum	        = RequireEnum("ActionTypeEnum")
-- local
local CDayTotalCharge	= RequireClass("CDayTotalCharge")

function CDayTotalCharge:_constructor(i_tData)
	self.m_ConfigData = i_tData
	self.nCharge = 0
	self.nChargeFlag = { }
end

function CDayTotalCharge:InitData(i_ActivitySystem,bFlage)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()
	if bFlage then
		self.nCharge = 0
		self.nChargeFlag = { }
		return
	end
	local oCmd = oPlayer:CreateSelectCmd("daytotalcharge")
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute()
	if tRes and tRes[1] then
		self.nCharge = tRes[1].chargenum
		self.nChargeFlag = StrToTable(tRes[1].awardstate)
	end
end

function CDayTotalCharge:OnDayRefresh(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()

	for indx, tbAward in pairs(self.m_ConfigData.award) do
	    if self.nChargeFlag[indx] ~= 1 then
			if self.nCharge >= tbAward.value then
				CMailManager:SendMail(sRoleID, MailTypeEnum.EveryDayCharge, tbAward.items)
			end
	    end
	end

	self.nCharge = 0
	self.nChargeFlag = { }
	self:SaveData(i_ActivitySystem)
end

function CDayTotalCharge:SaveData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	local oUpdateCmd = oPlayer:CreateUpdateCmd("daytotalcharge");
    oUpdateCmd:SetFields("chargenum", self.nCharge)
	oUpdateCmd:SetFields("awardstate", TableToStr(self.nChargeFlag))
    oUpdateCmd:SetWheres("roleid", sRoleID, "=");
    oUpdateCmd:Execute()
    oPlayer:SendToClient("C_DayTotalChargeInfo",self.nCharge, self.nChargeFlag)	
end

function CDayTotalCharge:SyncClientData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	oPlayer:SendToClient("C_DayTotalChargeInfo",self.nCharge, self.nChargeFlag)
end


function CDayTotalCharge:OnCharge(i_ActivitySystem,i_nGold)
	if now(1) < self.m_ConfigData.svst or now(1) > self.m_ConfigData.svot then
		return
	end
	self.nCharge = self.nCharge + i_nGold
	self:SaveData(i_ActivitySystem)
end

function CDayTotalCharge:GetAward(i_ActivitySystem,i_nIndex)
    local oPlayer = i_ActivitySystem:GetPlayer()
    if oPlayer:GetLevel() < self.m_ConfigData.level then
        delog("ERROR!!! action level limited")
        return
    end

    if self.nChargeFlag[i_nIndex] == 1 then
    	return
    end
    
    local tbAward = self.m_ConfigData.award[i_nIndex]
	if not tbAward then
		delog("======i_nIndex  error=======",i_nIndex)
		return
	end

	if self.nCharge < tbAward.value then
		delog("======nChargenum  unEnough=======",nChargenum )
		return
	end

	self.nChargeFlag[i_nIndex] = 1
	self:SaveData(i_ActivitySystem)
	local tAllAward = { }
	oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(tbAward.items, tAllAward)
	oPlayer:SendToClient( "C_DayTotalChargeGetAward", i_nIndex, tAllAward)
end


