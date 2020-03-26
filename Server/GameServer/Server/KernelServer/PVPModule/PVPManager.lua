-- PVP
local now = _commonservice.now
local MailTypeEnum		= RequireEnum("MailTypeEnum")
local ItemEnum = RequireEnum("ItemEnum")
local ItemLogEnum = RequireEnum("ItemLogEnum")
local CDBCommand		= RequireSingleton("CDBCommand")
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local KickingConfig_S = RequireConfig( "KickingConfig_S" )
local LadderConfig_S = RequireConfig( "LadderConfig_S" )
local LadderRobotConfig_S = RequireConfig( "LadderRobotConfig_S" )
local RobotConfig_S = RequireConfig( "RobotConfig_S" )
local CCommonFunction = RequireSingleton("CCommonFunction")
local CSchedule = RequireSingleton("CSchedule")
local CMailManager = RequireSingleton("CMailManager")
local CPlayerManager        = RequireSingleton("CPlayerManager")
local GameEventEnum = RequireEnum("GameEventEnum")
-- 存盘时间间隔
local i_nSaveDateTime = 2 * 60000
local CPVPManager = RequireSingleton("CPVPManager")
local PlayerLogEnum = RequireEnum("PlayerLogEnum")

local tPosWeight = { }

--天梯每组储存人数
local nSaveLenght = 50

function CPVPManager:Initialize()
    -- 玩家战斗数据
    self.tCombatInfo = { }
    -- 战斗中的玩家
    self.tCombating = { }
    -- 玩家存盘脏位
    self.tSaveData = { }

    -- 战斗数据人员缓存
    self.tCombatPlayerList = { }

    -- 玩家隐藏分排行榜
    self.tScoreRankList = { }
    -- 玩家隐藏分映射表
    self.tRolePosList = { }
    -- 玩家隐藏分存盘脏位
    self.tPvpSaveData = { }

    -- 天梯玩家分段数据
    self.tLadderData = { }
    -- 天梯玩家数据映射表
    self.tRolePosLadderList = { }
    -- 天梯玩家数据存盘脏位
    self.tLadderSaveData = { }
    -- 天梯战斗中的玩家
    self.tLadderCombating = { }

    self:LoadData()
	return true
end

function CPVPManager:LoadData()
    -- 缓存权重
    tPosWeight = GameParamConfig_S.HighWeight
    local tLowWeight = GameParamConfig_S.LowWeight
    for _, nWeight in ipairs( tLowWeight ) do 
        table.insert( tPosWeight, nWeight )
    end

    -- 加载帮会列表
    local tRes = CDBCommand:CreateSelectCmd("pvpmember"):Execute()
    if  tRes then
        -- 读取阵营数据
        for _, data in ipairs( tRes ) do 
            if not self.tCombatInfo[data.roleid] then
                --delog( data.roleid .. ":" .. string.utf8len( data.combatinfo )  )
                self.tCombatInfo[data.roleid] = StrToTable(data.combatinfo)
                table.insert( self.tCombatPlayerList, data.roleid )
            else
                -- 应该不会走到这一行
                print( "Erro data overflow 1" )
            end
        end 
    end

    -- 加载玩家隐藏分列表
    local tPvpRes = CDBCommand:CreateSelectCmd("pvprank_score"):Execute()
    if tPvpRes then
        self.tScoreRankList = { }
        -- 读取玩家隐藏分数据
        for _, data in ipairs( tPvpRes ) do
            if not self.tRolePosList[data.roleid] then
                table.insert( self.tScoreRankList, {
                    ["roleid"] = data.roleid,
                    ["score"] = data.score,
                    ["continuous"] = data.continuous,
                })
            else
                print( "Erro data overflow 2" )
            end
        end
        -- 起服排序玩家隐藏分列表
        table.sort( self.tScoreRankList, function( a,b )
            return a.score > b.score
        end )

        self.tRolePosList = { }
        for nPos, tData in ipairs( self.tScoreRankList ) do
            self.tRolePosList[tData.roleid] = nPos
        end
    end

    -- 加载玩家天梯数据列表
    local tLadderRes = CDBCommand:CreateSelectCmd("ladderdata"):Execute()
    
    -- 列表按段位初始化
    for nLadderGrad, _ in ipairs( LadderConfig_S ) do 
        self.tLadderData[nLadderGrad] = {}
    end

    -- 如果没数据，则生成机器人
    if #tLadderRes == 0 then
        self:CreateVirtualPlayer();
        tLadderRes = CDBCommand:CreateSelectCmd("ladderdata"):Execute();
        if not tLadderRes then
            delog(" CPVPManager:LoadData() not tLadderRes")
            return
        end
    end

    tLadderRes = CDBCommand:CreateSelectCmd("ladderdata"):Execute()
    if tLadderRes then
        for _, data in ipairs( tLadderRes ) do 
            if not self.tRolePosLadderList[data.roleid] then
                --获取当前段位
                local nLadderGrad = self:GetLadderGrad(data.score)
                if not nLadderGrad then
                    delog("LoadData not nLadderGrad")
                    return
                end
                --天梯玩家数据缓存
                self.tRolePosLadderList[data.roleid] = {
                    ["grad"] = nLadderGrad,
                    ["groupNum"] = 0,
                    ["score"] = data.score,
                    ["challengeTime"] = data.challengetime,
                    ["winTime"] = data.wintime,
                    ["continuous"] = data.continuous,
                }
                
                --每个段位分组添加roleid
                self.tRolePosLadderList[data.roleid].groupNum = self:AddLadderGradRoleId( data.roleid, data.score )
                
            else
                -- 应该不会走到这一行
                print( "Erro data overflow 3" )
            end
        end 
    end
    -- for i,v in pairs(self.tLadderData) do
    --     for x,y in ipairs(v) do
    --         for q,w in pairs(y) do
    --             print("Grad = ", i, "GroupNum = ", x, "nRoleId = ", w)
    --         end
    --     end
    -- end
    --添加机器人
        -- for i=1,10 do
        --     local cmd = CDBCommand:CreateInsertCmd("ladderdata")
        --     local x = "robot_" .. i
        --     cmd:SetFields("roleid", x)  
        --     cmd:SetFields("score", 0)
        --     cmd:SetFields("challengetime", 0)
        --     cmd:SetFields("wintime", 0)
        --     cmd:Execute()
        -- end
end 

function CPVPManager:SaveData()
    --更新玩家战斗数据
    if next(self.tSaveData) then
        for sRoleId, nMark in pairs(self.tSaveData) do
            if nMark == 1 then
                -- 添加DB信息
                local cmd = CDBCommand:CreateUpdateCmd("pvpmember")
                cmd:SetWheres("roleid", sRoleId, "=")  
                cmd:SetFields("combatinfo", TableToStr(self.tCombatInfo[sRoleId]))
                cmd:Execute()
            end
        end
        self.tSaveData = { }
    end

    --更新玩家隐藏分数据
    if next(self.tPvpSaveData) then
        for sRoleId, nMark in pairs(self.tPvpSaveData) do
            if nMark == 1 then
                local nPos = self.tRolePosList[sRoleId]
                -- 添加DB信息
                local cmd = CDBCommand:CreateUpdateCmd("pvprank_score")
                cmd:SetWheres("roleid", sRoleId, "=")  
                cmd:SetFields("score", self.tScoreRankList[nPos].score)
                cmd:SetFields("continuous", self.tScoreRankList[nPos].continuous)
                cmd:Execute()
            end
        end
        self.tPvpSaveData = { }
    end

    --更新玩家天梯数据
    if next(self.tLadderSaveData) then
        for sRoleId, nMark in pairs(self.tLadderSaveData) do
            if nMark == 1 then
                local tData = self.tRolePosLadderList[sRoleId]
                -- 添加DB信息
                local cmd = CDBCommand:CreateUpdateCmd("ladderdata")
                cmd:SetWheres("roleid", sRoleId, "=")  
                cmd:SetFields("score", tData.score)
                cmd:SetFields("challengetime", tData.challengeTime)
                cmd:SetFields("wintime", tData.winTime)
                cmd:SetFields("continuous", tData.continuous)
                cmd:Execute()
            end
        end
        self.tLadderSaveData = { }
    end
end

function CPVPManager:Destruct()
    self:SaveData()
end

-- 玩家下线
function CPVPManager:PlayerDestroy(oPlayer)
    local sRoleId = oPlayer:GetRoleID( )
    self.tCombating[sRoleId] = nil
    self.tLadderCombating[sRoleId] = nil
end

local nSaveTime = i_nSaveDateTime
function CPVPManager:Update(i_nDeltaMsec)
    nSaveTime = nSaveTime - i_nDeltaMsec
    if nSaveTime <= 0 then
        nSaveTime = i_nSaveDateTime
        self:SaveData( )
    end
end

-- 请求更新数据  长度 2048
function CPVPManager:ReqUpdateCombatInfo(oPlayer, tInfo)
    if not self:IsGoodCombatInfo( tInfo ) then
        return 
    end
    local sRoleId = oPlayer:GetRoleID( )
    if not self.tCombatInfo[sRoleId] then
        -- 添加DB信息
        local cmd = CDBCommand:CreateInsertCmd("pvpmember")
        cmd:SetFields("roleid", sRoleId)  
        cmd:SetFields("combatinfo", TableToStr(tInfo))
        cmd:Execute()
        table.insert( self.tCombatPlayerList, sRoleId )
    else
        self.tSaveData[sRoleId] = 1
    end
    self.tCombatInfo[sRoleId] = tInfo

end

-- 判断是否是合格的数据
function CPVPManager:IsGoodCombatInfo( tInfo )
    if not tInfo.Hero then
        delog( "CPVPManager:IsGoodCombatInfo not tInfo.Hero" )
        return false
    end 
    return true
end

-- 生成机器人
function CPVPManager:CreateVirtualPlayer()
    local tVirtualData = {}
    --战斗数据格式
    local tHeroKey      =   { "id", "location" , "level", "star" }
    local tVirtualInfo  = {}
    for nRobotId,tWeight in ipairs(LadderRobotConfig_S) do
        table.insert(tVirtualData, RobotConfig_S[nRobotId])
    end

    for nIndex, tData in pairs(tVirtualData) do
        local tCombatInfo   =   { ["Hero"] = { }, ["Pet"] = { ["0"]={} }, ["Camp"] = { ["0"]={} }, ["Player"] = { ["0"] = { } } }
        --没一个英雄
        if not next(tData.Hero) then
            delog("CPVPManager:CreateVirtualPlayer() not next(tData.Hero)!")
            return
        end

        --是否有队长
        local bCaptain = false;
        --取英雄数据
        for i, tInfo in pairs(tData.Hero) do
            local tHeroInfo  =  { ["id"] = 0, ["location"] = 0, ["level"] = 0, ["star"] = 0 }
            for n,v in pairs(tInfo) do
                if n == 2 then
                    if v == 5 then
                        bCaptain = v == 5;
                    end
                    tHeroInfo[tHeroKey[n]] = v - 1
                else
                    tHeroInfo[tHeroKey[n]] = v
                end
            end
            local sKey = "" .. (i - 1) 
            tCombatInfo["Hero"][sKey] = tHeroInfo
        end
        --无队长
        if not bCaptain then
            delog("CPVPManager:CreateVirtualPlayer() not bCaptain!")
        end

        --取宠物数据
        if tData.Pet[1] ~= 0 then
            tCombatInfo["Pet"]["0"]["id"] = tData.Pet[1]
            tCombatInfo["Pet"]["0"]["level"] = tData.Pet[2]
        end

        --取阵营数据
        if tData.isCamp ~= 0 then
            tCombatInfo["Camp"]["0"]["level"] = tData.isCamp
        end

        --取玩家数据
        tCombatInfo["Player"]["0"]["isVip"] = tData.isVip ~= 0
        tCombatInfo["Player"]["0"]["MpMax"] = tData.MpMax
        tCombatInfo["Player"]["0"]["MpRec"] = tData.MpRec
        tCombatInfo["Player"]["0"]["level"] = tData.level
        tCombatInfo["Player"]["0"]["Cmp"]   = tData.MpMax
        for i,v in ipairs(tData.RoleSkill) do
            local nKey = "" .. (i - 1)
            tCombatInfo["Player"]["0"]["sList"] = {}
            tCombatInfo["Player"]["0"]["sList"][nKey] = 100 * i + v
        end

        table.insert(tVirtualInfo, tCombatInfo) 
    end
    -- 以防万一，先清一下表
    local oLadderCmd = CDBCommand:CreateDeleteCmd("ladderdata"); 
    oLadderCmd:SetNoWhere();
    oLadderCmd:Execute(true);

    for k,tInfo in pairs(tVirtualInfo) do
        local sVirtualRoleId = "robot_" .. k
        --添加战斗数据
        if not self.tCombatInfo[sVirtualRoleId] then
            -- 添加DB信息
            local oMemberCmd = CDBCommand:CreateInsertCmd("pvpmember")
            oMemberCmd:SetFields("roleid", sVirtualRoleId)  
            oMemberCmd:SetFields("combatinfo", TableToStr(tInfo))
            oMemberCmd:Execute()
            table.insert( self.tCombatPlayerList, sVirtualRoleId )
        else
            self.tSaveData[sVirtualRoleId] = 1
        end
        self.tCombatInfo[sVirtualRoleId] = tInfo
        --添加天梯数据
        local tNewData = {
            ["grad"] = 1,
            ["groupNum"] = 0,
            ["score"] = 0,
            ["challengeTime"] = 0,      
            ["winTime"] = 0,
            ["continuous"] = 0,
        }
        if not self.tRolePosLadderList[sVirtualRoleId] then
            -- 添加DB信息
            oLadderCmd = CDBCommand:CreateInsertCmd("ladderdata")
            oLadderCmd:SetFields("roleid", sVirtualRoleId)  
            oLadderCmd:SetFields("score", 0)
            oLadderCmd:SetFields("challengetime", 0)
            oLadderCmd:SetFields("wintime", 0)
            oLadderCmd:SetFields("continuous", 0)
            oLadderCmd:Execute()
        else
            self.tLadderSaveData[sVirtualRoleId] = 1
        end
        self.tRolePosLadderList[sVirtualRoleId] = tNewData
        self.tRolePosLadderList[sVirtualRoleId].groupNum = self:AddLadderGradRoleId(sVirtualRoleId, tNewData.score)
    end
end

-- 请求匹配 并且开始战斗
function CPVPManager:ReqPvpMatching( oPlayer, nRoomType, nRoomID, tInfo )
    delog( "CPVPManager:ReqPvpMatching", nRoomType, nRoomID )
    local sRoleId = oPlayer:GetRoleID( )
    if not self:IsGoodCombatInfo( tInfo ) then
        delog( "not self:IsGoodCombatInfo( tInfo )" )
        return 
    end
    local tCfg = KickingConfig_S[nRoomType][nRoomID]
    if not tCfg then
        delog( "not tCfg" )
        return
    end

    -- 次数是否够用
    local nTimes = oPlayer:GetPvpTimes( nRoomType )
    if nTimes >= GameParamConfig_S.ParticipationMaxNum[nRoomType] then
        delog( "nTimes >= GameParamConfig_S.ParticipationMaxNum[nRoomType]", nTimes )
        return
    end

    -- 获取对应消耗的物品   ps：nRoomType 就是消耗的物品类型
    local nHasNum = oPlayer:GetSystem( "CItemSystem" ):GetCount( nRoomType )
    -- 钱不够 哈哈
    if nHasNum < tCfg.comeInNeed then
        delog( "nHasNum < tCfg.comeInNeed " )
        return
    end 

    -- 更新数据
    self:ReqUpdateCombatInfo(oPlayer, tInfo)   
    -- 在战斗中就不能再次战斗
    -- if self.tCombating[sRoleId] then
    --     oPlayer:SendToClient( "C_ReqPvpMatching", 2)
    --     return
    -- end 

    -- 挑战目标
    local bSucceedn, nOtherRoleID = self:ReqRandomRival( oPlayer )
    delog("nOtherRoleID ==================", nOtherRoleID)
    if not bSucceedn then
        oPlayer:SendToClient( "C_ReqPvpMatching", 3)
        delog("C_ReqPvpMatching not bSucceedn 3")
        return
    end

    if not nOtherRoleID then
        -- 不可能 概率为 21的20次方分之一 (╯°Д°)╯︵ ┻━┻
        oPlayer:SendToClient( "C_ReqPvpMatching", 3)
        delog("C_ReqPvpMatching not nOtherRoleID 3")
        return
    end

    local tOtherInfo = self.tCombatInfo[nOtherRoleID]
    if not tOtherInfo then
        oPlayer:SendToClient( "C_ReqPvpMatching", 3)
        delog("C_ReqPvpMatching not tOtherInfo 3")
        return
    end 
    self.tCombating[sRoleId] = {nRoomType, nRoomID, tOtherInfo, nOtherRoleID, now(1)}
    oPlayer:SendToClient( "C_ReqPvpMatching", 1, nRoomType, nRoomID, tOtherInfo, nOtherRoleID )
    oPlayer:DistPlaylog( PlayerLogEnum.PVP, nRoomType .. "-" .. nRoomID, 1)
end

function CPVPManager:GetRandomPos(oPlayer)
    local sRoleId = oPlayer:GetRoleID( )
    local nPlayerCount = #self.tScoreRankList
    local nOtherRoleID 
    local nRandom
    local nIdx = self.tRolePosList[sRoleId]
    if nPlayerCount <= 1 then
        return false
    elseif nPlayerCount <= 2 then
        for nPos, tData in ipairs( self.tScoreRankList ) do
            if tData.roleid ~= sRoleId then
                nOtherRoleID = tData.roleid
                break
            end 
        end
    elseif nPlayerCount <= 20 then
        if not nIdx then
            print( "Erro ReqPvpMatching loss of data" )
            return false
        end
        
        --连续胜利、失败 特殊匹配
        if (self.tScoreRankList[nIdx].continuous > GameParamConfig_S.SuccessiveVictoryNum) and (nIdx ~= 1) then
            nRandom = math.random( 1, nIdx - 1 )
            nOtherRoleID = self.tScoreRankList[nRandom].roleid
        elseif self.tScoreRankList[nIdx].continuous < ( GameParamConfig_S.ContinuousFailureNum * -1 ) then
            if nIdx == nPlayerCount then
                nRandom = nIdx - 1
            else
                nRandom = math.random( nIdx + 1, nPlayerCount )
            end
            nOtherRoleID = self.tScoreRankList[nRandom].roleid
        else
            local nRandom = math.random( 1, nPlayerCount - 1 )

            if nRandom < nIdx then
                nOtherRoleID = self.tScoreRankList[nRandom].roleid
            else
                nOtherRoleID = self.tScoreRankList[nRandom + 1].roleid
            end
        end
        
    else
        -- 大于20 个人 给你10次机会 如果还是随机不到 就不管了 
        for i = 1, 20 do
            nRandom = math.random(1, nPlayerCount)

            --连续胜利、失败 特殊匹配
            if (self.tScoreRankList[nIdx].continuous > GameParamConfig_S.SuccessiveVictoryNum) and (nIdx ~= 1) then
                nRandom = math.random( 1, nIdx - 1 )
            elseif self.tScoreRankList[nIdx].continuous < ( GameParamConfig_S.ContinuousFailureNum * -1 ) then
                if nIdx == nPlayerCount then
                    nRandom = nIdx - 1
                else
                    nRandom = math.random( nIdx + 1, nPlayerCount )
                end
            end

            if sRoleId ~= self.tScoreRankList[nRandom].roleid then
                nOtherRoleID = self.tScoreRankList[nRandom].roleid
                break
            end 

            if i == 20 then
                return false
            end
        end
    end 
    
    return true, nOtherRoleID
end


-- 请求结束战斗
function CPVPManager:ReqPvpCombatEnd( oPlayer, nStar, nWin )
    delog( "CPVPManager:ReqPvpCombatEnd", nStar, nWin )
    local sRoleId = oPlayer:GetRoleID( )
    -- 在战斗中就不能再次战斗
    if not self.tCombating[sRoleId] then
        delog( "not self.tCombating[sRoleId]" )
        return
    end 
    local nRoomType, nRoomID, tOtherInfo, nOtherRoleID, nStarTime = unpack(self.tCombating[sRoleId])
    self.tCombating[sRoleId] = nil
    local tCfg = KickingConfig_S[nRoomType][nRoomID]
    if not tCfg then
        delog( "not tCfg", nRoomType, nRoomID )
        return
    end
    if (nStar < 0) or (nStar > 3) then
        delog( "nStar <= 0 or nStar > 3" )
        return 
    end 
    -- 星级比例
    local nStarMoney = 1
    if nStar > 1 then
        nStarMoney = GameParamConfig_S.StarData[4 - nStar][3]
    end 
    local nBaseAward = tCfg.winAwardBase * nStarMoney
    local nChangeMoney = 0
    local nRoleScore = 0 
    local nOtherScore = 0 
    if not oPlayer:ModPvpTimes(nRoomType, 1) then
        delog("not oPlayer:ModPvpTimes(nRoomType, 1)")
        return
    end

    -- 胜利
    if nWin == 1 then 
        nChangeMoney = math.floor(nBaseAward * ( 1 -  (GameParamConfig_S.DeductionRate / 10000)))
        oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList({{1,nRoomType,nChangeMoney}})

        nRoleScore = self:SettleAccountsScore( sRoleId, nOtherRoleID, 1 )
        nOtherScore = self:SettleAccountsScore( nOtherRoleID, sRoleId, 0 )
        oPlayer:DistPlaylog( PlayerLogEnum.PVP, nRoomType .. "-" .. nRoomID, 2, 1, now(1) - nStarTime)
    elseif nWin == 2 then
        -- 失败
        nChangeMoney = math.floor(nBaseAward)
        if not oPlayer:CostItem(nRoomType, nChangeMoney, ItemLogEnum.PvpDefeated) then
            print( "Erro CPVPManager:ReqPvpCombatEnd not has money" )
        end

        nRoleScore = self:SettleAccountsScore( sRoleId, nOtherRoleID, 0 )
        nOtherScore = self:SettleAccountsScore( nOtherRoleID, sRoleId, 1 )
        oPlayer:DistPlaylog( PlayerLogEnum.PVP, nRoomType .. "-" .. nRoomID, 3, 0, now(1) - nStarTime)
    elseif nWin == 0 then
        -- 平局
        nChangeMoney = 0

        nRoleScore = self:SettleAccountsScore( sRoleId, nOtherRoleID, 2 )
        nOtherScore = self:SettleAccountsScore( nOtherRoleID, sRoleId, 2 )

    else
        delog( "return" )
        return
    end
    
    self:ReqUpdatePvpRankScore( sRoleId, nRoleScore )
    self:ReqUpdatePvpRankScore( nOtherRoleID, nOtherScore )

    local nPos = self.tRolePosList[sRoleId]
    local nContinuous = self.tScoreRankList[nPos].continuous

    delog(" nRoleScore , nOtherScore ============", nRoleScore, nOtherScore)
    oPlayer:SendToClient( "C_ReqPvpCombatEnd", nStar, nWin, nRoomType, nChangeMoney, nContinuous )
end

-- 请求活动数据
function CPVPManager:ReqPvpActivityInfo( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tData = { 
        self.tCombatInfo[sRoleId]
    }
    oPlayer:SendToClient( "C_ReqPvpActivityInfo", tData )
end

 -- 请求更新数据
defineC.K_ReqUpdateCombatInfo = function (oPlayer, tInfo)
    CPVPManager:ReqUpdateCombatInfo(oPlayer, tInfo)
end

 -- 请求匹配
defineC.K_ReqPvpMatching = function (oPlayer, nRoomType, nRoomID, tInfo)
    CPVPManager:ReqPvpMatching(oPlayer, nRoomType, nRoomID, tInfo)
end

 -- 请求结束战斗
defineC.K_ReqPvpCombatEnd = function (oPlayer, nStar, nWin)
    CPVPManager:ReqPvpCombatEnd(oPlayer, nStar, nWin)
end

 -- 请求活动数据
defineC.K_ReqPvpActivityInfo = function (oPlayer)
    CPVPManager:ReqPvpActivityInfo(oPlayer)
end



-------------------------------------玩家隐藏分排行榜--------------------------------------------

--获取玩家隐藏分
function CPVPManager:GetScoreByRoleId( sRoleId )
    local nPos = self.tRolePosList[sRoleId]
    if self.tScoreRankList[nPos] then
        return self.tScoreRankList[nPos].score
    end
    delog("the roleid in not score by tScoreRankList!")
    return 0
end

function CPVPManager:AddScoreByRoleId( sRoleId,nScore )
end

--获取玩家连胜次数
function CPVPManager:GetContinuousByRoleId( sRoleId )
    local nPos = self.tRolePosList[sRoleId]
    if self.tScoreRankList[nPos] then
        return self.tScoreRankList[nPos].continuous
    end
    delog("the roleid in not score by tScoreRankList!")
    return 0
end

-- 请求更新玩家隐藏分数据
function CPVPManager:ReqUpdatePvpRankScore(sRoleId, nScore)
    local nCurrentPos = self.tRolePosList[sRoleId]
    local bInsert = nCurrentPos and true or false
    if not nCurrentPos then
        --第一位进来
        if #self.tScoreRankList == 0 then
            table.insert(self.tScoreRankList, {
                ["roleid"] = sRoleId,
                ["score"] = nScore,
                ["continuous"] = 0,
            })
            self.tRolePosList[sRoleId] = 1
            return
        end
        for i = #self.tScoreRankList , 1, -1 do
            if nScore <= self.tScoreRankList[i].score then
                local currentPos = i + 1
                table.insert(self.tScoreRankList, currentPos, {
                    ["roleid"] = sRoleId,
                    ["score"] = nScore,
                    ["continuous"] = 0,
                })
                self.tRolePosList[sRoleId] = currentPos
                break
            end

            --将对比过的人 排名后移1位
            local nId = self.tScoreRankList[i].roleid
            self.tRolePosList[nId] = i + 1
        end
    elseif self.tScoreRankList[nCurrentPos] then
        -- 老玩家 更新数据
        local currentScore = self.tScoreRankList[nCurrentPos].score
        --升位
        if (nScore > currentScore) and (nCurrentPos > 1) then
            local nStart = nCurrentPos - 1
            local nEnd = 1
            for i = nStart, nEnd, -1 do
                
                if ( nScore <= self.tScoreRankList[i].score ) or ( i == 1 ) then
                    -- 换位
                    local tScoreRank = table.remove( self.tScoreRankList, nCurrentPos )
                    if (i == 1) and ( nScore > self.tScoreRankList[i].score ) then
                        table.insert( self.tScoreRankList, 1, tScoreRank )
                        nCurrentPos = 1

                        --将对比过的人 排名后移1位 特殊
                        local nId = self.tScoreRankList[2].roleid
                        self.tRolePosList[nId] = 2
                    else
                        table.insert( self.tScoreRankList, (i + 1), tScoreRank )
                        nCurrentPos = i + 1
                    end
                    
                    self.tRolePosList[sRoleId] = nCurrentPos 
                    break
                end
                --将对比过的人 排名后移1位
                local nId = self.tScoreRankList[i].roleid
                self.tRolePosList[nId] = (i + 1)
            end
        --降位
        elseif (nScore < currentScore) and (nCurrentPos < (#self.tScoreRankList)) then
            
            local nStart = nCurrentPos + 1
            local nEnd = #self.tScoreRankList
            for i = nStart , nEnd do 
                if (nScore >= self.tScoreRankList[i].score) or (i == nEnd) then
                    
                    --换位
                    local tScoreRank = table.remove( self.tScoreRankList, nCurrentPos )

                    if ( i == nEnd ) and ( nScore < self.tScoreRankList[i - 1].score ) then
                        table.insert( self.tScoreRankList, tScoreRank )
                        nCurrentPos = nEnd

                        --将对比过的人 排名前移1位 特殊
                        local nId = self.tScoreRankList[nEnd - 1].roleid
                        self.tRolePosList[nId] = (nEnd - 1)
                    else
                        table.insert( self.tScoreRankList, (i - 1), tScoreRank )
                        nCurrentPos = i - 1
                    end
                    self.tRolePosList[sRoleId] = nCurrentPos

                    break
                end
                --将对比过的人 排名前移1位
                local nId = self.tScoreRankList[i].roleid
                self.tRolePosList[nId] = (i - 1)
            end
        end
    else
        delog("self.tScoreRankList[nCurrentPos] == nil")
        return
    end

    if bInsert then
        self.tScoreRankList[nCurrentPos].score = nScore
        --脏了
        self.tPvpSaveData[sRoleId] = 1
    else
        -- 添加DB信息
        local cmd = CDBCommand:CreateInsertCmd("pvprank_score")
        cmd:SetFields("roleid", sRoleId)
        cmd:SetFields("score", nScore)
        cmd:Execute()
    end
end

--公式匹配对手
function CPVPManager:ReqRandomRival( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local nPos = self.tRolePosList[sRoleId]

    if not nPos then
        self:ReqUpdatePvpRankScore( sRoleId, GameParamConfig_S.ParameterN )
        nPos = self.tRolePosList[sRoleId]
    end

    if not nPos then
        delog( "not nPos" )
        return false
    end
    
    local nPeopleNum = #self.tScoreRankList
    local nRandomPos = 0
    --总人数不足X个人时,随机匹配
    if nPeopleNum < GameParamConfig_S.ImageTotalNum then
        local bSucceed
        local nRoleId 
        bSucceed, nRoleId = self:GetRandomPos( oPlayer )
        nRandomPos = self.tRolePosList[nRoleId]
        if not bSucceed then
            return false
        end

    --高于自己的人数不足Y人时,随机匹配高于自己的
    elseif nPos <= GameParamConfig_S.ImageHighNum then
        local nNumX = 0
        local nNumY = math.modf( ( nPeopleNum - nPos ) / GameParamConfig_S.LowNum ) 
        local tLowWeight = { }
       

        --连续失败
        if (self.tScoreRankList[nPos].continuous < ( GameParamConfig_S.ContinuousFailureNum * -1 )) or (nPos == 1) then

            tLowWeight = GameParamConfig_S.LowWeight
            nRandomPos = self:RandomPos( tLowWeight )

        --连续胜利
        elseif self.tScoreRankList[nPos].continuous > GameParamConfig_S.SuccessiveVictoryNum then

            nNumX = math.random( 1, nPos )
            nRandomPos = GameParamConfig_S.LowNum + 1

        else

            tLowWeight = GameParamConfig_S.LowWeight
            nNumX = math.random( 1, nPos )
            table.insert(tLowWeight, GameParamConfig_S.HighWeight[1] )
            nRandomPos = self:RandomPos( tLowWeight )

        end

        --随到比自己低的
        if nRandomPos <= GameParamConfig_S.LowNum then

            local x = nPos + nRandomPos * nNumY
            local y = x - nNumY + 1
            nRandomPos = math.random( y, x )

        else
            nRandomPos = nNumX
        end

    --低于自己的人数不足Z人时,随机匹配低于自己的
    elseif ( nPeopleNum - nPos ) <= GameParamConfig_S.ImageLowNum then
        
        local nNumX = math.modf( (nPos - 1) / GameParamConfig_S.HighNum ) 
        local nNumY = 0
        local tHighWeight = GameParamConfig_S.HighWeight

        --连续胜利
        if (self.tScoreRankList[nPos].continuous > GameParamConfig_S.SuccessiveVictoryNum) or (nPos == nPeopleNum) then

            tHighWeight = GameParamConfig_S.HighWeight
            nRandomPos = self:RandomPos( tHighWeight )

        --连续失败
        elseif self.tScoreRankList[nPos].continuous < ( GameParamConfig_S.ContinuousFailureNum * -1 ) then

            nNumY = math.random( (nPos + 1), nPeopleNum )
            nRandomPos = GameParamConfig_S.HighNum + 1
  
        else

            tHighWeight = GameParamConfig_S.HighWeight
            nNumY = math.random( 1, nPos )
            table.insert(tHighWeight, GameParamConfig_S.HighWeight[1] )
            nRandomPos = self:RandomPos( tHighWeight )

        end

        nRandomPos = self:RandomPos( tHighWeight )
        --随到比自己高的
        if nRandomPos <= GameParamConfig_S.HighNum then

            local x = nPos - nRandomPos * nNumX
            local y = x + nNumX - 1
            nRandomPos = math.random( x, y )
        else
            nRandomPos = nNumY
        end

    --正常情况,公式匹配对手
    else
        local nNumX = math.modf( (nPos - 1) / GameParamConfig_S.HighNum ) 
        local nNumY = math.modf( ( nPeopleNum - nPos ) / GameParamConfig_S.LowNum ) 
        --连续胜利
        if (self.tScoreRankList[nPos].continuous > GameParamConfig_S.SuccessiveVictoryNum) then

            nRandomPos = self:RandomPos( GameParamConfig_S.HighWeight )

        --连续失败
        elseif self.tScoreRankList[nPos].continuous < ( GameParamConfig_S.ContinuousFailureNum * -1 ) then

            nRandomPos = self:RandomPos( GameParamConfig_S.LowWeight ) + GameParamConfig_S.HighNum

        else
            nRandomPos = self:RandomPos( tPosWeight )
        end

        --随到比自己高的
        if nRandomPos <= GameParamConfig_S.HighNum then

            local x = nPos - nRandomPos * nNumX
            local y = x + nNumX - 1
            nRandomPos = math.random( x, y )

        --随到比自己低的
        else
            local x = nPos + (nRandomPos - GameParamConfig_S.HighNum) * nNumY
            local y = x - nNumY + 1
            nRandomPos = math.random( y, x )
        end

    end

    if not self.tScoreRankList[nRandomPos] then
        delog("self.tScoreRankList[nRandomPos] == nil", nRandomPos)
        return false
    end
    return self.tScoreRankList[nRandomPos].roleid ~= sRoleId, self.tScoreRankList[nRandomPos].roleid
end

--结算积分
--@param nMyStarScore 我的分数
--@param nEnemyStarScore 敌人的分数
--@param nResult  负0，胜1，平2，
function CPVPManager:SettleAccountsScore( nRoleID, nOtherRoleID, nResult )
    if not self:GetScoreByRoleId(nRoleID) then
        delog("self:GetScoreByRoleId(nRoleID) is not !")
        return
    end
    if not self:GetScoreByRoleId(nOtherRoleID) then
        delog("self:GetScoreByRoleId(nOtherRoleID) is not !")
        return
    end

    local nMyStarScore = self:GetScoreByRoleId(nRoleID)
    local nEnemyStarScore = self:GetScoreByRoleId(nOtherRoleID)
    local E = 1 / (1 + 10 ^ ((nEnemyStarScore - nMyStarScore) / 400))
    local S = nResult
    

    local nPos = self.tRolePosList[nRoleID]

    --平
    if nResult == 2 then
        S = E
    elseif nResult == 1 then
        --记录连胜次数
        if self.tScoreRankList[nPos].continuous > 0 then
            self.tScoreRankList[nPos].continuous = self.tScoreRankList[nPos].continuous + 1 
        else
            self.tScoreRankList[nPos].continuous = 1
        end
    else
        --记录连败次数
        if self.tScoreRankList[nPos].continuous > 0 then
            self.tScoreRankList[nPos].continuous = -1
        else
            self.tScoreRankList[nPos].continuous = self.tScoreRankList[nPos].continuous - 1
        end
    end
    --结算公式
    local nEndScore = math.modf(math.max(nMyStarScore + GameParamConfig_S.ParameterK * (S - E), GameParamConfig_S.ParameterM))
    return nEndScore
end

-- 按权重随机出一份Pos
function CPVPManager:RandomPos( tPosWeight )

    local nAllWeight = 0
    for _, nWeight in ipairs( tPosWeight ) do
        nAllWeight = nAllWeight + nWeight
    end
    local nRandomNumber = math.random( 1, nAllWeight )
    for nPos, nWeight in ipairs( tPosWeight ) do

        if nRandomNumber <= nWeight then
            return nPos
        else
            nRandomNumber = nRandomNumber - nWeight
        end
    end
end

-------------------------------------天梯系统--------------------------------------------

-- 获取段位
function CPVPManager:GetLadderGrad( nScore )
    for nDuanId, tInfo in ipairs(LadderConfig_S) do
        if nDuanId == #LadderConfig_S then
            if nScore >= tInfo.DuanMin then
                return nDuanId
            end
        end

        if nScore >= tInfo.DuanMin and nScore <= tInfo.DuanMax then
            return nDuanId
        end
    end
    delog("CPVPManager:GetLadderGrad( nScore ) is not LadderGrad!")
    return 0
end

-- 获取分数
function CPVPManager:GetLadderScore( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        delog("CPVPManager:GetLadderScore is not tData!")
        return 0
    end
    return tData.score
end

-- 获取胜利次数
function CPVPManager:GetLadderWinTimes( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        delog("CPVPManager:GetLadderScore is not tData!")
        return 0
    end
    return tData.winTime
end
-- 获取连胜次数
function CPVPManager:GetLadderContinuous( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        delog("CPVPManager:GetLadderScore is not tData!")
        return 0
    end
    return tData.continuous
end
-- 每个段位分组添加roleid
function CPVPManager:AddLadderGradRoleId( sRoleId, nScore )
    local tData = self.tRolePosLadderList[sRoleId]
    
    if not tData then
        delog("CPVPManager:AddLadderGradRoleId not tData!")
        return 
    end
    local nNewGrad = self:GetLadderGrad( nScore )
    local nOldGrad = tData.grad
    local nOldGroupNum = tData.groupNum
    --delog("CPVPManager:AddLadderGradRoleId", nNewGrad, nOldGrad, nOldGroupNum)
    self.tRolePosLadderList[sRoleId].grad = nNewGrad
    --新玩家
    if nOldGroupNum == 0 then
        if #self.tLadderData[nNewGrad] == 0 then
            local tRoleData = { sRoleId }
            self.tLadderData[nNewGrad] = { tRoleData }

            return 1
        else
            for nIndex, tData in ipairs( self.tLadderData[nNewGrad] ) do
                if #tData < nSaveLenght then
                    table.insert( self.tLadderData[nNewGrad][nIndex], sRoleId )
                    return nIndex

                elseif nIndex == #self.tLadderData[nNewGrad] then
                    local tRoleData = { sRoleId }
                    table.insert( self.tLadderData[nNewGrad], tRoleData )
                    return nIndex + 1
                end
            end
        end

    --老玩家
    else
        --段位不变
        if nNewGrad == nOldGrad then
            return nOldGroupNum
        else
            for nIndex, nRoleId in ipairs(self.tLadderData[nOldGrad][nOldGroupNum]) do
                if nRoleId == sRoleId then
                    table.remove( self.tLadderData[nOldGrad][nOldGroupNum], nIndex )
                    break
                end
            end
            if #self.tLadderData[nNewGrad] ~= 0 then
                for nIndex, tData in ipairs( self.tLadderData[nNewGrad] ) do
                    if #tData < nSaveLenght then
                        table.insert( self.tLadderData[nNewGrad][nIndex], sRoleId )
                        return nIndex

                    elseif nIndex == #self.tLadderData[nNewGrad] then
                        local tRoleData = { sRoleId }
                        table.insert( self.tLadderData[nNewGrad], tRoleData )
                        return nIndex + 1
                    end
                end
            else
                local tRoleData = { sRoleId }
                table.insert( self.tLadderData[nNewGrad], tRoleData )
                return 1
            end
        end
    end
    return 0
end

-- 检测天梯数据是否合格
function CPVPManager:IsGoodLadderData( tData )
    if not tData.score then
        delog( "CPVPManager:IsGoodLadderData not tData.score" )
        return false
    end 
    return true
end

-- 请求更新天梯数据
function CPVPManager:ReqUpdateLadderData(oPlayer, tNewData)
    local sRoleId = oPlayer:GetRoleID( )

    if not tNewData then
        delog("CPVPManager:ReqLadderMatching not tNewData!")
    end

    if not self:IsGoodLadderData( tNewData ) then
        delog("self:IsGoodLadderData( tNewData ) is not!")
        return
    end

    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        -- 添加DB信息
        local cmd = CDBCommand:CreateInsertCmd("ladderdata")
        cmd:SetFields("roleid", sRoleId)  
        cmd:SetFields("score", tNewData.score)
        cmd:SetFields("challengetime", tNewData.challengeTime)
        cmd:SetFields("wintime", tNewData.winTime)
        cmd:SetFields("continuous", tNewData.continuous)

        cmd:Execute()
    else
        self.tLadderSaveData[sRoleId] = 1
    end
    self.tRolePosLadderList[sRoleId] = tNewData
    self.tRolePosLadderList[sRoleId].groupNum = self:AddLadderGradRoleId(sRoleId, tNewData.score)

    -- for i,v in pairs(self.tLadderData) do
    --     for x,y in ipairs(v) do
    --         for q,w in pairs(y) do
    --             print("Grad = ", i, "GroupNum = ", x, "nRoleId = ", w)
    --         end
    --     end
    -- end
end

-- 请求匹配天梯
function CPVPManager:ReqLadderMatching( oPlayer, tInfo )
    --检测次数
    local nTimes = GameParamConfig_S.LadderFreeNum + oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.BuyLadderTimes ) + oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderAdverTimes )
    delog("nTimes === ",oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderTimes ), oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.BuyLadderTimes ))
    if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderTimes ) >= nTimes then
        delog("CPVPManager:ReqLadderMatching is not nTimes!")
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        return
    end

    local sRoleId = oPlayer:GetRoleID( )

    if not self:IsGoodCombatInfo( tInfo ) then
        delog( "not self:IsGoodCombatInfo( tInfo )" )
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        return 
    end

    -- 更新数据
    self:ReqUpdateCombatInfo(oPlayer, tInfo)

    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        --新人添加
        local tNewData = {
            ["grad"] = 1,
            ["groupNum"] = 0,
            ["score"] = 0,
            ["challengeTime"] = 0,      
            ["winTime"] = 0,
            ["continuous"] = 0,
        }
        self:ReqUpdateLadderData(oPlayer, tNewData)
    end 
    tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        delog("CPVPManager:ReqLadderMatching not tData!")
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        return
    end

    -- 匹配对手
    local bSucceedn, nOtherRoleID = self:LadderRivalMatching(sRoleId, tData.grad)

    if not bSucceedn then
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        delog("CPVPManager:ReqLadderMatching not bSucceedn!")
        return
    end

    if not nOtherRoleID then
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        delog("CPVPManager:ReqLadderMatching not nOtherRoleID!")
        return
    end
    delog("CPVPManager:ReqLadderMatching nOtherRoleID ==", nOtherRoleID)
    local tOtherCombatInfo = self.tCombatInfo[nOtherRoleID]
    if not tOtherCombatInfo then
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        delog("CPVPManager:ReqLadderMatching not tOtherCombatInfo!")
        return
    end

    local tOtherLadderData = self.tRolePosLadderList[nOtherRoleID]
    if not tOtherLadderData then
        oPlayer:SendToClient( "C_ReqLadderMatching", 3)
        delog("CPVPManager:ReqLadderMatching not tOtherLadderData!")
        return
    end

    local sOtherName = nil
    local oTarget = CPlayerManager:GetPlayerByRoleID(nOtherRoleID)
    if oTarget then
        sOtherName = oTarget:GetName()
    else
        local oDBCmd = CDBCommand:CreateSelectCmd("role")
        oDBCmd:SetFields("rolename")
        oDBCmd:SetWheres("roleid", nOtherRoleID, "=")
        oDBCmd:SetLimit(1)
        local res = oDBCmd:Execute()
        local info = res[1]
        if not info then
            sOtherName = "robot"
        else
            sOtherName = info.rolename
        end 
    end

    self.tLadderCombating[sRoleId] = { tOtherCombatInfo, tOtherLadderData, nOtherRoleID, now(1) }

    oPlayer:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.LadderTimes, 1)
    oPlayer:SendToClient( "C_ReqLadderMatching", 1, tOtherCombatInfo, tOtherLadderData, nOtherRoleID, sOtherName )
end

-- 匹配对手
function CPVPManager:LadderRivalMatching( sRoleId, nLadderGrad )
    local nOtherRoleID
    --菜鸟随机机器人   
    if nLadderGrad <= 1 then
        local nRandomNumber = math.random( 1, 10 )
        nOtherRoleID = "robot_" .. nRandomNumber
        return true, nOtherRoleID

    --随机真实玩家
    else
        if (not self.tLadderData[nLadderGrad]) or #self.tLadderData[nLadderGrad] == 0 then
            return false
        end
        --给10次随机机会
        for i=1,10 do
            local tRandomGroup = math.random( 1, #self.tLadderData[nLadderGrad] )
            if self.tLadderData[nLadderGrad][tRandomGroup] then
                local nRandomNumber = math.random( 1, #self.tLadderData[nLadderGrad][tRandomGroup] )
                nOtherRoleID = self.tLadderData[nLadderGrad][tRandomGroup][nRandomNumber]
                if nOtherRoleID ~= sRoleId then
                    return true, nOtherRoleID
                end
            end
            if i == 10 then
                return false
            end
        end
    end
    return false, nOtherRoleID
end

-- 请求结束天梯战斗
function CPVPManager:ReqLadderCombatEnd( oPlayer, nStar, nWin )
    delog( "CPVPManager:ReqLadderCombatEnd", nStar, nWin )
    local sRoleId = oPlayer:GetRoleID( )
    -- 没有在战斗中
    if not self.tLadderCombating[sRoleId] then
        delog( "not self.tLadderCombating[sRoleId]" )
        return
    end 
    local tOtherCombatInfo, tOtherLadderData, nOtherRoleID, nStarTime = unpack(self.tLadderCombating[sRoleId])
    self.tLadderCombating[sRoleId] = nil

    local tData = self.tRolePosLadderList[sRoleId]
    if not tData then
        delog( "CPVPManager:ReqLadderCombatEnd not tData" )
        return
    end 
    local tCfg = LadderConfig_S[tData.grad]
    if not tCfg then
        delog( "CPVPManager:ReqLadderCombatEnd not tCfg" )
        return
    end 

    -- 星级比例
    if (nStar < 0) or (nStar > 3) then
        delog( "CPVPManager:ReqLadderCombatEnd nStar <= 0 or nStar > 3" )
        return 
    end 
    
    local nStarMoney = 1
    if nStar > 1 then
        nStarMoney = GameParamConfig_S.LadderStarData[4 - nStar][3]
    end 

    local tAllAward = {}
    local tNewData = tData
    tNewData.challengeTime = tData.challengeTime + 1
    
    -- 胜利
    if nWin == 1 then 

        tNewData.score = tData.score + (GameParamConfig_S.VictoryBasicIntegral * nStarMoney)
        tNewData.winTime = tData.winTime + 1
        if tNewData.continuous > 0 then
            tNewData.continuous = tNewData.continuous + 1
        else
            tNewData.continuous = 1
        end
        --更新玩家天梯数据
        self:ReqUpdateLadderData( oPlayer, tNewData)

        --发奖励
        if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderTimes ) <= GameParamConfig_S.DailyAvailableAwardNum then
            oPlayer:GetSystem("CGiftSystem"):AddGiftByID(tCfg.WinBaseAward, tAllAward, nil, nStarMoney )
            oPlayer:GetSystem("CGiftSystem"):AddGiftByID(tCfg.WinExtraAward, tAllAward)
        end

    -- 失败 
    elseif nWin == 2 then

        if tNewData.continuous < 0 then
            tNewData.continuous = tNewData.continuous - 1
        else
            tNewData.continuous = -1
        end

        if LadderConfig_S[tNewData.grad].IsKou == 1 then
            tNewData.score = math.max(tData.score - (GameParamConfig_S.VictoryBasicIntegral * nStarMoney), 0) 
        end
        --更新玩家天梯数据
        self:ReqUpdateLadderData( oPlayer, tNewData)
        --发奖励
        if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderTimes ) <= GameParamConfig_S.DailyAvailableAwardNum then
            oPlayer:GetSystem("CGiftSystem"):AddGiftByID(tCfg.ComfortAward, tAllAward)
        end
    -- 平局
    elseif nWin == 0 then
        
        --更新玩家天梯数据
        self:ReqUpdateLadderData( oPlayer, tNewData)
        --发奖励
        if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.LadderTimes ) <= GameParamConfig_S.DailyAvailableAwardNum then
            oPlayer:GetSystem("CGiftSystem"):AddGiftByID(tCfg.ComfortAward, tAllAward)
        end

    else
        delog( "CPVPManager:ReqLadderCombatEnd nWin is not, return!" )
        return
    end
    
    
    oPlayer:SendToClient( "C_ReqLadderCombatEnd", nStar, nWin, tAllAward, tNewData.score, tNewData.winTime, tNewData.continuous )
end
    
--请求购买挑战天梯次数
function CPVPManager:ReqBuyLadderTimes( oPlayer, nNum )
    --检测次数
    if oPlayer:GetSystem( "CEventSystem" ):GetDayEventValue( GameEventEnum.BuyLadderTimes ) + nNum > GameParamConfig_S.LadderSpendNum then
        delog("CPVPManager:ReqBuyLadderTimes Buy Times upper limit!")
        return
    end

    local nUseCount = nNum * GameParamConfig_S.PurchasePrice

    -- 检测材料是否足够 并且消耗
    if not oPlayer:CostItem( ItemEnum.eEiamond, nUseCount, ItemLogEnum.BuyLadderTimes ) then
        delog( "not oPlayer:CostItem", ItemEnum.eEiamond, nUseCount )
        return
    end 

    oPlayer:GetSystem( "CEventSystem" ):OnEvent(GameEventEnum.BuyLadderTimes, nNum)
    oPlayer:SendToClient( "C_ReqBuyLadderTimes" )
end

-- 请求天梯活动数据
function CPVPManager:ReqLadderActivityInfo( oPlayer )
    local sRoleId = oPlayer:GetRoleID( )
    local tData = { 
        self.tCombatInfo[sRoleId]
    }
    oPlayer:SendToClient( "C_ReqLadderActivityInfo", tData )
end

 -- 请求匹配天梯
defineC.K_ReqLadderMatching = function ( oPlayer, tInfo )
    CPVPManager:ReqLadderMatching( oPlayer, tInfo )
end
    
 -- 请求结束天梯战斗
defineC.K_ReqLadderCombatEnd = function ( oPlayer, nStar, nWin )
    CPVPManager:ReqLadderCombatEnd( oPlayer, nStar, nWin )
end

 -- 请求购买挑战天梯次数
defineC.K_ReqBuyLadderTimes = function ( oPlayer, nNum )
    CPVPManager:ReqBuyLadderTimes( oPlayer, nNum )
end

 -- 请求天梯活动数据
defineC.K_ReqLadderActivityInfo = function ( oPlayer )
    CPVPManager:ReqLadderActivityInfo( oPlayer )
end

-- 请求pk联赛活动数据
function CPVPManager:ReqPKLeagueActivityInfo( sRoleId )
    local tData = { 
        self.tCombatInfo[sRoleId]
    }
    return tData
    
end