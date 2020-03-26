-----------
-- other --
-----------
local CustomspassConfig_S = RequireConfig( "CustomspassConfig_S" )
local RoleLevelUpConfig_S = RequireConfig( "RoleLevelUpConfig_S" )
local ChargeReturnConfig_S = RequireConfig( "ChargeReturnConfig_S" )
local ChargeConfig_S = RequireConfig( "ChargeConfig_S" )

local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local PresentConfig_S = RequireConfig( "PresentConfig_S" )
local FairyConfig_S = RequireConfig( "FairyConfig_S" )
local CDBCommand = RequireSingleton("CDBCommand")
local GameEventEnum	= RequireEnum("GameEventEnum")
local ItemEnum = RequireEnum("ItemEnum")
local MailTypeEnum		= RequireEnum("MailTypeEnum")
local PlayerLogEnum = RequireEnum("PlayerLogEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local CPlayerManager		= RequireSingleton("CPlayerManager")
local CRankManager  = RequireSingleton("CRankManager")
local CCommonFunction	= RequireSingleton("CCommonFunction")
local OpenGradeConfig_S = RequireConfig("OpenGradeConfig_S")
local InvitationConfig_S = RequireConfig("InvitationConfig_S")
local FoundationConfig_S = RequireConfig("FoundationConfig_S")
local HeroPeckConfig_S = RequireConfig("HeroPeckConfig_S")
local CastingConfig = RequireConfig("CastingConfig_S")
local CDBService = RequireSingleton("CDBService")
local CActionManager = RequireSingleton("CActionManager")
local CPVPManager = RequireSingleton("CPVPManager")
local CMailManager = RequireSingleton("CMailManager")
local CGuildManager = RequireSingleton("CGuildManager")



local GPC_MaxLevel			= GameParamConfig_S.MaxLevel

-- global singleton
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager")
local CDataLog = RequireSingleton("CDataLog")
-- global function
local now = _commonservice.now
-- local
local CPlayer = RequireClass("CPlayer")
	


local nDay = 1
local nAchieven = 2

local HeroAwardMapping = { }
for nHeroID, tCfg in pairs( HeroPeckConfig_S ) do 
	HeroAwardMapping[tCfg.shopId] = nHeroID
end

-- 获得玩家角色
function CPlayer:GetProf()
	return self.m_nProfID
end

-- 是否是VIP
function CPlayer:IsVip( )
	return self:GetSystem( "CVipSystem" ):IsVip( )
end

function CPlayer:GetVipLevel(  )
	return self:IsVip( ) and 1 or 0
end

-- 是否是永久VIP
function CPlayer:IsPerpetualVip( )
	return self:GetSystem( "CVipSystem" ):IsPerpetualVip( )
end
function CPlayer:SetPKLeagueFlag(nVal)
    self.m_nPKLeagueFlag = nVal
    self:SetSaveDataRoleInfo("pkleagueflag", self.m_nPKLeagueFlag)
end
function CPlayer:GetHP()
	return self.m_nHP
end
function CPlayer:SetHP(i_nVal)
    self.m_nHP = i_nVal
    self:SetSaveDataRoleInfo("hp", self.m_nHP)
end

function CPlayer:GetMaxHP() 		
	return self.m_nMaxHP 	
end

function CPlayer:SetMaxHP(i_nVal) 	
	self.m_nMaxHP = i_nVal 	
end

-- 获取开服天数
function CPlayer:GetOpenDays( )
	local nOpenDayTime = CGlobalInfoManager:GetOpenDayTime()
	local nDays = math.floor((now(1) - nOpenDayTime) / 86400)
	return nDays
end

function CPlayer:LogLogin()
    CDataLog:LogPublicLogin_log( self:GetGYYXIF( ), self:GetOpenID( ), 1, "", self:GetMAC( ), self.m_deviceId, "", "", 0, self.m_sIP )
end

-- 消耗一组物品
function CPlayer:CostItemList( tCostLsit, nLogType, sOtherLog )
	return self:GetSystem("CItemSystem"):CostItemList(tCostLsit, nLogType, sOtherLog)
end

-- 添加奖励
function CPlayer:AddGiftByID( nGiftID, tAllAward, tMulriple, nMultiple )
	self:GetSystem( "CGiftSystem" ):AddGiftByID( nGiftID, tAllAward, tMulriple, nMultiple )
end

-- 消耗物品
function CPlayer:CostItem(nEnumID, nCount, nLogType, sOtherLog)
	return self:GetSystem("CItemSystem"):ReduceItem(nEnumID, nCount, nLogType, sOtherLog)
end

-- 获取当前关卡
function CPlayer:GetDungeonsLevel( )
	return self.m_DungeonsLevel
end

-- 获取当前第几关
function CPlayer:GetDungeonsCustoms( )
	local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
	return tCfg.customsOrder
end

-- 玩家完成当前关卡
function CPlayer:WinDungeons(bWin)
	local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
	if not tCfg then
		delog( "CPlayer:WinDungeons not tCfg", self.m_DungeonsLevel )
		return
	end
	-- 发奖励
	local tAllAward = { }
	if bWin then
		self:DistPlaylog( PlayerLogEnum.Dungeons, self:GetDungeonsDesc( self.m_DungeonsLevel, self.m_DungeonsIdx ), 2, 1, now(1) - self.m_DUngeonsDetTime)
		local tMulriple = { }
		if self:IsVip( ) then
			tMulriple[1] = { 
				[ItemEnum.eGold] = GameParamConfig_S.VipGoldUp,
			}
		end
		self:GetSystem("CGiftSystem"):AddGiftByID(tCfg.waveRewardID, tAllAward, tMulriple)
		self:GetSystem("CGiftSystem"):AddGiftByID(tCfg.waveRewardIdTwo, tAllAward)
		CActionManager:DropAward(self, tAllAward)
		if self.m_DungeonsIdx >= tCfg.waveNum then
			local profReward = CastingConfig[self.m_nProfID]["dunAward_"..tCfg.waveRewardID]
			if profReward then
				self:GetSystem("CGiftSystem"):AddGiftByID(profReward, tAllAward)
			else
				self:GetSystem("CGiftSystem"):AddGiftByID(tCfg.extraRewardID, tAllAward)
			end
			if CustomspassConfig_S[self.m_DungeonsLevel + 1] then
		 		self.m_DungeonsLevel = self.m_DungeonsLevel + 1
		 		self.m_DungeonsIdx = 1
		 		self:SetSaveDataRoleInfo("dungeons", self.m_DungeonsLevel)
		 		self:OnEvent( GameEventEnum.LevelCrossing, tCfg.customsOrder + 1 )
		 		self:OnEvent( GameEventEnum.WinCustoms, 1 )
		 		self:GetSystem( "CPetSystem" ):OnDungeonsLevel( tCfg.customsOrder + 1 )
		 		self:GetSystem( "CSignInSystem" ):OnDungeonsLevel( tCfg.customsOrder + 1 )
		 		CGuildManager:OnDungeonsLevel( self, tCfg.customsOrder )
			end
		else
			self.m_DungeonsIdx = self.m_DungeonsIdx + 1
			if self.m_Circulation == 1 and self.m_DungeonsIdx == tCfg.waveNum then
				self.m_DungeonsIdx = 1
			end 
		end
	else
		self:DistPlaylog( PlayerLogEnum.Dungeons, self:GetDungeonsDesc( self.m_DungeonsLevel, self.m_DungeonsIdx ), 3, 0, now(1) - self.m_DUngeonsDetTime)
		self.m_DungeonsIdx = 1
		self.m_Circulation = 1
	 	self:SetSaveDataRoleInfo("circulation", self.m_Circulation)
	end 
	self:SetSaveDataRoleInfo("duneonsidx", self.m_DungeonsIdx)
	self:SendToClient("C_WinDungeons", bWin, self.m_DungeonsLevel, self.m_DungeonsIdx, tAllAward)
	self:DistPlaylog( PlayerLogEnum.Dungeons, self:GetDungeonsDesc( self.m_DungeonsLevel, self.m_DungeonsIdx ), 1 )
	self.m_DUngeonsDetTime = now(1)
end

-- 获取关卡描述
function CPlayer:GetDungeonsDesc( nDungeonsLevel, nDungeonsIdx )
	local tCfg = CustomspassConfig_S[nDungeonsLevel]
	if not tCfg then
		return ""
	end
	return tCfg.customsOrder .. "-" .. nDungeonsIdx
end

-- 请求跳波
function CPlayer:GotoDungeons( )
	local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
	if self.m_DungeonsIdx > tCfg.waveNum then
		return
	end
	self.m_DungeonsIdx = tCfg.waveNum
	self.m_Circulation = 0
	self:SetSaveDataRoleInfo("circulation", self.m_Circulation)
	self:SetSaveDataRoleInfo("duneonsidx", self.m_DungeonsIdx)
	self:SendToClient("C_GotoDungeons", self.m_DungeonsIdx )
end

-- 请求完成当前关卡
defineC.K_WinDungeons = function(oPlayer, bWin)
	oPlayer:WinDungeons( bWin )
end

-- 请求跳波
defineC.K_GotoDungeons = function( oPlayer, nDungeonsIdx )
	oPlayer:GotoDungeons( nDungeonsIdx )
end

-- 获取阵容信息
function CPlayer:GetBattleArray( )
	return self.m_BattleArray
end

-- 设置阵容
function CPlayer:SetBattleArray( nPos, nEnumID )
	if not self:GetSystem( "CHeroSystem" ):IsActivate( nEnumID ) then
		return
	end 
	self.m_BattleArray[nPos] = nEnumID
	self:SetSaveDataRoleInfo("battlearray", TableToStr(self.m_BattleArray))
	self:SendToClient( "C_SaveBattleArray", self.m_BattleArray )
end

-- 获取捐献次数
function CPlayer:GetContribution( nType )
	return self.m_nContribution[nType] or 0
end

-- 设置捐献次数
function CPlayer:SetContribution( nType, nTimes )
	self.m_nContribution[nType] = nTimes
	self:SetSaveDataRoleInfo("contribution", TableToStr(self.m_nContribution))
end

-- 请求保存阵容
function CPlayer:SaveBattleArray(tBattleArray, bClient)
	delog("CPlayer:SaveBattleArray(tBattleArray) Done")
	local tArray = { }
	for nPos, nEnumID in pairs(tBattleArray) do 
		nPos = tonumber(nPos)
		nEnumID = tonumber(nEnumID)
		tArray[nPos] = nEnumID
	end 
	-- 检测是否有队长
	if not tArray[4] then
		delog( "not tArray[4]" )
		return
	end 

	for nPos, nEnumID in pairs(tArray) do 
		if not self:GetSystem( "CHeroSystem" ):IsActivate( nEnumID ) then
			delog("not self:GetSystem(CHeroSystem):IsActivate( nEnumID )")
			return
		end 
	end 

	local bSame = true
	for nPos, nEnumID in pairs(tArray) do 
		if self.m_BattleArray[nPos] ~= nEnumID then
			bSame = false
			break
		end 
	end 
	
	if bSame then
		return
	end 

	self.m_BattleArray = { }
	for nPos, nEnumID in pairs(tArray) do 
		self.m_BattleArray[nPos] = nEnumID
	end 
	self:SetSaveDataRoleInfo("battlearray", TableToStr(self.m_BattleArray))
	self:SendToClient( "C_SaveBattleArray", self.m_BattleArray, bClient )
end

-- 请求保存副本阵容
function CPlayer:SaveCopyBattleArray(nType, tBattleArray, bClient)
	delog("CPlayer:SaveCopyBattleArray(tBattleArray) Done")
	local tArray = { }
	for nPos, nEnumID in pairs(tBattleArray) do 
		nPos = tonumber(nPos)
		nEnumID = tonumber(nEnumID)
		tArray[nPos] = nEnumID
	end 
	-- 检测是否有队长
	if not tArray[4] then
		delog( "not tArray[4]" )
		return
	end 

	for nPos, nEnumID in pairs(tArray) do 
		if not self:GetSystem( "CHeroSystem" ):IsActivate( nEnumID ) then
			delog("not self:GetSystem(CHeroSystem):IsActivate( nEnumID )")
			return
		end 
	end 

	local bSame = true
	if not self.m_CopyBattleArray[nType] then
		self.m_CopyBattleArray[nType] = {}
	end
	for nPos, nEnumID in pairs(tArray) do 
		if self.m_CopyBattleArray[nType][nPos] ~= nEnumID then
			bSame = false
			break
		end 
	end 
	
	if bSame then
		return
	end 
	self.m_CopyBattleArray[nType] ={ }
	for nPos, nEnumID in pairs(tArray) do 
		self.m_CopyBattleArray[nType][nPos] = nEnumID
	end 
	self:SetSaveDataRoleInfo("copybattlearray", TableToStr(self.m_CopyBattleArray))
	self:SendToClient( "C_SaveCopyBattleArray", nType, self.m_CopyBattleArray[nType], bClient )
end

-- 请求保存副本阵容
function CPlayer:RepGetBattleArray(nType)

	self:SendToClient( "C_RepGetBattleArray", nType, self.m_CopyBattleArray[nType] )
end

-- 请求保存阵容
defineC.K_SaveBattleArray = function(oPlayer, tBattleArray)
	oPlayer:SaveBattleArray(tBattleArray, true)
end

-- 请求保存副本阵容
defineC.K_SaveCopyBattleArray = function(oPlayer, nType, tBattleArray)
	oPlayer:SaveCopyBattleArray(nType, tBattleArray, true)
end

-- 请求副本布阵
defineC.K_RepGetBattleArray= function(oPlayer, nType)
	oPlayer:RepGetBattleArray(nType)
end

-- 获得经验
function CPlayer:AddExp( nExp )
	if nExp <= 0 then
		return nExp
	end
    local nLvUpExp = RoleLevelUpConfig_S[self.m_nLevel].levelUpExp
	if self.m_nExp == nLvUpExp then
		return nExp	-- 满级了
	end
	local nExpAdd = self:GetSystem( "CPrivilegeSystem" ):GetExpAddition( )
	if nExpAdd > 0 then
		nExp =  math.floor( nExp + ( nExp * nExpAdd ) )
	end 
	local nNewExp = self.m_nExp + nExp
	while nNewExp >= nLvUpExp do
		if self.m_nLevel >= GPC_MaxLevel then	-- 到达上限
			nNewExp = nLvUpExp
			break
		end
		local tCfg = RoleLevelUpConfig_S[self.m_nLevel + 1]
		local nNextLUExp = tCfg and tCfg.levelUpExp	-- 经验表查不到时，认为到达上限
		if not nNextLUExp then
			nNewExp = nLvUpExp
			break
		end
		nNewExp = nNewExp - nLvUpExp
		self:ModLevel( 1 )
		nLvUpExp = nNextLUExp
	end
	self:SetExp(nNewExp)
	return nExp
end 

function CPlayer:GetMP()
	return self.m_nMP
end

function CPlayer:SetMP(nVal)
    self.m_nMP = nVal
end

-- 创建时间
function CPlayer:GetCreateTime()
	return self.m_nCreateTime;
end

-- 请求保存当前mp
defineC.K_SetMP = function( oPlayer, nVal )
	oPlayer:SetMP( nVal )
end

-- 获取当前阵营
function CPlayer:GetGuildID( )
	return self.m_nGuildID
end

function CPlayer:SetGuildID(nGuildID)
	self.m_nGuildID = nGuildID
	self:SetSaveDataRoleInfo("guildid", self.m_nGuildID)
end

-- 请求赠送礼物
defineC.K_ReqGiveGifts = function( oPlayer, nRoleID, nGiveID )
	oPlayer:ReqGiveGifts( nRoleID, nGiveID )
end

-- 请求赠送礼物
function CPlayer:ReqGiveGifts( nRoleID, nGiveID )
	delog( "CPlayer:ReqGiveGifts Done", nRoleID, nGiveID )

	-- 不能给自己赠送
	if nRoleID == self:GetRoleID( ) then
		return
	end 

	local tCfg = PresentConfig_S[nGiveID]
	if not tCfg then
		delog("not tCfg")
		return
	end 	

	local nTargetName = ""
	local oTarget = CPlayerManager:GetPlayerByRoleID(nRoleID)
	-- 是否在线
	if oTarget then
		nTargetName = oTarget:GetName( )
	else
		local oDBCmd = CDBCommand:CreateSelectCmd("role")
		oDBCmd:SetFields("rolename")
		oDBCmd:SetWheres("roleid", nRoleID, "=")
		oDBCmd:SetLimit(1)
		local res = oDBCmd:Execute()
		local info = res[1]
		if not info then
			delog("not info")
			return
		end 
        nTargetName = info.rolename
	end 

	-- 获取道具ID
	local nItemID = tCfg.itemId
	-- 检测材料是否足够 并且消耗
	if not self:CostItem( nItemID, 1, ItemLogEnum.GiveGifts ) then
		-- 如果道具数量不够则直接消耗钻石
		if not self:CostItem( tCfg.cost[1], tCfg.cost[2], ItemLogEnum.GiveGifts ) then
			delog( "cannot afford" )
			return
		end 
	end 

	-- 是否在线
	local nCharm = 0
	if oTarget then
		oTarget:GetSystem( "CEventSystem" ):OnEvent( GameEventEnum.Charm, tCfg.charm )
		oTarget:GetSystem( "CEventSystem" ):OnEvent( GameEventEnum.CharmWeek, tCfg.charm )
		nCharm = oTarget:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.Charm )
	else
		local oDBCmd = CDBCommand:CreateSelectCmd("event")
		oDBCmd:SetWheres("roleid", nRoleID, "=")
		oDBCmd:SetLimit(1)
		local res = oDBCmd:Execute()
		local data = res[1]
		if data then
			local tEvents = {}
			for nType, nValue in string.gmatch(data.event, "(%d+),(%d+)") do
				tEvents[tonumber(nType)] = tonumber(nValue)
			end
			tEvents[GameEventEnum.Charm] = ( tEvents[GameEventEnum.Charm] or 0 ) + tCfg.charm
			tEvents[GameEventEnum.CharmWeek] = ( tEvents[GameEventEnum.CharmWeek] or 0 ) + tCfg.charm
			CRankManager:OnEvent( nRoleID, GameEventEnum.Charm, tEvents[GameEventEnum.Charm] )
			CRankManager:OnEvent( nRoleID, GameEventEnum.CharmWeek, tEvents[GameEventEnum.CharmWeek] )
			nCharm = tEvents[GameEventEnum.Charm]
			local tTemp = {}
			for nType, nValue in pairs(tEvents) do
				table.insert(tTemp, string.format("%d,%d", nType, nValue))
			end
			local sEvents = table.concat(tTemp, ";")
			local oCmd = CDBCommand:CreateUpdateCmd("event")
			oCmd:SetWheres("roleid", nRoleID, "=")
			oCmd:SetFields("event", sEvents)
			oCmd:Execute()
		end 
	end 
	
	-- 发邮件
	CMailManager:SendMail(
		nRoleID, 
		MailTypeEnum.GiveGifts, 
		( tCfg.isTrue == 1 ) and {{1, nItemID, 1}},
		{self:GetName(), nTargetName, nGiveID, nCharm}
	)

	-- 跑马灯
	local broadId = tCfg.broadId
	local broadtype = tCfg.broadtype or 1
	if broadId > 0 then
		local oLinkTips = NewClass("CLinkTips")
		if broadtype == 1 then
			oLinkTips:AddRoleInfo(self:GetName())
			oLinkTips:AddRoleInfo(nTargetName)
			oLinkTips:AddItemInfo(nItemID)
		elseif broadtype == 2 then
			oLinkTips:AddRoleInfo(self:GetName())
			oLinkTips:AddItemInfo(nItemID)
			oLinkTips:AddRoleInfo(nTargetName)
		else
			oLinkTips:AddRoleInfo(self:GetName())
			oLinkTips:AddRoleInfo(nTargetName)
		end 
		CPlayerManager:SendSystemTipsToAll(broadId, oLinkTips:GetParams())
	end 
	
	self:SendToClient( "C_ReqGiveGifts", nGiveID, nTargetName )
end

-- 添加离线奖励
function CPlayer:AddLeaveAward()
	local nLeaveTime = self:GetLeaveTime( )
	if nLeaveTime <= 0 then
		return
	end 
	if nLeaveTime <= GameParamConfig_S.ProfitBegin then
		return
	end
	-- 计算奖励次数
	local nAwardTimes = 0 
	for nIdx, tInfo in ipairs(GameParamConfig_S.ProfitRatio) do 
		local nUseTime = tInfo[1] * 3600 -- 换算成秒
		local nFlag = tInfo[2]
		local nCanTime = math.min( nLeaveTime, nUseTime )
		-- 计算奖励次数
		local nTimes = ( nCanTime / GameParamConfig_S.ProfitInterval ) * nFlag
		nAwardTimes = nAwardTimes + nTimes
		nLeaveTime = nLeaveTime - nUseTime
		if nLeaveTime <= 0 then
			break
		end 
	end 
	nAwardTimes = math.floor( nAwardTimes )
	if nAwardTimes <= 0 then
		return
	end 
	-- 计算奖励
	local tAllAward = { }
	local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
	local tList = self:GetSystem("CGiftSystem").GetGiftByID( tCfg.waveRewardID )
	if self:IsVip( ) then
		if tList[1] and tList[1][ItemEnum.eGold] then
			tList[1][ItemEnum.eGold] = math.floor( tList[1][ItemEnum.eGold] + tList[1][ItemEnum.eGold] * GameParamConfig_S.VipGoldUp / 10000 )
		end 
	end 
	for nType, tAwardInfo in pairs(tList) do
        for nID, nNum in pairs(tAwardInfo) do
        	nNum = nNum * nAwardTimes
            self:GetSystem("CGiftSystem"):AddGift(nType, nID, math.floor(nNum), tAllAward)
        end
    end
    self:SendToClient( "C_AddLeaveAward", self:GetLeaveTime( ), tAllAward )
end

function CPlayer:AddLeaveAwardAd(  )
	local nLeaveTime = self:GetLeaveTime( )
	if nLeaveTime <= 0 then
		return
	end 
	if nLeaveTime <= GameParamConfig_S.ProfitBegin then
		return
	end
	-- 计算奖励次数
	local nAwardTimes = 0 
	for nIdx, tInfo in ipairs(GameParamConfig_S.ProfitRatio) do 
		local nUseTime = tInfo[1] * 3600 -- 换算成秒
		local nFlag = tInfo[2]
		local nCanTime = math.min( nLeaveTime, nUseTime )
		-- 计算奖励次数
		local nTimes = ( nCanTime / GameParamConfig_S.ProfitInterval ) * nFlag
		nAwardTimes = nAwardTimes + nTimes
		nLeaveTime = nLeaveTime - nUseTime
		if nLeaveTime <= 0 then
			break
		end 
	end 
	nAwardTimes = math.floor( nAwardTimes )
	if nAwardTimes <= 0 then
		return
	end 
	-- 计算奖励
	local tAllAward = { }
	local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
	local tList = self:GetSystem("CGiftSystem").GetGiftByID( tCfg.waveRewardID )
	if self:IsVip( ) then
		if tList[1] and tList[1][ItemEnum.eGold] then
			tList[1][ItemEnum.eGold] = math.floor( tList[1][ItemEnum.eGold] + tList[1][ItemEnum.eGold] * GameParamConfig_S.VipGoldUp / 10000 )
		end 
	end 
	for nType, tAwardInfo in pairs(tList) do
        for nID, nNum in pairs(tAwardInfo) do
			nNum = nNum * nAwardTimes
			if not tAllAward[1] then
				tAllAward[1] = {}
			end
			tAllAward[1][nID] = nNum
        end
    end
    self:SendToClient( "C_AddLeaveAwardAd", self:GetLeaveTime( ), tAllAward )
end
	


-- 角色改名
defineC.K_RoleRenameReq = function (oPlayer, i_sNewName)
	if type(i_sNewName) ~= "string" then return end
	oPlayer:RenameReq(i_sNewName);
end

local nNameMaxLen = 24
local sql_rolename = "select `roleid` from `role` where `rolename` = '%s' limit 1";
-- 请求改名
function CPlayer:RenameReq(i_sNewName)
	delog( "CPlayer:RenameReq(i_sNewName)", i_sNewName )
	-- 检测重名
	if self:GetName() == i_sNewName then
		self:SendSystemTips(30033)
		delog( "self:GetName() == i_sNewName" )
		return
	end

	if #i_sNewName > nNameMaxLen then 
		delog( "#i_sNewName > nNameMaxLen" )
		return 
	end
	
	-- 检测是否有英文标点
	if string.find(i_sNewName, "%p") then
		self:SendSystemTips(30034)
		delog( "string_find(i_sNewName, '%p'" )
		return
	end

	local nServerID = CGlobalInfoManager:GetServerID()
	i_sNewName = CCommonFunction.ProtectSql(i_sNewName)
	local tRes = CDBService:Execute(string.format(sql_rolename, i_sNewName), nServerID)
	if not tRes then 
		delog( "not tRes" )
		return 
	end
	-- 检测重名
	if #tRes > 0 then
		self:SendSystemTips(30033)
		delog( "#tRes > 0" )
		return
	end

	-- 获取改名次数
	local nChangeTimes = self:GetSystem( "CEventSystem" ):GetEventValue( GameEventEnum.ChangeName )
	if nChangeTimes > 0 then
		if not self:CostItem(ItemEnum.eEiamond, GameParamConfig_S.ReNameExpend, ItemLogEnum.GiveGifts) then
			delog( "not self:CostItem(ItemEnum.eEiamond, GameParamConfig_S.ReNameExpend, ItemLogEnum.GiveGifts)" )
			return
		end 
	end 
	self:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.ChangeName, 1)

	local sRoleID = self.m_sRoleID
	self.m_sName = i_sNewName
	local oCmd = CDBCommand:CreateUpdateCmd("role")
	oCmd:SetWheres("roleid", sRoleID, "=")
	oCmd:SetFields("rolename", i_sNewName)
	oCmd:Execute()
	CRankManager:OnPlayerRename(sRoleID, i_sNewName)
	CGuildManager:OnPlayerRename(self, i_sNewName)

	-- 客户端
	self:SendToClient("C_RoleRename", i_sNewName)
	delog( "CPlayer:Rename(i_sNewName) Win", i_sNewName )
end

 -- 修改客户端信息
function CPlayer:ChgCliendInfo( i_nIdx, i_nFlag )
	-- delog( "CPlayer:ChgCliendInfo( i_nIdx, i_nFlag )", i_nIdx, i_nFlag )
	if type( i_nFlag ) ~= "number" then
		delog( 'type( i_nFlag ) ~= "number"' )
		return
	end 
	if type( i_nIdx ) ~= "number" then
		delog( 'type( i_nIdx ) ~= "number"' )
		return
	end 
	if ( i_nIdx > 64 ) or ( i_nIdx < 1 ) then
		delog( "( i_nIdx > 64 ) or ( i_nIdx < 1 )" )
		return
	end 
	if i_nFlag >= math.pow( 2, 32 ) then
		delog( "i_nFlag >= math.pow( 2, 32 )" )
		return
	end 

	if i_nFlag < 0 then
		delog( "i_nFlag < 0" )
		return
	end 

	if i_nFlag ~= math.floor( i_nFlag ) then
		delog( "i_nFlag ~= math.floor( i_nFlag )", i_nFlag, math.floor( i_nFlag ) )
		return
	end 
	self.m_tClientInfo[i_nIdx] = math.floor( i_nFlag )
end

-- 修改客户端信息
defineC.K_ChgCliendInfo = function (oPlayer, i_nIdx, i_nFlag )
	oPlayer:ChgCliendInfo( i_nIdx, i_nFlag )
end

function CPlayer:GetHeadID()
	return self.m_nHeadID;
end

-- 请求修改头像
function CPlayer:ChangeHeadID(nHeadID)
	if self.m_nHeadID == nHeadID then
		return
	end 
	if nHeadID == 0 then

	elseif nHeadID > 0 then
		if not self:GetSystem( "CHeroSystem" ):IsActivate( nHeadID ) then
			return
		end 
	else
		return
	end 
	self.m_nHeadID = nHeadID
    self:SetSaveDataRole("rolehead", self.m_nHeadID)
	self:SendToClient( "C_ChgHeadID", nHeadID )
	-- 更新排行榜信息
	CRankManager:OnChangeHead(self)
end

-- 修改头像
defineC.K_ChgHeadID = function (oPlayer, nHeadID )
	oPlayer:ChangeHeadID( nHeadID )
end

-- 触发事件
function CPlayer:OnEvent(i_nEventType, i_nEventValue)
	self:GetSystem("CEventSystem"):OnEvent(i_nEventType, i_nEventValue)
end 

local RDName 		= 1		-- 名字
local RDRoleID 		= 2		-- 角色ID
local RDGuildID 	= 3		-- 阵营ID
local RDDungeonsID 	= 4		-- 通关关卡
local RDHeroNum 	= 5		-- 英雄数量
local RDPetNum 		= 6		-- 宠物数量
local RDLogoutTime 	= 7		-- 离线时间
local RDOnlie 		= 8		-- 是否在线

function CPlayer:ReqObserverInfo( sRoleID )
	local oTarget = CPlayerManager:GetPlayerByRoleID( sRoleID )
	local tbData = { }
	tbData[RDRoleID] = sRoleID
	-- 是否在线
	if oTarget then
		tbData[RDName] = oTarget:GetName( )
		tbData[RDGuildID] = oTarget:GetGuildID( )
		tbData[RDDungeonsID] = oTarget:GetDungeonsLevel( )
		tbData[RDHeroNum] = oTarget:GetSystem( "CHeroSystem" ):GetHeroCount( )
		tbData[RDPetNum] = oTarget:GetSystem( "CPetSystem" ):GetPetCount( )
		tbData[RDLogoutTime] = oTarget:GetLogoutTime( )
		tbData[RDOnlie] = 1
	else
		tbData[RDOnlie] = 0
		local oSelectCmd = CDBCommand:CreateSelectCmd("role")
		oSelectCmd:SetWheres("roleid", sRoleID, "=")
		oSelectCmd:SetLimit(1)
		local res = oSelectCmd:Execute()
		local data = res[1]
		if data then
			tbData[RDName] = data.rolename
			tbData[RDLogoutTime] = data.logouttime
		end

		oSelectCmd = CDBCommand:CreateSelectCmd("role_info")
		oSelectCmd:SetWheres("roleid", sRoleID, "=")
		oSelectCmd:SetLimit(1)
		res = oSelectCmd:Execute()
		data = res[1]
		if data then
			tbData[RDGuildID] = data.guildid
			tbData[RDDungeonsID] = data.dungeons
		end


		oSelectCmd = CDBCommand:CreateSelectCmd("pet_role")
		oSelectCmd:SetWheres("roleid", sRoleID, "=")
		oSelectCmd:SetLimit(1)
		res = oSelectCmd:Execute()
		data = res[1]
		if data then
			local nNum = 0
			local tPetList = StrToTable( data.petinfo )
			for nEnumID, nCount in pairs(tPetList) do 
				nNum = nNum + 1
			end 
			tbData[RDPetNum] = nNum
		end

		oSelectCmd = CDBCommand:CreateSelectCmd("hero_role")
		oSelectCmd:SetWheres("roleid", sRoleID, "=")
		data = oSelectCmd:Execute()
		if data then
			local nNum = 0
			for _, info in pairs(data) do 
				nNum = nNum + 1
			end 
			tbData[RDHeroNum] = nNum
		end
	end

	self:SendToClient("C_ReqObserverInfo", tbData )
end

-- 请求查看他人信息
defineC.K_ReqObserverInfo = function (oPlayer, sRoleID )
	oPlayer:ReqObserverInfo( sRoleID )
end

-- 获取充值次数
function CPlayer:GetChargeTimes( nGoodsType, nGoodsId )
	if not self.m_tChargeTimes[nGoodsType] then
		return 0
	end
	if not self.m_tChargeTimes[nGoodsType][nGoodsId] then
		return 0
	end
	return self.m_tChargeTimes[nGoodsType][nGoodsId]
end

-- 添加充值次数
function CPlayer:ModChargeTime( nGoodsType, nGoodsId )
	if not self.m_tChargeTimes[nGoodsType] then
		self.m_tChargeTimes[nGoodsType] = { }
	end
	if not self.m_tChargeTimes[nGoodsType][nGoodsId] then
		self.m_tChargeTimes[nGoodsType][nGoodsId] = 1
	else
		self.m_tChargeTimes[nGoodsType][nGoodsId] = self.m_tChargeTimes[nGoodsType][nGoodsId] + 1
	end
	self:SetSaveDataRoleInfo("chargetimes", TableToStr(self.m_tChargeTimes))
	self:SendToClient( "C_ChargeTime", self.m_tChargeTimes )
end

-- 缓存充值映射表
local tChargeMoneyMapping = { }
for nGoodsId, tTypeCfg in pairs(ChargeConfig_S[1]) do
	delog( nGoodsId, tTypeCfg )
	tChargeMoneyMapping[tTypeCfg.Price] = nGoodsId
end 

-- 请求获取充值反馈奖励
function CPlayer:ReqChargeFeedback( nMoney )
	local tCfg = ChargeReturnConfig_S[nMoney]
	if not tCfg then
		return
	end 

	local nGoodsId = tChargeMoneyMapping[nMoney]
	if not nGoodsId then
		return
	end 

	-- 检测充值次数
	if self:GetChargeTimes( 1, nGoodsId ) <= 0 then
		return
	end 

	-- 是否领取过奖励
	if self.m_tChargeFeedback[nMoney] == 1 then
		return
	end 
	self.m_tChargeFeedback[nMoney] = 1
	self:SetSaveDataRoleInfo("chargefeedback", TableToStr(self.m_tChargeFeedback))
	local tAllAward = { }
	self:AddGiftByID( tCfg.chargeReward, tAllAward )
	self:SendToClient( "C_ReqChargeFeedback", nMoney, tAllAward )
end

-- 请求获取充值反馈奖励
defineC.K_ReqChargeFeedback = function (oPlayer, nMoney )
	oPlayer:ReqChargeFeedback( nMoney )
end

-- 获取今天挑战次数
function CPlayer:GetPvpTimes( nType )
	return self.m_tPvpTimes[nType] or 0
end

-- 设置今日pvp次数
function CPlayer:ModPvpTimes(nType, nNum)
	local times = self:GetPvpTimes(nType) + nNum
	delog("========",times)
	if times > GameParamConfig_S.ParticipationMaxNum[nType] then
		delog("times > GameParamConfig_S.ParticipationMaxNum[nType]")
		return false
	end

	self.m_tPvpTimes[nType] = self:GetPvpTimes(nType) + nNum
    self:SetSaveDataRoleInfo("pvptimes", TableToStr(self.m_tPvpTimes))
    return true
end

-- 添加特权次数
function CPlayer:ModFreeUseNum(nPrivilege, nNum)
	self.m_tFreeUseNum[nPrivilege] = self:GetFreeUseNum( nPrivilege ) + nNum 
    self:SetSaveDataRoleInfo("freeusenum", TableToStr(self.m_tFreeUseNum))
    self:SendToClient( "C_UpdatePrivilege", nPrivilege, self.m_tFreeUseNum[nPrivilege] )
end

-- 获取特权次数
function CPlayer:GetFreeUseNum(nPrivilege)
	return self.m_tFreeUseNum[nPrivilege] or 0
end

-- 消耗特权次数
function CPlayer:SubFreeUseNum(nPrivilege, nNum)
	if self:GetFreeUseNum(nPrivilege) < nNum then
		return false
	end
	self.m_tFreeUseNum[nPrivilege] = self.m_tFreeUseNum[nPrivilege] - nNum 
    self:SetSaveDataRoleInfo("freeusenum", TableToStr(self.m_tFreeUseNum))
    self:SendToClient( "C_UpdatePrivilege", nPrivilege, self.m_tFreeUseNum[nPrivilege] )
    return true
end

-- 添加闯关领取记录
function CPlayer:SetShareCustomsFlag(nCustoms)
	self.m_tShareCustomsFlag[nCustoms] = 1
    self:SetSaveDataRoleInfo("sharecustomsflag", TableToStr(self.m_tShareCustomsFlag))
end

-- 获取闯关领取记录
function CPlayer:GetShareCustomsFlag(nCustoms)
	return self.m_tShareCustomsFlag[nCustoms] or 0
end

-- 请求挑战Boss
function CPlayer:ChallengeBoss()
	local bChallenge = 1
	local nDungeonsCustoms = self:GetDungeonsCustoms()
	local needCustoms = OpenGradeConfig_S[14].Checkpoint
	if nDungeonsCustoms < needCustoms then
		return 
	end
	--oPlayer:ModChallengeTimes();
	self:SendToClient( "C_ReqChallengeBoss", bChallenge )
	self.nWorldBossTime = now(1)
	self:DistPlaylog( PlayerLogEnum.WorldBoss, "", 1)
end

-- 请求挑战Boss
defineC.K_ReqChallengeBoss = function(oPlayer)
    oPlayer:ChallengeBoss();
end 

-- 接收玩家挑战Boss伤害
function CPlayer:RecChallengeHarm( nHarmData )
	CRankManager:OnChallenge( self, nHarmData )
	if self.nWorldBossTime then
		self:DistPlaylog( PlayerLogEnum.WorldBoss, "", 2, 0, now(1) - self.nWorldBossTime)
	end
end

-- 接收玩家挑战Boss伤害
defineC.K_ReqSendChallengeHarm = function(oPlayer, nHarmData)
    oPlayer:RecChallengeHarm( nHarmData );
end

-- 添加今日挑战Boss次数
function CPlayer:ModChallengeTimes()
	self.m_tChallengeTimes = (self.m_tChallengeTimes or 0) + 1
    self:SetSaveDataRoleInfo("challengebosstimes", self.m_tChallengeTimes)
end

--分享关卡奖励缓存
local tShareCustoms = {}
for nKey, nCustoms in ipairs( GameParamConfig_S.ShareRelationCustoms ) do 
    local nAward = GameParamConfig_S.ShareRelationCustomsReward
    tShareCustoms[nCustoms] = nAward[nKey]
end 

-- 请求分享入口
defineC.K_ReqShareGame = function(oPlayer, tInfo)
	delog( "defineC.K_ReqShareGame", oPlayer:GetName( ) )
    oPlayer:ReqShareGame( tInfo )
end

local eCallType = {
    base       		 = 1;    -- 普通分享入口
    role       		 = 2;    -- 英雄分享入口
    customs    		 = 3;    -- 闯关分享入口
    achievent     	 = 4;    -- 成就分享入口
    ladderContinuous = 5;    -- 天梯连胜分享入口
    ladderUpGrading  = 6;    -- 天梯进阶分享入口
    pvpContinuous    = 7;    -- 王者约战连胜分享入口
}
local tSharelog = {
    "普通分享";
    "英雄分享";
    "闯关分享";
    "成就分享";
    "天梯连胜分享";
    "天梯进阶分享";
    "王者约战连胜分享";
}
local ShareGameFunc = {
    [eCallType.base]      		= function( oMap, ... ) oMap:ShareBase( ... ) end,
    [eCallType.role]   			= function( oMap, ... ) oMap:ShareRole( ... ) end,
    [eCallType.customs]    		= function( oMap, ... ) oMap:ShareCustoms( ... ) end,
    [eCallType.achievent]    	= function( oMap, ... ) oMap:ShareAchieven( ... ) end,
    [eCallType.ladderContinuous]= function( oMap, ... ) oMap:ShareLadderContinuous( ... ) end,
    [eCallType.ladderUpGrading]	= function( oMap, ... ) oMap:ShareLadderUpGrading( ... ) end,
    [eCallType.pvpContinuous] 	= function( oMap, ... ) oMap:SharePvpContinuous( ... ) end,
}

-- 请求分享入口
function CPlayer:ReqShareGame( tInfo )
	if not tInfo.calltype then
		return
	end
	local nCallType = tonumber(tInfo.calltype)
	local sRoleID = tostring(tInfo.roleid)
	local nId = tonumber(tInfo.id) or 0
	local nEventId = tonumber(tInfo.eventId) or 0

	local sShareTypeText = "其他分享"	
	ShareGameFunc[nCallType]( self, nCallType, nId, nEventId )
	sShareTypeText = tSharelog[nCallType]

	-- 特权操作
	self:GetSystem( "CPrivilegeSystem" ):AddFreeUseNum( )

	-- 分享次数累加
	self:OnEvent( GameEventEnum.ShareNum, 1 )
	
	self:SendToClient( "C_ReqAddFreeUseNum" )
	CDataLog:LogDistShare_log(self:GetGYYXIF(), self:GetOpenID(), sShareTypeText)
	self.nShareGameTime = now(1)
end

--普通分享
function CPlayer:ShareBase( nCallType )
	self:SendToClient( "C_ReqShareGame", nCallType )
end

--英雄分享
function CPlayer:ShareRole( nCallType, nHeroID )
	self:GetSystem( "CHeroSystem" ):HeroLevelUp( nHeroID, GameParamConfig_S.ShareGetHeroLevel)
	self:SendToClient( "C_ReqShareGame", nCallType, nHeroID )
end

--闯关分享
function CPlayer:ShareCustoms( nCallType, nCustoms )
	if not nCustoms then
		delog("oPlayer:ShareCustoms Done", nCustoms)
		return
	end

	local nAward = tShareCustoms[nCustoms]
	delog(" ShareCustoms :", nAward, nCallType, nCustoms)
	if not nAward then
		delog("not nAward ", nAward)
		return
	end
	--是否已经领过
	if self:GetShareCustomsFlag(nCustoms) == 1 then 
		return
	end
	self:SetShareCustomsFlag(nCustoms)

	local tAllAward = { }
	self:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, nAward, tAllAward )
	self:SendToClient( "C_ReqShareGame", nCallType, nCustoms, tAllAward )
end

--成就分享
function CPlayer:ShareAchieven( nCallType, eAchievenType, nEventId)
	if not eAchievenType then
		delog("CPlayer:ShareAchieven ", nCallType, eAchievenType, nEventId)
		return
	end
	if not nEventId then
		return
	end 
	if eAchievenType == nDay then
		self:GetSystem("CAchievementSystem"):ReqDayAchievementAward( nEventId, true )
	elseif eAchievenType == nAchieven then
		self:GetSystem("CAchievementSystem"):ReqAchievementAward( nEventId, true )
	end

	self:SendToClient( "C_ReqShareGame", nCallType, eAchievenType, nEventId )
end

--天梯连胜分享
function CPlayer:ShareLadderContinuous( nCallType )
	local tAllAward = {}
	local nAward = 0

	local nContinuous = CPVPManager:GetLadderContinuous( self )
	for _,data in ipairs(GameParamConfig_S.LadderSuccessiveVictoryDiamond) do
		if nContinuous == data[1] then
			nAward = data[2]
			break;
		end
	end
	if nAward == 0 then 
		delog("CPlayer:ShareLadderContinuous nAward = 0", nCallType, nContinuous )
		return
	end
	self:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, nAward, tAllAward )
	self:SendToClient( "C_ReqShareGame", nCallType, 0, tAllAward )
end

--天梯进阶分享
function CPlayer:ShareLadderUpGrading ( nCallType )
	-- local nAward = GameParamConfig_S.LadderParagraphPromotionIntegral
	-- local nScore = CPVPManager:GetLadderScore( self ) + nAward
	-- CPVPManager:AddLadderGradRoleId( self, nScore )
	-- self:SendToClient( "C_ReqShareGame", nCallType )
end

--王者约战连胜分享
function CPlayer:SharePvpContinuous( nCallType )
	local tAllAward = {}
	local nAward = 0
	local sRoleID = self:GetRoleID( )
	local nContinuous = CPVPManager:GetContinuousByRoleId( sRoleID )
	for _,data in ipairs(GameParamConfig_S.KingsSuccessiveVictoryDiamond) do
		if nContinuous == data[1] then
			nAward = data[2]
			break;
		end
	end
	if nAward == 0 then
		delog("CPlayer:SharePvpContinuous nAward = 0", nCallType, nContinuous )
		return
	end
	self:GetSystem("CGiftSystem"):AddGift( 1, ItemEnum.eEiamond, nAward, tAllAward )
	self:SendToClient( "C_ReqShareGame", nCallType, 0, tAllAward )
end

-- 请求领取邀请奖励
function CPlayer:ReqGetInviteAward( nIdx )
	local tCfg = InvitationConfig_S[nIdx]
	if not tCfg then
		return
	end 

	-- 检测是否领取过奖励
	if self.m_Invitation[nIdx] == 1 then
		return
	end 

	-- 检测是否达到邀请数量
	if self:GetSystem( "CEventSystem" ):GetEventValue(GameEventEnum.InvitationNum) < nIdx then
		return
	end 

	self.m_Invitation[nIdx] = 1
	self:SetSaveDataRoleInfo("invitation", TableToStr(self.m_Invitation))

	local tAllAward = { }
	self:AddGiftByID( tCfg.rewardID, tAllAward )
	self:SendToClient( "C_ReqGetInviteAward", nIdx, tAllAward )
end

-- 请求邀请入口
defineC.K_ReqGetInviteAward = function(oPlayer, nIdx)
	oPlayer:ReqGetInviteAward( nIdx )
end

function CPlayer:ReqInviteDun( )
	self.m_InvitadunFlag = 1
    self:SetSaveDataRoleInfo("invitadunflag", self.m_InvitadunFlag)
end

-- 请求邀请跳关
defineC.K_ReqInviteDun = function(oPlayer)
	oPlayer:ReqInviteDun( )
end

-- 请求邀请vip
function CPlayer:ReqGetInviteVip( bAdvertising )
	local sRoleID = self:GetRoleID( )
	local addVipTime = 24
    if bAdvertising then
    	addVipTime = 48
    else
    	if self.m_InvitaVipFlag == 1 then
			delog("ReqGetInviteVip self.m_InvitaVipFlag == 1")
			return
		end
    end
	 
	-- 是否达到上限
	if self.m_InvitaVipTimes >= GameParamConfig_S.FreeVipGetMaxNum and bAdvertising ~= true then
		delog("ReqGetInviteVip self.m_InvitaVipTimes >= GameParamConfig_S.FreeVipGetMaxNum and bAdvertising ~= true")
		return
	end 

	local nDayInviteNum = self:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.InvitationNum )
	if nDayInviteNum < GameParamConfig_S.HelpPassDailyNum then
		delog("ReqGetInviteVip nDayInviteNum < GameParamConfig_S.HelpPassDailyNum")
		return
	end 
	
	delog("===============", nDayInviteNum, GameParamConfig_S.HelpPassDailyNum)
	self.m_InvitaVipTimes = self.m_InvitaVipTimes + 1
	self.m_InvitaVipFlag = 1
    self:SetSaveDataRoleInfo("invitavipflag", self.m_InvitaVipFlag)
    self:SetSaveDataRoleInfo("invitaviptimes", self.m_InvitaVipTimes)
    
    self:GetSystem("CVipSystem"):AddVip( addVipTime * 3600 )
	self:SendToClient( "C_ReqGetInviteVip", bAdvertising )
end

-- 请求邀请vip
defineC.K_ReqGetInviteVip = function(oPlayer, bAdvertising)
	oPlayer:ReqGetInviteVip( bAdvertising )
end 

-- 获取是否购买了基金
function CPlayer:IsBuyFund()
	return self.m_nBuyFund == 1
end

-- 获取领取对应基金奖励情况
function CPlayer:IsGetFund( nFundId )
	return self.m_tBuyFundTims[nFundId] or 0
end

-- 购买基金
function CPlayer:RecBuyFund( bAdvertising  )
	-- 广告版本不需要VIP
	if ( not self:IsPerpetualVip( ) ) and ( bAdvertising ~= true ) then
		delog( "not Vip!" )
		return
	end
	if self:IsBuyFund( ) then
		delog( "self:IsBuyFund" )
		return
	end 
	if not self:CostItem( ItemEnum.eEiamond, GameParamConfig_S.BuyFoundationNeedDiamond, ItemLogEnum.BuyFund) then
		delog( "not self:CostItem(ItemEnum.eEiamond, GameParamConfig_S.BuyFoundationNeedDiamond, ItemLogEnum.BuyFund)" )
		return
	end

	--设置购买了基金
	self.m_nBuyFund = 1
    self:SetSaveDataRoleInfo("busefund", self.m_nBuyFund)

    self:SendToClient( "C_RecBuyFund")
end

--领取基金
function CPlayer:RecGetFundAward( nFundId )
	local tcfg = FoundationConfig_S[nFundId]
	if not tcfg then
		delog("nFundId is not find in FoundationConfig_S", type(nFundId) , nFundId, tcfg)
		return
	end
	if self:GetDungeonsCustoms() < tcfg.customsNum then
		delog("Customs not enough ", self:GetDungeonsCustoms(), tcfg.customsNum )
		return
	end
	
	-- 判断是否领取过
	if self:IsGetFund(nFundId) == 1 then
		return
	end
	self.m_tBuyFundTims[nFundId] = 1
	self:SetSaveDataRoleInfo("busefundtims", TableToStr(self.m_tBuyFundTims))
	local tAllAward = { }
	self:GetSystem("CGiftSystem"):AddGiftByID( tcfg.rewardId, tAllAward )
	self:SendToClient( "C_RecGetFundAward", nFundId, tAllAward )
end

-- 购买基金
defineC.K_ReqBuyFund = function(oPlayer, bAdvertising)
    oPlayer:RecBuyFund( bAdvertising )
end

-- 领取基金
defineC.K_ReqGetFundAward = function(oPlayer, nFundId)
    oPlayer:RecGetFundAward( nFundId )
end

-- 获取特权购买次数
function CPlayer:GetPrivilegeDiscount( nPrivilege )
	return self.m_tPrivilegeDiscount[nPrivilege] or 0
end

-- 添加特权购买次数
function CPlayer:ModPrivilegeDiscount( nPrivilege, nTimes )
	if not self.m_tPrivilegeDiscount[nPrivilege] then
		self.m_tPrivilegeDiscount[nPrivilege] = 1
	else
		self.m_tPrivilegeDiscount[nPrivilege] = self.m_tPrivilegeDiscount[nPrivilege] + 1
	end 
    self:SetSaveDataRoleInfo("privilegediscount", TableToStr(self.m_tPrivilegeDiscount))
    self:SendToClient( "C_UpdatePrivilegeDiscount", nPrivilege, self.m_tPrivilegeDiscount[nPrivilege] )
end

-- 获取礼包购买次数
function CPlayer:GetBoxDiscount( nID )
	return self.m_tBoxDiscount[nID] or 0
end

-- 添加礼包购买次数
function CPlayer:ModBoxDiscount( nID, nTimes )
	if not self.m_tBoxDiscount[nID] then
		self.m_tBoxDiscount[nID] = 1
	else
		self.m_tBoxDiscount[nID] = self.m_tBoxDiscount[nID] + 1
	end 
    self:SetSaveDataRoleInfo("boxdiscount", TableToStr(self.m_tBoxDiscount))
    self:SendToClient( "C_UpdateBoxDiscount", nID, self.m_tBoxDiscount[nID] )
end

-- 检测是否有过期的英雄并删除
function CPlayer:CheckHeroAwardList( )
	local tFlag = { }
	for nHeroID, nDeTime in pairs( self.m_tActivateHeroAwardList ) do 
		if now(1) >= nDeTime then
			table.insert( tFlag, nHeroID )
		end
	end
	for _, nHeroID in ipairs( tFlag ) do 
		self.m_tActivateHeroAwardList[nHeroID] = nil
	end
	if #tFlag > 0 then
    	self:SetSaveDataRoleInfo("heroawardlist", TableToStr(self.m_tActivateHeroAwardList))
	end
end

-- 激活英雄礼包
function CPlayer:ActivateHeroAward( nHeroID )
	local tCfg = HeroPeckConfig_S[nHeroID]
	if not tCfg then
		return
	end
	self.m_tActivateHeroAwardList[nHeroID] = now(1) + tCfg.limitTime
    self:SetSaveDataRoleInfo("heroawardlist", TableToStr(self.m_tActivateHeroAwardList))
	self:SendToClient( "C_ActivateHeroAward", nHeroID, self.m_tActivateHeroAwardList[nHeroID] )
end

-- 判断商店是否能购买英雄卡牌
function CPlayer:CheckHeroAwardCanBug( nID )
	local nHeroID = HeroAwardMapping[nID]
	if not nHeroID then
		delog("CPlayer:CheckHeroAwardCanBug not nHeroID")
		return false
	end
	if not self.m_tActivateHeroAwardList[nHeroID] then
		delog("CPlayer:CheckHeroAwardCanBug not self.m_tActivateHeroAwardList[nHeroID]")
		return false
	end
	return self.m_tActivateHeroAwardList[nHeroID] > now(1)
end

-- 添加商城购买次数
function CPlayer:AddMarketNum( nType, nID, nNnm )
	if not self.m_tMarketNumList[nType] then
		self.m_tMarketNumList[nType] = { }
	end
	if not self.m_tMarketNumList[nType][nID] then
		self.m_tMarketNumList[nType][nID] = 0
	end
	self.m_tMarketNumList[nType][nID] = self.m_tMarketNumList[nType][nID] + nNnm
    self:SetSaveDataRoleInfo("marketnumlist", TableToStr(self.m_tMarketNumList))
end

-- 获取商城购买次数
function CPlayer:GetMarketNum( nType, nID )
	if not self.m_tMarketNumList[nType] then
		return 0
	end
	return self.m_tMarketNumList[nType][nID] or 0
end

-- 记录玩家活动log
function CPlayer:DistPlaylog( play_type, play_name, op_type, is_success, use_time )
	CDataLog:LogDistPlay_log( 
		self:GetGYYXIF( ), 
		self:GetOpenID( ), 
		self:GetRoleID( ), 
		self:GetLevel( ), 
		play_type, 
		play_name, 
		op_type, 
		is_success or 0,
		use_time or 0 )
end

-- 请求领取小仙女奖励
function CPlayer:ReqAngelBeats( nType, nId, bRedAdvertising)
	delog( "CPlayer:ReqAngelBeats Done", nType, nId )
	local tCfg = FairyConfig_S[nType]
	if not tCfg then
		return
	end
	tCfg = tCfg[nId]
	if not tCfg then
		return
	end
	-- 检测是否可以领取
	if ( self.m_nAngelBeats + GameParamConfig_S.FairyGenerationTime[1] ) >= now(1) then
		delog( "( self.m_nAngelBeats + GameParamConfig_S.FairyGenerationTime[1] ) < now(1)", self.m_nAngelBeats )
		return
	end
    local nMultiple = 1
    -- 需要看广告获得翻倍奖励的，弹出看广告二级界面
    if tCfg.fairyType == 1 then
    	if bRedAdvertising == true then
    		nMultiple = 5
    	end
    -- 不需要看广告的奖励，点击小仙女后宝箱落到地上直接弹出获得道具通用展示界面
    elseif tCfg.fairyType == 2 then

    --必须看广告才能领取奖励，看完广告后再回到这个界面，界面显示一个领取按钮，点击领取奖励，界面底部文本描述国际化ID
    elseif tCfg.fairyType == 3 then

    else
    	return
    end
	self.m_nAngelBeats = now(1)
    self:SetSaveDataRoleInfo("angelbeats", self.m_nAngelBeats)
    local tAllAward = { }
    self:AddGiftByID( tCfg.rewardId, tAllAward, nil, nMultiple )
    self:SendToClient( "C_ReqAngelBeats", nType, nId, bRedAdvertising, tAllAward )
end

-- 请求领取小仙女奖励
defineC.K_ReqAngelBeats = function(oPlayer, nType, nId, bRedAdvertising)
	oPlayer:ReqAngelBeats(  nType, nId, bRedAdvertising )
end

-- 微信临时广告发放次数
local nWXAdertisingTimes = 10
-- 广告类型
local eAdvertisingType = {
    defeated      	= 0;    -- 不能看广告
    angelBeats      = 1;    -- 小仙女广告
    diamond       	= 2;    -- 钻石广告
    signIn    		= 3;    -- 签到广告
    pvp    		 	= 4;    -- 王者约战广告
    heroPeck    	= 5;    -- 英雄进阶礼包广告
    ladder    		= 6;    -- 天梯广告
    mpRecover    	= 7;    -- MP恢复广告
	wroldBoss    	= 8;    -- 世界Boss广告
	freeluckdraw   =9;     -- 商城免费抽奖 广告
	weekLogin       = 10,   -- 七日登陆广告版
	LeaveAward      =11 ,   --离线收益广告
	Achievement    = 12,    --成就广告
}

-- 广告类型文字
local eAdvertisingStr = {
    [eAdvertisingType.defeated]     = "不能看广告";
    [eAdvertisingType.angelBeats]   = "小仙女广告";
    [eAdvertisingType.diamond]      = "钻石广告";
    [eAdvertisingType.signIn]    	= "签到广告";
    [eAdvertisingType.pvp]    		= "王者约战广告";
    [eAdvertisingType.heroPeck]    	= "英雄进阶礼包广告";
    [eAdvertisingType.ladder]    	= "天梯广告";
    [eAdvertisingType.mpRecover]    = "MP恢复广告";
	[eAdvertisingType.wroldBoss]    = "世界Boss广告";	
	[eAdvertisingType.freeluckdraw] = "商城免费抽奖广告";	
	[eAdvertisingType.weekLogin]    = "七日登陆广告版";	
	[eAdvertisingType.LeaveAward]   = "离线收益广告";
	[eAdvertisingType.Achievement]   = "成就广告";

}

-- 广告执行方法
local AdvertisingFunc = {
    [eAdvertisingType.angelBeats]   = function( oMap, nType, ... ) oMap:AdvertisingAngelBeats( nType, ... ) end,
    [eAdvertisingType.diamond]   	= function( oMap, nType, ... ) oMap:AdvertisingDiamond( nType, ... ) end,
    [eAdvertisingType.signIn]    	= function( oMap, nType, ... ) oMap:AdvertisingSignIn( nType, ... ) end,
    [eAdvertisingType.pvp]    		= function( oMap, nType, ... ) oMap:AdvertisingPvp( nType, ... ) end,
    [eAdvertisingType.heroPeck]    	= function( oMap, nType, ... ) oMap:AdvertisingHeroPeck( nType, ... ) end,
    [eAdvertisingType.ladder]    	= function( oMap, nType, ... ) oMap:AdvertisingLadder( nType, ... ) end,
    [eAdvertisingType.mpRecover]    = function( oMap, nType, ... ) oMap:AdvertisingCommon( nType, ... ) end,
    [eAdvertisingType.wroldBoss]    = function( oMap, nType, ... ) oMap:AdvertisingCommon( nType, ... ) end,
    [eAdvertisingType.weekLogin]    = function( oMap, nType, ... ) oMap:AdvertisingCommon( nType, ... ) end,
    [eAdvertisingType.freeluckdraw]    = function( oMap, nType, ... ) oMap:Advertisingfreeluckdraw( nType, ... ) end,
    [eAdvertisingType.LeaveAward]    = function( oMap, nType, ... ) oMap:AdvertisingLeaveAward( nType, ... ) end,
    [eAdvertisingType.Achievement]    = function( oMap, nType, ... ) oMap:AdvertisingAchievement( nType, ... ) end,
}

-- 请求广告奖励
function CPlayer:ReqAdvertising( nType, ... )
	-- 检测微信今日发放次数是否充足
	local nTimes = self:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.AdvertisingTimes )
	if nTimes >= nWXAdertisingTimes then
	delog("CPlayer:ReqAdvertising( ) nTimes >= nWXAdertisingTimes")
		self:SendToClient( "C_ReqAdvertising", eAdvertisingType.defeated )
 		return
 	end
 	if nType ~= 0 then
		self:DistPlaylog( PlayerLogEnum.AD, eAdvertisingStr[nType], 1)
 	end
   	AdvertisingFunc[nType]( self, nType, ... )
end

-- 通用广告
function CPlayer:AdvertisingCommon( nType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	self:SendToClient( "C_ReqAdvertising", nType )
end

-- 商城免费抽奖广告
function CPlayer:Advertisingfreeluckdraw( nType ,nItemType)
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	self.m_nCoolingTime= now(1)
	self.m_nLookAdDrawTimes =self.m_nLookAdDrawTimes + 1

	self:SetSaveDataRoleInfo("m_nLookAdDrawTimes", self.m_nLookAdDrawTimes)
	self:SetSaveDataRoleInfo("m_nCoolingTime", self.m_nCoolingTime)
	self:GetSystem("CMarketSystem"):ReqLotteryAD( nItemType )
end

--成就广告 奖励发放
function CPlayer:AdvertisingAchievement( nType, ... )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	local eAchieveType, nEventId = ...
	if eAchieveType == 1 then 
		self:GetSystem("CAchievementSystem"):ReqDayAchievementAward(nEventId,false,true)
	elseif eAchieveType == 2 then
		self:GetSystem("CAchievementSystem"):ReqAchievementAward(nEventId,false,true)
	end
end

-- 离线收益广告奖励发放
function CPlayer:AdvertisingLeaveAward( nType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	self:SendToClient( "C_ReqLeaveAward", nType )  --C_ReqAngelBeats
	self:AddLeaveAward()
end

-- 小仙女广告
function CPlayer:AdvertisingAngelBeats( nType, nAngelBeatsType, nId )
	local nTimes = self.m_tAdvertisingTimes[nType] or 0
	-- 检测次数
	if nTimes >= GameParamConfig_S.advertisementDailyDiamondNum then
		delog("nTimes >= GameParamConfig_S.advertisementDailyDiamondNum")
		return
	end
	-- 记录次数
	self:AddAdvertisingTimes( nType )

	self:ReqAngelBeats( nAngelBeatsType, nId, true )
end
-- 钻石广告
function CPlayer:AdvertisingDiamond( nType )
	-- 检测次数
	if GameParamConfig_S.advertisementDailyNum ~= -1 then
		local nTimes = self.m_tAdvertisingTimes[nType] or 0
		if nTimes >= GameParamConfig_S.advertisementDailyNum then
			return
		end
	end

	-- 时间检测
	if ( self.m_nAdvertisingTime + GameParamConfig_S.advertisementCD ) >= now(1) then
		return
	end
	-- 记录次数
	self:AddAdvertisingTimes( nType )

	self.m_nAdvertisingTime = now(1)
    self:SetSaveDataRoleInfo("advertisingtime", self.m_nAdvertisingTime)
    
    local tAllAward = { }
    self:GetSystem("CGiftSystem") :AddGift(1, ItemEnum.eEiamond, GameParamConfig_S.advertisementDaiamod, tAllAward)
    self:SendToClient( "C_ReqAdvertising", nType, tAllAward, self.m_nAdvertisingTime)
end
-- 签到广告
function CPlayer:AdvertisingSignIn( nType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	self:GetSystem( "CSignInSystem" ):ReqSignIn( true )
end
-- 王者约战广告
function CPlayer:AdvertisingPvp( nType, nPvpType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	if not self:ModPvpTimes( nPvpType, -1 ) then
		delog("not self:ModPvpTimes( nType, -1 )")
		return
	end
	self:SendToClient( "C_ReqAdvertising", nType )
end
-- 天梯广告
function CPlayer:AdvertisingLadder( nType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )

	self:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.LadderAdverTimes, 1)

	self:SendToClient( "C_ReqAdvertising", nType )
end

-- 英雄进阶礼包广告
function CPlayer:AdvertisingHeroPeck( nType, nHeroPeckType )
	-- 记录次数
	self:AddAdvertisingTimes( nType )
	if self.m_tHeroPeckAdFlag[nHeroPeckType] == 1 then
		delog("self.m_tHeroPeckAdFlag[nHeroPeckType] == 1 ")
		return
	end
	delog(m_tHeroPeckAdFlag)
	self.m_tHeroPeckAdFlag[nHeroPeckType] = 1
	delog(self.m_tHeroPeckAdFlag)
	self:SetSaveDataRoleInfo("heropeckadflag", TableToStr(self.m_tHeroPeckAdFlag))
	self:SendToClient( "C_ReqAdvertising", nType )
end

-- 请求广告奖励
defineC.K_ReqAdvertising = function(oPlayer, nType, ...)
	oPlayer:ReqAdvertising( nType, ... )
end


-- 增加看广告次数
function CPlayer:AddAdvertisingTimes( nType )
	-- 总次数
	self:OnEvent( GameEventEnum.AdvertisingTimes, 1 )

	if not self.m_tAdvertisingTimes[nType] then
		self.m_tAdvertisingTimes[nType] = 0
	end
	self.m_tAdvertisingTimes[nType] = self.m_tAdvertisingTimes[nType] + 1
    self:SetSaveDataRoleInfo("advertisingtimes", TableToStr(self.m_tAdvertisingTimes))
 end