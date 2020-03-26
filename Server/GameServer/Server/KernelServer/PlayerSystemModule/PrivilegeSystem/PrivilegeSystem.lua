--特权系统
local now					= _commonservice.now
local ItemLogEnum 			= RequireEnum("ItemLogEnum")
local ItemEnum 				= RequireEnum("ItemEnum")
local GameEventEnum			= RequireEnum("GameEventEnum")
local CustomspassConfig_S 	= RequireConfig( "CustomspassConfig_S" )
local PrivilegeConfig_S 	= RequireConfig( "PrivilegeConfig_S" )
local CCommonFunction 		= RequireSingleton("CCommonFunction")
local CActionManager = RequireSingleton("CActionManager");
local Interval 				= 1000

local CPrivilegeSystem 		= RequireClass("CPrivilegeSystem")
local GameParamConfig 		= RequireConfig("GameParamConfig_S")
local CPlayerManager		= RequireSingleton("CPlayerManager")

local nToDayAddMaxNum 		= GameParamConfig.ShareDialyGetFreePrivilegeNum
local tFreeUseMaxNum		= GameParamConfig.FreePrivilegeStorageMaxNum


function CPrivilegeSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer()
	local nRoleId = oPlayer:GetRoleID()
	self.tPrivilegeList = { }
	self.tTypeList = { }
	self.m_nCheckTime = Interval

	local tRes = oPlayer:GetPlayerData("CPrivilegeSystem")
	for _, tInfo in pairs(tRes.privilege_role) do
		if ( now(1) < tInfo.deltime ) or ( tInfo.deltime == -1 ) then
			local tCfg = PrivilegeConfig_S[tInfo.privilegeid]
			if tCfg then
				self.tPrivilegeList[tInfo.privilegeid] = tInfo.deltime
				if not self.tTypeList[tCfg.type] then
					self.tTypeList[tCfg.type] = 1
				else 
					self.tTypeList[tCfg.type] = self.tTypeList[tCfg.type] + 1
				end 
			end 
		else
			local cmd = oPlayer:CreateDeleteCmd("privilege_role")
			cmd:SetWheres("roleid", nRoleId, "=")
			cmd:SetWheres("privilegeid", tInfo.privilegeid, "=")
			cmd:Execute()
		end 
	end	
end	

-- 分享 增加免得特权
function CPrivilegeSystem:AddFreeUseNum( )
	local oPlayer = self:GetPlayer()
	local sRoleID = oPlayer:GetRoleID()

	local nShareNum = self:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.ShareNum )
	if nShareNum >= nToDayAddMaxNum then
		return
	end

	local tPrivilegeNum = { }

	-- 随机特权
	for nkey, _ in pairs(PrivilegeConfig_S) do
		if self:IsAddFreeUse( nkey ) == true then
			table.insert( tPrivilegeNum, nkey )
		end
	end
	
	if #tPrivilegeNum == 0 then
		return
	end

	local nPrivilege = self:RandomPrivilege( tPrivilegeNum, GameParamConfig.PrivilegeWeight )

	-- 特权累加
	oPlayer:ModFreeUseNum(nPrivilege, 1)
	
end
 
-- 按权重随机出一个特权
function CPrivilegeSystem:RandomPrivilege( tPrivilegeNum, tPrivilegeWeight )
    local nAllWeight = 0
    for _, nPrivilege in ipairs( tPrivilegeNum ) do
        nAllWeight = nAllWeight + tPrivilegeWeight[nPrivilege]
    end
    local nRandomNumber = math.random( 1, nAllWeight )
    for _, nPrivilege in ipairs( tPrivilegeNum ) do
        local nWight = tPrivilegeWeight[nPrivilege]
        if nRandomNumber <= nWight then
            return nPrivilege
        else
            nRandomNumber = nRandomNumber - nWight
        end
    end
end

-- 是否能添加免费特权
function CPrivilegeSystem:IsAddFreeUse( nPrivilege )
	return self:GetPlayer():GetFreeUseNum( nPrivilege ) < tFreeUseMaxNum[nPrivilege]
end

-- 是否开启特权
function CPrivilegeSystem:IsPrivilegeOpen(nPrivilege)
	if not self.tPrivilegeList[nPrivilege] then
		return false
	end 
	return ( self.tPrivilegeList[nPrivilege] > 0 ) or ( self.tPrivilegeList[nPrivilege] == -1 )
end

-- 是否开启特权
function CPrivilegeSystem:IsPrivilegeOpenByType(nType)
	if not self.tTypeList[nType] then
		return false
	end 
	return self.tTypeList[nType] > 0
end

-- 获取当前经验加成
function CPrivilegeSystem:GetExpAddition( )
	if not self:IsPrivilegeOpenByType(4) then
		return 0
	end 
	local nExpAdd = 0
	for nPrivilege, nDeltime in pairs(self.tPrivilegeList) do 
		local tCfg = PrivilegeConfig_S[nPrivilege]
		if tCfg.type == 4 then
			nExpAdd = nExpAdd + tCfg.parameter[1]
		end 
	end 
	return nExpAdd / 10000
end

function CPrivilegeSystem:Update(i_nDeltaMsec)
	self.m_nCheckTime = self.m_nCheckTime - i_nDeltaMsec
	if self.m_nCheckTime <= 0 then
		self.m_nCheckTime = self.m_nCheckTime + Interval
		local tDelList = { }
		for nPrivilege, nDeltime in pairs( self.tPrivilegeList ) do 
			if (now(1) >= nDeltime) and (nDeltime ~= -1) then
				table.insert( tDelList, nPrivilege )
			end 
		end 

		for _, nPrivilege in pairs(tDelList) do
			self:DelPrivilege(nPrivilege)
		end
	end
end

function CPrivilegeSystem:SaveData()

end

function CPrivilegeSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient( "C_PrivilegeSystemInfo", self.tPrivilegeList )
end

-- 添加特权
function CPrivilegeSystem:AddPrivilege( nPrivilege )
	delog( "CPrivilegeSystem:AddPrivilege Done", type(nPrivilege), nPrivilege )
	local oPlayer = self:GetPlayer( ) 
	local nRoleId = oPlayer:GetRoleID( )
	if self.tPrivilegeList[nPrivilege] then
		delog( "self.tPrivilegeList[nPrivilege]" )
		return false
	end

	local tCfg = PrivilegeConfig_S[nPrivilege]
	if not tCfg then
		delog( "not tCfg" )
		return false
	end 
	local nType = tCfg.type
	-- 立刻生效
	if tCfg.continueTime == 0 then
		-- 这里是特殊处理
		if nType == 3 then
			local tCustomspassConfig = CustomspassConfig_S[oPlayer:GetDungeonsLevel( )]
			if tCustomspassConfig then
				local tAllAward = self:GetSystem("CGiftSystem").GetGiftByID(tCustomspassConfig.waveRewardID)
				if tAllAward[1] and tAllAward[1][ItemEnum.eGold] then
					oPlayer:GetSystem("CItemSystem"):AddItem(ItemEnum.eGold, tAllAward[1][ItemEnum.eGold] * tCfg.parameter[1])
				end 
			end 
		end 
	else
		local nDeltime = -1
		if tCfg.continueTime > 0 then
			nDeltime = tCfg.continueTime + now(1)
		end 
		self.tPrivilegeList[nPrivilege] = nDeltime
		if not self.tTypeList[nType] then
			self.tTypeList[nType] = 1
		else 
			self.tTypeList[nType] = self.tTypeList[nType] + 1
		end 
		local cmd = oPlayer:CreateInsertCmd("privilege_role")
		cmd:SetFields("roleid", nRoleId)
		cmd:SetFields("privilegeid", nPrivilege)
		cmd:SetFields("deltime", nDeltime)
		cmd:Execute() 
	end 
	oPlayer:SendToClient( "C_ReqAddPrivilege", nPrivilege, self.tPrivilegeList[nPrivilege], oPlayer:GetFreeUseNum( nPrivilege ) )
	return true
end

-- 删除特权
function CPrivilegeSystem:DelPrivilege(nPrivilege)
	local oPlayer = self:GetPlayer( ) 
	local nRoleId = oPlayer:GetRoleID( )
	if not self.tPrivilegeList[nPrivilege] then
		return
	end

	local tCfg = PrivilegeConfig_S[nPrivilege]
	if not tCfg then
		return
	end 
	local nType = tCfg.type

	self.tPrivilegeList[nPrivilege] = nil
	if self.tTypeList[nType] and self.tTypeList[nType] > 0 then
		self.tTypeList[nType] = self.tTypeList[nType] - 1
	end 
	if self.tTypeList[nType] <= 0 then
		self.tTypeList[nType] = nil
	end 
	local cmd = oPlayer:CreateDeleteCmd("privilege_role")
	cmd:SetWheres("roleid", nRoleId, "=")
	cmd:SetWheres("privilegeid", nPrivilege, "=")
	cmd:Execute()
	oPlayer:SendToClient( "C_DelPrivilege", nPrivilege)
end

-- 请求添加特权
function CPrivilegeSystem:ReqAddPrivilege(nPrivilege)
	delog("CPrivilegeSystem:ReqAddPrivilege Done")
	local oPlayer = self:GetPlayer( ) 
	local tCfg = PrivilegeConfig_S[nPrivilege]
	if not tCfg then
		delog( "not tCfg" )
		return
	end 

	if self:IsPrivilegeOpen(nPrivilege) then
		delog( "self:IsPrivilegeOpen(nPrivilege)" )
		return
	end 

	local PurchaseConsumption = tCfg.PurchaseConsumption

	-- 检测是否有免费次数
	if oPlayer:SubFreeUseNum(nPrivilege, 1) then
		-- 消耗成功了
	else 
		-- 需要消耗的数量
		local nUseCount = PurchaseConsumption[2]
		-- 特权活动信息
		local bOpen, nTimes, tMoney = CActionManager:IsPrivilegeDiscountOpen( )
		if bOpen then
			local nUseTimes = oPlayer:GetPrivilegeDiscount( nPrivilege )
			if nUseTimes < nTimes then
				nUseCount = tMoney[nPrivilege]
			end
		end
		-- 检测材料是否足够 并且消耗
		if not oPlayer:CostItem( PurchaseConsumption[1], nUseCount, ItemLogEnum.AddPrivilege ) then
			delog( "not oPlayer:CostItem", PurchaseConsumption[1], nUseCount )
			return
		end 
		oPlayer:ModPrivilegeDiscount( nPrivilege, 1 )
	end
	-- 添加特权
	self:AddPrivilege( nPrivilege )
	oPlayer:OnEvent( GameEventEnum.UsePrivilege, 1 )
end

 -- 请求添加特权
defineC.K_ReqAddPrivilege = function (oPlayer, nPrivilege)
	oPlayer:GetSystem("CPrivilegeSystem"):ReqAddPrivilege(nPrivilege)
end