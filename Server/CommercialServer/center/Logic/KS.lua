

-- global function
local logfile = logfile
local print = print
local pairs = pairs
local ipairs = ipairs
local tostring = tostring
local string_format = string.format
local table_insert	= table.insert
local table_remove	= table.remove
local math_ceil     = math.ceil
local closesession  = _netservice.closesession
local now           = _commonservice.now
local realnow       = _commonservice.realnow
-- global singleton
local CDBService    = RequireSingleton("CDBService")
local CKSManager	= RequireSingleton("CKSManager")
local CCenter		= RequireSingleton("CCenter")
local CCommonFunction   = RequireSingleton("CCommonFunction")


local CKS = RequireClass("CKS")

function CKS:_constructor(i_pSession, i_sIP)
	self.m_pSession = i_pSession
    self.m_nPong    = 0
	self.m_sIP		= i_sIP
	self.m_nID		= 0
    self.m_nOpenTime= 0
    self.m_bOpenTimeBeSet = false
	-- self.m_tReq		= {}
    -- self.m_nReqIndex= 1
    self.m_nOnlineNum = 0
end

function CKS:GetIP()
	return self.m_sIP
end

function CKS:GetOpenTimeInfo()    
    local year, month, day = CCommonFunction.Sec2Calendar(self.m_nOpenTime)
    local openday = math_ceil((now(1) - CCommonFunction.Calendar2Sec(year, month, day, 0, 0, 0) ) / 86400)
    return self.m_sOpenTime, openday
end

function CKS:GetOpenTime()
    return self.m_nOpenTime
end

function CKS:GetOpenTimeBeSet()
    return self.m_bOpenTimeBeSet
end

function CKS:GetID()
	return self.m_nID
end

function CKS:GetVersion()
    return self.m_sVersion
end

function CKS:SetData(i_nID, i_nOpenTime, i_bOpenTimeBeSet, i_sVersion)
	print("KS Regist", self.m_sIP, i_nID)
	if CKSManager:SetID2KS(i_nID, self) then
        self.m_nID = i_nID
        self.m_nOpenTime = i_nOpenTime
        self.m_bOpenTimeBeSet = i_bOpenTimeBeSet
        self.m_sOpenTime = CCommonFunction.Sec2Calendar(i_nOpenTime, true)
        self.m_sVersion = i_sVersion
        CCenter:GetActivity(i_nID)
		CCenter:GetAlwaysNotice(i_nID)
    else
        self:BeKick()
    end
end
defineCM.CM_Regist = function(i_oKS, i_nID, i_nOpenTime, i_bOpenTimeBeSet, i_sVersion)
	i_oKS:SetData(i_nID, i_nOpenTime, i_bOpenTimeBeSet, i_sVersion)
end


function CKS:BeKick()
    if self.m_pSession then
        closesession(self.m_pSession)
        self.m_pSession = nil
    end
end

function CKS:OnClose()
	print("KS Close", self.m_sIP, self.m_nID)
	-- for _, pReq in pairs(self.m_tReq) do
		-- replyrequest(pReq, 503, "Service Unavailable")
	-- end
	-- self.m_tReq = {}
	self.m_pSession = nil
end

-- 关服
function CKS:Shutdown()
	self:Send("K_Shutdown")
end

-- 踢人
function CKS:KickPlayer(i_sRoleID)
	self:Send("K_KickPlayer", i_sRoleID)
end

-- 强制踢人
function CKS:DestroyPlayer(i_sRoleID)
	self:Send("K_DestroyPlayer", i_sRoleID)
end


-- function CKS:IncreaseReqIndex()
    -- local index = self.m_nReqIndex
    -- self.m_nReqIndex = self.m_nReqIndex + 1
    -- return index
-- end

-- 请求
-- function CKS:Request(i_pReq, i_sRequest, i_Param, i_tResBody)
    -- local index = self:IncreaseReqIndex()
    -- print("-- request --", index, realnow())
    -- if self:Send("K_Request", index, i_sRequest, i_Param, i_tResBody) then
        -- self.m_tReq[index] = i_pReq
    -- else
        -- replyrequest(i_pReq, 503, "Service Unavailable")
    -- end
-- end

-- 请求应答
-- function CKS:OnResponse(i_nIndex, i_tResBody)
	-- local pReq = self.m_tReq[i_nIndex]
	-- if pReq then
		-- replyrequest(pReq, 200, "OK", CJSON.Encode(i_tResBody, true))
        -- self.m_tReq[i_nIndex] = nil
        -- print("-- response --", i_nIndex, realnow())
	-- else
		-- print("ERROR!!!, pReq is nil.", i_nIndex)
	-- end
-- end
-- defineCM.CM_Response = function(i_oKS, i_nIndex, i_tResBody)
	-- i_oKS:OnResponse(i_nIndex, i_tResBody)
-- end

-- 通过roleid查询角色数据
-- function CKS:RoleID2RoleInfo(i_sRoleID, i_pReq, i_tResBody)
	-- self:Request(i_pReq, "roleid2roleinfo", i_sRoleID, i_tResBody)
-- end


-- ping
function CKS:Ping()
    self:Send("K_Ping")
end
-- pong
function CKS:Pong()
    self.m_nPong = now(1)
end
defineCM.CM_Pong = function(i_oKS)
    i_oKS:Pong()
end

-- 热更代码
function CKS:RedoFile(i_sFileName)
	self:Send("K_RedoFile", i_sFileName)
end


local malloc		= _memoryservice.malloc
local free			= _memoryservice.free
local fast_encode	= _codeservice.fast_encode
local sendtosession = _netservice.sendtosession
local nMaxLen = 4 * 4096
function CKS:Send(i_sMsg, ...)
    local bOK = false
    if self.m_pSession then
        local nMsgLen = nMaxLen
        if i_sMsg == "K_PushActivities" then
            nMsgLen = 16777215
        end
        local pData = malloc(nMsgLen)
        if pData then
            local nLen = fast_encode(pData, nMsgLen, i_sMsg, ...)
            if nLen > 0 then
                sendtosession(self.m_pSession, pData, nLen)
                bOK = true
            else
                print("ERROR!!! CKS:Send fast_encode")
            end
            free(pData)
        else
            print("ERROR!!! CKS:Send malloc")
        end
    end
    return bOK
end

-- 得在线人数
function CKS:GetOnlineNum()
    return self.m_nOnlineNum
end

-- 记录人物数据
function CKS:OnPlayerEverydayEnter(i_tData)
    if i_tData["online"] then
        if i_tData["online"] == 1 then
            self.m_nOnlineNum = self.m_nOnlineNum + 1;
        elseif i_tData["online"] == 0 then
            self.m_nOnlineNum = self.m_nOnlineNum - 1;
        end
    end
end
