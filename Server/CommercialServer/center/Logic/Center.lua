
-- global function
local print     = print
local pairs     = pairs
local ipairs	= ipairs
local type      = type
local tonumber  = tonumber
local now       = _commonservice.now
local table_insert = table.insert
local table_remove = table.remove
local math_random  = math.random
local NewClass  = NewClass
local fast_encode   = _codeservice.fast_encode
local fast_decode   = _codeservice.fast_decode
local sendtosession	= _netservice.sendtosession
local closesession	= _netservice.closesession
local malloc		= _memoryservice.malloc
local free			= _memoryservice.free
-- global singleton
local CKSManager = RequireSingleton("CKSManager")
-- global msg table
defineCT = {}

-- local 
local CCenter = RequireSingleton("CCenter")

-- listen
local function onAccept(session, ip)
	CCenter:OnAccept(session, ip)
end
local function onClose(session)
	CCenter:OnClose(session)
end
local function onRecv(session, data, len)
	CCenter:OnRecv(session, data, len)
end


function CCenter:Initialize()
    self.m_nSessionNum = 0
    self.m_tType2Services = {}
    self.m_tServices2Type = {}
    
    -- 监听
	self.m_pListener = _netservice.listennormal(
        ServerCfg.ServiceMgrIP, ServerCfg.ServiceMgrPort,
        onAccept, onClose, onRecv)
	return self.m_pListener
end

function CCenter:Destruct()
	if self.m_pListener then
		_netservice.shutdownlistener(self.m_pListener)
		self.m_pListener = nil
	end
	for session, _ in pairs(self.m_tServices2Type) do
		_netservice.closesession(session)
	end
end

function CCenter:IsDestructOver()
	return self.m_nSessionNum == 0
end

function CCenter:OnAccept(i_pSession, i_sIP)
	self.m_tServices2Type[i_pSession] = "unknown"
	self.m_nSessionNum = self.m_nSessionNum + 1
end

function CCenter:OnClose(i_pSession)
	self.m_nSessionNum = self.m_nSessionNum - 1
	local sType = self.m_tServices2Type[i_pSession]
	self.m_tServices2Type[i_pSession] = nil
	if sType ~= "unknown" then
        for k, v in ipairs(self.m_tType2Services[sType]) do
            if v == i_pSession then
                table_remove(self.m_tType2Services[sType], k)
                break
            end
        end
        print("--service leave--", sType, #self.m_tType2Services[sType])
    end
end

local function OnServiceCall(i_pSession, i_sMsg, ...)
	if i_sMsg and defineCT[i_sMsg] then
		defineCT[i_sMsg](i_pSession, ...)
	else
		print("ERROR!!! OnServiceCall", i_sMsg)
	end
end

function CCenter:OnRecv(i_pSession, i_pData, i_nLen)
    OnServiceCall(i_pSession, fast_decode(i_pData, i_nLen))
end

local nMaxLen = 4 * 4096
function CCenter:Send2Service(i_pSession, ...)
    local bRes = false	
    local pData = malloc(nMaxLen)
    if pData then
        local nLen = fast_encode(pData, nMaxLen, ...)
        if nLen > 0 then
            sendtosession(i_pSession, pData, nLen)
            bRes = true
        else
            print("ERROR!!! CCenter:Send fast_encode")
        end
        free(pData)
    else
        print("ERROR!!! CCenter:Send malloc")
    end
    return bRes
end


function CCenter:OnServiceRegist(i_sType, i_pSession)
    self.m_tServices2Type[i_pSession] = i_sType
    self.m_tType2Services[i_sType] = self.m_tType2Services[i_sType] or {}
    table_insert(self.m_tType2Services[i_sType], i_pSession)
    print("--service join--", i_sType, #self.m_tType2Services[i_sType])
end
defineCT.CT_Service_Regist = function(i_pSession, i_sType)
    CCenter:OnServiceRegist(i_sType, i_pSession)
end

function CCenter:GetService(i_sType)
    local tServices = self.m_tType2Services[i_sType]
    local num = tServices and #tServices or 0
    if num > 0 then
        return tServices[math_random(1, num)]
    end
end


