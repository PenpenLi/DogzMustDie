-- global enum
local KSPlayerStateEnum = RequireEnum("KSPlayerStateEnum")
local PlayerBeKickReasonEnum = RequireEnum("PlayerBeKickReasonEnum")
local ItemEnum = RequireEnum("ItemEnum")
local GameEventEnum = RequireEnum("GameEventEnum")
local PlayerLogEnum = RequireEnum("PlayerLogEnum")

-- global class
local CustomspassConfig_S = RequireConfig( "CustomspassConfig_S" )
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CDataLog = RequireSingleton("CDataLog")
local CDBCommand = RequireSingleton("CDBCommand")
local CCommercialService = RequireSingleton("CCommercialService")
local CDataReport = RequireSingleton("CDataReport")
local CPlayerManager = RequireSingleton("CPlayerManager")
local CPlayerSystemList = RequireSingleton("CPlayerSystemList")
local CCommonFunction = RequireSingleton("CCommonFunction")
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager")
local CDBServerManager = RequireSingleton("CDBServerManager")
local CMailManager = RequireSingleton("CMailManager")
local CTopicManager = RequireSingleton("CTopicManager")
local CGuildManager = RequireSingleton("CGuildManager")
local CPVPManager = RequireSingleton("CPVPManager")

local CServiceConnector = RequireSingleton("CServiceConnector")

local PlayerInitConfig_S = RequireConfig( "PlayerInitConfig_S" )

-- global function
local math_floor = math.floor
local math_random = math.random
local math_ceil = math.ceil
local table_insert = table.insert
local string_format = string.format
local string_gmatch = string.gmatch
local now = _commonservice.now
local ProtectedCall = ProtectedCall
local IsSecInToday = CCommonFunction.IsSecInToday
local mSqrt = math.sqrt

-- local
local IntervalMsec = 2 * 60000 -- 数据定时保存的间隔（ms）
local ReportPlayTimeIntervalMsec = 5 * 60000 -- 上报在线时长的间隔（ms）

local CPlayer = RequireClass("CPlayer")
function CPlayer:_constructor(i_pSession, i_sIP, i_nIP)
    self.m_pSession = i_pSession
    self.m_sIP = i_sIP
    self.m_nIP = tostring(i_nIP)
    self:SetState(KSPlayerStateEnum.eConnect)
end

function CPlayer:SetState(i_nState)
    self.m_nState = i_nState
end
function CPlayer:GetState()
    return self.m_nState
end

local malloc = _memoryservice.malloc
local free = _memoryservice.free
local fancy_encode = _codeservice.fancy_encode
local baseLen = 4096
local maxLen = 65535
local sendtosession = _netservice.sendtosession
function CPlayer:SendToClient(i_sMsg, ...)
    if self.m_pSession then
        local nBuffLen = baseLen
        while true do
            if nBuffLen > maxLen then
                print("ERROR!!! CPlayer:SendToClient > maxLen", nBuffLen, i_sMsg)
                break
            end
            local pData = malloc(nBuffLen)
            if pData then
                local nLen = fancy_encode(pData, nBuffLen, i_sMsg, ...)
                if nLen > 0 then
                    -- self.m_nSendToClientLen = self.m_nSendToClientLen + nLen
                    sendtosession(self.m_pSession, pData, nLen)
                    free(pData)
                    break
                else
                    print("WARNING!!! CPlayer:SendToClient", nBuffLen, i_sMsg)
                    nBuffLen = nBuffLen + baseLen
                    free(pData)
                end
            else
                print("ERROR!!! CPlayer:SendToClient malloc", nBuffLen, i_sMsg)
                break
            end
        end
    end
end
function CPlayer:SendDataToClient(i_pData, i_nLen)
    if self.m_pSession then
        sendtosession(self.m_pSession, i_pData, i_nLen)
    end
end

local nReconnect = 60000
function CPlayer:OnDisconnect()
    self.m_pSession = nil
    -- 一些数据缓存清空
    self.m_bHaveAucData = nil

    local nState = self:GetState()
    if nState == KSPlayerStateEnum.eConnect or 
        nState == KSPlayerStateEnum.eLogin or
        nState == KSPlayerStateEnum.eWaitNew or
        nState == KSPlayerStateEnum.eLoadData or
        nState == KSPlayerStateEnum.eReadDBData then
        CPlayerManager:DeletePlayer(self)
    elseif nState == KSPlayerStateEnum.eInGame then
        self:LeaveGame()
    end
end

local closesession = _netservice.closesession
function CPlayer:CloseSession()
    if self.m_pSession then
        logfile("Log!!! closesession.", self.m_sRoleID, self.m_pSession)
        closesession(self.m_pSession)
    else
        print("ERROR!!! closesession nil.", self.m_sAccountID, self.m_sRoleID)
    end
end

-- 账号替换
function CPlayer:BeReplace(i_oPlayer)
    CPlayerManager:ReplacePlayerA2B(self, i_oPlayer)
    self:SendToClient("C_LoadCharListMsg", 1)
    self:SetState(KSPlayerStateEnum.eInGame)
    self.m_bBeKick = nil
end

-- 顶号
function CPlayer:ReplaceBy(i_oPlayer)
    print("LOG!!! player raplace A.", self.m_sAccountID, self.m_sRoleID or "", self:GetState(), self:GetIP())
    print("LOG!!! player replace B.", i_oPlayer:GetIP())
    if self:GetState() == KSPlayerStateEnum.eInGame then
        if self.m_oReplacePlayer then
            self.m_oReplacePlayer:BeKick(PlayerBeKickReasonEnum.eRepeatLogin, i_oPlayer:GetIP())
        else
            self:BeKick(PlayerBeKickReasonEnum.eRepeatLogin, i_oPlayer:GetIP())
        end
        self.m_oReplacePlayer = i_oPlayer
    elseif self:GetState() == KSPlayerStateEnum.eWaitReconnect then
        self.m_nReconnectTime = nil
        self:BeReplace(i_oPlayer)
    elseif self:GetState() == KSPlayerStateEnum.eWaitNew or self:GetState() == KSPlayerStateEnum.eLoadData then
        self:BeKick(PlayerBeKickReasonEnum.eRepeatLogin, i_oPlayer:GetIP())
        i_oPlayer:BeKick(PlayerBeKickReasonEnum.eRepeatLogin, self:GetIP())
    else
        i_oPlayer:BeKick(PlayerBeKickReasonEnum.eRepeatLogin, self:GetIP())
    end
end

-- 被踢
function CPlayer:BeKick(i_nReason, i_AppendData)
    print(debug.traceback())
    -- 内部错误 记录数据库 用来做查询
    if i_nReason >= PlayerBeKickReasonEnum.eGSError then
        CDataLog:GameLogBekick(ServerInfo.serverid, self.m_sRoleID or "", i_nReason)
    end
    --
    local nState = self:GetState()
    print("WARNING!!! player be kick", self.m_sAccountID, self.m_sRoleID, nState, i_nReason, self:GetIP())
    self.m_bBeKick = true
    self:SendToClient("C_LastError", i_nReason, i_AppendData)
    if nState == KSPlayerStateEnum.eInGame then
        if i_nReason == PlayerBeKickReasonEnum.eRepeatLogin then
            self:CloseSession()
        else
            self:LeaveGame()
        end
    elseif nState == KSPlayerStateEnum.eWaitReconnect then
        self:LeaveGame()
    else
        self:CloseSession()
    end
end

function CPlayer:SetSaveDataRole(i_sKey, i_Value)
    self.m_tSaveDataRole[i_sKey] = i_Value
end

function CPlayer:SetSaveDataRoleInfo(i_sKey, i_Value)
    self.m_tSaveDataRoleInfo[i_sKey] = i_Value
end

--[[
    info 是数据库属性
]]
function CPlayer:SetBaseInfo(info)
    -- 定时存盘时间
    self.m_nSaveTime = IntervalMsec
    -- 上报在线时长的间隔（ms）
    self.m_nReportPlayTime = ReportPlayTimeIntervalMsec
    self.m_tSaveDataRole = {}
    self.m_tSaveDataRoleInfo = {}
    -- 数据初始化
    self.m_sRoleID = info.roleid -- 角色ID
    self.m_nLevel = info.level or 1 -- 等级
    self.m_nExp = info.exp or 0 -- 经验
    self.m_sName = info.rolename -- 角色名称
    self.m_nProfID = info.roleprof -- 职业信息
    self.m_nHeadID = info.rolehead -- 头像
    self.m_nNewFlag = info.newflag -- 是否是新注册玩家
    self.m_nCamp = info.camp or 0 -- 阵营
    self.m_nLoginNum = info.loginnum or 1 -- 登陆天数
    self.m_nCreateTime = info.createtime -- 角色创建时间(时间戳，秒)
    self.m_nRefreshTime = info.refreshtime -- 每日刷新时间(时间戳，秒)
    self.m_nTodayTime = info.todaytime or 0 -- 本日在线时间
    self.m_nTodayHour = math_floor((info.todaytime or 0) / 3600) -- 本日在线小时
    self.m_nPlayTime = info.totaltime or 0 -- 在线总时间(msec)
    self.m_nLogoutTime = info.logouttime or 0 -- 上次下线时间
    self:BanSpeak(info.banspeak or 0, true) -- 禁言时间
    self.m_nCP = info.combatpower or 0 -- 战斗力

    -- 记录离线时间
    self.nLeaveTime = now( 1 ) - self.m_nLogoutTime

    self:SetState(KSPlayerStateEnum.eLoadData)

    -- 关卡数 初始关卡是10001
    self.m_DungeonsLevel            = 10001 
    self.m_DungeonsIdx              = 1  
    self.m_BattleArray              = {}
    self.m_CopyBattleArray          = {}
    self.m_Circulation              = 0
    self.m_nMP                      = 50
    self.m_nGuildID                 = 0
    self.m_nContribution            = { }
    self.m_tClientInfo              = { }
    self.m_tChargeTimes             = { }
    self.m_tChargeFeedback          = { }
    self.m_tPvpTimes                = { }
    self.m_tFreeUseNum              = { }
    self.m_tShareCustomsFlag        = { }
    self.m_Invitation               = { }
    self.m_InvitadunFlag            = 0
    self.m_InvitaVipFlag            = 0
    self.m_InvitaVipTimes           = 0
    self.m_nBuyFund                 = 0
    self.m_tBuyFundTims             = { } 
    self.m_tPrivilegeDiscount       = { }
    self.m_tBoxDiscount             = { }
    self.m_tActivateHeroAwardList   = { }
    self.m_tMarketNumList           = { }
    self.m_nAngelBeats              = 0
    self.m_nAdvertisingTime         = 0
    self.m_tAdvertisingTimes        = { }
    self.m_tDropAward               = { }
    self.m_nRecoverTime             = 0
    self.m_nPower                   = GameParamConfig_S.PowerMax
    self.m_nBuyPowerTimes           = 0
    self.m_tCopyUsePet              = {}
    self.m_tHeroPeckAdFlag          = {}
    self.m_nPKLeagueFlag            = 0
    self.m_nLookAdDrawTimes         = 0
    self.m_nCoolingTime             = 0
    

    local tData = {
        login_type = tostring(self.m_tLoginData.login_type),
        browser_type = tostring(self.m_tLoginData.browser_type),
        system_type = tostring(self.m_tLoginData.system_type),
        desk_version = tostring(self.m_tLoginData.desk_version)
    }
    CDataReport:DataReport("client_info", tData, {self})
    self.m_tLoginData = nil
end

function CPlayer:SyncClientData()
    local sRoleID = self:GetRoleID( )
    -- 同步玩家基础数据
    self:SendToClient("C_SyncPlayerInfoMsg", self:GetSyncCLInfo())
    -- 同步给客户端服务器时间
    self:SendToClient("C_ServerTime", now(1), CGlobalInfoManager:GetOpenTime(), ServerInfo.serverid)
    -- 同步各系统数据
    self.m_oSystemMgr:SyncClientData()
    self:SendToClient("C_SyncTopicManager", CTopicManager:GetPlayerInfo( self ))

    -- 客户端临时缓存
    self:SendToClient("C_ClientInfo", self.m_tClientInfo)
    -- 同步当日邀请的人数
    self:SendToClient( "C_OnInvite", CPlayerManager:GetDayInviteNum(sRoleID) )
    -- 同步玩家天梯积分
    self:SendToClient( "C_LadderScore", CPVPManager:GetLadderScore( self ), CPVPManager:GetLadderWinTimes( self ))
    -- 同步玩家广告奖励
    self:SendToClient("C_Advertising", self.m_nAdvertisingTime)
    -- 上线同步结束
    self:SendToClient( "C_OnlineSyncEnd" )
end

function CPlayer:Create()
    logfile("KS Player Create", self.m_sRoleID)
    delog("KS Player Create", self.m_sRoleID)
    if not ServerInfo.isbridge then
        CCommercialService:ReportPlayerLogin(self)
    end
    CCommercialService:ReportPlayerInServer(self)
    CPlayerManager:SetPlayer2RoleID(self)
    if self:IsNew() then
        self.m_tClientInfo = {}
        CDataLog:LogDistAccount_log( self:GetGYYXIF(), self:GetOpenID(), self:GetRoleID(), self:GetName(),0, 0, self.sInviteRoleID or "" )
    else
        local tRes1 = self:GetPlayerData("CPlayer")
        local tRes = tRes1 and tRes1.role_info
        if tRes then
            tRes = tRes[1]
            -- 关卡数
            self.m_DungeonsLevel = tRes.dungeons or 10001
            self.m_DungeonsIdx = tRes.duneonsidx or 1
            self.m_BattleArray = StrToTable(tRes.battlearray)
            self.m_CopyBattleArray = StrToTable(tRes.copybattlearray)
            self.m_Circulation = tRes.circulation
            self.m_nMP = tRes.mp
            self.m_nGuildID = tRes.guildid
            self.m_tClientInfo = StrToTable(tRes.clientinfo)
            self.m_nContribution = StrToTable(tRes.contribution)
            self.m_tChargeTimes = StrToTable(tRes.chargetimes)
            self.m_tChargeFeedback = StrToTable(tRes.chargefeedback)
            self.m_tPvpTimes = StrToTable(tRes.pvptimes)
            self.m_tChallengeTimes = StrToTable(tRes.challengebosstimes)
            self.m_tFreeUseNum = StrToTable(tRes.freeusenum)  
            self.m_Invitation = StrToTable(tRes.invitation)
            self.m_InvitadunFlag = tRes.invitadunflag
            self.m_InvitaVipFlag = tRes.invitavipflag
            self.m_InvitaVipTimes = tRes.invitaviptimes
            self.m_tShareCustomsFlag = StrToTable(tRes.freeusenum)
            self.m_nBuyFund = tRes.busefund
            self.m_tPrivilegeDiscount = StrToTable(tRes.privilegediscount)
            self.m_tBoxDiscount = StrToTable(tRes.boxdiscount)
            self.m_tBuyFundTims = StrToTable(tRes.busefundtims)
            self.m_tActivateHeroAwardList = StrToTable(tRes.heroawardlist)
            self.m_tMarketNumList = StrToTable(tRes.marketnumlist)
            self.m_nAngelBeats = tRes.angelbeats
            self.m_nAdvertisingTime = tRes.advertisingtime
            self.m_tAdvertisingTimes = StrToTable(tRes.advertisingtimes)
            if type( self.m_tAdvertisingTimes ) == "number" then
                self.m_tAdvertisingTimes = {}
            end
            self.m_tDropAward = StrToTable(tRes.dropaward)
            self.m_nRecoverTime = tRes.recovertime
            self.m_nPower = tRes.power
            self.m_nBuyPowerTimes = tRes.buypowertimes
            self.m_tCopyUsePet = StrToTable(tRes.copyusepet)
            self.m_tHeroPeckAdFlag = StrToTable(tRes.heropeckadflag)
            self:SaveRoleData()
            self.m_nPKLeagueFlag = tRes.pkleagueflag
            self.m_nCoolingTime = tRes.m_ncoolingtime
            self.m_nLookAdDrawTimes = tRes.m_nlookaddrawtimes
            --需要初始化DB的属性
            if tRes.power == -1 then
                self.m_nPower = GameParamConfig_S.PowerMax
                self:SetSaveDataRoleInfo("power", self.m_nPower)
            end
        end
    end 
    

    if self.m_Circulation == 1 then
        local tCfg = CustomspassConfig_S[self.m_DungeonsLevel]
        if tCfg then
            self.m_DungeonsIdx = tCfg.waveNum
            self.m_Circulation = 0
            self:SetSaveDataRoleInfo("circulation", self.m_Circulation)
        else
            delog( "not CustomspassConfig_S[self.m_DungeonsLevel]", self.m_DungeonsLevel )
        end
    end 

    -- 更新老号的职业
    if self.m_nProfID == 1 then
        self.m_nProfID = 101
        self:SetSaveDataRole("roleprof", self.m_nProfID)
    end

    -- 系统管理器
    self.m_oSystemMgr = NewClass("CPlayerSystemManager", self, CPlayerSystemList:GetSysList()) 

    -- 解析刷新数据
    if IsSecInToday(self.m_nRefreshTime) then -- 每日刷新时间为本日
        self.m_oSystemMgr:Create(false, not CCommonFunction.IsSecInThisWeek(self.m_nRefreshTime))
    else -- 刷新时间不为本日
        -- 重置每日刷新相关数据
        self:DayRefresh()
        self.m_oSystemMgr:Create(true, not CCommonFunction.IsSecInThisWeek(self.m_nRefreshTime))
        CCommercialService:ReportPlayerEverydayEnter(self)
        CDataLog:UpdateDistAccount_log( self:GetName( ), self:GetRoleID(), self:GetSystem( "CItemSystem" ):GetCount( ItemEnum.eGold ), self:GetVipLevel( ) )
    end

    -- 自动回蓝机制
    local nMaxMP = self:GetSystem( "CSkillSystem" ):GetMaxMP( )
    if self.m_nMP < nMaxMP then
        local nMp = self.m_nMP + self.nLeaveTime
        if nMp > nMaxMP then
            nMp = nMaxMP
        end 
        self:SetMP( nMp )
    end
    -- 英雄礼包检测过期
    self:CheckHeroAwardList( )

    -- 同步给客户端数据
    if not self.m_bNoInit2Client then
        self:SyncClientData()
    else
        self.m_bNoInit2Client = nil
    end

    -- 开始关卡记录
    self.m_DUngeonsDetTime = now(1)
    self:DistPlaylog( PlayerLogEnum.Dungeons, self:GetDungeonsDesc( self.m_DungeonsLevel, self.m_DungeonsIdx ), 1 )

    local bIsNew = false
    if self:IsNew() then
        self.m_nNewFlag = 0
        self:SetSaveDataRole("newflag", self.m_nNewFlag)
        CCommercialService:ReportPlayerEverydayEnter(self)
        bIsNew = true
    end

    self:EnterGame(true, bIsNew)
    CDataLog:GspLogGrow(self:GetServerID(), self:GetPf(), self:GetOpenID(), self:GetRoleID(), 21, 0, self.m_nLevel)

    local tData = {
        level = tostring(self.m_nLevel),
        ip = self.m_sIP,
        map_id = tostring(self:GetMapCfgID())
    }
    CDataReport:DataReport("login", tData, {self})

    if bIsNew then
        self:NewPlayerInit( )
    else
        if ServerInfo.IsQQ then
            -- 广告版离线收益需要
            self:AddLeaveAwardAd() 
        else
            -- 添加离线收益
            self:AddLeaveAward()
        end
    end 
    CGuildManager:PlayerOnlie( self )
    CServiceConnector:Send("K_LoadString", "CGameServer:Test( )", true)

    delog( "OnInvite 2 =======", true, self.sInviteRoleID, self:GetRoleID())
    CPlayerManager:OnInvite( true,self.sInviteRoleID, self:GetRoleID() )
end

-- 新玩家初始化
function CPlayer:NewPlayerInit( )
    local tCfg = PlayerInitConfig_S[1]
    if not tCfg then
        return
    end 

    for _, tItemInfo in ipairs(tCfg.InitItem) do
        self:GetSystem("CItemSystem"):AddItem( tItemInfo[1], tItemInfo[2] )
    end

    local nEnumID = self.m_nProfID
    self:GetSystem( "CHeroSystem" ):AddHero( nEnumID )
    self:SaveBattleArray({[4] = nEnumID})
    self:SendToClient( "C_NewPlayerInit" )
end

-- 获取光宇游戏生命指纹
function CPlayer:GetGYYXIF()
    return "测试指纹"
end

function CPlayer:ClientCreate()
    if self:GetState() == KSPlayerStateEnum.eLoadData then
        local function f()
            if self.m_pSession then -- 可能会在异步读取数据时断开连接了
                if not ProtectedCall(
                        function()
                            self:Create()
                        end
                    )
                 then
                    print("ERROR!!! Player Create Error.", self:GetRoleID())
                    self:BeKick(PlayerBeKickReasonEnum.eKSHandleCLMsgError)
                end
            end
            CDBServerManager:ClearPlayerData(self:GetRoleID())
        end
        local tRoleInfo = {
            m_sRoleID = self:GetRoleID(),
            m_bIsNew = self:IsNew(),
            m_bRefresh = not IsSecInToday(self.m_nRefreshTime),
            m_nServerID = self:GetServerID(),
            m_nPlatformLevel = self:GetPlatformLevel(),
            m_nProfID = self:GetProfID()
        }
        self:SendDB(f, tRoleInfo)
        self:SetState(KSPlayerStateEnum.eReadDBData)
    elseif self:GetState() == KSPlayerStateEnum.eInGame then
        -- 同步给客户端数据
        self:SyncClientData()
        self:SendToClient("C_EnterMap")
    end
    
end

function CPlayer:Update(i_nDeltaMsec)
    self.m_nPlayTime = self.m_nPlayTime + i_nDeltaMsec
    self:SetSaveDataRole("totaltime", self.m_nPlayTime)
    -- 断线重连等待时间
    if self.m_nReconnectTime then
        self.m_nReconnectTime = self.m_nReconnectTime - i_nDeltaMsec
        if self.m_nReconnectTime <= 0 then
            self.m_nReconnectTime = nil
            self:LeaveGame()
        end
    end
    -- 定时存盘
    self.m_nSaveTime = self.m_nSaveTime - i_nDeltaMsec
    if self.m_nSaveTime <= 0 then
        self.m_nSaveTime = IntervalMsec
        self:GetSystem( "CEventSystem" ):OnEvent( GameEventEnum.AddDayMinute, math.floor(self.m_nTodayTime / 60000 ))
        self:SaveData()
    end
    -- 上报在线时长
    self.m_nReportPlayTime = self.m_nReportPlayTime - i_nDeltaMsec
    if self.m_nReportPlayTime <= 0 then
        self.m_nReportPlayTime = ReportPlayTimeIntervalMsec
        CDataLog:LogDistOnline_log(self:GetGYYXIF(), self:GetOpenID())
    end
    -- 更新本日在线时间
    self:UpdateTodayTime(i_nDeltaMsec)
    -- 系统更新
    self.m_oSystemMgr:Update(i_nDeltaMsec)
end

function CPlayer:UpdateTodayTime(i_nDeltaMsec)
    local nTodayTime = self.m_nTodayTime
    self.m_nTodayTime = self.m_nTodayTime + i_nDeltaMsec
    -- print("----", nTodayTime, self.m_nTodayTime)
    if nTodayTime <= 300000 and self.m_nTodayTime >= 300000 then
        CCommercialService:ReportPlayerEveryday5Min(self)
    end
    self:SetSaveDataRole("todaytime", self.m_nTodayTime)
    local nHour = math_floor(self.m_nTodayTime / 3600000)
    -- print("--------", self.m_nTodayTime/1000, nHour);
    if self.m_nTodayHour < nHour then
        self.m_nTodayHour = nHour
    end
end

function CPlayer:DayRefresh()
    -- 每日刷新时间(时间戳，秒)
    self.m_nRefreshTime = now(1)
    self:SetSaveDataRole("refreshtime", self.m_nRefreshTime)
    -- 本日在线时间
    self.m_nTodayTime = 0
    self:SetSaveDataRole("todaytime", self.m_nTodayTime)
    self.m_nTodayHour = 0 -- 本日在线小时
    -- 登陆天数+1
    self.m_nLoginNum = self.m_nLoginNum + 1
    delog("self.m_nLoginNum    = self.m_nLoginNum + 1", self.m_nLoginNum)
    self:SetSaveDataRole("loginnum", self.m_nLoginNum)
    self.m_nContribution = { }
    self:SetSaveDataRoleInfo("contribution", TableToStr(self.m_nContribution))

    self.m_tPvpTimes = { }
    self:SetSaveDataRoleInfo("pvptimes", TableToStr(self.m_tPvpTimes))
    self.m_InvitaVipFlag = 0
    self:SetSaveDataRoleInfo("invitavipflag", self.m_InvitaVipFlag)
    self.m_tAdvertisingTimes = { }
    self:SetSaveDataRoleInfo("advertisingtimes", TableToStr(self.m_tAdvertisingTimes))
    self.m_nBuyPowerTimes = 0
    self:SetSaveDataRoleInfo("buypowertimes", self.m_nBuyPowerTimes)
    self.m_nLookAdDrawTimes = 0
    self:SetSaveDataRoleInfo("m_nlookaddrawtimes", self.m_nLookAdDrawTimes)
end

function CPlayer:OnWeekRefresh()
    self.m_oSystemMgr:OnWeekRefresh()
    self:SendToClient("C_WeekRefreshMsg")
    self.m_nPKLeagueFlag = 0
    self:SetSaveDataRoleInfo("pkleagueflag", self.m_nPKLeagueFlag)
end 

function CPlayer:OnDayRefresh()
    self:DayRefresh()
    self.m_oSystemMgr:OnDayRefresh()
    self:SendToClient("C_DayRefreshMsg")
    CCommercialService:ReportPlayerEverydayEnter(self)
    CDataLog:UpdateDistAccount_log( self:GetName( ), self:GetRoleID(), self:GetSystem( "CItemSystem" ):GetCount( ItemEnum.eGold ), self:GetVipLevel( ) )
end

-- 保存role数据
function CPlayer:SaveRoleData(i_bLogOut)
    if next(self.m_tSaveDataRole) or i_bLogOut then
        local oUpdateCmd = self:CreateUpdateCmd("role")
        for k, v in pairs(self.m_tSaveDataRole) do
            oUpdateCmd:SetFields(k, v)
        end
        if i_bLogOut then
            local nCurTime = now(1)
            oUpdateCmd:SetFields("combatpower", self.m_nCP)
            oUpdateCmd:SetFields("logouttime", nCurTime)
        end
        oUpdateCmd:SetWheres("roleid", self.m_sRoleID, "=")
        oUpdateCmd:Execute()
        self.m_tSaveDataRole = {}
    end
end

-- 保存role_info数据
function CPlayer:SaveRoleInfoData(i_bLogOut)
    if next(self.m_tSaveDataRoleInfo) then
        local oUpdateCmd = self:CreateUpdateCmd("role_info")
        for k, v in pairs(self.m_tSaveDataRoleInfo) do
            oUpdateCmd:SetFields(k, v)
        end
        oUpdateCmd:SetWheres("roleid", self.m_sRoleID, "=")
        oUpdateCmd:Execute()
        self.m_tSaveDataRoleInfo = {}
    end
end

-- 保存role_scores数据
function CPlayer:SaveScoresData()
end

-- 保存数据
function CPlayer:SaveData(i_bLogOut)
    -- self:PrintSendToClientLen()
    local res =
        ProtectedCall(
        function()
            self:SaveRoleData(i_bLogOut)
        end
    )
    if not res then
        print("ERROR!!! Player SaveRoleData", self.m_sRoleID)
    end
    res =
        ProtectedCall(
        function()
            self:SaveRoleInfoData(i_bLogOut)
        end
    )
    if not res then
        print("ERROR!!! Player SaveRoleInfoData", self.m_sRoleID)
    end
    res =
        ProtectedCall(
        function()
            self:SaveScoresData(i_bLogOut)
        end
    )
    if not res then
        print("ERROR!!! Player SaveScoresData", self.m_sRoleID)
    end
    -- 保存角色各种系统数据 SystemMgr里已经ProtectedCall了
    self.m_oSystemMgr:SaveData(i_bLogOut)
end

function CPlayer:Destroy(i_fCloseSession)
    CGuildManager:PlayerOnlie( self )
    CCommercialService:ReportPlayerOutServer(self)
    CPVPManager:PlayerDestroy(self)
    self:SetState(KSPlayerStateEnum.eDestroy)
    -- 下线前存一下mp
    self:SetSaveDataRoleInfo("mp", self.m_nMP)
    local szDB = TableToStr(self.m_tClientInfo)
    self:SetSaveDataRoleInfo("clientinfo", szDB)
    self:SaveData(true) -- 保存数据
    self.m_oSystemMgr:Destroy()

    -- 删除Player
    local res =
        ProtectedCall(
        function()
            CPlayerManager:DeletePlayer(self)
        end
    )
    if not res then
        print("ERROR!!! Player CPlayerManager:DeletePlayer", self.m_sRoleID)
    end

    -- 异步存储全部执行后在关闭session
    if i_fCloseSession then
        local tRoleInfo = {
            m_sRoleID = self:GetRoleID(),
            m_bDestroy = true
        }
        self:SendDB(i_fCloseSession, tRoleInfo)
    end
    -- 离线上报
    local tData = {
        level = tostring(self.m_nLevel),
        map_id = tostring(self.GetMapCfgID()),
        ip = self.m_sIP,
        onlinetime = tostring(now(1) - self:GetLoginTime())
    }
    CDataReport:DataReport("logout", tData, {self})
end

function CPlayer:GetSyncCLInfo()
    return {
        [1] = self.m_sRoleID,
        [2] = self.m_sName,
        [3] = self.m_DungeonsLevel,
        [4] = self.m_DungeonsIdx,
        [5] = self.m_BattleArray,
        [6] = self.m_nLevel,
        [7] = self.m_nExp,
        [8] = self.m_Circulation,
        [9] = self.m_nMP,
        [10] = self.m_nGuildID,
        [11] = self.m_nHeadID,
        [12] = self.m_nContribution,
        [13] = self.m_tChargeTimes,
        [14] = self.m_tChargeFeedback,
        [15] = self.m_tPvpTimes,
        [16] = self.m_tChallengeTimes,
        [17] = self.m_tFreeUseNum,
        [18] = self.m_Invitation,
        [19] = self.m_InvitadunFlag,
        [20] = self.m_InvitaVipFlag,
        [21] = self.m_InvitaVipTimes,
        [22] = self.m_tShareCustomsFlag,
        [23] = self:IsNew( ),
        [24] = self.m_nBuyFund,
        [25] = self.m_tBuyFundTims,
        [26] = self.m_tPrivilegeDiscount,
        [27] = self.m_tBoxDiscount,
        [28] = self.m_tActivateHeroAwardList,
        [29] = self.m_tMarketNumList,
        [30] = self.m_nRecoverTime,
        [31] = self.m_nPower,
        [32] = self.m_nBuyPowerTimes,
        [33] = self.m_CopyBattleArray,
        [34] = self.m_tAdvertisingTimes,
        [35] = self.m_tHeroPeckAdFlag,
        [36] = self.m_nPKLeagueFlag,
        [37] = self.m_nProfID,
        [38]=self.m_nLookAdDrawTimes,
        [39]=self.m_nCoolingTime,
    }
   
end

------------
---- db ----
------------
function CPlayer:GetServerID()
    return self.m_nDBID
end

function CPlayer:SetDBID(i_nDBID)
    self.m_nDBID = i_nDBID
end

function CPlayer:CreateSelectCmd(i_sTableName)
    return CDBCommand:CreateSelectCmd(i_sTableName, self.m_nDBID)
end

function CPlayer:CreateInsertCmd(i_sTableName)
    return CDBCommand:CreateInsertCmd(i_sTableName, self.m_nDBID)
end

function CPlayer:CreateUpdateCmd(i_sTableName)
    return CDBCommand:CreateUpdateCmd(i_sTableName, self.m_nDBID)
end

function CPlayer:CreateDeleteCmd(i_sTableName)
    return CDBCommand:CreateDeleteCmd(i_sTableName, self.m_nDBID)
end
