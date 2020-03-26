
-- global function
local print = print
local pairs = pairs
local ipairs= ipairs
local string_format = string.format
local table_insert  = table.insert
local table_sort    = table.sort
local math_floor    = math.floor
local math_random   = math.random
local now           = _commonservice.now
local NewClass      = NewClass
-- global singleton 
local CCommonFunction   = RequireSingleton("CCommonFunction")
local CSchedule         = RequireSingleton("CSchedule")
local CDBService        = RequireSingleton("CDBService")
local CJSON             = RequireSingleton("CJSON")
local CCenter			= RequireSingleton("CCenter")

-- local 

local CLottoMgr = RequireSingleton("CLottoMgr")

function CLottoMgr:Initialize()
    self.m_tMap = {}
	return true
end

function CLottoMgr:OnDayRefresh()
    for _, v in pairs(self.m_tMap) do
        v:OnDayRefresh()
    end
end

function CLottoMgr:Delete(i_sSpecialID)
    self.m_tMap[i_sSpecialID] = nil
    print("--delete lotto--", i_sSpecialID)
end

function CLottoMgr:OnInit(i_nKS, i_tData)
    local oLotto = self.m_tMap[i_tData.specid]
    if oLotto then
        oLotto:ReInit(i_tData)
    else
        print("--new lotto--", i_tData.specid)
        oLotto = NewClass("CLotto", i_tData, i_nKS)
        self.m_tMap[i_tData.specid] = oLotto
    end
    oLotto:OnRegist(i_nKS)
end

function CLottoMgr:Book(i_nKS, i_sRoleID, i_sActionID, i_sSpecialID, i_nIndex)
    local oLotto = self.m_tMap[i_sSpecialID]
    if not oLotto then
        print("ERROR!!! book lotto not exist.", i_sRoleID, i_sSpecialID, i_nIndex)
        return
    end
    oLotto:Book(i_nKS, i_sRoleID, i_sActionID, i_nIndex)
end

function CLottoMgr:Buy(i_nKS, i_sSpecialID, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
    local oLotto = self.m_tMap[i_sSpecialID]
    if not oLotto then
        print("ERROR!!! buy lotto not exist.", i_sSpecialID, i_nIndex, i_sRoleID, i_sRoleName)
        return
    end
    oLotto:Buy(i_nKS, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
end

function CLottoMgr:GetRoleData(i_nKS, i_sSpecialID, i_sRoleID)
    local oLotto = self.m_tMap[i_sSpecialID]
    if not oLotto then
        print("ERROR!!! get role data lotto not exist.", i_sSpecialID, i_sRoleID)
        return
    end
    oLotto:GetRoleData(i_nKS, i_sRoleID)
end

function CLottoMgr:GetCount(i_nKS, i_sSpecialID, i_sRoleID)
    local oLotto = self.m_tMap[i_sSpecialID]
    if not oLotto then
        print("ERROR!!! get lotto count not exist.", i_sSpecialID, i_sRoleID)
        return
    end
    oLotto:GetCount(i_nKS, i_sRoleID)
end


local CLotto = RequireClass("CLotto")
function CLotto:_constructor(i_tData)
    self.m_sSpecialID = i_tData.specid
    self.m_sActID = i_tData.id
    self.m_tServerMap = {}
    self:Init(i_tData)
end

function CLotto:Init(i_tData)
    self.m_tSubMap = {}
    for index, data in pairs(i_tData.award) do
        self.m_tSubMap[index] = NewClass("CSubLotto", self, i_tData.specid, index, i_tData.svst, i_tData.svot, i_tData.name, data)
    end
    self.m_nDelTaskID = CSchedule:AddTask({m_nTime = i_tData.svot * 1000}, nil, nil, 1, function() CLottoMgr:Delete(i_tData.specid)end, {})
    self.m_sDataJson = CJSON.Encode(i_tData)
end

function CLotto:ReInit(i_tData)
    local sDataJson = CJSON.Encode(i_tData)
    if self.m_sDataJson ~= sDataJson then
        print("--reinit lotto--", self.m_sSpecialID)
        CSchedule:DelTask(self.m_nDelTaskID)
        for _, oSubLotto in pairs(self.m_tSubMap) do
            oSubLotto:Destruct()
        end
        self:Init(i_tData)
    end
end

function CLotto:GetInitServerID()
    return self.m_nInitServerID
end

function CLotto:OnDayRefresh()
    for _, v in pairs(self.m_tSubMap) do
        v:OnDayRefresh()
    end
end

function CLotto:OnRegist(i_nServerID)
	print("===OnRegist==", i_nServerID);
    self.m_tServerMap[i_nServerID] = true
end

function CLotto:Buy(i_nKS, i_nIndex, i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nVipLevel)
    self.m_tSubMap[i_nIndex]:Buy(i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nKS, i_nVipLevel)
end

function CLotto:Book(i_nKS, i_sRoleID, i_sActionID, i_nIndex)
    local res = self.m_tSubMap[i_nIndex]:Book(i_sRoleID)
	CCenter:Send("CT_BookLottoRes", i_nKS, i_sRoleID, i_sActionID, res)
end

function CLotto:GetRoleData(i_nKS, i_sRoleID)
    local tData = {}
    for index, oSubLotto in pairs(self.m_tSubMap) do
        tData[index] = oSubLotto:GetRoleData(i_sRoleID)
    end
	CCenter:Send("CT_GetLottoDataRes", i_nKS, i_sRoleID, self.m_sActID, tData)
end

function CLotto:GetCount(i_nKS, i_sRoleID)
    local tData = {}
    for index, oSubLotto in pairs(self.m_tSubMap) do
        tData[index] = oSubLotto:GetCount()
    end
	CCenter:Send("CT_GetLottoCountRes", i_nKS, i_sRoleID, self.m_sActID, tData)
end

function CLotto:Broadcast(i_nIndex, i_nTime, i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount)
	CCenter:Send("CT_LottoLuckyInfo", self.m_tServerMap, self.m_sActID, i_nIndex, i_nTime, i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount);
end



local CSubLotto = RequireClass("CSubLotto")
function CSubLotto:_constructor(i_oMgr, i_sSpecialID, i_nIndex, i_nSvst, i_nSvot, i_sName, i_tData)
    self.m_oMgr = i_oMgr
    self.m_tData = i_tData
    self.m_nIndex = i_nIndex
    self.m_sSpecialID = i_sSpecialID
    self.m_sName = i_sName
    self.m_tHistory = {}
    
    self.m_tTaskList = {}
    local nNowTime = now(1)
    local st_year, st_month, st_day = CCommonFunction.Sec2Calendar(i_nSvst)
    for time, _ in pairs(i_tData) do
        local hour, minute = math_floor(time/100), time % 100
        local ts = CCommonFunction.Calendar2Sec(st_year, st_month, st_day, hour, minute, 0)
        while(ts < i_nSvot) do
            if ts > i_nSvst and ts > nNowTime then
                print("--sub lotto schedule--", i_sSpecialID, i_nIndex, CCommonFunction.Sec2Calendar(ts))
                local nTaskID = CSchedule:AddTask({m_nTime = ts * 1000}, nil, nil, 1, function() self:Award()end, {})
                table_insert(self.m_tTaskList, nTaskID)
            end
            ts = ts + (3600 * 24)
        end
    end
    if nNowTime < i_nSvst then
        local nTaskID = CSchedule:AddTask({m_nTime = i_nSvst * 1000}, nil, nil, 1, function() self:Init()end, {})
        table_insert(self.m_tTaskList, nTaskID)
    else
        self:Init(true)
    end
end

function CSubLotto:Destruct()
    for _, nTaskID in ipairs(self.m_tTaskList) do
        CSchedule:DelTask(nTaskID)
    end
end

function CSubLotto:OnDayRefresh()
    self:Init()
    self.m_tHistory = {}
end

function CSubLotto:Init(i_bBeing)
    self.m_nMaxNumber = 0 -- 最大号码
    self.m_tNumberMap = {}
    self.m_tRoleMap = {}
    self.m_nCount = 0 -- 当前参与人数
    
    self.m_nTime = 2400
    local nNowTime = now(1)
    for time, data in pairs(self.m_tData) do
        local hour, minute = math_floor(time/100), time % 100
        local ts = CCommonFunction.GetTodayThisTimeSec(hour, minute, 0)
        if nNowTime < ts then
            if time < self.m_nTime then
                self.m_nTime = time
            end
        end
    end
    self.m_tNowData = self.m_tData[self.m_nTime]
    local year, month, day = CCommonFunction.Sec2Calendar(now(1))
    self.m_nCalendar = year * 100000000 + month * 1000000 + day * 10000 + self.m_nTime
    print("--sub lotto init--", self.m_sSpecialID, self.m_nCalendar, self.m_nTime)
    
    if i_bBeing then
        local res = CDBService:SelectLotto(self.m_sSpecialID, self.m_nIndex, self.m_nCalendar)
        if res then
            for _, v in ipairs(res) do
                print("--db init--", self.m_nCalendar, v.number, v.roleid, v.name, v.serverid)
                self.m_tNumberMap[v.number] = {v.roleid, v.name, v.serverid, v.viplv}
                if self.m_nMaxNumber < v.number then
                    self.m_nMaxNumber = v.number
                end
                self.m_tRoleMap[v.roleid] = self.m_tRoleMap[v.roleid] or {}
                table_insert(self.m_tRoleMap[v.roleid], v.number)
            end
            self.m_nCount = self.m_nCount + #res
            print("--db init over--", self.m_nCount, self.m_nMaxNumber)
        end
    end
end

function CSubLotto:Buy(i_nTime, i_nNumber, i_sRoleID, i_sRoleName, i_nServerID, i_nVipLevel)
    if i_nTime ~= self.m_nTime then
        print("ERROR!!! lotto buy err.", i_nTime, self.m_nTime, i_sRoleID)
        return
    end
    self.m_tNumberMap[i_nNumber] = {i_sRoleID, i_sRoleName, i_nServerID, i_nVipLevel}
    self.m_tRoleMap[i_sRoleID] = self.m_tRoleMap[i_sRoleID] or {}
    table_insert(self.m_tRoleMap[i_sRoleID], i_nNumber)
    self.m_nCount = self.m_nCount + 1
    -- insert to db
    CDBService:InsertLotto(self.m_sSpecialID, self.m_nIndex, self.m_nCalendar, i_nNumber, i_nServerID, i_sRoleID, i_sRoleName, i_nVipLevel)
end

function CSubLotto:Book(i_sRoleID)
    local t = {
        index = self.m_nIndex,
        time = self.m_nTime,
    }
    if self.m_tNowData then
        if self.m_tNowData.single_limit > 0 and #(self.m_tRoleMap[i_sRoleID] or {}) >= self.m_tNowData.single_limit then
            t.res = 2 -- 个人限量
        else
            if self.m_tNowData.total_limit > 0 and self.m_nCount >= self.m_tNowData.total_limit then
                t.res = 3 -- 全服限量
            else                
                self.m_nMaxNumber = self.m_nMaxNumber + 1
                t.res = 0 -- 正常
                t.number = self.m_nMaxNumber
                t.price = self.m_tNowData.price
                t.items = self.m_tNowData.items
                t.specid = self.m_sSpecialID
            end
        end
    else
        t.res = 1 -- 活动还未开启
    end
    return t
end

function CSubLotto:GetRoleData(i_sRoleID)
    -- CCommonFunction.PrintTable(self.m_tRoleMap)
    -- print("------", i_sRoleID)
    return {
        self.m_nTime,
        self.m_tRoleMap[i_sRoleID] or {},
        self.m_tHistory
    }
end

function CSubLotto:GetCount()
    return {
        self.m_nTime,
        self.m_nCount,
    }
end

function CSubLotto:Broadcast(i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount)
    self.m_oMgr:Broadcast(self.m_nIndex, self.m_nTime, i_nNumber, i_sRoleName, i_nVipLevel, i_nCount, i_nMinCount)
end

local str_title = "%s活动奖励"
local str_content = "恭喜您在%s活动中，获得幸运大奖，奖励如下："
function CSubLotto:Award()    
    local lucky_number
    if self.m_tNowData.mininum > 0 and self.m_nCount < self.m_tNowData.mininum then -- 小于保底值 没有奖励
		lucky_number = 0
    else -- 
        local random_number = math_random(1, self.m_nCount)
        local i = 0
        for number, _ in pairs(self.m_tNumberMap) do
            i = i + 1
            if i == random_number then
                lucky_number = number
                break
            end
        end
    end
    local lucky_name = ""
    local lucky_vip = 0
    local lucky_info = self.m_tNumberMap[lucky_number]
    if lucky_info then
        local title = string_format(str_title, self.m_sName)
        local content = string_format(str_content, self.m_sName)
		local tItems = {}
		for _, v in ipairs(self.m_tNowData.luckyprize) do
			table_insert(tItems, {[1] = v[1], [2] = v[2]})
		end
		CCenter:Send("CT_SubAward", lucky_info[3], lucky_info[1], title, content, tItems);
        lucky_name = lucky_info[2]
        lucky_vip = lucky_info[4]
        CDBService:UpdateLotto(self.m_sSpecialID, self.m_nIndex, self.m_nCalendar, lucky_number)
    end
	self:Broadcast(lucky_number, lucky_name, lucky_vip, self.m_nCount, self.m_tNowData.mininum)
    table_insert(self.m_tHistory, {self.m_nTime, lucky_number, lucky_name, lucky_vip, self.m_nCount, self.m_tNowData.mininum})
    print("--lucky number--", self.m_sSpecialID, self.m_nIndex, self.m_nCalendar, lucky_number, lucky_name)
    -- 下一波初始化
    self:Init()
end
