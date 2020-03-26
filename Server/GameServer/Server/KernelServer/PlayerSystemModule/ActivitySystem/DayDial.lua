--[[
	@brief	每日转盘活动(ks)
	@author	faye
]]
-- global enum
local ItemLogEnum	 = RequireEnum("ItemLogEnum")
local ItemEnum = RequireEnum("ItemEnum")
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
-- local
local CDayDial	= RequireClass("CDayDial")

function CDayDial:_constructor(i_tData)
	self.m_ConfigData = i_tData
	self.m_tData = {}
end

local tFieldEnum  = {
	"freenum",			--已使用免费次数
	"totalnum",			--累计使用次数
	"awardstate",		--礼包状态
	"awardhistory",		--中奖历史
}
function CDayDial:InitData(i_ActivitySystem, bFlage)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	if bFlage then
		self.m_tData[1] = 0 
		self.m_tData[2] = 0 
		self.m_tData[3] = {} 
		self.m_tData[4] = {} 
		self:SaveData(i_ActivitySystem)
		return
	end
	local oCmd = oPlayer:CreateSelectCmd("daydial")
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute()
	if tRes and tRes[1] then
		self.m_tData = {
					tRes[1].freenum,
					tRes[1].totalnum,
					StrToTable(tRes[1].awardstate),
					StrToTable(tRes[1].awardhistory),
					}
	else
		self.m_tData[1] = 0 
		self.m_tData[2] = 0 
		self.m_tData[3] = {} 
		self.m_tData[4] = {} 
		self:SaveData(i_ActivitySystem)
	end
end

function CDayDial:OnDayRefresh(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	local nActivityID = self.m_ConfigData.id
	
	if self.m_tData[2] ~=0 then
		--[[
		for indx, tbAward in pairs(self.m_ConfigData.cost) do
			if self.m_tData[2] and self.m_tData[2] >= tbAward.num then
				if not self.m_tData[3][indx] then
					CMailManager:SendMail(sRoleID, MailTypeEnum.ContiCharge, {{tbAward.itemid, tbAward.itemnum}}, {indx})
				end
			end	
		end
		--]]
		self.m_tData[1] = 0 
		self.m_tData[2] = 0 
		self:SaveData(i_ActivitySystem)
	end
	
end

function CDayDial:SaveData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	local sRoleID = oPlayer:GetRoleID();
	local oUpdateCmd = oPlayer:CreateUpdateCmd("daydial");
	for indx, sField in ipairs(tFieldEnum) do
		if sField == "awardstate" or sField == "awardhistory" then
			if not self.m_tData[indx] then
				self.m_tData[indx] = { }
			end
			local Str = TableToStr(self.m_tData[indx])
			oUpdateCmd:SetFields(sField, Str)
		else
			oUpdateCmd:SetFields(sField, self.m_tData[indx])
		end
	end
    oUpdateCmd:SetWheres("roleid", sRoleID, "=");
    oUpdateCmd:Execute()
    oPlayer:SendToClient("C_DayDialInfo", self.m_tData)	
end

function CDayDial:SyncClientData(i_ActivitySystem)
	local oPlayer = i_ActivitySystem:GetPlayer()
	oPlayer:SendToClient("C_DayDialInfo", self.m_tData)
end

function CDayDial:OnCharge(i_ActivitySystem,i_nGold)

end

function CDayDial:BuyChargeAward(i_ActivitySystem,i_nIndex)
    local oPlayer = i_ActivitySystem:GetPlayer()
    local nActivityID = self.m_ConfigData.id

    if oPlayer:GetLevel() < self.m_ConfigData.level then
        delog("ERROR!!! action level limited")
        return
    end
  
    local tbAward = self.m_ConfigData.award
	if not tbAward then
		return
	end
	local ncost = 0
	local GetAward = function ( bflag )
		local function CallBack(i_bSuc)
			if i_bSuc then
				local tbReward = { }
				for i=1,i_nIndex do	
					local oWeight = NewClass("CWeightMethod")
				    for k, v in ipairs(tbAward) do
				    	if v.weight then
							oWeight:SetWeightInfo({k, v}, v.weight)
						end
					end
					local tbData = oWeight:ExecuteWeight()
					table.insert(tbReward, oWeight:ExecuteWeight())
				end
				local tbItem = { }
				local tbRelRaward = { }
				for i,v in ipairs(tbReward) do
					tbItem[i] = { v[1], v[2].itemid, v[2].itemnum }
					table.insert(tbRelRaward, {v[2].Type,v[2].itemid, v[2].itemnum})
					---历史记录
					if #self.m_tData[4] >= 30 then
						table.remove(self.m_tData[4],1)
					end
					table.insert(self.m_tData[4], {v[2].itemid, v[2].itemnum})
					if v[2].rare == 1 then
						--local oLinkTips = NewClass("CLinkTips");
						--oLinkTips:AddRoleInfo(oPlayer:GetName(), oPlayer:GetVipLevel());
						--oLinkTips:AddItemInfo(v[2].itemid)
						--CPlayerManager:SendSystemTipsToAll(100265, oLinkTips:GetParams())
					end
				end

				if bflag then
					self.m_tData[1] = self.m_tData[1] + i_nIndex
				end
				self.m_tData[2] = self.m_tData[2] + i_nIndex	----总次数
				self:SaveData(i_ActivitySystem)
			    local tAllAward = { }
				oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(tbRelRaward, tAllAward)
				oPlayer:SendToClient("C_DayDialAward", tbItem)
			end	
		end
		if bflag then
			CallBack(true)
		else	
			delog("=====CDayDial:BuyChargeAward=====ncost============",ncost)
			if not oPlayer:CostItem(ItemEnum.eEiamond, ncost, ItemLogEnum.DayDialCost) then
				delog( "not CDayDial:BuyChargeAward ItemLogEnum.DayDialCost" )
				return
			end 
			CallBack(true)
		end
	end

	local nfreeNum = tbAward[0].freenum
	if i_nIndex == 1 then
		ncost = tbAward[0].onecost
	else
		ncost = tbAward[0].tencost
		if tbAward[0].rebate and tbAward[0].rebate > 0 then
			ncost = ncost * tbAward[0].rebate / 10
		end
	end
	delog("=====CDayDial:BuyChargeAward=====ncost========dadf====",self.m_tData,self.m_tData[1])
	if self.m_tData[1] < nfreeNum and i_nIndex == 1 then
		GetAward(true)
	else
		GetAward(false)
	end 
end

function CDayDial:GetAward(i_ActivitySystem,i_nIndex)
    local oPlayer = i_ActivitySystem:GetPlayer()
    local nActivityID = self.m_ConfigData.id

    if oPlayer:GetLevel() < self.m_ConfigData.level then
        delog("ERROR!!! DayDial action level limited")
        return
    end
  
    local tbcost = self.m_ConfigData.cost[i_nIndex]
	if not tbcost then
		return
	end


	if not self.m_tData[3] then
		self.m_tData[3] = { }
	end

	if self.m_tData[2] < tbcost.num then
		delog("ERROR!!!==CDayDial:GetAward====num  unEnough=======",i_nIndex)
		return
	end

	if self.m_tData[3][i_nIndex] then
		delog("ERROR!!!===CDayDial:GetAward===reward get yet=======",i_nIndex)
		return
	end 
	local tbItem = tbcost.items
	self.m_tData[3][i_nIndex] = 1
	oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(tbItem, tAllAward)
	self:SaveData(i_ActivitySystem)
end

