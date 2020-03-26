--[[
	@brief	H5运营活动系统(ks)
	@author	faye
]]
local pairs = pairs;
local ipairs = ipairs;
local next = next;
local math_floor = math.floor;
local string_gmatch = string.gmatch
local tonumber = tonumber
local table_concat = table.concat
local table_insert = table.insert
local NewClass = NewClass;
local now = _commonservice.now;
local ActionTypeEnum			= RequireEnum("ActionTypeEnum")
local GameParamConfig_S	= RequireConfig("GameParamConfig_S");
local CPlayerManager = RequireSingleton("CPlayerManager");
local CActionManager = RequireSingleton("CActionManager", true)

local CActivitySystem = RequireClass("CActivitySystem");

function CActivitySystem:Create(i_bDayRefresh)
	local oPlayer = self:GetPlayer();
	local sRoleID = oPlayer:GetRoleID();
	self.m_tData = {};	
	self.m_RewardClass = {}
	self.m_ActionIn = {}
	local oCmd = oPlayer:CreateSelectCmd("activity_partin")
	oCmd:SetWheres("roleid", sRoleID, "=");
	oCmd:SetLimit(1);
	local tRes = oCmd:Execute()
	if tRes and tRes[1] then
		self.m_ActionIn = StrToTable(tRes[1].actyinfo)	
	end
	---获取到所有活动
	self.m_tActionList = CActionManager:GetAllActivit()
   	for _,Activit in pairs(self.m_tActionList) do
		self:CreateRewardClass(Activit)
	end
	self:LoadData(i_bDayRefresh)
end  

function CActivitySystem:LoadData(i_bDayRefresh)
	if i_bDayRefresh then
		self:OnDayRefresh();
	end
end

function CActivitySystem:SaveData()
	local oPlayer = self:GetPlayer();
	local sRoleID = oPlayer:GetRoleID();
	local oUpdateCmd = oPlayer:CreateUpdateCmd("activity_partin");
	local Str = TableToStr(self.m_ActionIn)
	oUpdateCmd:SetFields("actyinfo", Str)
    oUpdateCmd:SetWheres("roleid", sRoleID, "=");
    oUpdateCmd:Execute()	
end

-- 零点刷新
function CActivitySystem:OnDayRefresh()
	for ActionID, oAction in pairs(self.m_RewardClass) do
		if oAction.OnDayRefresh then
			oAction:OnDayRefresh(self)
		end
	end
end

-- 花费钻石
function CActivitySystem:OnCostEiamond( nCount )
	for ActionID, oAction in pairs(self.m_RewardClass) do
		if oAction.OnCostEiamond then
			oAction:OnCostEiamond(self, nCount)
		end
	end
end

--活动推广
function CActivitySystem:OnPushActivities()
	self.m_tActionList = CActionManager:GetAllActivit()
   	for _,Activit in pairs(self.m_tActionList) do
		self:CreateRewardClass(Activit)
	end
    self:SyncClientData()
end


function CActivitySystem:ForActivityStart(i_sActionID)
	i_sActionID = tostring(i_sActionID)
	local oAction = self.m_RewardClass[i_sActionID]
	if oAction then
		return
	end
	local Activit = self.m_tActionList[i_sActionID]
	if not Activit then
		return
	end
	self:CreateRewardClass(Activit)
	oAction = self.m_RewardClass[i_sActionID]
	if oAction and oAction.SyncClientData then
		oAction:SyncClientData(self)
	end
end

function CActivitySystem:SyncClientData()
    if not CActionManager then return end
	local oPlayer = self:GetPlayer()
	for _, Activit in pairs(self.m_tActionList) do	
		if now(1) <= Activit.clot or Activit.clot == 0 then
        	oPlayer:SendToClient("C_AllActivitys", Activit )
		end
	end
   	oPlayer:SendToClient("C_AllActivitysEnd")
   	for ActionID, oAction in pairs(self.m_RewardClass) do
		if oAction.SyncClientData then
			oAction:SyncClientData(self)
		end
	end
end

local typeFightRank ={		
}

local typeclass = {
	[ActionTypeEnum.eDayTotalCharge]    = "CDayTotalCharge",	--每日累冲
	[ActionTypeEnum.eDayConsume]   		= "CDayConsume",		--每日消耗
	[ActionTypeEnum.eConversion]   		= "CConversionActivity",--道具兑换
	[ActionTypeEnum.eDayDial]   		= "CDayDial",			--每日转盘
}

function CActivitySystem:CreateRewardClass(Activit)
	local nType = Activit.type
	local oPlayer = self:GetPlayer()
	-----是否首次参与本活动标记
	local bFlage = false
	
	if typeFightRank[nType] ~= 1 then
		if now(1) >= Activit.svst and now(1) <= Activit.svot then
			if not typeclass[nType] then
				return
			end
			local oAction = NewClass(typeclass[nType], Activit)
			self.m_RewardClass[Activit.id] = oAction
			if not self.m_ActionIn[nType] then
				self.m_ActionIn[nType] = Activit.id
			elseif self.m_ActionIn[nType] ~= Activit.id then
				self.m_ActionIn[nType] = Activit.id
				bFlage = true
			end
			oAction:InitData(self, bFlage)
		end
	end
end

-------是否是战力冲榜类型
function CActivitySystem:IsFightRankAward( nType )
	return typeFightRank[nType]
end

------响应充值
function CActivitySystem:OnCharge( i_nGold )
	for ActionID, oAction in pairs(self.m_RewardClass) do
		if oAction.OnCharge then
			oAction:OnCharge(self,i_nGold)
		end
	end
end

------响应消耗
function CActivitySystem:OnConsume( i_nItemNum, i_nType )
	for ActionID, oAction in pairs(self.m_RewardClass) do
		if oAction.OnConsume then
			oAction:OnConsume(self, i_nItemNum, i_nType)
		end
	end
end

----响应获取到福袋
function CActivitySystem:SetBlessingBagNum( i_nNum  )
	delog("============11==i_nNum===11============",i_nNum)
	for ActionID, oAction in pairs(self.m_RewardClass) do
		delog("=============ActionID===============",ActionID)
		delog("=============oAction.SetBlessingBagNum===============",oAction.SetBlessingBagNum)
		if oAction.SetBlessingBagNum then
			oAction:SetBlessingBagNum(self, i_nNum)
		end
	end
end

function CActivitySystem:GetLogString(i_sActionID, i_nIndex)
	local oAction = self.m_RewardClass[i_sActionID]
	return oAction.m_ConfigData.name
end

-- 领取奖励
function CActivitySystem:GetActivityAward(i_sActionID, i_nIndex, i_nNum)
	delog("=====i_sActionID======i_nIndex====i_nNum==",i_sActionID, i_nIndex, i_nNum)
	i_sActionID = tostring(i_sActionID)
	local oAction = self.m_RewardClass[i_sActionID]
	if not oAction then
		delog("ERROR!!! action id invalid.", i_sActionID)
		return
	end
	if oAction.m_ConfigData.svot ~=0 and now(1) > oAction.m_ConfigData.svot then
		delog("ERROR!!! action id time is over.", i_sActionID)
		return
	end
	oAction:GetAward(self, i_nIndex, i_nNum)
end

-- 领取目标奖励
function CActivitySystem:GoalFightAward(i_sActionID, i_nIndex, nFight)
	delog("=====i_sActionID======i_nIndex====nFight==",i_sActionID,i_nIndex,nFight)
	i_sActionID = tostring(i_sActionID)
	local oAction = self.m_RewardClass[i_sActionID]
	if not oAction then
		delog("ERROR!!! action id invalid.", i_sActionID)
		return
	end
	oAction:GoalFightAward(self, i_nIndex, nFight)
end


-- 充值转盘奖励
function CActivitySystem:BuyChargeAward(i_sActionID, i_nIndex)
	delog("=====BuyChargeAward======i_nIndex======",i_sActionID,i_nIndex)
	i_sActionID = tostring(i_sActionID)
	local oAction = self.m_RewardClass[i_sActionID]
	if not oAction then
		delog("ERROR!!! action id invalid.", i_sActionID)
		return
	end
	oAction:BuyChargeAward(self, i_nIndex)
end


----------------- 消息专区 --------------------
----请求领取奖励
defineC.K_GetActivityAwardReq = function (i_oPlayer,i_sActionID, i_nIndex, i_nNum)
	i_oPlayer:GetSystem("CActivitySystem"):GetActivityAward(i_sActionID, i_nIndex, i_nNum);
end

--- 购买奖励  充值转盘
defineC.K_BuyChargeAward = function(i_oPlayer,i_sActionID,i_nIndex)
	i_oPlayer:GetSystem("CActivitySystem"):BuyChargeAward( i_sActionID, i_nIndex)
end

--- 领取目标奖励
defineS.K_GoalFightAward = function(i_oPlayer,i_sActionID,i_nIndex, nFight)
	i_oPlayer:GetSystem("CActivitySystem"):GoalFightAward( i_sActionID, i_nIndex, nFight)
end

------响应消耗
defineS.K_OnConsume = function(i_oPlayer, i_nItemNum, i_nType)
    i_oPlayer:GetSystem("CActivitySystem"):OnConsume(i_nItemNum, i_nType)
end