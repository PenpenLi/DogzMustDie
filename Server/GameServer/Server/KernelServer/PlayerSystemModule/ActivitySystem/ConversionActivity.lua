--[[
	@brief	道具兑换活动(ks)
	@author	faye
]]
-- global enum
local ItemLogEnum	 = RequireEnum("ItemLogEnum")
local MailTypeEnum	 = RequireEnum("MailTypeEnum")
local ItemEnum = RequireEnum("ItemEnum")
-- global function

-- global singleton

-- local
local CConversionActivity	= RequireClass("CConversionActivity")

function CConversionActivity:_constructor(i_tData)
	self.m_ConfigData = i_tData
	self.m_tData = {}
end

function CConversionActivity:InitData(i_ActivitySystem,bFlage)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()
	if bFlage then
		self.m_tData = { }
		self:SaveData(i_ActivitySystem)
		return
	end
	local oCmd = oPlayer:CreateSelectCmd("conversion")
	oCmd:SetWheres("roleid", sRoleID, "=")
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute()
	if tRes and tRes[1] then
		self.m_tData = StrToTable(tRes[1].awardstate)
	end
end

function CConversionActivity:OnDayRefresh(i_ActivitySystem)
	self.m_tData = { }
	self:SaveData(i_ActivitySystem)
	
end

function CConversionActivity:SaveData(i_ActivitySystem)
    local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()
	local oUpdateCmd = oPlayer:CreateUpdateCmd("conversion");
    oUpdateCmd:SetFields("awardstate", TableToStr(self.m_tData))
    oUpdateCmd:SetWheres("roleid", sRoleID, "=")
    oUpdateCmd:Execute()
    oPlayer:SendToClient("C_ConversionInfo", self.m_tData)
end

function CConversionActivity:SyncClientData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	oPlayer:SendToClient("C_ConversionInfo", self.m_tData)
end


function CConversionActivity:GetAward(i_ActivitySystem,i_nIndex)
    local oPlayer = i_ActivitySystem:GetPlayer()
    if oPlayer:GetLevel() < self.m_ConfigData.level then 
        delog("ERROR!!! action level limited")
        return
    end

    if not self.m_tData[i_nIndex] then
    	self.m_tData[i_nIndex] = 0
    end

	local tbAward = self.m_ConfigData.award[i_nIndex]
	if not tbAward then
		delog("======i_nIndex  error=======",i_nIndex)
		return
	end

	if self.m_tData[i_nIndex] >= tbAward.value then
		delog("======Conversion num  is max=======",i_nIndex)
		return
	end
	--消耗物品
	local tUseCount = {}
	for _, v in ipairs(tbAward.items1) do
		if v[1] == 0 then 
			break 
		end
		local tInfo = { v[2], v[3] }
		table.insert(tUseCount, tInfo)
	end
	
	if not oPlayer:CostItemList( tUseCount, ItemLogEnum.ExchangeItem ) then
		delog( "not oPlayer:CostItem", tUseCount )
		return
	end

	self.m_tData[i_nIndex] = self.m_tData[i_nIndex] + 1

   	local tAllAward = { }
	oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(tbAward.items2, tAllAward)
    self:SaveData(i_ActivitySystem)

    oPlayer:SendToClient("C_ConversionGetAward", self.m_tData, tAllAward)
end


