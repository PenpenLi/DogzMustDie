
-- global function
local print = print
local pairs = pairs
local ipairs= ipairs
local type  = type
local tonumber = tonumber
local string_gmatch = string.gmatch
local table_insert  = table.insert
local NewClass      = NewClass
local converttostring   = _codeservice.converttostring
local sendtosession     = _netservice.sendtosession
-- local
local CDBService = RequireSingleton("CDBService")
local CWDManager = RequireSingleton("CWDManager")

-- listen
local function onAccept(session, ip)
	CWDManager:OnAccept(session, ip)
end
local function onClose(session)
	CWDManager:OnClose(session)
end
local function onRecv(session, data, len)
	CWDManager:OnRecv(session, data, len)
end


function CWDManager:Initialize()
	self.m_tSession2WD = {}
	self.m_nSessionNum = 0
	self.m_tID2WD = {}
	self.m_tWaitAutoRestartID = {}
	self.m_pListener = _netservice.listennormal(
        ServerCfg.KSWDMgrIP, ServerCfg.WDManagerPort,
        onAccept, onClose, onRecv)
	return self.m_pListener
end

function CWDManager:Destruct()
	if self.m_pListener then
		_netservice.shutdownlistener(self.m_pListener)
		self.m_pListener = nil
	end
	for session, _ in pairs(self.m_tSession2WD) do
		_netservice.closesession(session)
	end
end

function CWDManager:IsDestructOver()
	return self.m_nSessionNum == 0
end

function CWDManager:OnAccept(i_pSession, i_sIP)
	self.m_tSession2WD[i_pSession] = {
        m_pSession = i_pSession,
        m_sIP = i_sIP,
    }
	self.m_nSessionNum = self.m_nSessionNum + 1
end

function CWDManager:OnClose(i_pSession)
	self.m_nSessionNum = self.m_nSessionNum - 1
	local oWD = self.m_tSession2WD[i_pSession]
	self.m_tSession2WD[i_pSession] = nil
    if oWD.m_nID then
        self.m_tID2WD[oWD.m_nID] = nil
        print("MD Close", oWD.m_nID, oWD.m_sIP)
    end
end

function CWDManager:GetWDInfo()
	local tTemp = {}
    for _, oWD in pairs(self.m_tID2WD) do
        table_insert(tTemp, {
            id = oWD.m_nID,
            ip = oWD.m_sIP,
            state = 0,
        })
    end
    table.sort(tTemp, function(a, b) return a.id < b.id end)
	return tTemp
end

function CWDManager:WaitAutoRestart(i_nServerID)
	self.m_tWaitAutoRestartID[i_nServerID] = true;
end

function CWDManager:OnRecv(i_pSession, i_pData, i_nLen)
    local oWD = self.m_tSession2WD[i_pSession]
    local str = converttostring(i_pData, i_nLen)
    local tCmd = {}
	for words in string_gmatch(str, "(%w+)") do
        table_insert(tCmd, words)
    end
    if tCmd[1] == "regist" then
        local nID = tonumber(tCmd[2])
        local oWDTemp = self.m_tID2WD[nID]
        if oWDTemp then
            print("ERROR!!! MD Repeat.", nID, oWDTemp.m_sIP, oWD.m_sIP)
            _netservice.closesession(i_pSession)
        else            
            print("MD Regist", nID, oWD.m_sIP)
            oWD.m_nID = nID
            self.m_tID2WD[nID] = oWD
			-- 修改开服时间会自动重启
			if self.m_tWaitAutoRestartID[nID] then
				self.m_tWaitAutoRestartID[nID] = nil
				self:StartServer(nID)
			end
        end
    elseif tCmd[1] == "crash" then
        print("ERROR!!! server has crashed.", tCmd[2])
        CDBService:LogServerCrash(tCmd[2])
    end
end

function CWDManager:StartServer(i_Arg)
    if type(i_Arg) == "number" or type(i_Arg) == "string" then
        i_Arg = tonumber(i_Arg)
        if i_Arg == 0 then
            for _, oWD in pairs(self.m_tID2WD) do
                sendtosession(oWD.m_pSession, "start")
            end
        else
            local oWD = self.m_tID2WD[i_Arg]
            if oWD then
                sendtosession(oWD.m_pSession, "start")
            end
        end
    elseif type(i_Arg) == "table" then
        if #i_Arg == 0 then
            for _, oWD in pairs(self.m_tID2WD) do
                sendtosession(oWD.m_pSession, "start")
            end
        else
            for _, v in ipairs(i_Arg) do
                local oWD = self.m_tID2WD[tonumber(v)]
                if oWD then
                    sendtosession(oWD.m_pSession, "start")
                end
            end
        end
    end
end


