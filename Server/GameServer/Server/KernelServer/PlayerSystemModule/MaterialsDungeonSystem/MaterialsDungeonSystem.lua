--材料副本
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CopyConfig_S = RequireConfig( "CopyConfig_S" )
local CustomspassConfig_S = RequireConfig( "CustomspassConfig_S" )
local GameEventEnum = RequireEnum("GameEventEnum")
local CMaterialsDungeonSystem = RequireClass("CMaterialsDungeonSystem")

function CMaterialsDungeonSystem:Create( i_bDayRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	-- 存盘脏位
	self.tSaveDungeon = { }
	-- 记录当前已经通到哪关
	self.tCurDungeonIdx = { }
	-- 记录副本的星星
	self.tDungeonStar = { }
	-- 记录通关次数
	self.tDungeonClearedTimes = { }
	-- 记录当天已购买的次数
	self.tBuyDungeonTimes = { }
	-- 记录购买次数(不清除的)
	self.tAdditionDungeonTimes = { }

	local res = oPlayer:GetPlayerData("CMaterialsDungeonSystem")
	if res then
		self.tCurDungeonIdx = StrToTable( res.curdungeonidx )
		self.tDungeonStar = StrToTable( res.dungeonstar )
		self.tDungeonClearedTimes = StrToTable( res.dungeonclearedtimes )
		self.tBuyDungeonTimes = StrToTable( res.buydungeontimes )
		self.tAdditionDungeonTimes = StrToTable( res.additiondungeontimes )
	end 
	if i_bDayRefresh then
		self:OnDayRefresh()
	end
end

-- 存盘
function CMaterialsDungeonSystem:SaveData()
	if next(self.tSaveDungeon) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("materialsdungeon");
        for k, v in pairs(self.tSaveDungeon) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.tSaveDungeon = {}
	end
end

--上线同步
function CMaterialsDungeonSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( )
	oPlayer:SendToClient("C_SendMaterialsDungeonInfo", self.tCurDungeonIdx, self.tDungeonStar, self.tDungeonClearedTimes, self.tBuyDungeonTimes, self.tAdditionDungeonTimes)
end

-- 第二天
function CMaterialsDungeonSystem:OnDayRefresh()
	self.tDungeonClearedTimes = {}
	self.tBuyDungeonTimes = {}
	self.tSaveDungeon["dungeonclearedtimes"] = TableToStr( self.tDungeonClearedTimes ) 
	self.tSaveDungeon["buydungeontimes"] = TableToStr( self.tBuyDungeonTimes ) 
end

function CMaterialsDungeonSystem:Update()
	local oPlayer = self:GetPlayer( )
	if oPlayer.m_nPower >= GameParamConfig_S.PowerMax then
		oPlayer.m_nRecoverTime = now(1)
		oPlayer:SetSaveDataRoleInfo("recovertime", oPlayer.m_nRecoverTime)
		return
	end
	local nHasTimes = now(1) - oPlayer.m_nRecoverTime
    if nHasTimes >= GameParamConfig_S.PowerSpeed then
    	local nTimes = math.floor(nHasTimes / GameParamConfig_S.PowerSpeed)
    	oPlayer.m_nRecoverTime = now(1)
    	oPlayer:SetSaveDataRoleInfo("recovertime", oPlayer.m_nRecoverTime)
        -- 恢复体力1点
        oPlayer.m_nPower = oPlayer.m_nPower + nTimes
        if oPlayer.m_nPower > GameParamConfig_S.PowerMax then
        	oPlayer.m_nPower = GameParamConfig_S.PowerMax
        end
		oPlayer:SetSaveDataRoleInfo("power", oPlayer.m_nPower)
        --oPlayer:SendToClient("C_MaterialsDungeonUpdatePower", oPlayer.m_nRecoverTime, oPlayer.m_nPower)
    end
    
end

-- 获取今日剩余挑战次数
function CMaterialsDungeonSystem:GetTodayResidueTiems( nType, nCopyId )
	local tDungeonData = CopyConfig_S[nType][nCopyId]
	return tDungeonData.DailyFreeNum + self:GetAdditionDungeonTimes( nType, nCopyId ) - self:GetDungeonClearedTimes( nType, nCopyId )
end
-- 获取附加挑战次数
function CMaterialsDungeonSystem:GetAdditionDungeonTimes( nType, nCopyId )
	if not self.tAdditionDungeonTimes[nType] then
		return 0
	end
	return self.tAdditionDungeonTimes[nType][nCopyId] or 0
end


-- 获取当前已经通到哪关
function CMaterialsDungeonSystem:GetCurDungeonIdx( nType )
	return self.tCurDungeonIdx[nType] or 0
end

-- 获取副本的星星
function CMaterialsDungeonSystem:GetDungeonStar( nType, nCopyId, nStar )
	if self.tDungeonStar[nType] and self.tDungeonStar[nType][nCopyId] then
		return self.tDungeonStar[nType][nCopyId][nStar] or 0
	end
	return 0
end

-- 获取今日通关次数
function CMaterialsDungeonSystem:GetDungeonClearedTimes( nType, nCopyId )
	if self.tDungeonClearedTimes[nType] and self.tDungeonClearedTimes[nType][nCopyId] then
		return self.tDungeonClearedTimes[nType][nCopyId]
	end
	return 0
end

-- 获取购买次数
function CMaterialsDungeonSystem:GetBuyDungeonTimes( nType, nCopyId )
	if not self.tBuyDungeonTimes[nType] then
		return 0
	end
	return self.tBuyDungeonTimes[nType][nCopyId] or 0
end

-- 是否符合挑战副本条件
function CMaterialsDungeonSystem:IsChallengeDungeon( nType, nCopyId )
	local oPlayer = self:GetPlayer( )
	local tDungeonData = CopyConfig_S[nType][nCopyId]

	-- 需要主线关卡
	if oPlayer:GetDungeonsCustoms() < tDungeonData.CustomsNum then
		delog("CMaterialsDungeonSystem:ReqChallengeDungeon GetDungeonsCustoms() < tDungeonData.CustomsNum!", nType, nCopyId)
		return false
	end

	-- 是否是能挑战的关卡
	local nChallengeDungeonIdx = self:GetCurDungeonIdx(nType) + 1
	if nCopyId > nChallengeDungeonIdx then
		delog("CMaterialsDungeonSystem:ReqChallengeDungeon nCopyId > (self:GetCurDungeonIdx(nType) + 1)!", nType, nCopyId)
		delog( self.tCurDungeonIdx )
		return false
	end

	-- 剩余挑战次数
	if self:GetTodayResidueTiems(nType, nCopyId) <= 0 then
		delog("CMaterialsDungeonSystem:ReqChallengeDungeon nResidueTiems <= 0!", nType, nCopyId)
		return false
	end

	-- 体力是否足够
	if oPlayer.m_nPower < tDungeonData.NeedPower then
		delog("CMaterialsDungeonSystem:ReqChallengeDungeon oPlayer.m_nPower < tDungeonData.NeedPower!", nType, nCopyId)
		return false
	end
	return true
end

-- 通过副本
function CMaterialsDungeonSystem:ReqPassDungeon( nType, nCopyId, nWin, tStar )
	local oPlayer = self:GetPlayer( )
	local tDungeonData = CopyConfig_S[nType][nCopyId]
	if self:IsChallengeDungeon( nType, nCopyId ) == false then
		return
	end

	--胜利
	if nWin == 1 then
		-- 消耗体力
		oPlayer.m_nPower = oPlayer.m_nPower - tDungeonData.NeedPower
		oPlayer:SetSaveDataRoleInfo("power", oPlayer.m_nPower)
		--更新当前通关到那关
		local nChallengeDungeonIdx = self:GetCurDungeonIdx(nType)
		if nCopyId > nChallengeDungeonIdx then
			self.tCurDungeonIdx[nType] = nCopyId
			self.tSaveDungeon["curdungeonidx"] = TableToStr( self.tCurDungeonIdx ) 
		end

		if self:GetAdditionDungeonTimes(nType, nCopyId) > 0 then
			--附加次数-1
			if not self.tAdditionDungeonTimes[nType] then
				self.tAdditionDungeonTimes[nType] = {}
			end
			self.tAdditionDungeonTimes[nType][nCopyId] = self:GetAdditionDungeonTimes(nType, nCopyId) - 1
			if self:GetAdditionDungeonTimes(nType, nCopyId) == 0 then
				table.remove(self.tAdditionDungeonTimes[nType], nCopyId)
			end
			self.tSaveDungeon["additiondungeontimes"] = TableToStr( self.tAdditionDungeonTimes )
		else
			--已挑战次数+1
			if not self.tDungeonClearedTimes[nType] then 
				self.tDungeonClearedTimes[nType] = {}
			end
			self.tDungeonClearedTimes[nType][nCopyId] = self:GetDungeonClearedTimes( nType, nCopyId) + 1
			self.tSaveDungeon["dungeonclearedtimes"] = TableToStr( self.tDungeonClearedTimes ) 

		end
		
		if not self.tDungeonStar[nType] then
			self.tDungeonStar[nType] = {}
		end
		if not self.tDungeonStar[nType][nCopyId] then
			self.tDungeonStar[nType][nCopyId] = {}
		end

		--获得星星奖励
		local tAllAward = { }
		for nStar, nLighten in ipairs(tStar) do
			if self:GetDungeonStar(nType, nCopyId, nStar) == 0 and nLighten == 1 then
				self.tDungeonStar[nType][nCopyId][nStar] = nLighten
				self.tSaveDungeon["dungeonstar"] = TableToStr( self.tDungeonStar ) 
				oPlayer:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, tDungeonData.FirstGetDiamond[nStar], tAllAward )
			end
		end

		-- 获得通关奖励
		local tCustomspassConfig = CustomspassConfig_S[oPlayer:GetDungeonsLevel( )]
		if tCustomspassConfig then
			local tAward = self:GetSystem("CGiftSystem").GetGiftByID(tCustomspassConfig.waveRewardID)
			if tAward[1] and tAward[1][ItemEnum.eGold] then
				oPlayer:GetSystem("CGiftSystem"):AddGift(1, ItemEnum.eGold, tAward[1][ItemEnum.eGold] * tDungeonData.CopyDropGold, tAllAward)
			end 
		end 
		oPlayer:AddGiftByID( tDungeonData.CopyDropReward, tAllAward )

		oPlayer:SendToClient( "C_ReqPassDungeon", nType, nCopyId, nWin, tStar, tAllAward)
	--失败
	else
		oPlayer:SendToClient( "C_ReqPassDungeon", nType, nCopyId, nWin, tStar )
	end
end

-- 购买挑战次数
function CMaterialsDungeonSystem:ReqBuyDungeonTimes( nType, nCopyId, nBuyTimes )
	local oPlayer = self:GetPlayer( )
	local nTimes = self:GetBuyDungeonTimes(nType, nCopyId) + nBuyTimes
	local nNeedEiamond = GameParamConfig_S.CopyBuyNeedDiamond * nBuyTimes
	if nTimes > GameParamConfig_S.CopyBuyMaxNum then
		delog("CMaterialsDungeonSystem:ReqBuyDungeonTimes nTimes >= GameParamConfig_S.CopyBuyMaxNum!", nType, nCopyId, self:GetBuyDungeonTimes(nType, nCopyId))
		return
	end

	-- 消耗
	if not oPlayer:CostItem(ItemEnum.eEiamond, nNeedEiamond, ItemLogEnum.BuyDungeonTimes) then
		return
	end 

	if not self.tBuyDungeonTimes[nType] then
		self.tBuyDungeonTimes[nType] = {}
	end
	if not self.tAdditionDungeonTimes[nType] then
		self.tAdditionDungeonTimes[nType] = {}
	end
	self.tBuyDungeonTimes[nType][nCopyId] = nTimes
	self.tSaveDungeon["buydungeontimes"] = TableToStr( self.tBuyDungeonTimes ) 
	self.tAdditionDungeonTimes[nType][nCopyId] = self:GetAdditionDungeonTimes(nType, nCopyId) + nTimes
	self.tSaveDungeon["additiondungeontimes"] = TableToStr( self.tAdditionDungeonTimes ) 
	oPlayer:SendToClient( "C_ReqBuyDungeonTimes", nType, nCopyId, nBuyTimes)
end

-- 购买体力
function CMaterialsDungeonSystem:ReqBuyPower( )
	delog( "CMaterialsDungeonSystem:ReqBuyPower Done" )
	local oPlayer = self:GetPlayer( )
	if oPlayer.m_nBuyPowerTimes >= GameParamConfig_S.DailyPowerBuyMaxNum then
		delog("CMaterialsDungeonSystem:ReqBuyPower self.m_nBuyPowerTimes >= GameParamConfig_S.DailyPowerBuyMaxNum!", self.m_nBuyPowerTimes)
		return
	end

	-- 消耗
	if not oPlayer:CostItem(ItemEnum.eEiamond, GameParamConfig_S.BuyPower[1], ItemLogEnum.BuyPowerTimes) then
		delog( "CMaterialsDungeonSystem:ReqBuyPower not oPlayer:CostItem(ItemEnum.eEiamond" )
		return
	end 

	oPlayer.m_nBuyPowerTimes = oPlayer.m_nBuyPowerTimes + 1
	oPlayer.m_nPower = oPlayer.m_nPower + GameParamConfig_S.BuyPower[2]
	oPlayer:SetSaveDataRoleInfo("power", oPlayer.m_nPower)
	oPlayer:SetSaveDataRoleInfo("buypowertimes", oPlayer.m_nBuyPowerTimes)
	oPlayer:SendToClient( "C_ReqBuyPower", oPlayer.m_nBuyPowerTimes, oPlayer.m_nPower)
end

-- 请求通过副本
defineC.K_ReqPassDungeon = function ( oPlayer, nType, nCopyId, nWin, tStar )
	oPlayer:GetSystem( "CMaterialsDungeonSystem" ):ReqPassDungeon( nType, nCopyId, nWin, tStar )
end

-- 请求购买挑战次数
defineC.K_ReqBuyDungeonTimes = function ( oPlayer, nType, nCopyId, nBuyTimes )
	oPlayer:GetSystem( "CMaterialsDungeonSystem" ):ReqBuyDungeonTimes( nType, nCopyId, nBuyTimes )
end

-- 请求购买体力
defineC.K_ReqBuyPower = function ( oPlayer )
	oPlayer:GetSystem( "CMaterialsDungeonSystem" ):ReqBuyPower()
end
