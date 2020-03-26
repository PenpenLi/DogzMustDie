--[[
	@brief 本服排行榜
	@author Hou
]]
local ipairs = ipairs
local pairs = pairs
local next = next
local string_format = string.format
local table_insert = table.insert
local table_remove = table.remove
local table_sort = table.sort
local math_floor = math.floor
local math_min = math.min
local now = _commonservice.now
local MailTypeEnum      = RequireEnum("MailTypeEnum")
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum");
local CSchedule = RequireSingleton("CSchedule");
local GameParamConfig_S = RequireConfig("GameParamConfig_S")
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager")
local CDBCommand = RequireSingleton("CDBCommand")
local CPlayerManager = RequireSingleton("CPlayerManager")
local RankTypeEnum = RequireEnum("RankTypeEnum")
local GameEventEnum = RequireEnum("GameEventEnum")
local CCommonFunction   = RequireSingleton("CCommonFunction")
local CMailManager = RequireSingleton("CMailManager")

-- boss奖励缓存
local tBossAwardMapping = {}
for _, tAwardInfo in ipairs( GameParamConfig_S.WorldBossReward ) do 
    local nRank = tAwardInfo[1]
    local nAward = tAwardInfo[2]
    tBossAwardMapping[nRank] = nAward
end 

-- 简要数据下标枚举
local RDRoleId = 1 -- roleid
local RDName = 2 -- rolename
local RDLevel = 3 -- 等级
local RDProf = 4 -- 职业
local RDVipLv = 5 -- vip等级
local RDHead = 6 -- 头像ID
local RDCamp = 7 -- 阵营ID

local RoleIdCol = 1 -- roleid在tRank中的下标
local MainCol = 3 -- 主数据在tRank中的下标

-- 最低排名
local MinRank = 100

-- 定时保存间隔
local SaveInterval = 60 * 60000 --60 * 60000;

-- 排行榜条件类型
local tbRankType = {
    Main = 1, -- 一个条件
    Vice = 2, -- 两个条件
    Next = 3 -- 三个条件
}

-- 各种load函数
local tbRankFunc = {
    [tbRankType.Main] = function(tRank, tRolePos, tData, res, pos)
        table_insert(
            tRank,
            {
                res.roleid,
                tData[RDName],
                res.mainvalue
            }
        )
        tRolePos[res.roleid] = pos
    end,
    [tbRankType.Vice] = function(tRank, tRolePos, tData, res, pos)
        table_insert(
            tRank,
            {
                res.roleid,
                tData[RDName],
                res.mainvalue,
                res.vicevalue
            }
        )
        tRolePos[res.roleid] = pos
    end,
    [tbRankType.Next] = function(tRank, tRolePos, tData, res, pos)
        table_insert(
            tRank,
            {
                res.roleid,
                tData[RDName],
                res.mainvalue,
                res.vicevalue,
                res.nextvalue
            }
        )
        tRolePos[res.roleid] = pos
    end
}

-- 排序字段
local tbRankOrder = {
    [tbRankType.Main] = "`mainvalue` desc",
    [tbRankType.Vice] = "`mainvalue` desc, `vicevalue` desc",
    [tbRankType.Next] = "`mainvalue` desc, `vicevalue` desc, `nextvalue` desc"
}

-- 各种字段信息
local tbRankKeys = {
    [tbRankType.Main] = {"roleid", "mainvalue"},
    [tbRankType.Vice] = {"roleid", "mainvalue", "vicevalue"},
    [tbRankType.Next] = {"roleid", "mainvalue", "vicevalue", "nextvalue"}
}

local tbRankValues = {
    [tbRankType.Main] = function(tRank)
        return {tRank[1], tRank[MainCol]}
    end,
    [tbRankType.Vice] = function(tRank)
        return {tRank[1], tRank[MainCol], tRank[4]}
    end,
    [tbRankType.Next] = function(tRank)
        return {tRank[1], tRank[MainCol], tRank[4], tRank[5]}
    end
}

-- 排行榜数据表信息
local RankDBInfo = {
    [RankTypeEnum.LevelRank] = {tbName = "rank_level", nType = tbRankType.Vice}, -- 等级榜
    [RankTypeEnum.GoldRank] = {tbName = "rank_gold", nType = tbRankType.Vice}, -- 财富榜
    [RankTypeEnum.ClickRank] = {tbName = "rank_click", nType = tbRankType.Vice}, -- 点击榜
    [RankTypeEnum.ChargeRank] = {tbName = "rank_charge", nType = tbRankType.Vice}, -- 充值榜
    [RankTypeEnum.HeroRank] = {tbName = "rank_hero", nType = tbRankType.Vice}, -- 英雄榜

    [RankTypeEnum.CharmAll] = {tbName = "rank_charmall", nType = tbRankType.Vice}, -- 魅力总榜
    [RankTypeEnum.CharmWeek] = {tbName = "rank_charmweek", nType = tbRankType.Vice}, -- 魅力周榜
    [RankTypeEnum.CharmLastWeek] = {tbName = "rank_charmlastweek", nType = tbRankType.Vice}, -- 魅力上周榜
  
    [RankTypeEnum.BossToDay] = {tbName = "rank_bosstoday", nType = tbRankType.Vice}, -- 世界BOSS今日榜
    [RankTypeEnum.BossYesTerDay] = {tbName = "rank_bossyesterday", nType = tbRankType.Vice}, -- 世界BOSS昨日榜
    
    [RankTypeEnum.PKLeagueHit] = {tbName = "rank_pkLeaguehit", nType = tbRankType.Vice}, -- PK联赛伤害排行榜

}

local CRankManager = RequireSingleton("CRankManager")
function CRankManager:Initialize()
    -- 本服排行
    self.m_tRank = {}
    -- 辅助表（快速定位）
    self.m_tRolePos = {}
    -- 角色简要数据
    self.m_tRoleData = {}
    -- 用于定时保存数据
    self.m_nSaveTime = SaveInterval
    for _, v in pairs(RankTypeEnum) do
        self.m_tRank[v] = {}
        self.m_tRolePos[v] = {}
    end
    self.m_tSaveRank = {}
    self:LoadData()
    return true
end

-- 开服处理
function CRankManager:Openserverdis( )
    local nShuttime = CGlobalInfoManager:GetShuttime()
    if nShuttime and ( not CCommonFunction.IsSecInThisWeek(nShuttime) ) then
        self:OnWeekRefresh()
    end 
end

-- 每周调用
function CRankManager:OnWeekRefresh( )
    -- 将本周魅力榜给上周魅力榜
    self.m_tRank[RankTypeEnum.CharmLastWeek] = self.m_tRank[RankTypeEnum.CharmWeek]
    self.m_tRolePos[RankTypeEnum.CharmLastWeek] = self.m_tRolePos[RankTypeEnum.CharmWeek]

    -- 清空本周魅力榜
    self:ClearOneRank( RankTypeEnum.CharmWeek )
end

function CRankManager:LoadData()
    -- 填充 m_tRoleData
    local oCmd = CDBCommand:CreateSelectCmd("role")
    oCmd:SetFields("roleid")
    oCmd:SetFields("rolename")
    oCmd:SetFields("level")
    oCmd:SetFields("roleprof")
    oCmd:SetFields("rolehead")
    local tRes = oCmd:Execute()
    if tRes and #tRes > 0 then
        local rid
        for _, res in ipairs(tRes) do
            rid = res.roleid
            self.m_tRoleData[rid] = {
                [RDRoleId] = rid, -- roleid
                [RDName] = res.rolename, -- 名字
                [RDProf] = res.roleprof, -- 职业
                [RDLevel] = res.level,   -- 等级
                [RDHead] = res.rolehead, -- 头像
            }
        end
    end
    oCmd = CDBCommand:CreateSelectCmd("role_info")
    oCmd:SetFields("roleid")
    oCmd:SetFields("guildid")
    local tInfoRes = oCmd:Execute()
    local tData
    if tInfoRes and #tInfoRes > 0 then
        for _, res in ipairs(tInfoRes) do
            tData = self.m_tRoleData[res.roleid]
            if tData then
                tData[RDCamp] = res.guildid -- 阵营
            end
        end
    end
    oCmd = CDBCommand:CreateSelectCmd("vip")
    oCmd:SetFields("roleid")
    local tInfoRes = oCmd:Execute()
    local tData
    if tInfoRes and #tInfoRes > 0 then
        for _, res in ipairs(tInfoRes) do
            tData = self.m_tRoleData[res.roleid]
            if tData then
                tData[RDVipLv] = res.expirationtime -- 当前vip
            end
        end
    end
    -- 填充 m_tRank m_tRolePos
    local tRank, tRoleP, func
    for rankType, info in pairs(RankDBInfo) do
        oCmd = CDBCommand:CreateSelectCmd(info.tbName)
        oCmd:OrderBy(tbRankOrder[info.nType], true, true)
        oCmd:SetLimit(MinRank)
        tRes = oCmd:Execute()
        tRank = self.m_tRank[rankType]
        tRoleP = self.m_tRolePos[rankType]
        func = tbRankFunc[info.nType]
        if tRes and #tRes > 0 then
            for i, res in ipairs(tRes) do
                -- 这里是防止排行榜里存放了已经不存在的玩家
                if self.m_tRoleData[res.roleid] then
                    func(tRank, tRoleP, self.m_tRoleData[res.roleid], res, i)
                end
            end
        end
    end
end

function CRankManager:SaveData()
    local oCmd, getFunc
    for rankType, info in pairs(RankDBInfo) do
        repeat
            oCmd = CDBCommand:CreateDeleteCmd(info.tbName)
            oCmd:SetNoWhere()
            oCmd:Execute()
            if not next(self.m_tRank[rankType]) then
                break
            end
            oCmd = CDBCommand:CreateInsertCmd(info.tbName)
            oCmd:SetKeys(tbRankKeys[info.nType])
            getFunc = tbRankValues[info.nType]
            for _, v in ipairs(self.m_tRank[rankType]) do
                oCmd:SetMultiValues(getFunc(v))
            end
            oCmd:Execute()
        until true
    end
end

function CRankManager:BeginDelaySave()
    local getFunc, temp
    for rankType, info in pairs(RankDBInfo) do
        self.m_tSaveRank[rankType] = {}
        temp = self.m_tSaveRank[rankType]
        getFunc = tbRankValues[info.nType]
        for _, v in ipairs(self.m_tRank[rankType]) do
            table_insert(temp, getFunc(v))
        end
    end
end

function CRankManager:DelaySaveData()
    local nType, tData = next(self.m_tSaveRank)
    if not nType then
        return
    end
    local tbInfo = RankDBInfo[nType]
    local oCmd = CDBCommand:CreateDeleteCmd(tbInfo.tbName)
    oCmd:SetNoWhere()
    oCmd:Execute()
    if not next(tData) then
        self.m_tSaveRank[nType] = nil
        return
    end
    oCmd = CDBCommand:CreateInsertCmd(tbInfo.tbName)
    oCmd:SetKeys(tbRankKeys[tbInfo.nType])

    for _, v in ipairs(tData) do
        oCmd:SetMultiValues(v)
    end
    oCmd:Execute()
    self.m_tSaveRank[nType] = nil
end

function CRankManager:Update(i_nDeltaMSec)
    self.m_nSaveTime = self.m_nSaveTime - i_nDeltaMSec
    if self.m_nSaveTime <= 0 then
        self.m_nSaveTime = self.m_nSaveTime + SaveInterval
        self:BeginDelaySave()
    else
        self:DelaySaveData()
    end
end

-- 每日调用发奖励
function CRankManager:OnDayRefresh()
    --发奖励
    local tRank = self.m_tRank[RankTypeEnum.BossToDay]
    local tRoleP = self.m_tRolePos[RankTypeEnum.BossToDay]
    --奖励ID
    local nGiftID = nil
    for nRank, tInfo in ipairs(tRank) do
        local nAward = tBossAwardMapping[nRank]
        if nAward then
            nGiftID = nAward
        end 
        local sRoleID = tInfo[1]
        CMailManager:SendMail( sRoleID, MailTypeEnum.ChallengeBoss, nGiftID, { nRank })
    end
   -- 将世界Boss今日榜给世界Boss昨日日榜
    self.m_tRank[RankTypeEnum.BossYesTerDay] = self.m_tRank[RankTypeEnum.BossToDay]
    self.m_tRolePos[RankTypeEnum.BossYesTerDay] = self.m_tRolePos[RankTypeEnum.BossToDay]

    -- 清空世界Boss今日榜
    self:ClearOneRank( RankTypeEnum.BossToDay )
end

function CRankManager:Destruct()
    self.m_tSaveRank = {}
    self:SaveData()
end

-- 排行榜刷新
function CRankManager:RankUpdate(i_nType, sRoleId, i_nMainValue, i_nViceValue, i_nNextValue)
    local tRank = self.m_tRank[i_nType]
    local tRoleP = self.m_tRolePos[i_nType]
    local nCurPos = tRoleP[sRoleId]
    -- 获取排行榜数据类型
    local nRankType = RankDBInfo[i_nType].nType
    local tbValues = {i_nMainValue, i_nViceValue, i_nNextValue}
    if #tbValues <= 0 then
        delog( "#tbValues <= 0" )
        return
    end
    -- 如果已在榜内
    if nCurPos then
        local bCanUpdate = false
        local tbOldValues = tbRankValues[nRankType](tRank[nCurPos])
        for nIdx, nVal in ipairs(tbValues) do
            local nOldVal = tbOldValues[nIdx + 1] -- 为什么nIdx要+1 因为这个里面1是roleid
            if nVal < nOldVal then
                bCanUpdate = false
                break
            elseif nVal > nOldVal then
                bCanUpdate = true
                break
            end
        end 
        -- 如果当前的属性和之前的一样或者不如之前的 则不刷新排行
        if not bCanUpdate then
            return
        end

        -- 附上值
        for nIdx, nVal in ipairs(tbValues) do
            tRank[nCurPos][nIdx + 2] = nVal
        end

        local nPos = nCurPos
        while nPos > 1 do
            local bCurPos = false
            -- 获取上一名的信息
            local tbLastValues = tbRankValues[nRankType](tRank[nPos - 1])
            for nIdx, nVal in ipairs(tbValues) do
                local nLastVal = tbLastValues[nIdx + 1] -- 为什么nIdx要+1 因为这个里面1是roleid
                --delog( "nPos - 1", nPos - 1, nVal, nLastVal )
                if nVal > nLastVal then
                    break
                elseif nVal < nLastVal then
                    bCurPos = true
                    break
                elseif (nVal <= nLastVal) and (nIdx == #tbValues) then
                    bCurPos = true
                    break
                end
            end
            if bCurPos then
                break
            end
            nPos = nPos - 1
        end
        --delog( "nCurPos:", nCurPos, "nPos", nPos )
        if nPos ~= nCurPos then
            --delog( "CRankManager:RankUpdate rank up", nPos )
            tRoleP[sRoleId] = nPos
            local tTemp = tRank[nCurPos]
            for i = nCurPos - 1, nPos, -1 do
                tRoleP[tRank[i][RoleIdCol]] = tRoleP[tRank[i][RoleIdCol]] + 1
                tRank[i + 1] = tRank[i]
            end
            tRank[nPos] = tTemp
        end
    else -- 没在榜内
        local nNum = #tRank
        local nPos = nNum + 1
        while nPos > 1 do
            local bCurPos = false
            -- 获取上一名的信息
            local tbLastValues = tbRankValues[nRankType](tRank[nPos - 1])
            for nIdx, nVal in ipairs(tbValues) do
                local nLastVal = tbLastValues[nIdx + 1] -- 为什么nIdx要+1 因为这个里面1是roleid
                if nVal > nLastVal then
                    break
                elseif nVal < nLastVal then
                    bCurPos = true
                    break
                elseif (nVal <= nLastVal) and (nIdx == #tbValues) then
                    bCurPos = true
                    break
                end
            end
            if bCurPos then
                break
            end
            nPos = nPos - 1
        end
        if nPos > MinRank then -- 没进榜
            return
        end
        local sName = ""
        local oPlayer = CPlayerManager:GetPlayerByRoleID(sRoleId)
        if oPlayer then
            sName = oPlayer:GetName( )
        else
            local tData = self.m_tRoleData[sRoleId]
            if tData then
                sName = tData[RDName]
            else
                local oDBCmd = CDBCommand:CreateSelectCmd("role")
                oDBCmd:SetFields("rolename")
                oDBCmd:SetWheres("roleid", nRoleID, "=")
                oDBCmd:SetLimit(1)
                local res = oDBCmd:Execute()
                local info = res[1]
                if info then
                    sName = info.rolename
                end 
            end 
        end 

        local tRankInfo = {
            sRoleId,
            sName,
        }
        for _, nVal in ipairs(tbValues) do
            table_insert(tRankInfo, nVal)
        end
        table_insert(tRank, nPos, tRankInfo)
        --delog( "table_insert(tRank, nPos, tRankInfo)", i_nType, nPos )
        tRoleP[sRoleId] = nPos
        -- 去掉垫底的
        if nNum == MinRank then
            local tRem = table_remove(tRank)
            tRoleP[tRem[RoleIdCol]] = nil
        end
        for i = nPos + 1, #tRank do
            tRoleP[tRank[i][RoleIdCol]] = tRoleP[tRank[i][RoleIdCol]] + 1
        end
    end
end

-- 新增roledata
function CRankManager:AddRoleData(oPlayer)
    local sRoleId = oPlayer:GetRoleID()
    delog("CRankManager:AddRoleData Done ", sRoleId)
    self.m_tRoleData[sRoleId] = {
        [RDRoleId] = sRoleId,
        [RDName] = oPlayer:GetName(), -- 名字
        [RDProf] = oPlayer:GetProfID(), -- 职业
        [RDVipLv] = oPlayer:GetSystem("CVipSystem"):GetExpirationTime( ) , -- vip
        [RDLevel] = oPlayer:GetLevel(), --等级
        [RDHead] = oPlayer:GetHeadID(), --头像ID
        [RDCamp] = oPlayer:GetGuildID(),--阵营ID
    }
end

-- 刷新VIP
function CRankManager:OnVipLvUp(i_sRoleID, nExpirationTime)
    local tData = self.m_tRoleData[i_sRoleID]
    if not tData then
        return
    end
    tData[RDVipLv] = nExpirationTime
end

-- 改名
function CRankManager:OnPlayerRename(i_sRoleID, i_sNewName)
    local tData = self.m_tRoleData[i_sRoleID]
    if not tData then
        return
    end
    tData[RDName] = i_sNewName
    -- 修改上榜的内容
    for rankType, info in pairs(RankDBInfo) do
        local tRolePos = self.m_tRolePos[rankType]
        local nCurPos = tRolePos and tRolePos[i_sRoleID]
        if nCurPos then
            self.m_tRank[rankType][nCurPos][2] = i_sNewName
        end
    end
end

-- 请求本服排行
function CRankManager:DataReqHandler(oPlayer, i_nType, i_nStartIndex, i_nEndIndex, i_tOtherData)
    local tRank = self.m_tRank[i_nType]
    if not tRank then
        return
    end
    local tBuffer = {}
    local tOnline = {}
    local tOtherData = {}
    local bHasOhter = next(i_tOtherData) and true or false
    local nNum = #tRank
    if nNum == 0 or i_nStartIndex > nNum then
        oPlayer:SendToClient("C_RankData", i_nType, tBuffer, tOtherData, tOnline, 0)
        return
    end
   
    local nEnd = i_nEndIndex > nNum and nNum or i_nEndIndex
    local tData
    local tTemp
    for i = i_nStartIndex, nEnd do
        tData = tRank[i]
        if not tData then
            break
        end
        -- 添加排行榜数据
        tBuffer[i] = tData
        if bHasOhter then
            -- 获取玩家其他信息
            --delog("CRankManager:DataReqHandler", tData[1])
            local tRoleData = self.m_tRoleData[tData[1]]
            local tbOther = {}
            if tRoleData then
                for nIdx, nDataType in ipairs(i_tOtherData) do
                    tbOther[nIdx] = tRoleData[nDataType]
                end
            end
            tOtherData[i] = tbOther
        end
        -- 是否在线
        tOnline[i] = (CPlayerManager:GetPlayerByRoleID(tData[RoleIdCol]) and 1 or 0)
    end
    local nRanking
    local nRolePos = self.m_tRolePos[i_nType][oPlayer:GetRoleID()]
    if not nRolePos then
        nRanking = 0
    else
        nRanking = nRolePos
    end
    oPlayer:SendToClient("C_RankData", i_nType, tBuffer, tOtherData, tOnline, nRanking)
end

---------------  ------------

local tEventMapping = {
    [GameEventEnum.AddGold] = RankTypeEnum.GoldRank, -- 财富榜
    [GameEventEnum.AddClick] = RankTypeEnum.ClickRank, -- 点击榜
    [GameEventEnum.Charm] = RankTypeEnum.CharmAll, -- 魅力总榜
    [GameEventEnum.CharmWeek] = RankTypeEnum.CharmWeek, -- 魅力周榜
}

-- 玩家事件改变
function CRankManager:OnEvent(sRoleId, nEventType, nEventValue)
    local nRankType = tEventMapping[nEventType]
    if not nRankType then
        return
    end
    self:RankUpdate(nRankType, sRoleId, nEventValue, -now(1))
end

--获取某个排行榜数据
function CRankManager:GetRankBuyType(i_nType)
    return self.m_tRank[i_nType] or {}
end

--获取玩家某个排行榜pos
function CRankManager:GetRankBuyRoleId(i_nType, sRoleId)
    return self.m_tRolePos[i_nType][sRoleId] or -1
end

-- 排行榜累加刷新 ( 仅适用于Vice类型 )
function CRankManager:RankAddUpdate( oPlayer, nRankType, nValue )
    --delog( "CRankManager:RankAddUpdate( oPlayer, nRankType, nValue )", nRankType, nValue )
    local sRoleId = oPlayer:GetRoleID()
    local tData = self.m_tRoleData[sRoleId]
    if not tData then
        self:AddRoleData(oPlayer)
    end
    local tRank = self.m_tRank[nRankType]
    local tRoleP = self.m_tRolePos[nRankType]
    local nCurPos = tRoleP[sRoleId]
    local nMainValue = nCurPos and tRank[nCurPos][MainCol] or 0
    --delog( "CRankManager:RankAddUpdate", nMainValue + nValue )
    self:RankUpdate(nRankType, oPlayer:GetRoleID( ), nMainValue + nValue, -now(1))
end

-- 升级回调
function CRankManager:OnLevelUp(oPlayer)
    local nLevel = oPlayer:GetLevel()
    local tData = self.m_tRoleData[oPlayer:GetRoleID()]
    if tData then
        tData[RDLevel] = nLevel
    else
        self:AddRoleData(oPlayer)
    end
    self:RankUpdate(RankTypeEnum.LevelRank, oPlayer:GetRoleID( ), nLevel, -now(1))
end

-- 挑战boss结束 
function CRankManager:OnChallenge( oPlayer, nHarmData )
    local sRoleId = oPlayer:GetRoleID()
    local tRank = self.m_tRank[RankTypeEnum.BossToDay]
    local tRoleP = self.m_tRolePos[RankTypeEnum.BossToDay]
    local nCurPos = tRoleP[sRoleId]
    local nMainValue = nCurPos and (tRank[nCurPos] and tRank[nCurPos][MainCol] or 0) or 0
    if nMainValue > nHarmData then 
        return 
    end
    oPlayer:GetSystem( "CEventSystem" ):OnEvent( GameEventEnum.NowBossRank, nHarmData )
      
    self:RankUpdate(RankTypeEnum.BossToDay, oPlayer:GetRoleID( ), nHarmData, -now(1))
end

-- 更换头像
function CRankManager:OnChangeHead(oPlayer)
    local tData = self.m_tRoleData[oPlayer:GetRoleID()]
    if tData then
        tData[RDHead] = oPlayer:GetHeadID( )
    else
        self:AddRoleData(oPlayer)
    end
end

-- 更换阵营
function CRankManager:OnChangeCamp(oPlayer)
    local tData = self.m_tRoleData[oPlayer:GetRoleID()]
    if not tData then
        return
    end

    tData[RDCamp] = oPlayer:GetGuildID( )
end

-- 将玩家从排行榜移除
function CRankManager:RankRemovalPlayer(oPlayer, i_nType)
    local nRoleID = oPlayer:GetRoleID()
    local tRolePos = self.m_tRolePos[i_nType]
    local nRank = tRolePos[nRoleID]
    -- 本来就没有进榜 何来移除
    if not nRank then
        return
    end
    local tRank = self.m_tRank[i_nType]
    self.m_tRolePos[i_nType][nRoleID] = nil
    table_remove(tRank, nRank)
    for nFlag = nRank, #tRank do
        local nRID = tRank[nFlag][RoleIdCol]
        tRolePos[nRID] = nFlag
    end
end

----清空某个排行榜数据
function CRankManager:ClearOneRank( i_nRankType )
    self.m_tRank[i_nRankType] = {}
    self.m_tRolePos[i_nRankType] = {}
    local oImageCmd = CDBCommand:CreateDeleteCmd(RankDBInfo[i_nRankType].tbName)
    oImageCmd:SetNoWhere()
    oImageCmd:Execute(true)
end

---------------消息专区----------------
-- 请求本服排行数据
defineC.K_RankDataReq = function(oPlayer, i_nType, i_nStartIndex, i_nEndIndex, i_tOtherData)
    if type(i_nStartIndex) ~= "number" then
        return
    end
    CRankManager:DataReqHandler(oPlayer, i_nType, i_nStartIndex, i_nEndIndex, i_tOtherData)
end

-- 更新点击数据
defineC.K_ReqClickTimes = function(oPlayer, nAddTimes)
    oPlayer:GetSystem("CEventSystem"):OnEvent( GameEventEnum.AddClick, nAddTimes )
end