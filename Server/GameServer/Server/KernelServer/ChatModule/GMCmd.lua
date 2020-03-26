local math_floor = math.floor;
local tonumber = tonumber;
local type = type;
local ItemConfig_S = RequireConfig( "ItemConfig_S" )
local petConfig_S = RequireConfig( "petConfig_S" )
local ItemLogEnum = RequireEnum("ItemLogEnum");
local now = _commonservice.now;
local ExpGainEnum_eGM	= RequireEnum("ExpGainEnum").eGM;
local GPC_MaxLevel		= RequireConfig("GameParamConfig_S").MaxLevel;
local CChat = RequireSingleton("CChat");
local CPlayerManager    = RequireSingleton("CPlayerManager")
local GameEventEnum = RequireEnum("GameEventEnum")

--Gs对应的gm指令 key为指令id
local tKsGmFunction = {	
 	--gm增加道具
	[1] = function(i_oPlayer, i_tArg) AddItemByGm(i_oPlayer, i_tArg[2], i_tArg[3]) end, 
 	--设置跳关
	[2] = function(i_oPlayer, i_tArg) SetMainDun(i_oPlayer, i_tArg[2], i_tArg[3]) end, 
 	--获取所有道具
	[3] = function(i_oPlayer) GetAllItem(i_oPlayer) end, 
 	--获取所有英雄
	[4] = function(i_oPlayer) GetAllPet(i_oPlayer) end,
	[5] = function(i_oPlayer) i_oPlayer:SendToClient( "C_Whosyourdaddy" ) end,
	[6] = function(i_oPlayer, i_tArg) AddEquipByGm(i_oPlayer, i_tArg[2], i_tArg[3]) end,
	[7] = function(i_oPlayer) AddGift(i_oPlayer, i_tArg[2]) end,
	[8] = function(i_oPlayer, i_tArg) AddInvite(i_oPlayer, i_tArg[2], i_tArg[3], i_tArg[4]) end,
}
--gm添加邀请人数
function AddInvite(i_oPlayer, nCount, bAdvertising, sInviteRoleID)
	-- local sRoleID = i_oPlayer:GetRoleID( )
	-- -- 当日人数累加
	-- if not CPlayerManager.m_tDayInviteNum[sRoleID] then
	-- 	CPlayerManager.m_tDayInviteNum[sRoleID] = nCount
	-- else
	-- 	CPlayerManager.m_tDayInviteNum[sRoleID] = CPlayerManager.m_tDayInviteNum[sRoleID] + nCount
	-- end 
	-- i_oPlayer:OnEvent( GameEventEnum.InvitationNum, nCount )
	-- --0非广告版 1广告版
	local bAd = bAdvertising == 1
	-- for i=1,nCount do
	-- 	i_oPlayer:ReqGetInviteVip(bAd)
	-- end
	-- i_oPlayer:SendToClient( "C_OnInvite", CPlayerManager.m_tDayInviteNum[sRoleID] )
	delog( "AddInvite Done", sInviteRoleID )
	CPlayerManager:OnInvite( bAd, 133642 .. "", sInviteRoleID )
end

--gm发奖励
function AddGift(i_oPlayer, nGiftID)
	i_oPlayer:AddGiftByID(nGiftID)
end

--gm增加装备
function AddEquipByGm(i_oPlayer, nEnumID, nCount)
	if not nCount then
		nCount = 1
	end
	i_oPlayer:GetSystem( "CEquipSystem" ):AddEquip( nEnumID, nCount )
end

--获取所有道具
function GetAllPet(i_oPlayer)
	for nEnumID, tCfg in pairs( petConfig_S ) do
		i_oPlayer:GetSystem( "CPetSystem" ):AddPet( nEnumID, 1 )
	end 
end

--获取所有道具
function GetAllItem(i_oPlayer)
	for nEnumID, tCfg in pairs( ItemConfig_S ) do
		if tCfg.dwItemTypes ~= 31 then
			i_oPlayer:GetSystem( "CItemSystem" ):AddItem( nEnumID, 999999 )
		end
	end 
end

--gm增加道具
function AddItemByGm(i_oPlayer, nEnumID, nCount)
	i_oPlayer:GetSystem( "CItemSystem" ):AddItem( nEnumID, nCount )
end

--设置跳关
function SetMainDun(i_oPlayer, nDungeonsLevel, nDungeonsIdx)
	if nDungeonsLevel < 10001 then
		nDungeonsLevel = nDungeonsLevel + 10000
	end 
	i_oPlayer.m_DungeonsLevel = nDungeonsLevel
	i_oPlayer.m_DungeonsIdx = nDungeonsIdx or 1
	i_oPlayer:SetSaveDataRoleInfo("dungeons", i_oPlayer.m_DungeonsLevel)
	i_oPlayer:SetSaveDataRoleInfo("duneonsidx", i_oPlayer.m_DungeonsIdx)
end

function CChat:GmOperate(i_oPlayer, i_tArg)  	
	local nGmId = i_tArg[1]
	tKsGmFunction[nGmId](i_oPlayer, i_tArg)
end
