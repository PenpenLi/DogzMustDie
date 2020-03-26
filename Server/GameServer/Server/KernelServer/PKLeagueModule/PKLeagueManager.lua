-- PK联赛
local now               = _commonservice.now
local ItemEnum          = RequireEnum("ItemEnum")
local ItemLogEnum       = RequireEnum("ItemLogEnum")
local MailTypeEnum      = RequireEnum("MailTypeEnum")
local RankTypeEnum      = RequireEnum("RankTypeEnum")
local CSchedule         = RequireSingleton("CSchedule")
local CDBCommand        = RequireSingleton("CDBCommand")
local CPVPManager       = RequireSingleton("CPVPManager")
local CRankManager      = RequireSingleton("CRankManager")
local CMailManager      = RequireSingleton("CMailManager")
local CPlayerManager    = RequireSingleton("CPlayerManager")
local CCommonFunction   = RequireSingleton("CCommonFunction")
local CPKLeagueManager  = RequireSingleton("CPKLeagueManager")
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local StringInfoConfig_S= RequireConfig( "StringInfoConfig_S" )
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum");

-- 存盘时间间隔
local i_nSaveDateTime = 2 * 60000

-- 配对位置
local eStance = {
    eLeft  = 1, -- 左边
    eRight = 2, -- 右边
}

-- 状态枚举
local eState = {
    eUnopened       = 0;    -- 未开启
    eApply          = 1;    -- 报名阶段
    eLeagueBet16    = 2;    -- 16强押注
    eLeagueWar16    = 3;    -- 16强开战
    eLeagueBet8     = 4;    -- 8强押注
    eLeagueWar8     = 5;    -- 8强开战
    eLeagueBet4     = 6;    -- 4强押注
    eLeagueWar4     = 7;    -- 4强开战
    eLeagueBet2     = 8;    -- 2强押注
    eLeagueWar2     = 9;    -- 2强开战
    eLeagueBet1     = 10;   -- 决赛押注
    eLeagueWar1     = 11;   -- 决赛开战
    eLeagueOver     = 12;   -- 结束，结算奖励
    eUndercondition = 13;   -- 人数不足，开启失败
}


-- 简要数据下标枚举 与之前的排行榜对应
local RDRoleId  = 1    -- roleid
local RDName    = 2    -- rolename
local RDLevel   = 3    -- 等级
local RDProf    = 4    -- 职业
local RDVipLv   = 5    -- vip等级
local RDHead    = 6    -- 头像ID
local RDCamp    = 7    -- 阵营ID
local RDHit     = 8    -- 伤害

-- 简要枚举 阶段对战人员组信息
local FPHead    = 1    -- 头像ID
local FPName    = 2    -- rolename
local FPOdds    = 3    -- 赔率
local FPRoleId  = 4    -- roleid
local FPResult  = 5    -- 胜负结果

-- 押注阶段对应的最大次数 及 点赞消耗钻石
local tPraiseNum = {
    [eState.eLeagueBet16] = 1,
    [eState.eLeagueBet8]  = 2,
    [eState.eLeagueBet4]  = 3,
    [eState.eLeagueBet2]  = 4,
    [eState.eLeagueBet1]  = 5,
}

function CPKLeagueManager:Initialize()
    -- 状态机当前状态
    self.nCurState = 0
    -- 是否能开启活动
    self.bOpen = false
    -- 玩家存盘脏位
    self.tSaveData = { }
    -- 阶段对战人员组
    self.tFightPlayerList = { }
    -- 报名玩家各种数据信息
    self.tPlayerPKLeagueInfo = { }
    -- 押注总数量信息
    self.tAllBetData = { }
    -- 本次活动总赔率信息
    self.tOddsData = { }

    -- 定时开启阶段联赛
    local sStartTime, sOverTime = string.match(GameParamConfig_S.ELeagueTotalTime, "(.+)-(.+)")
    local nStartDay, nStartHour = string.match(sStartTime, "(.+)$(.+)")
    local nOverDay, nOverHour = string.match(sOverTime, "(.+)$(.+)")

    -- 开服判断阶段
    local nOpenTime = now(1)
    local year, month, day, hour, minute = CCommonFunction.Sec2Calendar(nOpenTime)
    local nWeek = CCommonFunction.Calendar2Week(year, month, day)

    if nWeek < tonumber(nOverDay) then
        self.bOpen = true
        self:ChangeLeagueState(eState.eApply)
    end

    CSchedule:AddTask({m_sWeek = (nStartDay) , m_sTime = nStartHour}, ScheduleTaskCycleTypeEnum.eWeek, 1, 0, function() self:ChangeLeagueState(eState.eApply) end, {}, true);
    CSchedule:AddTask({m_sWeek = (nStartDay) , m_sTime = nStartHour}, ScheduleTaskCycleTypeEnum.eWeek, 1, 0, function() self.bOpen = true end, {}, true);
    CSchedule:AddTask({m_sWeek = (nOverDay) , m_sTime = "19:27"}, ScheduleTaskCycleTypeEnum.eWeek, 1, 0, function() self:SendPKSystemTipsToAll() end, {}, true);
    -- 定时开启设置
    for i, sTime in ipairs(GameParamConfig_S.ELeagueTime) do
        --下标对应枚举处理
        local nType = i + 1
        --定时切换
        local tTime = {m_sWeek = (nOverDay), m_sTime = sTime};
        CSchedule:AddTask(tTime, ScheduleTaskCycleTypeEnum.eWeek, 1, 0, function() self:ChangeLeagueState(nType) end, {}, true);
    end
    self:LoadData()
    return true
end

-- 加载数据
function CPKLeagueManager:LoadData()
    local tRes = CDBCommand:CreateSelectCmd("pkleague"):Execute()
    -- local tTest = {}

    if tRes then
        -- 读取阵营数据
        for _, data in ipairs( tRes ) do 
            if not self.tPlayerPKLeagueInfo[data.roleid] then
                self.tPlayerPKLeagueInfo[data.roleid] = {
                    ["hit"] = data.hit, -- 海选伤害
                    ["hitrank"] = data.hitrank, -- 海选伤害排名 已經沒用了 搬到排行榜離了
                    ["betinfo"] = StrToTable(data.betinfo), -- 押注信息
                    ["bettimes"] = StrToTable(data.bettimes), -- 玩家本周押注次数
                    ["capacity"] = StrToTable(data.capacity), -- 玩家战斗力计算数据
                    ["fightplayer"] = StrToTable(data.fightplayer), -- 阶段对战信息
                    ["playerInfo"] = StrToTable(data.playerInfo), -- 玩家基本信息
                }

            else
                -- 应该不会走到这一行
                print( "Erro data overflow CPKLeagueManager" )
            end
        end 
    end
end

-- 保存数据
function CPKLeagueManager:SaveData()
    --更新玩家战斗数据  
    if next(self.tSaveData) then
        for sRoleId, nMark in pairs(self.tSaveData) do
            if nMark == 1 then
                local tInfo = self.tPlayerPKLeagueInfo[sRoleId]
                if not tInfo then
                    delog("CPKLeagueManager:SaveData not tInfo!")
                    return
                end
                -- 添加DB信息
                local cmd = CDBCommand:CreateUpdateCmd("pkleague")
                cmd:SetWheres("roleid", sRoleId, "=") 
                cmd:SetFields("hit", tInfo.hit)
                cmd:SetFields("hitrank", tInfo.hitrank)
                cmd:SetFields("betinfo", TableToStr(tInfo.betinfo))
                cmd:SetFields("bettimes", TableToStr(tInfo.bettimes))
                cmd:SetFields("capacity", TableToStr(tInfo.capacity))
                cmd:SetFields("fightplayer", TableToStr(tInfo.fightplayer))
                cmd:SetFields("playerInfo", TableToStr(tInfo.playerInfo))
                cmd:Execute()
            end
        end
        self.tSaveData = { }
    end

end

-- 下线操作
function CPKLeagueManager:Destruct()
    self:SaveData()
end

-- 迭代更新
local nSaveTime = i_nSaveDateTime
function CPKLeagueManager:Update(i_nDeltaMsec)
    nSaveTime = nSaveTime - i_nDeltaMsec
    if nSaveTime <= 0 then
        nSaveTime = i_nSaveDateTime
        self:SaveData( )
    end
end

function CPKLeagueManager:SendPKSystemTipsToAll( )
    local oLinkTips = NewClass("CLinkTips")
    oLinkTips:AddParam(StringInfoConfig_S[5015].s)
    oLinkTips:AddParam("3")
    --全服走马灯提示
    CPlayerManager:SendSystemTipsToAll(30043, oLinkTips:GetParams())
end

-- 切换联赛状态
function CPKLeagueManager:ChangeLeagueState(nState)
    if self.nCurState == eState.eUndercondition then
        delog("self.nCurState == eState.eUndercondition ", self.nCurState)
        return
    end
    if self.bOpen == false and nState ~= eState.eApply then
        delog("CPKLeagueManager:ChangeLeagueState  self.bOpen = false")
        return 
    end

    self.nCurState = nState
    delog("self.nCurState == ", self.nCurState)

    -- 阶段人员分配设置
    -- 16强 筛选
    if self.nCurState == eState.eLeagueBet16 then
        --检测人数是否达标

        local tHitInfoToRank = CRankManager:GetRankBuyType(RankTypeEnum.PKLeagueHit)
        if #tHitInfoToRank < 32 then
            delog("InitFightPlayer #tHitInfoToRank < 32 !")
            self.nCurState = eState.eUndercondition

            local oLinkTips = NewClass("CLinkTips")
            --全服走马灯提示
            CPlayerManager:SendSystemTipsToAll(30074, oLinkTips:GetParams())

            return
        end

        local tLeftRoleId = { }
        local tRightRoleId = { }
        -- 获取前32名玩家ID
        for i=1,32 do
            table.insert( tLeftRoleId, tHitInfoToRank[i][RDRoleId] )
        end

        -- 随机配对人员
        for i=1,16 do
            local nRandomRole = math.random( 1, #tLeftRoleId )
            table.insert( tRightRoleId, tLeftRoleId[nRandomRole] )
            table.remove( tLeftRoleId, nRandomRole )
        end

        local nOdds = GameParamConfig_S.Odds[1]
        for i, id in ipairs(tLeftRoleId) do 
            -- 计算胜败
            local nLeftResult = self:PKResult( self:GetCapacity(id), self:GetCapacity(tRightRoleId[i]) )
            local nRightResult = self:PKResult( self:GetCapacity(tRightRoleId[i]), self:GetCapacity(id) )
            -- 红方玩家信息
            local tLeftRoleInfo  = { 
                [FPHead] = self.tPlayerPKLeagueInfo[id].playerInfo[RDHead], -- 头像id
                [FPName] = self.tPlayerPKLeagueInfo[id].playerInfo[RDName], -- 姓名
                [FPOdds] = nOdds * 100, -- 赔率
                [FPRoleId] = self.tPlayerPKLeagueInfo[id].playerInfo[RDRoleId], -- 玩家id
                [FPResult] = nLeftResult, -- 计算胜败
            }
            -- 蓝方玩家信息
            local tRightRoleInfo  = {
                [FPHead] = self.tPlayerPKLeagueInfo[tRightRoleId[i]].playerInfo[RDHead],
                [FPName] = self.tPlayerPKLeagueInfo[tRightRoleId[i]].playerInfo[RDName],
                [FPOdds] = nOdds * 100,
                [FPRoleId] = self.tPlayerPKLeagueInfo[tRightRoleId[i]].playerInfo[RDRoleId],
                [FPResult] = nRightResult,
            }
            self:SetPlayerFightResult(id, self.nCurState, i, nLeftResult)
            self:SetPlayerFightResult(tRightRoleId[i], self.nCurState, i, nRightResult)
            -- 设置赔率
            self:SetOddsData(nState, i, eStance.eLeft, nOdds)
            self:SetOddsData(nState, i, eStance.eRight, nOdds)

            if not self.tFightPlayerList[self.nCurState] then
                self.tFightPlayerList[self.nCurState] = { }
            end
            if not self.tFightPlayerList[self.nCurState + 1] then
                self.tFightPlayerList[self.nCurState + 1] = { }
            end

            self.tFightPlayerList[self.nCurState][i] =  {
                [eStance.eLeft] = tLeftRoleInfo,
                [eStance.eRight] = tRightRoleInfo,
            }
            self.tFightPlayerList[self.nCurState + 1][i] =  {
                [eStance.eLeft] = tLeftRoleInfo,
                [eStance.eRight] = tRightRoleInfo,
            }
        end
        -- 观战阶段信息一样
        -- self.tFightPlayerList[self.nCurState + 1] = self.tFightPlayerList[self.nCurState]

        -- 发邮件 通知玩家海选结束
        for id, tInfo in pairs(self.tPlayerPKLeagueInfo) do
            local nHit = tInfo.hit
            local nHitRank =CRankManager:GetRankBuyRoleId(RankTypeEnum.PKLeagueHit, id)
            local tAward = {}
            local nAward = GameParamConfig_S.JoinReward[2]
            if nHitRank <= 32 then
                nAward = GameParamConfig_S.JoinReward[1]
            end
            if nAward > 0 then
                table.insert( tAward, { 1, ItemEnum.eEiamond, nAward } )
            end
            if not next(tAward) then
                tAward = nil
            end
            CMailManager:SendMail(id, MailTypeEnum.PKLeagueHit, tAward, { nHit, nHitRank })
        end
        --全服走马灯提示
        local oLinkTips = NewClass("CLinkTips")
        CPlayerManager:SendSystemTipsToAll(30075, oLinkTips:GetParams())

    -- 8、4、2、1强 押注过程
    elseif self.nCurState == eState.eLeagueBet8 or 
           self.nCurState == eState.eLeagueBet4 or 
           self.nCurState == eState.eLeagueBet2 or 
           self.nCurState == eState.eLeagueBet1 then
        
        -- 发邮件 发送上个阶段的奖励

        self:SendLeagueMail()
        local tFightInfo = self.tFightPlayerList[self.nCurState - 2]
        local nSetPlayerNum = #tFightInfo / 2
        local tLeftRoleInfo = {}
        local tRightRoleInfo = {}
        local nOdds = GameParamConfig_S.Odds[1]
        for i, tInfo in ipairs(tFightInfo) do
            local nResult = tInfo[eStance.eLeft][FPResult]
            tInfo[eStance.eLeft][FPOdds] = nOdds * 100
            tInfo[eStance.eRight][FPOdds] = nOdds * 100
            -- 邀请胜利的玩家，进入下个比赛阶段
            if nResult == 1 then
                if #tLeftRoleInfo < nSetPlayerNum then
                     table.insert( tLeftRoleInfo, tInfo[eStance.eLeft] )
                else
                    table.insert( tRightRoleInfo, tInfo[eStance.eLeft] )
                end
            else
                if #tLeftRoleInfo < nSetPlayerNum then
                     table.insert( tLeftRoleInfo, tInfo[eStance.eRight] )
                else
                    table.insert( tRightRoleInfo, tInfo[eStance.eRight] )
                end
            end

            --  设置赔率
            self:SetOddsData(nState, i, eStance.eLeft, nOdds)
            self:SetOddsData(nState, i, eStance.eRight, nOdds)
        end
        -- 将上个比赛胜利人员 再次配对对手
        if not self.tFightPlayerList[self.nCurState] then
            self.tFightPlayerList[self.nCurState] = { }
        end
        for i,v in ipairs(tLeftRoleInfo) do
            tLeftRoleInfo[i][FPResult] = self:PKResult( self:GetCapacity(v[FPRoleId]), self:GetCapacity(tRightRoleInfo[i][FPRoleId]) )
            tRightRoleInfo[i][FPResult] = self:PKResult( self:GetCapacity(tRightRoleInfo[i][FPRoleId]), self:GetCapacity(v[FPRoleId]) )
            
            self.tFightPlayerList[self.nCurState][i] =  {
                [eStance.eLeft] = tLeftRoleInfo[i],
                [eStance.eRight] = tRightRoleInfo[i],
            }

            self:SetPlayerFightResult(v[FPRoleId], self.nCurState, i, tLeftRoleInfo[i][FPResult])
            self:SetPlayerFightResult(tRightRoleInfo[i][FPRoleId], self.nCurState, i, tRightRoleInfo[i][FPResult])
        end
        -- 观战阶段信息一样
        self.tFightPlayerList[self.nCurState + 1] = self.tFightPlayerList[self.nCurState]

    -- 8、4、2、1强 决赛过程
    elseif self.nCurState == eState.eLeagueWar16 or 
           self.nCurState == eState.eLeagueWar8 or 
           self.nCurState == eState.eLeagueWar4 or 
           self.nCurState == eState.eLeagueWar2 or 
           self.nCurState == eState.eLeagueWar1 then

            for i,tInfo in pairs(self.tFightPlayerList[self.nCurState]) do
                local sLeftId = tInfo[eStance.eLeft][FPRoleId]
                local sRightId = tInfo[eStance.eRight][FPRoleId]
                local oLeftPlayer = CPlayerManager:GetPlayerByRoleID(sLeftId)
                local oRightPlayer = CPlayerManager:GetPlayerByRoleID(sRightId)
                if oLeftPlayer then
                    oLeftPlayer:SendToClient( "C_ReqInformWatch", self.nCurState, i, tInfo[eStance.eLeft][FPName], tInfo[eStance.eRight][FPName] ) 
                end
                if oRightPlayer then
                    oRightPlayer:SendToClient( "C_ReqInformWatch", self.nCurState, i, tInfo[eStance.eLeft][FPName], tInfo[eStance.eRight][FPName] )
                end
            end

    --结算
    elseif self.nCurState == eState.eLeagueOver then
        self.nCurState = eState.eUnopened

        -- 发邮件 发送最后奖励
        self:SendLeagueMail()
        -- 玩家存盘脏位
        self.tSaveData = { }
        -- 阶段对战人员组
        self.tFightPlayerList = { }
        -- 报名玩家各种数据信息
        self.tPlayerPKLeagueInfo = { }
        -- 押注总数量信息
        self.tAllBetData = { }
        -- 本次活动总赔率信息
        self.tOddsData = { }
        -- 清表
        local oCmd = CDBCommand:CreateDeleteCmd("pkleague")
        oCmd:SetNoWhere()
        oCmd:Execute(true)

        -- 清空本周PK联赛伤害排行榜
        CRankManager:ClearOneRank( RankTypeEnum.PKLeagueHit )
    end
end

-- 发邮件奖励 决赛邮件
function CPKLeagueManager:SendLeagueMail( )
    local sName = "未知" -- 冠军名字
    if self.nCurState == eState.eLeagueOver then
        for _, info in pairs(self.tFightPlayerList[eState.eLeagueWar1]) do
            if info[eStance.eLeft][FPResult] == 1 then
                sName = info[eStance.eLeft][FPName]
            else
                sName = info[eStance.eRight][FPName]
            end
        end
    end

    for id, tInfo in pairs(self.tPlayerPKLeagueInfo) do
        local tAward = {}
        local nLastState = self.nCurState - 2 -- 上个押注阶段
        local nPraise = GameParamConfig_S.Praise[tPraiseNum[nLastState]] --获取上个阶段单次押注金额
        local nHitRank = CRankManager:GetRankBuyRoleId(RankTypeEnum.PKLeagueHit, id)
        local tMyBetInfo = tInfo.betinfo
        local tBetResult = {}
        local nMyResult = 0
        local nAward = 0
        -- 判断该玩家是否参与其中，该玩家胜利还是失败
        if nHitRank <= 32 and tInfo.fightplayer[nLastState] then
            for k,v in pairs(tInfo.fightplayer[nLastState]) do
                nMyResult = v
            end
        end
        -- 判断该玩家押注了没
        if tMyBetInfo[nLastState] then
            local nMyBetAllAward = 0
            for index, nStance in pairs(tMyBetInfo[nLastState]) do
                local tBetInfo = {}
                local tFightPlayer = self:GetFightPlayer(nLastState, index, nStance)
                -- 检测官方押注数据是否拥有
                if tFightPlayer ~= 0 then
                    local nMyBetAward = 0
                    local nOdds = tFightPlayer[FPOdds]
                    -- 如果压中了
                    if tFightPlayer[FPResult] == 1 then
                        -- 奖励 = 押注 * 赔率
                        nMyBetAward = math.floor(nPraise * nOdds / 100)
                    end
                    tBetInfo = {tFightPlayer[FPName], nOdds, nMyBetAward }
                    table.insert( tBetResult, tBetInfo )
                    nMyBetAllAward = nMyBetAllAward + nMyBetAward
                end
            end
            if nMyBetAllAward > 0 then
                table.insert( tAward, { 1, ItemEnum.eEiamond, nMyBetAllAward } )
            end
        end
        -- 胜利 失败 奖励 table.insert不要拆出来
        if nMyResult == 1 then
            nAward = (GameParamConfig_S.ELeagueReward[nLastState - 1] or 0)

            if nAward > 0 then
                table.insert( tAward, { 1, ItemEnum.eEiamond, nAward } )
            end

        elseif nMyResult == 2 then
            nAward = (GameParamConfig_S.ELeagueReward[nLastState] or 0)
            if nAward > 0 then
                table.insert( tAward, { 1, ItemEnum.eEiamond, nAward } )
            end
        end

        local eMailTypeEnum = MailTypeEnum.PKLeagueFight
        if self.nCurState == eState.eLeagueOver then
            eMailTypeEnum = MailTypeEnum.PKLeagueOver
        end
        if not next(tAward) then
            tAward = nil
        end
        CMailManager:SendMail(id, eMailTypeEnum, tAward, { nLastState, nMyResult, tBetResult, sName })
    end

    -- 全服通告
    if self.nCurState == eState.eLeagueOver then

        local oLinkTips = NewClass("CLinkTips")
        oLinkTips:AddRoleInfo(sName)
        oLinkTips:AddParam(StringInfoConfig_S[5015].s)
        CPlayerManager:SendSystemTipsToAll(30045, oLinkTips:GetParams())
    end
end


-- 初始化玩家PK联赛信息
function CPKLeagueManager:CreatPlayerPKLeagueInfo( sRoleId )
    if self.tPlayerPKLeagueInfo[sRoleId] then
        return
    end
    local oPlayer = CPlayerManager:GetPlayerByRoleID( sRoleId )
    self.tPlayerPKLeagueInfo[sRoleId] = {
        ["hit"] = 0, -- 海选伤害
        ["hitrank"] = CRankManager:GetRankBuyRoleId(RankTypeEnum.PKLeagueHit, sRoleId), -- 海选伤害排名
        ["betinfo"] = {}, -- 押注信息
        ["bettimes"] = {}, -- 玩家本周押注次数
        ["capacity"] = {}, -- 玩家战斗力计算数据
        ["fightplayer"] = {}, -- 阶段对战人员组
        ["playerInfo"] = {
                [RDRoleId]  = sRoleId,      -- roleid
                [RDName]    = oPlayer:GetName(), -- 名字
                [RDProf]    = oPlayer:GetProfID(), -- 职业
                [RDLevel]   = oPlayer:GetLevel(), -- 等级
                [RDVipLv]   = oPlayer:GetSystem("CVipSystem"):GetExpirationTime( ), -- 等级
                [RDHead]    = oPlayer:GetHeadID(), -- 头像
                [RDCamp]    = oPlayer:GetGuildID(),-- 阵营ID
                [RDHit]     = 0, -- 伤害
        }, -- 角色基本信息
    }
    -- 添加DB信息
    local cmd = CDBCommand:CreateInsertCmd("pkleague")
    cmd:SetFields("roleid", sRoleId)
    cmd:SetFields("hit", self.tPlayerPKLeagueInfo[sRoleId].hit)
    cmd:SetFields("hitrank", self.tPlayerPKLeagueInfo[sRoleId].hitrank)
    cmd:SetFields("betinfo", TableToStr(self.tPlayerPKLeagueInfo[sRoleId].betinfo))
    cmd:SetFields("bettimes", TableToStr(self.tPlayerPKLeagueInfo[sRoleId].bettimes))
    cmd:SetFields("capacity", TableToStr(self.tPlayerPKLeagueInfo[sRoleId].capacity))
    cmd:SetFields("fightplayer", TableToStr(self.tPlayerPKLeagueInfo[sRoleId].fightplayer)) 
    cmd:SetFields("playerInfo", TableToStr(self.tPlayerPKLeagueInfo[sRoleId].playerInfo)) 
    cmd:Execute()
end

-- 获取押注信息
function CPKLeagueManager:GetBetInfoList( sRoleId )
    if not self.tPlayerPKLeagueInfo[sRoleId] then
        return nil
    end
    return self.tPlayerPKLeagueInfo[sRoleId].betinfo
end

-- 获取总押注信息
function CPKLeagueManager:GettAllBetData( nState, nIndex, nStance )
    if not self.tAllBetData[nState] then
        return 0
    end
    if not self.tAllBetData[nState][nIndex] then
        return 0
    end
    return self.tAllBetData[nState][nIndex][nStance] or 0
end

-- 设置玩家阶段对战结果
function CPKLeagueManager:SetPlayerFightResult( sRoleId, nState, nIndex, nResult )
    if not self.tPlayerPKLeagueInfo[sRoleId] then
        delog("CPKLeagueManager:SetPlayerFightPlayer not self.tPlayerPKLeagueInfo[sRoleId]")
        return
    end
    if not self.tPlayerPKLeagueInfo[sRoleId].fightplayer[self.nCurState] then
        self.tPlayerPKLeagueInfo[sRoleId].fightplayer[self.nCurState] = { }
    end
    self.tPlayerPKLeagueInfo[sRoleId].fightplayer[self.nCurState][nIndex] = nResult
    self.tSaveData[sRoleId] = 1
end
-- 获取阶段对战人员组信息
function CPKLeagueManager:GetFightPlayer( nState, nIndex, nStance )
    if not self.tFightPlayerList[nState] then
        delog("CPKLeagueManager:AddAllBetData not self.tFightPlayerList[nState]")
        return 0
    end
    if not self.tFightPlayerList[nState][nIndex] then
        delog("CPKLeagueManager:AddAllBetData not self.tFightPlayerList[nState][nIndex]")
        return 0
    end
    return self.tFightPlayerList[nState][nIndex][nStance] or 0
end

-- 获取玩家战斗计算数据
function CPKLeagueManager:GetCapacity( sRoleId )
    local tInfo = {
        ["hp"] = 0,
        ["dps"] = 0,
    }
    if not self.tPlayerPKLeagueInfo[sRoleId] then
        return tInfo
    end
    if not next(self.tPlayerPKLeagueInfo[sRoleId].capacity) then
        return tInfo
    end
    return self.tPlayerPKLeagueInfo[sRoleId].capacity
end

-- 获取列表押注信息
function CPKLeagueManager:GetOddsData( nState, nIndex, nStance )
    if not self.tOddsData[nState] then
        delog("CPKLeagueManager:GetOddsData not self.tOddsData[nState]")
        return GameParamConfig_S.Odds[1]
    end
    if not self.tOddsData[nState][nIndex] then
        delog("CPKLeagueManager:GetOddsData not self.tOddsData[nState][nIndex]")
        return GameParamConfig_S.Odds[1]
    end
    return self.tOddsData[nState][nIndex][nStance] or GameParamConfig_S.Odds[1]
end
-- 设置列表押注信息
function CPKLeagueManager:SetOddsData( nState, nIndex, nStance, nOdds )
    if not self.tOddsData[nState] then
        self.tOddsData[nState] = {}
    end
    if not self.tOddsData[nState][nIndex] then
       self.tOddsData[nState][nIndex] = {}
    end
    self.tOddsData[nState][nIndex][nStance] = nOdds
end
-- 累加总押注信息
function CPKLeagueManager:AddAllBetData( nState, nIndex, nStance )
    if not self.tAllBetData[nState] then
        self.tAllBetData[nState] = {}
    end
    if not self.tAllBetData[nState][nIndex] then
        self.tAllBetData[nState][nIndex] = {}
    end
    if not self.tAllBetData[nState][nIndex][nStance] then
        self.tAllBetData[nState][nIndex][nStance] = 0
    end
    -- 累加
    self.tAllBetData[nState][nIndex][nStance] = self.tAllBetData[nState][nIndex][nStance] + 1

    --重新计算双方赔率
    local nLeftBet = self:GettAllBetData(nState, nIndex, eStance.eLeft)
    local nRightBet = self:GettAllBetData(nState, nIndex, eStance.eRight)

    local nLeftOdds = self:CalculateOdds(nLeftBet, nRightBet )
    local nRightOdds = self:CalculateOdds(nRightBet, nLeftBet )

    if self:GetFightPlayer(nState, nIndex, eStance.eLeft) == 0 then
        return
    end
    if self:GetFightPlayer(nState, nIndex, eStance.eRight) == 0 then
        return
    end

    self.tFightPlayerList[nState][nIndex][eStance.eLeft][FPOdds] = nLeftOdds * 100
    self.tFightPlayerList[nState][nIndex][eStance.eRight][FPOdds] = nRightOdds * 100
    local sLeftRoleId = self.tFightPlayerList[nState][nIndex][eStance.eLeft][FPRoleId]
    local sRightRoleId = self.tFightPlayerList[nState][nIndex][eStance.eRight][FPRoleId]

    self:SetOddsData(nState, nIndex, eStance.eLeft, nLeftOdds)
    self:SetOddsData(nState, nIndex, eStance.eRight, nRightOdds)
    self.tSaveData[sLeftRoleId] = 1
    self.tSaveData[sRightRoleId] = 1
end

---------------------------------------------请求--------------------------------------------------
---------------------------------------------------------------------------------------------------

-- 发送PK联赛状态信息
function CPKLeagueManager:ReqPKLeagueState( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tInfo = self.tPlayerPKLeagueInfo[sRoleId]
    -- 未开启 或者 条件不足无法开启
    if self.nCurState == eState.eUnopened or self.nCurState == eUndercondition then
        oPlayer:SendToClient( "C_ReqPKLeagueState", self.nCurState)

    -- 报名
    elseif self.nCurState == eState.eApply then
        
        local tPlayerInfo = {}
        if tInfo then
            tPlayerInfo = {
                ["rank"] = CRankManager:GetRankBuyRoleId(RankTypeEnum.PKLeagueHit, sRoleId),-- 排名 (-1未上榜)
                ["hit"] = tInfo.hit,-- 伤害
            }
        end
        delog("self.nCurState == eState.eApply", self.nCurState, tPlayerInfo, CPVPManager:ReqPKLeagueActivityInfo(sRoleId))
        oPlayer:SendToClient( "C_ReqPKLeagueState", self.nCurState, tPlayerInfo, CPVPManager:ReqPKLeagueActivityInfo(sRoleId))
   
    -- 筛选阶段
    else 
        if not tInfo then
            self:CreatPlayerPKLeagueInfo( sRoleId )
            tInfo = self.tPlayerPKLeagueInfo[sRoleId]
            if not tInfo then
                delog("ReqPKLeagueState not tInfo , you not Apply !")
            end
        end

        local tFightPlayer = self.tFightPlayerList[self.nCurState]
        local sNextTime = GameParamConfig_S.ELeagueTime[self.nCurState]
        local tBetInfo = self:GetBetInfoList(sRoleId)
        local tLeftHeroInfo = { }
        local tRighttHeroInfo = { }

        -- 决赛特殊传参
        if self.nCurState == eState.eLeagueWar1 or self.nCurState == eState.eLeagueBet1 then
            local sLeftId = tFightPlayer[1][eStance.eLeft][FPRoleId]
            local sRightId = tFightPlayer[1][eStance.eRight][FPRoleId]

            local tLeftCombatInfo = CPVPManager:ReqPKLeagueActivityInfo(sLeftId)
            local tRightCombatInfo = CPVPManager:ReqPKLeagueActivityInfo(sRightId)

            if (not tLeftCombatInfo) or (not tRightCombatInfo) then
                delog("(not tLeftCombatInfo) or (not tRightCombatInfo)")
            end
            tLeftHeroInfo = tLeftCombatInfo[1].Hero
            tRighttHeroInfo = tRightCombatInfo[1].Hero 
        end
        local nState = self.nCurState
        if not tInfo.bettimes[self.nCurState] then
            nState = nState - 1
        end
        oPlayer:SendToClient( "C_ReqPKLeagueState", self.nCurState, tInfo.bettimes[nState], tBetInfo[nState], tFightPlayer, sNextTime, tLeftHeroInfo, tRighttHeroInfo )
    end
end

-- 接收海选伤害
function CPKLeagueManager:ReqLeagueHit( oPlayer, nHit )
    local sRoleId = oPlayer:GetRoleID( )
    --新人初始化信息
    if not self.tPlayerPKLeagueInfo[sRoleId] then
        self:CreatPlayerPKLeagueInfo( sRoleId )
        --再次检测
        if not self.tPlayerPKLeagueInfo[sRoleId] then
            delog("not self.tPlayerPKLeagueInfo[sRoleId]")
            return 
        end
    end
    oPlayer:SetPKLeagueFlag( 1 )
    CRankManager:RankUpdate(RankTypeEnum.PKLeagueHit, sRoleId, nHit, -now(1))

    if nHit > self.tPlayerPKLeagueInfo[sRoleId].hit then
        self.tPlayerPKLeagueInfo[sRoleId].hit = nHit
    end
    oPlayer:SendToClient( "C_ReqLeagueHit", self.tPlayerPKLeagueInfo[sRoleId].hit, CRankManager:GetRankBuyRoleId(RankTypeEnum.PKLeagueHit, sRoleId))
end

-- 押注
function CPKLeagueManager:ReqLeagueBetInfo( oPlayer, nState, nIndex, nStance )
    local sRoleId = oPlayer:GetRoleID( )
    local tInfo = self.tPlayerPKLeagueInfo[sRoleId]
    local nBetMaxNum = tPraiseNum[self.nCurState]
    if not tInfo then
        self:CreatPlayerPKLeagueInfo( sRoleId )
        tInfo = self.tPlayerPKLeagueInfo[sRoleId]
        if not tInfo then
            delog("ReqPKLeagueState not tInfo , you not Apply !")
        end
    end

    --检测客户端与服务器的状态是否相同
    if self.nCurState ~= nState then
        delog("ReqLeagueBetInfo self.nCurState ~= self.nCurState !")
        return
    end

    if not tInfo.bettimes[self.nCurState] then
        tInfo.bettimes[self.nCurState] = 0
    end 

    if not tPraiseNum[self.nCurState] then
        delog("ReqLeagueBetInfo not tPraiseNum[self.nCurState] !")
        return
    end
    --检测次数是否已达上限
    if tInfo.bettimes[self.nCurState] > GameParamConfig_S.PraiseNum[nBetMaxNum] then
        delog("ReqLeagueBetInfo tInfo.bettimes[self.nCurState] > 3")
        return
    end

    if not tInfo.betinfo[self.nCurState] then
        tInfo.betinfo[self.nCurState] = { }
    end

    -- 已经押注过该组人员
    if tInfo.betinfo[self.nCurState][nIndex] then
        delog("ReqLeagueBetInfo stInfo.betinfo[self.nCurState][nIndex] is have Bet！", self.nCurState, nIndex)
        return
    end

    local nUseCount = GameParamConfig_S.Praise[tPraiseNum[self.nCurState]]
    -- 检测材料是否足够 并且消耗
    if not oPlayer:CostItem( ItemEnum.eEiamond, nUseCount, ItemLogEnum.BuyLadderTimes ) then
        delog( "CPKLeagueManager:ReqLeagueBetInfo not oPlayer:CostItem", ItemEnum.eEiamond, nUseCount )
        return
    end 

    -- 增加押注次数
    tInfo.bettimes[self.nCurState] = tInfo.bettimes[self.nCurState] + 1

    self:AddAllBetData( self.nCurState, nIndex, nStance )
    -- 设置押注信息
    tInfo.betinfo[self.nCurState][nIndex] = nStance
    self.tSaveData[sRoleId] = 1
    oPlayer:SendToClient( "C_ReqLeagueBetInfo" , nIndex, nStance, self.tFightPlayerList[self.nCurState] )
end



-- 请求观看联赛信息
function CPKLeagueManager:ReqWatchLeague( oPlayer, nState, nIndex )
    local sRoleId = oPlayer:GetRoleID( )
    local tInfo = self.tPlayerPKLeagueInfo[sRoleId]
    if not tInfo then
        self:CreatPlayerPKLeagueInfo( sRoleId )
        tInfo = self.tPlayerPKLeagueInfo[sRoleId]
        if not tInfo then
            delog("ReqPKLeagueState not tInfo , you not Apply !")
        end
    end
    --检测客户端与服务器的状态是否相同
    if self.nCurState ~= nState then
        delog("ReqWatchLeague self.nCurState ~= nState !")
        return
    end

    if not self.tFightPlayerList[nState] then
        delog("ReqWatchLeague not self.tFightPlayerList[nState] !")
        return 
    end

    if not self.tFightPlayerList[nState][nIndex] then
        delog("ReqWatchLeague not self.tFightPlayerList[nState][nIndex] !")
        return 
    end

    local sLeftRoleInfo = self.tFightPlayerList[nState][nIndex][eStance.eLeft]
    local sRightRoleInfo = self.tFightPlayerList[nState][nIndex][eStance.eRight]

    local tLeftCombatInfo = CPVPManager:ReqPKLeagueActivityInfo(sLeftRoleInfo[FPRoleId])
    local tRightCombatInfo = CPVPManager:ReqPKLeagueActivityInfo(sRightRoleInfo[FPRoleId])
    --如果丢失了战斗包  给个假的
    if not next(tLeftCombatInfo) then
        tLeftCombatInfo = {{["Hero"]={["1"]={["id"]=102,["level"]=24,["star"]=1,["location"]=2},["0"]={["id"]=101,["level"]=24,["star"]=1,["location"]=0},["3"]={["id"]=104,["level"]=24,["star"]=1,["location"]=6},["2"]={["id"]=103,["level"]=24,["star"]=1,["location"]=4},["4"]={["id"]=105,["level"]=24,["star"]=1,["location"]=8}},["Camp"]={["0"]={["Base"]=0,["level"]=1}},["Pet"]={["0"]={["id"]=1,["level"]=1}},["Player"]={["0"]={["sList"]={},["MpRec"]=30,["level"]=24,["isVip"]=false,["MpMax"]=60}}}}
    end
    if not next(tRightCombatInfo) then
        tRightCombatInfo = {{["Hero"]={["1"]={["id"]=127,["location"]=1,["level"]=70,["star"]=5},["0"]={["id"]=101,["location"]=0,["level"]=70,["star"]=5},["3"]={["id"]=116,["location"]=3,["level"]=70,["star"]=5},["2"]={["id"]=126,["location"]=2,["level"]=70,["star"]=5},["4"]={["id"]=102,["location"]=4,["level"]=70,["star"]=5}},["Pet"]={["0"]={["id"]=1,["level"]=1}},["Camp"]={["0"]={}},["Attribute"]={[1]={["1"]=11,["2"]=1000},[2]={["1"]=12,["2"]=500},[3]={["1"]=17,["2"]=200},[4]={["1"]=24,["2"]=300},[5]={["1"]=27,["2"]=200},[6]={["1"]=11,["2"]=1000},[7]={["1"]=31,["2"]=500}},["Player"]={["0"]={["sList"]={["0"]=101},["Cmp"]=110,["isVip"]=true,["MpMax"]=60,["MpRec"]=30,["level"]=83}}}}
    end
    -- 1代表左边玩家胜  2代表左边玩家败
    local nResult = 2
    if sLeftRoleInfo[FPResult] == 1 then
        nResult = 1
    end
    oPlayer:SendToClient( "C_ReqWatchLeague", tLeftCombatInfo[1], tRightCombatInfo[1] , nResult  )
end

-- 接收玩家的队伍总生命、总DPS
function CPKLeagueManager:ReqCapacityList( oPlayer, nAllHP, nAllDPS )
    local sRoleId = oPlayer:GetRoleID( )
    local tInfo = self.tPlayerPKLeagueInfo[sRoleId]
    if not tInfo then
        self:CreatPlayerPKLeagueInfo( sRoleId )
        tInfo = self.tPlayerPKLeagueInfo[sRoleId]
        if not tInfo then
            delog("ReqPKLeagueState not tInfo , you not Apply !")
        end
    end
    tInfo.capacity = {
        ["hp"] = nAllHP,
        ["dps"] = nAllDPS,
    }
    self.tSaveData[sRoleId] = 1
end

-- 请求PK联赛状态信息
defineC.K_ReqPKLeagueState = function ( oPlayer )
    CPKLeagueManager:ReqPKLeagueState( oPlayer )
end

-- 发送海选伤害
defineC.K_ReqLeagueHit = function ( oPlayer, nHit )
    CPKLeagueManager:ReqLeagueHit( oPlayer, nHit )
end

-- 发送押注信息
defineC.K_ReqLeagueBetInfo = function ( oPlayer, nState, nIndex, nStance )
    CPKLeagueManager:ReqLeagueBetInfo( oPlayer, nState, nIndex, nStance )
end

-- 请求观看联赛信息
defineC.K_ReqWatchLeague = function ( oPlayer, nState, nIndex )
    CPKLeagueManager:ReqWatchLeague( oPlayer, nState, nIndex )
end

-- 发送玩家的队伍总生命、总DPS
defineC.K_ReqCapacityList = function ( oPlayer, nAllHP, nAllDPS )
    CPKLeagueManager:ReqCapacityList( oPlayer, nAllHP, nAllDPS )
end

---------------------------------------------计算功能----------------------------------------------
---------------------------------------------------------------------------------------------------
-- 计算赔率
-- 对a和b玩家进行押注的押注总金额分别为m和n
-- a胜利的赔率=[n*(1-税率)/m]+1，奖励=赔率*个人押注金额
-- b胜利的赔率=[m*(1-税率)/n]+1，奖励=赔率*个人押注金额
function CPKLeagueManager:CalculateOdds( nAllMoney_A, nAllMoney_B )
    local Num_A = GameParamConfig_S.Praise[tPraiseNum[self.nCurState]] * nAllMoney_A
    local Num_B = GameParamConfig_S.Praise[tPraiseNum[self.nCurState]] * nAllMoney_B
    local nOdds = ( Num_B * ( 1 - GameParamConfig_S.TaxRate ) / Num_A ) + 1
    nOdds = math.max( nOdds, GameParamConfig_S.Odds[1] )
    nOdds = math.min( nOdds, GameParamConfig_S.Odds[2] )
    return nOdds
end

-- 计算胜负
-- tCapacity_A A的战斗力计算数据,tCapacity_B B的战斗力计算数据
-- nResult = 1 为A胜利 B失败
-- nResult = 2 为A失败 B胜利
function CPKLeagueManager:PKResult( tCapacity_A, tCapacity_B )
    local nValue = (tCapacity_A.hp / tCapacity_B.dps) / (tCapacity_B.hp / tCapacity_A.dps)
    local nResult
    if nValue >= 1 then
        nResult = 1
    else
        nResult = 2
    end
    return nResult
end
