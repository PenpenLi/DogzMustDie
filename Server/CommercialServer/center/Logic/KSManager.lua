
-- global enum
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum")
-- global function
local print     = print
local pairs     = pairs
local ipairs	= ipairs
local type      = type
local tonumber  = tonumber
local now       = _commonservice.now
local NewClass  = NewClass
local table_insert  = table.insert
local fast_decode   = _codeservice.fast_decode
-- global singleton
local CSchedule     = RequireSingleton("CSchedule")
local CDBService    = RequireSingleton("CDBService")

-- global msg table
defineCM = {}

-- local 
local CKSManager = RequireSingleton("CKSManager")

-- listen
local function onAccept(session, ip)
	CKSManager:OnAccept(session, ip)
end
local function onClose(session)
	CKSManager:OnClose(session)
end
local function onRecv(session, data, len)
	CKSManager:OnRecv(session, data, len)
end


function CKSManager:Initialize()
	self.m_tSession2KS = {}
	self.m_nSessionNum = 0
	self.m_tID2KS = {}
    self.m_tOld2New = {}
    
    -- 定时1分钟ping1次
	CSchedule:AddTask({}, ScheduleTaskCycleTypeEnum.eMinute, 1, 0, function() self:PingEveryOne() end, {})
        
    local res = CDBService:SelectOld2New()
    if res then
        for _, v in ipairs(res) do
            self.m_tOld2New[v.oldid] = v.newid
        end
    else
        print("ERROR!!! select from old2new err.")
        return false
    end
    
    -- 监听
	self.m_pListener = _netservice.listennormal(
        ServerCfg.KSWDMgrIP, ServerCfg.KSManagerPort,
        onAccept, onClose, onRecv)
	return self.m_pListener
end

function CKSManager:Destruct()
	if self.m_pListener then
		_netservice.shutdownlistener(self.m_pListener)
		self.m_pListener = nil
	end
	for session, _ in pairs(self.m_tSession2KS) do
		_netservice.closesession(session)
	end
end

function CKSManager:IsDestructOver()
	return self.m_nSessionNum == 0
end

function CKSManager:OnAccept(i_pSession, i_sIP)
	self.m_tSession2KS[i_pSession] = NewClass("CKS", i_pSession, i_sIP)
	self.m_nSessionNum = self.m_nSessionNum + 1
end

function CKSManager:OnClose(i_pSession)
	self.m_nSessionNum = self.m_nSessionNum - 1
	local oKS = self.m_tSession2KS[i_pSession]
	self.m_tSession2KS[i_pSession] = nil
	self.m_tID2KS[oKS:GetID()] = nil
	oKS:OnClose()
end

local function OnKSCall(i_oKS, i_sMsg, ...)
	if i_sMsg and defineCM[i_sMsg] then
		defineCM[i_sMsg](i_oKS, ...)
	else
		print("ERROR!!! OnKSCall", i_oKS:GetID(), i_oKS:GetIP(), i_sMsg)
	end
end

function CKSManager:OnRecv(i_pSession, i_pData, i_nLen)
	local oKS = self.m_tSession2KS[i_pSession]
    OnKSCall(oKS, fast_decode(i_pData, i_nLen))
end

function CKSManager:SetOld2New(i_nOldID, i_nNewID)
    if CDBService:InsertOld2New(i_nOldID, i_nNewID) then
        self.m_tOld2New[i_nOldID] = i_nNewID
        return true
    else
        return false
    end
end

function CKSManager:GetOld2New(i_nOldID)
    local nNewID = self.m_tOld2New[i_nOldID]
    if nNewID then
        return self:GetOld2New(nNewID)
    else
        return i_nOldID
    end
end

-- 设置KS 和 服务器ID 映射
function CKSManager:SetID2KS(i_nKSID, i_oKS)
	local oKS = self:GetKSByID(i_nKSID)
	if oKS then
		print("ERROR!!! CKSManager:SetKS2ID repeat!!!", i_nKSID, oKS:GetIP(), i_oKS:GetIP())
        return false
	else
		self.m_tID2KS[i_nKSID] = i_oKS
        return true
	end
end

-- 根据服务器ID获取服务器KS对象
function CKSManager:GetKSByID(i_nKSID)
    if not i_nKSID then
        return self.m_tID2KS
    else
	   return self.m_tID2KS[i_nKSID]
    end
end

-- ping所有服务器
function CKSManager:PingEveryOne()
    for _, oKS in pairs(self.m_tID2KS) do
        oKS:Ping()
    end
end

-- 关服
function CKSManager:ShutdownKSByID(i_Arg)
    if type(i_Arg) == "number" or type(i_Arg) == "string" then
        i_Arg = tonumber(i_Arg)
        if i_Arg == 0 then
            for _, oKS in pairs(self.m_tID2KS) do
                oKS:Shutdown()
            end
        else
            local oKS = self:GetKSByID(i_Arg)
            if oKS then
                oKS:Shutdown()
            end
        end
    elseif type(i_Arg) == "table" then
        if #i_Arg == 0 then
            for _, oKS in pairs(self.m_tID2KS) do
                oKS:Shutdown()
            end
        else
            for _, v in ipairs(i_Arg) do
                local oKS = self:GetKSByID(tonumber(v))
                if oKS then
                    oKS:Shutdown()
                end
            end
        end
    end
end


-- 获取所有服务器信息
function CKSManager:GetKSInfo()
	local tTemp = {}
    for _, oKS in pairs(self.m_tID2KS) do
        table_insert(tTemp, {
            id = oKS:GetID(),
            ip = oKS:GetIP(),
            state = 1
        })
    end
    table.sort(tTemp, function(a, b) return a.id < b.id end)
	return tTemp
end


-- 热更新代码
function CKSManager:RedoFile(i_sFileName)
	for _, oKS in pairs(self.m_tID2KS) do
		oKS:RedoFile(i_sFileName)
	end
end

function CKSManager:GetVersionSet()
    local tSet = {}
    for nID, oKS in pairs(self.m_tID2KS) do
		local sVersion = oKS:GetVersion()
        if sVersion then
            local tSetData = tSet[sVersion] or {set = {}, num = 0}
            table_insert(tSetData.set, nID)
            tSetData.num = tSetData.num + 1
            tSet[sVersion] = tSetData
        else
            print("ERROR!!! server version is nil.", nID, oKS:GetIP())
        end
	end
    return tSet
end


