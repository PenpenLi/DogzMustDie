
-- global function
local logfile   = logfile
local print     = print
local pairs     = pairs
local ipairs    = ipairs
-- global singleton
local CCenter		= RequireSingleton("CCenter")
local CKS           = RequireClass("CKS")
local CKSManager    = RequireSingleton("CKSManager")
local CSchedule     = RequireSingleton("CSchedule")
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum")

function CCenter:OnPlayerCreateChar(i_tData)
    local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_PlayerCreateChar", i_tData)
    end
end
defineCM.CM_ReportPlayerCreateChar = function(i_oKS, i_tData)
	CCenter:OnPlayerCreateChar(i_tData)
end

function CCenter:OnPlayerRename(i_sNewName, i_sOldName)
    local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_PlayerRename", i_sNewName, i_sOldName)
    end
end
defineCM.CM_ReportPlayerRename = function(i_oKS, i_sNewName, i_sOldName)
	CCenter:OnPlayerRename(i_sNewName, i_sOldName)
end

function CCenter:GetInviteNum (i_tData)
    local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_GetInviteNum", i_tData)
    end
end
defineCM.CM_GetInviteNum = function(i_oKS,i_tData)
    CCenter:GetInviteNum(i_tData)
end

function CCenter:OnPlayerChangeCharInfo(i_oKS, i_tData)
	local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_PlayerChangeCharInfo", i_tData)
    end

    -- 人物信息记录到center KS里
    if i_oKS then
        i_oKS:OnPlayerEverydayEnter( i_tData )
    end
end
-- 所有characters相关更新都走统一消息
defineCM.CM_ReportCharactersInfo = function(i_oKS, i_tData)
	CCenter:OnPlayerChangeCharInfo(i_oKS, i_tData)
end

function CCenter:OnPlayerEverydayEnter(i_tData)
	local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_PlayerEverydayEnter", i_tData)
    end
end
defineCM.CM_ReportPlayerEverydayEnter = function(i_oKS, i_tData)
	CCenter:OnPlayerEverydayEnter(i_tData)
end

function CCenter:Banspeak(i_sRoleID, i_nWaitTime, i_nServerID)
    local tbID2KS = CKSManager:GetKSByID()
    if i_nServerID then
        local oKS = tbID2KS[i_nServerID]
        oKS:Send("K_BanSpeak", i_sRoleID, i_nWaitTime)
    else
        for _, oKS in pairs(tbID2KS) do
            oKS:Send("K_BanSpeak",i_sRoleID, i_nWaitTime)
        end
    end    
end
defineCT.CT_Banspeak = function(i_pSession, i_sRoleID, i_nWaitTime, i_nServerID)
    CCenter:Banspeak(i_sRoleID, i_nWaitTime, i_nServerID)
end
function CCenter:Banplay( i_sRoleID, i_nWaitTime, i_nServerID)
    local tbID2KS = CKSManager:GetKSByID()
    if i_nServerID then
        local oKS = tbID2KS[i_nServerID]
        oKS:Send("K_BanPlay", i_sRoleID, i_nWaitTime)
    else
        for _, oKS in pairs(tbID2KS) do
            oKS:Send("K_BanPlay",i_sRoleID, i_nWaitTime)
        end
    end
end
defineCT.CT_Banplay = function(i_pSession, i_sRoleID, i_nWaitTime, i_nServerID)
    CCenter:Banplay( i_sRoleID, i_nWaitTime,i_nServerID)
end

function CCenter:Kickplay(i_nServerID, i_tRoleID)
    local oKS = CKSManager:GetKSByID(i_nServerID)
    if oKS then
        oKS:Send("K_KickPlay", i_tRoleID)
    end
end
defineCT.CT_Kickplay = function(i_pSession, i_nServerID, i_tRoleID)
    CCenter:Kickplay(i_nServerID, i_tRoleID)
end

-- 公告
function CCenter:Notice(i_nServerID, i_tMsg)
    local oKS = CKSManager:GetKSByID(i_nServerID)
    if oKS then
        oKS:Send("K_Notice", i_tMsg)
    end
end
defineCT.CT_Notice = function(i_pSession, i_nServerID, i_tMsg)
    CCenter:Notice(i_nServerID, i_tMsg)
end


-- 公告
function CCenter:NoticeNew(i_nKSID, i_sMsg, i_nStartTimeMsec, i_nEndTimeMsec, i_nInterval, i_nNumber, i_nPosition)
    local tbID2KS = CKSManager:GetKSByID()
    local function f()
        if i_nKSID == 88 then
            for _, oKS in pairs(tbID2KS) do
                oKS:Send("K_Notice",i_nPosition, i_sMsg)
            end
        else
            local oKS = tbID2KS[i_nKSID]
            if oKS then
                oKS:Send("K_Notice",i_nPosition, i_sMsg)
            end
        end
    end
    local nTaskID = CSchedule:AddTask({m_nTime = i_nStartTimeMsec}, ScheduleTaskCycleTypeEnum.eSecond, i_nInterval, i_nNumber, f, {})
    if nTaskID then
        local function f1()
            CSchedule:DelTask(nTaskID)
        end
        CSchedule:AddTask({m_nTime = i_nEndTimeMsec}, nil, nil, 1, f1, {})
    end
end
defineCT.CT_NoticeNew = function(i_pSession, i_nKSID, i_sMsg, i_nStartTimeMsec, i_nEndTimeMsec, i_nInterval, i_nNumber, i_nPosition)
    CCenter:NoticeNew(i_nKSID, i_sMsg, i_nStartTimeMsec, i_nEndTimeMsec, i_nInterval, i_nNumber, i_nPosition)
end


-- 邮件
function CCenter:SendMail( i_sRoleID, i_sTitle, i_sContent, i_tItems, i_bSendOnline,i_nServerID)
    local tbID2KS = CKSManager:GetKSByID()
    if i_nServerID and i_nServerID ~= 0 then
        local oKS = tbID2KS[i_nServerID]
        if oKS then
             oKS:Send("K_SendMail", i_sRoleID, i_sTitle, i_sContent, i_tItems, i_bSendOnline)
        end
    else
        for _, oKS in pairs(tbID2KS) do
            oKS:Send("K_SendMail",i_sRoleID, i_sTitle, i_sContent, i_tItems, i_bSendOnline)
        end
    end    
end
defineCT.CT_SendMail = function(i_pSession, i_sRoleID, i_sTitle, i_sContent, i_tItems, i_bSendOnline,i_nServerID)
    CCenter:SendMail( i_sRoleID, i_sTitle, i_sContent, i_tItems, i_bSendOnline,i_nServerID)
end


-- 邀请数量
function CCenter:SendInviteNum( i_nServerID, i_sRoleID, bNew, invitee)
    local tbID2KS = CKSManager:GetKSByID()
    if i_nServerID then
        i_nServerID = tonumber(i_nServerID)
        local oKS = tbID2KS[i_nServerID]
        if not oKS then
            i_nServerID = tostring(i_nServerID)
            oKS = tbID2KS[i_nServerID]
        end
        if oKS then
             oKS:Send("K_SendInviteNum", i_sRoleID, bNew, invitee)
        end
    end     
end
defineCT.CT_SendInviteNum = function(i_pSession, i_nServerID, i_sRoleID, bNew, invitee)
    CCenter:SendInviteNum( i_nServerID, i_sRoleID, bNew, invitee)
end


-- playerService 调用 游戏服接口
function CCenter:PlayerServiceCall(i_nServerID, i_tData)
    local oKS = CKSManager:GetKSByID(i_nServerID)
    if not (oKS and oKS:Send("K_PlayerServiceCall", i_tData)) then
		local PlayerService = self:GetService("player_service")
		if PlayerService then
			self:Send2Service(PlayerService, "S_PlayerServiceCallRes", i_tData.m_nIndex)
		end
    end
end
defineCT.CT_PlayerServiceCall = function(i_pSession, i_nServerID, i_tData)
	CCenter:PlayerServiceCall(i_nServerID, i_tData)
end

-- playerService 调用 游戏服接口 信息返回
function CCenter:PlayerServiceCallRespond(i_tData)
	local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_PlayerServiceCallRes", i_tData.m_nIndex, i_tData.m_tData, i_tData.m_sOperName)
    end
end
defineCM.CM_PlayerServiceCallRespond = function(i_oKS, i_tData)
	CCenter:PlayerServiceCallRespond(i_tData)
end

-- 设置常置公告
function CCenter:SetAlwaysNotice(i_nServerID, i_tData)
    local oKS = CKSManager:GetKSByID(i_nServerID)
    if oKS then
		oKS:Send("K_SetAlwaysNotice", i_tData)
    end
end
defineCT.CT_SetAlwaysNotice = function(i_pSession, i_nServerID, i_tData)
	CCenter:SetAlwaysNotice(i_nServerID, i_tData)
end

function CCenter:GetAlwaysNotice(i_nServerID)
    local PlayerService = self:GetService("player_service")
    if PlayerService then
        self:Send2Service(PlayerService, "S_GetAlwaysNotice", i_nServerID)
    end
end
local CCommonFunction   = RequireSingleton("CCommonFunction")
-- 贴吧分享通知
function CCenter:TieBaShare( i_nServerID, i_sRoleID, reqbody )
    print( "CCenter:TieBaShare Done", i_nServerID, i_sRoleID )
    local tbID2KS = CKSManager:GetKSByID()
    CCommonFunction.PrintTable(tbID2KS)
    if i_nServerID then
        i_nServerID = tonumber(i_nServerID)
        local oKS = tbID2KS[i_nServerID]
        if not oKS then
            i_nServerID = tostring(i_nServerID)
            oKS = tbID2KS[i_nServerID]
        end
        if oKS then
            print( "K_TieBaShare Done ",  i_sRoleID)
            oKS:Send("K_TieBaShare", i_sRoleID, reqbody)
            print(  )
        end
    end  
end

defineCT.CT_TieBaShare = function(i_pSession, i_nServerID, i_sRoleID, reqbody)
    CCenter:TieBaShare( i_nServerID, i_sRoleID, reqbody)
end

