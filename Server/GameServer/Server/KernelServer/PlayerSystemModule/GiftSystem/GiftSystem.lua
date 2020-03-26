--道具系统
local ItemType = RequireEnum("ItemType")
local RewardConfig_S = RequireConfig("RewardConfig_S")
local CItemConfigMgr = RequireSingleton("CItemConfigMgr")

-- 奖励类型枚举
local EItemType     = 1 -- 道具
local EEquipType    = 2 -- 装备
local EHeroType     = 3 -- 英雄
local EPetType      = 4 -- 神兽

local CGiftSystem = RequireClass("CGiftSystem")
function CGiftSystem:Create(bRefresh)
end

-- 添加奖励
function CGiftSystem:AddGiftByID(nGiftID, tAllAward, tMulriple, nMultiple)
    local tCfg = RewardConfig_S[nGiftID]
    if not tCfg then
        return
    end
    local nJudge = tCfg.judgeType
    local nTimes = tCfg.cishu
    -- 防止策划瞎配
    if nTimes > 10 then
        nTimes = 10
    end
    local tAward = tCfg.reWrad
    local fJudgeFunc = CGiftSystem["EJudgeType" .. nJudge]
    if not fJudgeFunc then
        print("erro: CGiftSystem:AddGiftByID not fJudgeFunc", nGiftID)
        return
    end
    -- 缓存奖励
    local tGiftAward = {}
    tAllAward = tAllAward or {}
    for nIdx = 1, nTimes do
        fJudgeFunc(tAward, tGiftAward)
    end
    for nType, tInfo in pairs(tGiftAward) do
        for nID, nNum in pairs(tInfo) do
            if tMulriple and tMulriple[nType] and tMulriple[nType][nID] then
                nNum = math.floor( nNum + nNum * tMulriple[nType][nID] / 10000 )
            end
            if nMultiple then
                nNum = math.floor( nNum * nMultiple )
            end
            self:AddGift(nType, nID, nNum, tAllAward)
        end
    end
end

-- 直接发奖励
function CGiftSystem.EJudgeType0(tAward, tAllAward)
    for nIdx, tAwardInfo in ipairs(tAward) do
        local nType = tAwardInfo[1]
        local nID = tAwardInfo[2]
        local nNum = tAwardInfo[3]
        CGiftSystem:AddGiftTool(tAllAward, nType, nID, nNum)
    end
end

-- 按权重随机出一个
function CGiftSystem.EJudgeType1(tAward, tAllAward)
    local nAllWeight = 0
    for nIdx, tAwardInfo in ipairs(tAward) do
        nAllWeight = nAllWeight + tAwardInfo[4]
    end
    local nRandomNumber = math.random(1, nAllWeight)
    for nIdx, tAwardInfo in ipairs(tAward) do
        local nWight = tAwardInfo[4]
        if nRandomNumber <= nWight then
            local nType = tAwardInfo[1]
            local nID = tAwardInfo[2]
            local nNum = tAwardInfo[3]
            CGiftSystem:AddGiftTool(tAllAward, nType, nID, nNum)
            break
        else
            nRandomNumber = nRandomNumber - nWight
        end
    end
end

-- 按概率全部判断是否掉落
function CGiftSystem.EJudgeType2(tAward, tAllAward)
    local nRandomNumber = math.random(1, 10000)
    for nIdx, tAwardInfo in ipairs(tAward) do
        local nWight = tAwardInfo[4]
        if nWight >= nRandomNumber then
            local nType = tAwardInfo[1]
            local nID = tAwardInfo[2]
            local nNum = tAwardInfo[3]
            CGiftSystem:AddGiftTool(tAllAward, nType, nID, nNum)
        end
    end
end

-- 按概率判断是否掉落一个
function CGiftSystem.EJudgeType3(tAward, tAllAward)
    local nRandomNumber = math.random(1, 10000)
    for nIdx, tAwardInfo in ipairs(tAward) do
        local nWight = tAwardInfo[4]
        if nWight >= nRandomNumber then
            local nType = tAwardInfo[1]
            local nID = tAwardInfo[2]
            local nNum = tAwardInfo[3]
            CGiftSystem:AddGiftTool(tAllAward, nType, nID, nNum)
            return
        else
            nRandomNumber = nRandomNumber - nWight
        end
    end
end

-- 相同道具叠加
function CGiftSystem:AddGiftTool(tAwardList, nType, nID, nNum, bCheck)
    -- 如果是使用物品类型则直接使用
    if bCheck then
        if nType == EItemType then
            local nItemType = CItemConfigMgr:GetType(nID)
            if nItemType == ItemType.UseItem then
                return
            end
        end
    end

    if not tAwardList[nType] then
        tAwardList[nType] = {}
    end
    if not tAwardList[nType][nID] then
        tAwardList[nType][nID] = nNum
    else
        tAwardList[nType][nID] = tAwardList[nType][nID] + nNum
    end
end

-- 通用添加奖励
function CGiftSystem:AddGift(nType, nID, nNum, tAllAward)
    local oPlayer = self:GetPlayer()
    if nNum <= 0 then
        return
    end 
    if nType == EItemType then
        -- 道具
        nNum = oPlayer:GetSystem("CItemSystem"):AddItem(nID, nNum, tAllAward)
    elseif nType == EEquipType then
        for nCount = 1, nNum do 
            oPlayer:GetSystem("CEquipSystem"):AddEquip(nID)
        end
    elseif nType == EHeroType then
        oPlayer:GetSystem("CHeroSystem"):AddHero(nID, true)
    elseif nType == EPetType then
        oPlayer:GetSystem("CPetSystem"):AddPet(nID, nNum)
    end
    self:AddGiftTool(tAllAward, nType, nID, nNum, true)
end

-- 添加奖励( 批量添加 )
function CGiftSystem:AddGiftByList(tList, tAllAward)
    tAllAward = tAllAward or {}
    local oPlayer = self:GetPlayer()
    for _, tAwardInfo in ipairs(tList) do
        local nType = tAwardInfo[1]
        local nID = tAwardInfo[2]
        local nNum = tAwardInfo[3]
        self:AddGift(nType, nID, nNum, tAllAward)
    end
end

-- 添加奖励( 批量添加 )
function CGiftSystem:AddGiftByMap(tList, tAllAward)
    tAllAward = tAllAward or {}
    local oPlayer = self:GetPlayer()
    for nType, tAwardInfo in pairs(tList) do
        for nID, nNum in pairs(tAwardInfo) do
            self:AddGift(nType, nID, nNum, tAllAward)
        end
    end
end

-- 获取奖励列表
CGiftSystem.GetGiftByID = function(nGiftID)
    local tCfg = RewardConfig_S[nGiftID]
    if not tCfg then
        return {}
    end
    local nJudge = tCfg.judgeType
    local nTimes = tCfg.cishu
    local tAward = tCfg.reWrad
    local fJudgeFunc = CGiftSystem["EJudgeType" .. nJudge]
    if not fJudgeFunc then
        return {}
    end
    -- 缓存奖励
    local tGiftAward = {}
    for nIdx = 1, nTimes do
        fJudgeFunc(tAward, tGiftAward)
    end
    return tGiftAward
end
