
-- global enum
local ActionTypeEnum			= RequireEnum("ActionTypeEnum")

-- global singleton
local EquipConfig_S = RequireConfig( "EquipConfig_S" )
local HeroConfig_S = RequireConfig( "HeroConfig_S" )
local petConfig_S = RequireConfig( "petConfig_S" )
local CCommonFunction   = RequireSingleton("CCommonFunction")
local CGlobalInfoManager = RequireSingleton("CGlobalInfoManager")
local CItemConfigMgr = RequireSingleton("CItemConfigMgr")
local CPlayerManager    = RequireSingleton("CPlayerManager")
local CDBService        = RequireSingleton("CDBService")
local CDBCommand        = RequireSingleton("CDBCommand")
local CSchedule     = RequireSingleton("CSchedule")

-- global function
local now           = _commonservice.now
local print			= print
local pairs			= pairs
local ipairs		= ipairs
local tonumber      = tonumber
local NewClass		= NewClass
local table_insert	= table.insert
local table_sort	= table.sort
local table_maxn    = table.maxn
local math_ceil		= math.ceil
local math_floor	= math.floor
local string_match  = string.match
local string_format = string.format
local ProtectedCall = ProtectedCall
local Calendar2Sec  = CCommonFunction.Calendar2Sec
local GetTodayStartSec  = CCommonFunction.GetTodayStartSec
-- global class


-- local
local CActionManager = RequireSingleton("CActionManager");
function CActionManager:Initialize()
	-- 商业化活动列表 和 活动版本
    self.m_tActionList = {}
	self.m_tAllActivit = {}
    self.m_nTaskID = {}
	return true
end

function CActionManager:GetAction(i_sID)
	return self.m_tActionList[i_sID];
end

function CActionManager:GetAllAction()
    return self.m_tActionList
end
function CActionManager:GetAllActivit()
	return self.m_tAllActivit
end

function CActionManager:GetActivit(i_sID)
    return self.m_tAllActivit[i_sID];
end

 local type2class = {
}
function CActionManager:AddAction(i_tActionData)
    self.m_tAllActivit[i_tActionData.id] = i_tActionData
end

-- 根据活动类型判断是开启了活动
function CActionManager:IsOpenByType( nType )
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == nType then            
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                return true
            end 
        end 
    end 
    return false
end

-- 十连活动是否开启
function CActionManager:IsTenevenDiscountsOpen( )
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == ActionTypeEnum.eTenevenDiscounts then            
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                local award = tActionData.award[1]
                if award then
                    local tday = string.split(tostring(award.value), "#")
                    local week = CCommonFunction.Sec2Week(now(1))
                    for _, nWeek in ipairs( tday ) do 
                        if nWeek == tostring(week) then
                            return true, tonumber( award.money )
                        end 
                    end 
                end 
            end 
        end 
    end 
    return false
end

-- 特权优惠活动是否开启
function CActionManager:IsPrivilegeDiscountOpen( )
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == ActionTypeEnum.ePrivilegeDiscount then            
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                local award = tActionData.award[1]
                if award then
                    return true, tonumber(award.value), award.money
                end 
            end
        end 
    end 
    return false
end

-- 宝箱优惠活动是否开启
function CActionManager:IsBoxDiscountOpen( )
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == ActionTypeEnum.eBoxDiscount then            
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                local award = tActionData.award[1]
                if award then
                    return true, tonumber(award.value), award.money
                end 
            end
        end 
    end
    return false
end

-- 随机出一个话题
function CActionManager:RandomTopicDesc( )
    local tInfo = nil
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == ActionTypeEnum.eTopic then 
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                    local nRandom = math.random( 1, #tActionData.award )
                    tInfo = tActionData.award[nRandom]
                break
            end
        end
    end
    return tInfo
end

-- 分发活动掉落奖励
function CActionManager:DropAward(oPlayer, tAllAward)
    local sRoleID = oPlayer:GetRoleID( )
    local bSave = false
    local bOpenAward = false
    for nID, tActionData in pairs( self.m_tAllActivit ) do 
        if tActionData.type == ActionTypeEnum.eDrop then 
            local nNowTime = now(1)
            if (tActionData.svst <= nNowTime) and (tActionData.svot >= nNowTime) then
                bOpenAward = true
                for idx, award in ipairs( tActionData.award ) do 
                    local prob = award.prob
                    local outgoing = award.outgoing
                    local limit = award.limit
                    local items = award.items
                    if not oPlayer.m_tDropAward[idx] then
                        oPlayer.m_tDropAward[idx] = {0,0}
                    end

                    local tDropAward = oPlayer.m_tDropAward[idx]
                    local bCanGet = true
                    if tDropAward[1] < outgoing then
                        bCanGet = false
                    end

                    if limit ~= -1 then
                        if tDropAward[2] >= limit then
                            bCanGet = false
                        end
                    end
                    --delog( "********************", idx, tDropAward[1] )
                    tDropAward[1] = tDropAward[1] + 1
                    if bCanGet then
                        local nRandom = math.random( 1, 10000 )
                        if nRandom <= prob then
                            oPlayer:GetSystem( "CGiftSystem" ):AddGiftByList(items, tAllAward)
                            tDropAward[1] = 0
                            tDropAward[2] = tDropAward[2] + 1
                        end
                    end
                    bSave = true
                end
            end
        end 
    end 
    if bSave then
        oPlayer:SetSaveDataRoleInfo("dropaward", TableToStr(oPlayer.m_tDropAward))
    end
    if not bOpenAward then
        if next( oPlayer.m_tDropAward ) then
            oPlayer.m_tDropAward = { }
            oPlayer:SetSaveDataRoleInfo("dropaward", "")
        end
    end
end

-- 解析CS传来的数据
local tAwardFunMap
local tFinalFunMap

local function get_ymd(str)
    local year, month, day = string_match(str, "(%d+)/(%d+)/(%d+)")
    return tonumber(year), tonumber(month), tonumber(day)
end
local function get_hms(str)
    local hour, minute, second = string_match(str, "(%d+):(%d+):(%d+)")
    if not hour then
        hour, minute = string_match(str, "(%d+):(%d+)")
        second = 0
    end
    return tonumber(hour), tonumber(minute), tonumber(second)
end
local function get_absolute_time(date, time)
    local year, month, day = get_ymd(date)
    local hour, minute, second = get_hms(time)
    return Calendar2Sec(year, month, day, hour, minute, second)
end
local function get_relative_time(opendaytime, date, time)
    local day = tonumber(date) - 1
    local hour, minute, second = get_hms(time)
    return opendaytime + (day * 86400) + (hour * 3600) + (minute * 60) + second
end

--[[
    --@brief 此函数为解析数据总接口！！
    --@param indexs 档次
    --@param items
--]]
local function parse_activity_data(indexs, items, opendaytime, activity)
    local tData = {}
    tData.id = activity.id .. "|" .. activity.version      -- 唯一id生成
    tData.type = tonumber(activity.type)        -- 活动类型 
    
    tData.name = activity.name                             -- 活动名称
    tData.desc = activity.desc                             -- 活动描述
    tData.pos  = tonumber(activity.position)               -- 活动位置 ?? 类型
    tData.icon = activity.icon or ""                       -- 活动图标
    tData.order= tonumber(activity.order)                  -- 活动排序
    tData.level= tonumber(activity.level)                  -- 等级限制
    local svst, svot, clst, clot                    -- 活动时间
    if activity.start_time.type == 0 then
        svst = get_absolute_time(activity.start_time.date, activity.start_time.time)  ---开始时间
    else -- 开服天数
        svst = get_relative_time(opendaytime, activity.start_time.date, activity.start_time.time)
    end
    if activity.end_time.type == 0 then
        svot = get_absolute_time(activity.end_time.date, activity.end_time.time)       ---结束时间
    else -- 开服天数
        svot = get_relative_time(opendaytime, activity.end_time.date, activity.end_time.time)
    end
    if activity.show_start.type == 0 then
        clst = get_absolute_time(activity.show_start.date, activity.show_start.time)    ---开始显示时间
    else -- 开服天数
        clst = get_relative_time(opendaytime, activity.show_start.date, activity.show_start.time)
    end
    if activity.show_end.type == 0 then
        clot = get_absolute_time(activity.show_end.date, activity.show_end.time)        ---显示结束时间
    else -- 开服天数
        clot = get_relative_time(opendaytime, activity.show_end.date, activity.show_end.time)
    end
        
    local nNowTime = now(1)
    if clst >= clot or svst >= svot or (clot <= nNowTime and svot <= nNowTime) then
        print("ERROR!!! activity time err.", tData.id, clst, clot, svst, svot)
        return
    end
    
    tData.svst = svst
    tData.svot = svot
    tData.clst = clst
    tData.clot = clot
    
    print("Log. parse_activity_data", tData.id, tData.type, clst, clot, svst, svot)

    tData.award  = {}                                -- 生成活动各档次信息
    for _, indexid in ipairs(activity.items) do
        if indexs[indexid] then
            tAwardFunMap[tData.type](tData, indexs[indexid], items, activity.id)
        else
            print("ERROR!!! activity items id not exist.", activity.id, indexid)
        end
    end

    if tFinalFunMap[tData.type] then
        local res = tFinalFunMap[tData.type](tData)
        if not res then
            print("ERROR!!! activity final check failed.", activity.id, activity.version)
            return
        end
    end
    
    return tData
end

function CActionManager:OnPushActivities(i_tData)
    self:InitActivities(i_tData)
end

function CActionManager:InitActivities(i_tData)
    -- do return end
    -- if self.m_nVersion == i_tData.version then return end
    local activities = i_tData.activities
    -- 各档次集合
    local tIndexs = {} 
    for _, v in ipairs(activities.items) do
        tIndexs[v.id] = v
    end
    -- 各奖励集合
    local tItems = {}
    for _, v in ipairs(activities.rewards) do
        tItems[v.id] = v
    end
    -- 开始生成游戏内数据结构
    local nOpenDayTime = CGlobalInfoManager:GetOpenDayTime()
    local tDatas = {}
    for _, v in ipairs(activities.activities) do
        local res, tData = ProtectedCall(function() return parse_activity_data(tIndexs, tItems, nOpenDayTime, v) end)
        if res and tData then
            table_insert(tDatas, tData)
        end
    end
    
    for id,vale in pairs(self.m_nTaskID) do
        CSchedule:DelTask(vale)
        self.m_nTaskID[id] = nil
    end
    for k, v in ipairs(tDatas) do
        self:AddAction(v)
        if now(1) <= v.svst then
            local tTime = {m_nTime = v.svst*1000}
            local taskID = CSchedule:AddTask(tTime, nil, nil, 1, function() self:ForActivityStart(v.id) end, {})
            self.m_nTaskID[v.id] = taskID
        end
    end
    CPlayerManager:OnPushActivities()
end

function CActionManager:ForActivityStart(i_id)
    if self.m_nTaskID[i_id] then
        CSchedule:DelTask(self.m_nTaskID[i_id])
        self.m_nTaskID[i_id] = nil
        CPlayerManager:ForActivityStart(i_id)
    end
end

--[[
============================
与运营对完修改一下方法
==============================
--]]

local function parse_reward(my_reward, their_reward, their_items, activityid, svot)
    for _, itemid in ipairs(their_reward) do
        local itemdata = their_items[itemid]
        if itemdata then
            local arr = string.split(tostring(itemdata.item_id), "-");
            local nType = arr[1]
            local nID = arr[2]
            local item = {tonumber(nType), tonumber(nID), tonumber(itemdata.number)}
            table_insert(my_reward, item)
        else
            print("ERROR!!! activity reward id not exist.", activityid, itemid) 
        end
    end
end

local function parse_day_charge(mydata, theirdata, items, activityid)
    local indexdata = {
        value = tonumber(theirdata.params.amount),  
        items = {},
    }
    parse_reward(indexdata.items, theirdata.rewards, items, activityid, mydata.svot)
    table_insert(mydata.award, indexdata)
end

local function parse_tenevendiscounts(mydata, theirdata, items, activityid)
    local indexdata = {
        value = theirdata.params.amount,
        money = tonumber(theirdata.params.money),
    }
    table_insert(mydata.award, indexdata)
end

local function parse_privilegediscount(mydata, theirdata, items, activityid)
    local indexdata = {
        value = tonumber(theirdata.params.times),
        money = { },
    }

    for i = 1, 5 do 
        indexdata.money[i] = tonumber(theirdata.params["money" .. i])
    end
    table_insert(mydata.award, indexdata)
end

local function parse_boxdiscount(mydata, theirdata, items, activityid)
    local indexdata = {
        value = tonumber(theirdata.params.times),
        money = { },
    }
    for i = 1, 3 do 
        indexdata.money[i] = tonumber(theirdata.params["money" .. i])
    end
    table_insert(mydata.award, indexdata)
end

local function parse_conversion(mydata, theirdata, items, activityid)
    local indexdata = {
        value = tonumber(theirdata.params.limit),
        items1 = {},
        items2 = {}
    }
    for i = 1, 4 do 
        local arr = string.split(tostring(theirdata.params["item" .. i]), "-");
        local nType = arr[1]
        local nID = arr[2]
        indexdata.items1[i] = {tonumber(nType), tonumber(nID), tonumber(theirdata.params["number" .. i])}
    end
    parse_reward(indexdata.items2, theirdata.rewards, items, activityid, mydata.svot)
    table_insert(mydata.award, indexdata)
end

local function parse_drop(mydata, theirdata, items, activityid)
    local indexdata = {
        prob = tonumber(theirdata.params.prob),
        outgoing = tonumber(theirdata.params.outgoing),
        limit = tonumber(theirdata.params.limit),
        items = {},
    }
    parse_reward(indexdata.items, theirdata.rewards, items, activityid, mydata.svot)
    table_insert(mydata.award, indexdata)
end

local function parse_random_day(mydata, theirdata, items, activityid)
    if theirdata.category == "cost" then
        mydata.cost = mydata.cost or {}
        local indexdata = {
            num = tonumber(theirdata.params.number),
            items = {},
        }
        parse_reward(indexdata.items, theirdata.rewards, items, activityid, mydata.svot)
        table_insert(mydata.cost, indexdata)
    elseif theirdata.category == "pool" then
        local indexdata = {
            freenum = tonumber(theirdata.params.freenum),
            onecost = tonumber(theirdata.params.onecost),
            tencost = tonumber(theirdata.params.tencost),
            rebate  = tonumber(theirdata.params.rebate),
        }
        mydata.award[0] = indexdata
    else
        mydata.award = mydata.award or {}
        local arr = string.split(tostring(theirdata.params.item1), "-");
        local nType = arr[1]
        local nID = arr[2]
        local indexdata = {
            Type = tonumber(nType),
            itemid = tonumber(nID),
            itemnum = tonumber(theirdata.params.num),
            weight = tonumber(theirdata.params.weight),
            rare = tonumber(theirdata.params.rare),
        }
        table_insert(mydata.award, indexdata)
    end
end

local function parse_topic(mydata, theirdata, items, activityid)
    local indexdata = {
        desc = tostring(theirdata.params.desc),
    }
    table_insert(mydata.award, indexdata)
end

tAwardFunMap = {
    [ActionTypeEnum.eDayTotalCharge]        = parse_day_charge,
    [ActionTypeEnum.eDayConsume]            = parse_day_charge,
    [ActionTypeEnum.eTenevenDiscounts]      = parse_tenevendiscounts,
    [ActionTypeEnum.ePrivilegeDiscount]     = parse_privilegediscount,
    [ActionTypeEnum.eBoxDiscount]           = parse_boxdiscount,
    [ActionTypeEnum.eConversion]            = parse_conversion,
    [ActionTypeEnum.eDrop]                  = parse_drop,
    [ActionTypeEnum.eDayDial]               = parse_random_day,
    [ActionTypeEnum.eTopic]                 = parse_topic,
}


-- 奖励类型枚举
local EItemType     = 1 -- 道具
local EEquipType    = 2 -- 装备
local EHeroType     = 3 -- 英雄
local EPetType      = 4 -- 神兽

-- final
local function item_filter(items, id)
    if #items == 0 then
        print("ERROR!!! item_filter activities items empty.", id)
        return false
    end
    for _, v in ipairs(items) do
        local nType = v[1]
        local nID = v[2]
        local nNum = v[3]
        if nType == EItemType then
            if not CItemConfigMgr:IsItem(nID) then
                print("ERROR!!! item_filter activities itemid invalid.", id, nType, nID)
                return false
            end
        elseif nType == EEquipType then
            if not EquipConfig_S[nID] then
                print("ERROR!!! item_filter activities itemid invalid.", id, nType, nID)
                return false
            end
        elseif nType == EHeroType then
            if not HeroConfig_S[nID] then
                print("ERROR!!! item_filter activities itemid invalid.", id, nType, nID)
                return false
            end
        elseif nType == EPetType then
            if not petConfig_S[nID] then
                print("ERROR!!! item_filter activities itemid invalid.", id, nType, nID)
                return false
            end
        end
        if not v[2] or v[2] <= 0 then
            print("ERROR!!! item_filter activities itemnum invalid.", id, v[1], v[2])
            return false
        end
    end
    return true
end

local function final_day_charge(data)
    
    if #data.award <= 0 then
        print("ERROR!!! final_day_charge #data.award <= 0", data.id)
        return false
    end 

    for id, info in ipairs( data.award ) do 
        if not info.value then
            print("ERROR!!! final_day_charge info.value is nil.", data.id)
            return false
        end
        if not info.items then
            print("ERROR!!! final_day_charge not info.items", data.id)
            return false
        end
        if not item_filter(info.items, data.id) then
            print("ERROR!!! final_day_charge item_filter(info.items, data.id) item_filter false.", data.id)
            return false
        end
    end 
    return true
end

local function final_tenevendiscounts(data)
    if #data.award <= 0 then
        print("ERROR!!! final_tenevendiscounts #data.award <= 0", data.id)
        return false
    end 
    for id, info in ipairs( data.award ) do 
        if not info.value then
            print("ERROR!!! final_tenevendiscounts info.value is nil.", data.id)
            return false
        end
        if not info.money then
            print("ERROR!!! final_tenevendiscounts not info.money", data.id)
            return false
        end
    end 
    return true
end

local function final_privilegediscount( data )
    if #data.award <= 0 then
        print("ERROR!!! final_privilegediscount #data.award <= 0", data.id)
        return false
    end 
    for id, info in ipairs( data.award ) do 
        if not info.value then
            print("ERROR!!! final_privilegediscount info.value is nil.", data.id)
            return false
        end
        for i = 1,5 do 
            if not info.money[i] then
                print("ERROR!!! final_privilegediscount not info.money" .. i, data.id)
                return false
            end
        end
    end 
    return true
end

local function final_boxdiscount( data )

    if #data.award <= 0 then
        print("ERROR!!! final_boxdiscount #data.award <= 0", data.id)
        return false
    end 
    for id, info in ipairs( data.award ) do 
        if not info.value then
            print("ERROR!!! final_boxdiscount info.value is nil.", data.id)
            return false
        end
        for i = 1,3 do 
            if not info.money[i] then
                print("ERROR!!! final_boxdiscount not info.money" .. i, data.id)
                return false
            end
        end
    end 
    return true
end

local function final_conversion( data )
    if #data.award <= 0 then
        print("ERROR!!! final_conversion #data.award <= 0", data.id)
        return false
    end 

    for id, info in ipairs( data.award ) do 
        if not info.value then
            print("ERROR!!! final_conversion info.value is nil.", data.id)
            return false
        end
        if not info.items1 then
            print("ERROR!!! final_conversion not info.items1", data.id)
            return false
        end
        if not info.items2 then
            print("ERROR!!! final_conversion not info.items2", data.id)
            return false
        end
    end 
    return true
end

local function final_drop( data )
    if #data.award <= 0 then
        print("ERROR!!! final_drop #data.award <= 0", data.id)
        return false
    end 

    for id, info in ipairs( data.award ) do 
        if not info.prob then
            print("ERROR!!! final_drop info.prob is nil.", data.id)
            return false
        end
        if not info.outgoing then
            print("ERROR!!! final_drop not info.outgoing", data.id)
            return false
        end
        if not info.limit then
            print("ERROR!!! final_drop not info.limit", data.id)
            return false
        end
        if not info.items then
            print("ERROR!!! final_drop not info.items", data.id)
            return false
        end
        if not item_filter(info.items, data.id) then
            print("ERROR!!! final_drop item_filter(info.items, data.id) item_filter false.", data.id)
            return false
        end
    end 
    return true
end


local function final_random(data)
    if not data.cost then
        --print("ERROR!!! final_random data.cost is nil.", data.id)
        --return false
    end
    if not data.award then
        print("ERROR!!! final_random data.award is nil.", data.id)
        return false
    end
    if #data.award ~= 10 then
        print("ERROR!!! final_random #data.award ~= 12.", data.id,#data.award)
        return false
    end
    --[[
    for _, v in ipairs(data.cost) do
        if not v.num then
            print("ERROR!!! final_random data.cost v.num is nil.", data.id)
            return false
        end
        if not v.items then
            print("ERROR!!! final_random data.cost v.items is nil.", data.id)
            return false
        end
    end
    --]]
    for _, v in ipairs(data.award) do
        if not v.itemid then
            print("ERROR!!! final_random data.award v.itemid is nil.", data.id)
            return false
        end
        if not v.itemnum then
            print("ERROR!!! final_random data.award v.itemnum is nil.", data.id)
            return false
        end
        if not v.weight then
            print("ERROR!!! final_random data.award v.weight is nil.", data.id)
            return false
        end
        if not v.rare then
            print("ERROR!!! final_random data.award v.rare is nil.", data.id)
            return false
        end
    end

    if not data.award[0] then
        print("ERROR!!! final_random data.award[0] is nil.", data.id)
        return false
    end
    if not data.award[0].freenum then
        print("ERROR!!! final_random data.award[0].freenum is nil.", data.id)
        return false
    end
    if not data.award[0].onecost then
        print("ERROR!!! final_random data.award[0].freenum is nil.", data.id)
        return false
    end
    if not data.award[0].tencost then
        print("ERROR!!! final_random data.award[0].freenumis nil.", data.id)
        return false
    end
    --table_sort(data.cost, function(a, b) return a.num < b.num end)
    return true
end

local function final_topic( data )
    if #data.award <= 0 then
        print("ERROR!!! final_topic #data.award <= 0", data.id)
        return false
    end 
    return true
end

tFinalFunMap = {
    [ActionTypeEnum.eDayTotalCharge]        = final_day_charge,
    [ActionTypeEnum.eDayConsume]            = final_dayconsume,
    [ActionTypeEnum.eTenevenDiscounts]      = final_tenevendiscounts,
    [ActionTypeEnum.ePrivilegeDiscount]     = final_privilegediscount,
    [ActionTypeEnum.eBoxDiscount]           = final_boxdiscount,
    [ActionTypeEnum.eConversion]            = final_conversion,
    [ActionTypeEnum.eDrop]                  = final_drop,
    [ActionTypeEnum.eDayDial]               = final_random,
    [ActionTypeEnum.eTopic]                 = final_topic,
}

function CActionManager:AddTestAction()
    local testdata = dofile("./Server/KernelServer/ActivityModule/testdata.lua")
    
    self:AddAction(testdata.tCharge)
    self:AddAction(testdata.tFightGoal)
    self:AddAction(testdata.tWeaponGoal)
    self:AddAction(testdata.tPetGoal)
    self:AddAction(testdata.tApparelGoal)
    self:AddAction(testdata.tKungfuGoal)
    self:AddAction(testdata.tArrayGoal)
    self:AddAction(testdata.tSwordGoal)
    self:AddAction(testdata.tJingMaiGoal)
    self:AddAction(testdata.tNeiGongGoal)
    self:AddAction(testdata.tRankCP)
    self:AddAction(testdata.tRankWeapon)
    self:AddAction(testdata.tFirstCharge)
    self:AddAction(testdata.tEquipGoal) 
    self:AddAction(testdata.tDayTotalCharge)
    self:AddAction(testdata.tNewTotalCharge1)
    self:AddAction(testdata.tNewTotalCharge2)
    self:AddAction(testdata.tContiCharge1)
    self:AddAction(testdata.tContiCharge2)
    self:AddAction(testdata.tContiCharge3)
    self:AddAction(testdata.tPurchaselimit)
    self:AddAction(testdata.tConversion)
    self:AddAction(testdata.tOddGiftBag)
    self:AddAction(testdata.tChargeDial)
    self:AddAction(testdata.tDayDial)
    self:AddAction(testdata.tMonopoly)
    self:AddAction(testdata.tDayConsume)
    self:AddAction(testdata.tRankGoldConsume)
end

 
