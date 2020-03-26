
-- version = 1.0

-- global function
local print			= print
local logfile       = logfile
local pairs			= pairs
local ipairs		= ipairs
local unpack        = unpack
local tonumber      = tonumber
local now           = _commonservice.now
local connectnormal = _netservice.connectnormal
local sendtosession	= _netservice.sendtosession
local closesession	= _netservice.closesession
local fast_encode	= _codeservice.fast_encode
local fast_decode	= _codeservice.fast_decode
local malloc		= _memoryservice.malloc
local free			= _memoryservice.free

-- global
defineS = {}

-- local
local CCenter = RequireSingleton("CCenter")

function CCenter:Initialize()
	self:Connect()
    
	return true
end

local function OnCenterCall(i_sMsg, ...)
    defineS[i_sMsg](...)
end

local function onConnect(i_bRes, i_pSession)
	CCenter:OnConnect(i_bRes, i_pSession)
end

local function onRecv(i_pSession, i_pData, i_nLen)
	OnCenterCall(fast_decode(i_pData, i_nLen))
end

local function onClose(i_pSession, i_sErrStr)
	CCenter:OnDisconnect(i_sErrStr)
end

function CCenter:Connect()
	connectnormal(ServerCfg.CenterIP, ServerCfg.CenterPort, onConnect, onClose, onRecv)
end

local nReconnectTime = 1000
function CCenter:OnConnect(i_bRes, i_pSession)
	if i_bRes then
		print("connect to center succeed!!!")
		self.m_pSession = i_pSession
		self:Send("CT_Service_Regist", ServerCfg.ServiceType)
	else
		print("connect to center failed!!!")
		self.m_nReconnectTime = nReconnectTime
	end
end

function CCenter:OnDisconnect(i_sErrStr)
	print("center disconnect!!!", i_sErrStr)
	self.m_pSession = nil
	if self.m_bDestruct then
		self.m_bDestructOver = true
	else
		self.m_nReconnectTime = nReconnectTime
	end
end

function CCenter:Update(i_nDeltaMsec)
	if self.m_nReconnectTime then
		self.m_nReconnectTime = self.m_nReconnectTime - i_nDeltaMsec
		if self.m_nReconnectTime <= 0 then
			self.m_nReconnectTime = nil
			self:Connect()
		end
	end
end

function CCenter:Destruct()
	self.m_bDestruct = true
	if self.m_pSession then
		closesession(self.m_pSession)
	end
end

local nMaxLen = ServerCfg.CenterMsgLen or (4 * 4096)
function CCenter:Send(i_sMsg, ...)
    local bRes = false
	if self.m_pSession then
		local pData = malloc(nMaxLen)
		if pData then
			local nLen = fast_encode(pData, nMaxLen, i_sMsg, ...)
			if nLen > 0 then
				sendtosession(self.m_pSession, pData, nLen)
                bRes = true
			else
				print("ERROR!!! CCenter:Send fast_encode")
			end
			free(pData)
		else
			print("ERROR!!! CCenter:Send malloc failed. len:", nMaxLen)
		end
	else
		print("ERROR!!! CCenter Disappeared!!!")
	end
    return bRes
end


