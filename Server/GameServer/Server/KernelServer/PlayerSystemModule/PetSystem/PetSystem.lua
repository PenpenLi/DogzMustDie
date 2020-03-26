--道具系统
local now = _commonservice.now
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local petConfig_S = RequireConfig( "petConfig_S" )
local OpenGradeConfig_S = RequireConfig( "OpenGradeConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local GameEventEnum = RequireEnum("GameEventEnum")
local OpenLevel = OpenGradeConfig_S[3].Checkpoint
local HatchInterval = GameParamConfig_S.HatchInterval * 3600

local CPetSystem = RequireClass("CPetSystem")
function CPetSystem:Create( bRefresh )
	local oPlayer = self:GetPlayer( )
	local nRoleId = oPlayer:GetRoleID( )
	-- 存盘脏位
	self.tSaveCaches = { }
	-- 宠物列表( id = 数量 )
	self.tPetList = { }
	-- 当前剩余次数
	self.nHasTimes = 0
	-- 下次刷新时间搓
	self.nNextUpdateTime = 0
	-- 当前使用的宠物
	self.nUsePet = 0
	-- 是否标记红点
	self.tNewList = { }
	-- 记录当前宠物数量
	self.nPetCount = 0
	local res = oPlayer:GetPlayerData("CPetSystem")
	if res then
		self.tPetList = StrToTable( res.petinfo )
		self.nHasTimes = res.hastimes
		self.nNextUpdateTime = res.nexttime
		self.nUsePet = res.usepet
		self.tNewList = StrToTable( res.newlist )

		for nEnumID, nNum in pairs( self.tPetList ) do 
			self.nPetCount = self.nPetCount + 1
		end 
	end 
end

-- 英雄数量
function CPetSystem:GetPetCount( )
	return self.nPetCount
end

-- 存盘
function CPetSystem:SaveData()
	if next(self.tSaveCaches) then
		local oPlayer = self:GetPlayer();
		local sRoleID = oPlayer:GetRoleID();
        local oUpdateCmd = oPlayer:CreateUpdateCmd("pet_role");
        for k, v in pairs(self.tSaveCaches) do
            oUpdateCmd:SetFields(k, v)
        end
		oUpdateCmd:SetWheres("roleid", sRoleID, "=");
        oUpdateCmd:Execute()
        self.tSaveCaches = {}
	end
end

-- 判断功能是否开启
function CPetSystem:IsOpen( )
	local oPlayer = self:GetPlayer( ) 
	return oPlayer:GetDungeonsCustoms( ) >= OpenLevel
end 

function CPetSystem:Update(i_nDeltaMsec)
	self:CheckAddTimes( )
end

function CPetSystem:OnDungeonsLevel( nLevel )
	if OpenLevel == nLevel then
    	self:AddPet( GameParamConfig_S.InitialPet, 1 )
	end 
end

-- 检测是否有添加次数
function CPetSystem:CheckAddTimes( )
	-- 检测功能是否开启
	if not self:IsOpen( ) then
		return
	end 

	-- 检测是否达到上限
	if self.nHasTimes >= GameParamConfig_S.HatchMaxNum then
		return
	end 
	local oPlayer = self:GetPlayer( )

	local bChange = false

	-- 开始检测
	if self.nNextUpdateTime == 0 then
		self.nNextUpdateTime = now(1) + HatchInterval
		bChange = true
	elseif self.nNextUpdateTime > 0 then
		for nTimes = 1, GameParamConfig_S.HatchMaxNum do
			if now( 1 ) >= self.nNextUpdateTime then
				self.nHasTimes = self.nHasTimes + 1
				self.nNextUpdateTime = self.nNextUpdateTime + HatchInterval
				bChange = true
				if self.nHasTimes >= GameParamConfig_S.HatchMaxNum then
					break
				end 
			else
				break
			end 
		end 
		if self.nHasTimes >= GameParamConfig_S.HatchMaxNum then
			self.nNextUpdateTime = 0
			bChange = true
		end 
	end 
	if bChange then
		self.tSaveCaches["hastimes"] = self.nHasTimes
		self.tSaveCaches["nexttime"] = self.nNextUpdateTime
		oPlayer:SendToClient( "C_PetUpdateTimes", self.nHasTimes, self.nNextUpdateTime )
	end
end

function CPetSystem:SyncClientData( )
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_SendPetInfo", 
		self.tPetList, 
		self.nHasTimes, 
		self.nNextUpdateTime, 
		self.nUsePet,
		self.tNewList
		)
end

-- 添加宠物
function CPetSystem:AddPet( nEnumID, nNum )
	local oPlayer = self:GetPlayer( ) 
	if not petConfig_S[nEnumID] then
		return 
	end 

	if self.tPetList[nEnumID] and self.tPetList[nEnumID] >= GameParamConfig_S.PetMaxLevel then
		return
	end 

	nNum = nNum or 1
	if not self.tPetList[nEnumID] then
		self.tNewList[nEnumID] = 1
		self.nPetCount = self.nPetCount + 1
		self.tSaveCaches["newlist"] = TableToStr( self.tNewList )
	end 

	self.tPetList[nEnumID] = ( self.tPetList[nEnumID] or 0 ) + nNum
	self.tSaveCaches["petinfo"] = TableToStr( self.tPetList )
	oPlayer:OnEvent( GameEventEnum.PetAllLevel, nNum )
	oPlayer:SendToClient("C_AddPet", nEnumID, self.tPetList[nEnumID] )
end

-- 请求领取宠物
function CPetSystem:ReqGetPet( nNum )
	local oPlayer = self:GetPlayer( ) 
	if not self:IsOpen( ) then
		return
	end 
	-- 是否有次数
	if self.nHasTimes < nNum then
		return
	end  
	self.nHasTimes = self.nHasTimes - nNum

	-- 创建下次刷新时间
	if self.nNextUpdateTime == 0 then
		self.nNextUpdateTime = now(1) + HatchInterval
	end
	local tAllAward = { }
	for nTimes = 1, nNum do 
		oPlayer:GetSystem("CGiftSystem"):AddGiftByID(GameParamConfig_S.HatchAwardId, tAllAward)
	end 
	self.tSaveCaches["hastimes"] = self.nHasTimes
	oPlayer:SendToClient("C_ReqGetPet", tAllAward, self.nHasTimes, self.nNextUpdateTime)
end

-- 请求上阵宠物
function CPetSystem:ReqUsePet(nEnumID)
	local oPlayer = self:GetPlayer( ) 
	if not self:IsOpen( ) then
		return
	end 

	if not self.tPetList[nEnumID] then
		return
	end 

	self.nUsePet = nEnumID

	self.tSaveCaches["usepet"] = self.nUsePet
	oPlayer:SendToClient("C_ReqUsePet", nEnumID)
end

-- 请求上阵副本宠物
function CPetSystem:ReqCopyUsePet(nType, nEnumID)
	local oPlayer = self:GetPlayer( ) 
	if not self:IsOpen( ) then
		return
	end 

	if not self.tPetList[nEnumID] then
		return
	end 

	oPlayer.m_tCopyUsePet[nType] = nEnumID

	oPlayer:SetSaveDataRoleInfo("copyusepet", TableToStr(oPlayer.m_tCopyUsePet))
	oPlayer:SendToClient("C_ReqCopyUsePet", nType, nEnumID)
end

-- 请求查看宠物
function CPetSystem:ReqLookPet(nEnumID)
	local oPlayer = self:GetPlayer( ) 
	if not self:IsOpen( ) then
		return
	end 

	if not self.tNewList[nEnumID] then
		return
	end 

	self.tNewList[nEnumID] = nil
	self.tSaveCaches["newlist"] = TableToStr( self.tNewList )
end

-- 请求查看宠物
function CPetSystem:ReqGetCopyUsePet(nType)
	local oPlayer = self:GetPlayer( ) 
	oPlayer:SendToClient("C_ReqGetCopyUsePet", nType, oPlayer.m_tCopyUsePet[nType])
end


-- 请求领取宠物
defineC.K_ReqGetPet = function ( oPlayer, nNum )
	oPlayer:GetSystem( "CPetSystem" ):ReqGetPet( nNum )
end

-- 请求上阵
defineC.K_ReqUsePet = function ( oPlayer, nEnumID )
	oPlayer:GetSystem( "CPetSystem" ):ReqUsePet(nEnumID)
end

-- 请求查看宠物
defineC.K_ReqLookPet = function ( oPlayer, nEnumID )
	oPlayer:GetSystem( "CPetSystem" ):ReqLookPet(nEnumID)
end

-- 请求上阵副本神兽
defineC.K_ReqCopyUsePet = function ( oPlayer, nType, nEnumID )
	oPlayer:GetSystem( "CPetSystem" ):ReqCopyUsePet(nType, nEnumID)
end

-- 请求获取上阵副本神兽
defineC.K_ReqGetCopyUsePet = function ( oPlayer, nType )
	oPlayer:GetSystem( "CPetSystem" ):ReqGetCopyUsePet(nType)
end