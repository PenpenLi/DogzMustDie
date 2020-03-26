local ItemEnum = RequireEnum("ItemEnum")
local ActionTypeEnum = RequireEnum("ActionTypeEnum")
local GameEventEnum = RequireEnum("GameEventEnum")
local MarketConfig_S = RequireConfig("MarketConfig_S");
local CastingConfig = RequireConfig("CastingConfig_S");
local LotteryConfig_S = RequireConfig("LotteryConfig_S");
local ItemLogEnum = RequireEnum("ItemLogEnum")
local CItemConfigMgr = RequireSingleton("CItemConfigMgr")
local CActionManager = RequireSingleton("CActionManager")
local CMarketSystem = RequireClass("CMarketSystem");
local GameParamConfig = RequireConfig("GameParamConfig_S");
local ErrorCode = {
				Succeed = 1, 		--操作成功
				CostUnEnough = 2  	--消耗不足
				}


function CMarketSystem:Create(i_bRefresh)
	local oPlayer = self:GetPlayer();
	local nRoleId = oPlayer:GetRoleID();
	if i_bRefresh then
		self:OnDayRefresh()
	end
end

function CMarketSystem:SyncClientData()
	local oPlayer = self:GetPlayer();
	-- oPlayer:SendToClient("C_SendMarketLimitInfo", self.m_tInfo);
end

function CMarketSystem:SaveData()

end
-- bAdvertising 是否广告版
function CMarketSystem:BuyRequest( nType, nID, nNnm, bAdvertising )
	local oPlayer = self:GetPlayer( )
	local tbProduct = MarketConfig_S[nType][nID]
	if not tbProduct then
		print("===BuyRequest ERROR====nType==nID==",nType,nID)
		return
	end

	-- 获取当前购买次数
	local nBuyNum = oPlayer:GetMarketNum( nType, nID )
	-- 检测是否超过限购次数
	delog("==============", nType, nID, nNnm, bAdvertising)
	if bAdvertising and nType == 4 then

	else
		if tbProduct.MaxNum ~= -1 then
			if nBuyNum + nNnm > tbProduct.MaxNum then
				delog( "nBuyNum + nNnm > tbProduct.MaxNum" )
				return
			end
		end
	end
	

	local nMoney = tbProduct.Price[2] * nNnm;
	---折扣
	if tbProduct.Discount > 0 then 
		nMoney = math.floor(nMoney * tbProduct.Discount / 10)
	end

	if nType == 2 then	
		-- 宝箱活动信息
		local bOpen, nTimes, tMoney = CActionManager:IsBoxDiscountOpen( )
		if bOpen then
			local nUseTimes = oPlayer:GetBoxDiscount( nID )
			if nUseTimes < nTimes then
				nMoney = tMoney[nID]
			end
		end
	elseif nType == 4 then
		if not oPlayer:CheckHeroAwardCanBug( nID ) then
			delog( "not oPlayer:CheckHeroAwardCanBug( nID )" )
			return
		end
	end
	local tbItem = tbProduct.sellContent
	local sOtherLog = nil
	-- 暂时只有道具打log
	if tbItem[1] == 1 then
		sOtherLog = CItemConfigMgr:GetItemName( tbItem[2] )
	end

	-- 检测材料是否足够 并且消耗
	if not oPlayer:CostItem( tbProduct.Price[1], nMoney, ItemLogEnum.MarketBuyCost, sOtherLog ) then
		oPlayer:SendToClient("C_MarketBuyRes", ErrorCode.CostUnEnough)
		return
	end 

	local tAward = { }
	oPlayer:GetSystem("CGiftSystem"):AddGift(tbItem[1],tbItem[2],tbItem[3] * nNnm, tAward)
	oPlayer:SendToClient("C_MarketBuyRes", ErrorCode.Succeed, nType, nID, tAward )
	oPlayer:AddMarketNum( nType, nID, nNnm )
	if nType == 2 then
		oPlayer:ModBoxDiscount( nID, 1 )
	end
end

-- 请求抽奖
function CMarketSystem:ReqLottery( nType )
	delog( "CMarketSystem:ReqLottery Done" , type( nType ), nType )
	local tCfg = LotteryConfig_S[nType]
	if not tCfg then
		delog( "not tCfg" )
		return
	end 
	local oPlayer = self:GetPlayer( )
	local nDungons =  oPlayer:GetDungeonsCustoms( )
	
	local tLotteryCfg = nil
	-- 寻找对应的配置
	for _, tFlagCfg in ipairs( tCfg ) do 
		if nDungons < tFlagCfg.customNum then
			break
		end
		tLotteryCfg = tFlagCfg 
	end 
	if not tLotteryCfg then
		delog( "not tLotteryCfg" )
		return
	end
	local nUseLotteryNum = nType == 1 and 1 or 10

	-- 记录需要消耗对道具
	local tUseItem = { }
	-- 获取拥有抽奖卷对数量
	local nHasLottery = oPlayer:GetSystem( "CItemSystem" ):GetCount( ItemEnum.Lottery )
	
	-- 这里策划十连抽又不想用抽奖卷了 说以先特殊处理一下
	if nType == 2 then
		nHasLottery = 0
	end

	-- 判断代抽卷是否足够
	if nHasLottery >= nUseLotteryNum then
		tUseItem = { { ItemEnum.Lottery, nUseLotteryNum } }
	else
		-- 计算一次需要多少钱
		local nOneHasMoney = tLotteryCfg.needDiamond / nUseLotteryNum
		local nHasEiamondTimes = nUseLotteryNum - nHasLottery
		-- 如果十连运营活动开启的话则现在打折
		local bIsOpen, nMoney = CActionManager:IsTenevenDiscountsOpen( )
		local nToDayNum = oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.Teneven )
		local nHasMoney = nil
		-- 判断 是否是十连  是否开启了活动 是否是今天首次
		if (nType == 2) and bIsOpen and ( nToDayNum <= 0 ) then
			nHasMoney = nMoney
		end 

		tUseItem = { 
			{ItemEnum.Lottery, nHasLottery }, 	-- 需要代抽卷对数量
			{ItemEnum.eEiamond, math.floor( nHasMoney and nHasMoney or (nHasEiamondTimes * nOneHasMoney) ) }  -- 需要钻石对数量
		}
	end 
	if not oPlayer:CostItemList( tUseItem, ItemLogEnum.Lottery ) then
		oPlayer:SendToClient("C_ReqLottery", ErrorCode.CostUnEnough, nType )
		return 
	end

	local tAward = { }
	if nType == 1 then
		if oPlayer:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.OneLottery ) == 0 then
			local profid = oPlayer:GetProf( )
			local firstGiftAward = CastingConfig[profid]["firstGiftAward"]
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID(firstGiftAward, tAward)
		else
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.id, tAward)
		end
		oPlayer:OnEvent(GameEventEnum.OneLottery, 1)
	else
		local bGetGuarantee = false
		local minimumGuarantee = tLotteryCfg.minimumGuarantee
		for nIdx = 1, nUseLotteryNum - 1 do
			local tAwardFlag = { }
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.id, tAwardFlag)
			table.insert( tAward, tAwardFlag )
		end 

		local tAwardFlag = { }
		oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.minimumGuarantee, tAwardFlag)
		table.insert( tAward, tAwardFlag )
		oPlayer:OnEvent(GameEventEnum.Teneven, 1)
	end 
	oPlayer:SendToClient("C_ReqLottery", ErrorCode.Succeed, nType, tAward )
end
-- 请求抽奖 广告
function CMarketSystem:ReqLotteryAD( nType )
	local tCfg = LotteryConfig_S[nType]
	if not tCfg then
		delog( "not tCfg" )
		return
	end 
	local tAward = { }
	local oPlayer = self:GetPlayer( )
	local nDungons =  oPlayer:GetDungeonsCustoms( )
	local tLotteryCfg = nil
	-- 寻找对应的配置
	for _, tFlagCfg in ipairs( tCfg ) do 
		if nDungons < tFlagCfg.customNum then
			break
		end
		tLotteryCfg = tFlagCfg 
	end 
	if not tLotteryCfg then
		delog( "not tLotteryCfg" )
		return
	end
	local nUseLotteryNum = nType == 1 and 1 or 10
	if nType == 1 then
		if oPlayer:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.OneLottery ) == 0 then
			local profid = oPlayer:GetProf( )
			local firstGiftAward = CastingConfig[profid]["firstGiftAward"]
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID(firstGiftAward, tAward)
		else
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.id, tAward)
		end
		oPlayer:OnEvent(GameEventEnum.OneLottery, 1)
	else
		local bGetGuarantee = false
		local minimumGuarantee = tLotteryCfg.minimumGuarantee
		for nIdx = 1, nUseLotteryNum - 1 do
			local tAwardFlag = { }
			oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.id, tAwardFlag)
			table.insert( tAward, tAwardFlag )
		end 

		local tAwardFlag = { }
		oPlayer:GetSystem("CGiftSystem"):AddGiftByID( tLotteryCfg.minimumGuarantee, tAwardFlag)
		table.insert( tAward, tAwardFlag )
		oPlayer:OnEvent(GameEventEnum.Teneven, 1)
	end
	
	oPlayer:SendToClient("C_ReqLottery", ErrorCode.Succeed, nType, tAward ,oPlayer.m_nLookAdDrawTimes,oPlayer.m_nCoolingTime)
end
----------------------------------------------------------------------------

 -- 购买道具
defineC.K_MarketBuyReq = function (oPlayer, nType, nID, nNum, bAdvertising)
	oPlayer:GetSystem("CMarketSystem"):BuyRequest(nType, nID, math.floor(nNum), bAdvertising)
end

 -- 请求抽奖
defineC.K_ReqLottery = function (oPlayer, nType)
	oPlayer:GetSystem("CMarketSystem"):ReqLottery(nType)
end