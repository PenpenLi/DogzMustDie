-- global function
local print = print
local pairs = pairs
local ipairs = ipairs
local type = type
local math_floor = math.floor
local now = _commonservice.now
local table_insert = table.insert
local string_len = string.len
local table_concat = table.concat
local string_format = string.format
-- global enum
local ChatEnum = RequireEnum("ChatChannelEnum")
local PlayerBeKickReasonEnum = RequireEnum("PlayerBeKickReasonEnum")
-- global config
local GameParamConfig = RequireConfig("GameParamConfig_S")
local OpenGradeConfig_S = RequireConfig("OpenGradeConfig_S")
-- global singleton
local CPlayerManager = RequireSingleton("CPlayerManager")
local CDataReport = RequireSingleton("CDataReport")
local CGuildManager = RequireSingleton("CGuildManager")

local CBridgeListener = RequireSingleton("CBridgeListener", true)
local ServerInfo = ServerInfo

-- local
local CChat = RequireSingleton("CChat")

local tFunctionInfo = {
    [ChatEnum.eGuild] = function(i_oChat, i_oPlayer, i_tMsgInfo)
        i_oChat:SendMsgToGuild(i_oPlayer, i_tMsgInfo)
    end, -- 帮会
    [ChatEnum.eWorld] = function(i_oChat, i_oPlayer, i_tMsgInfo)
        i_oChat:SendMsgToWorld(i_oPlayer, i_tMsgInfo)
    end -- 世界
}

local math_floor = math.floor
local math_sqrt = math.sqrt
local string_len = string.len
local string_byte = string.byte
local md5 = _commonservice.md5
local hex_encode = _commonservice.hex_encode
local function get_str_sum(str)
    local sum = 0
    for i = 1, string_len(str) do
        sum = sum + string_byte(str, i)
    end
    return sum
end
local function get_sig(accountid, roleid, str)
    local a = (get_str_sum(accountid) * string_len(str)) ^ 2
    local b = (get_str_sum(roleid) * get_str_sum(hex_encode(md5(str), 16))) ^ 2
    return math_floor(math_sqrt(a + b)) % 10000
end

function CChat:Initialize()
    self.m_tAlwaysNotice = {}
    return true
end

function CChat:SetAlwaysNotice(i_tData)
    self.m_tAlwaysNotice = i_tData
    CPlayerManager:SendMsgToAllClient(
        "C_AlwaysNotice",
        i_tData.m_sContent or "",
        i_tData.m_sLink or "",
        i_tData.m_sLinkName or ""
    )
end

function CChat:GetAlwaysNotice()
    local tNotice = self.m_tAlwaysNotice
    return tNotice.m_sContent or "", tNotice.m_sLink or "", tNotice.m_sLinkName or ""
end

function CChat:SendChatInfo(i_oPlayer, i_ChannelId, i_tMsgInfo, i_nSig)
    -- if get_sig(i_oPlayer:GetAccountID(), i_oPlayer:GetRoleID(), i_tMsgInfo[2]) == i_nSig then
    tFunctionInfo[i_ChannelId](self, i_oPlayer, i_tMsgInfo)
    -- end
end

function CChat:GetItemInfo(i_oPlayer, i_tItem)
    local oItemSystem = i_oPlayer:GetSystem("CItemSystem")
    local tInfo = {}
    for _, nItemInstId in pairs(i_tItem) do
        tInfo[nItemInstId] = oItemSystem:GetItemInfoByInstId(nItemInstId)
    end
    return tInfo
end

function CChat:GetMsgInfo(i_oPlayer, i_tMsgInfo)
    local tMsg = {
        [1] = i_oPlayer:GetName(),
        [2] = i_tMsgInfo[2],
        [3] = i_oPlayer:GetRoleID(),
        [4] = i_oPlayer:GetGuildID(),
        [5] = i_oPlayer:GetHeadID(),
        [6] = i_oPlayer:GetSystem("CVipSystem"):GetExpirationTime()
    }
    return tMsg
end

-- 发消息给阵营频道
function CChat:SendMsgToGuild(i_oPlayer, i_tMsgInfo)
    local tMsg = self:GetMsgInfo(i_oPlayer, i_tMsgInfo)
    local oGuild = CGuildManager:GetGuild(i_oPlayer:GetGuildID())
    local tPlayerList = oGuild:GetPlayerList()
    local tPlayOnlineList = {}
    for nRoleID, oMember in pairs(tPlayerList) do
        local oTarget = CPlayerManager:GetPlayerByRoleID(nRoleID)
        if oTarget then
            table.insert(tPlayOnlineList, oTarget)
        end
    end
    CPlayerManager:SendMsgToGroupPlayer(tPlayOnlineList, "C_SendChatMsg", ChatEnum.eGuild, tMsg)
    CDataReport:Reportchat(i_oPlayer, 6, tMsg[3])
end

--发消息给世界频道
local tWorld = {} --记录世界频道说话间隔
function CChat:SendMsgToWorld(i_oPlayer, i_tMsgInfo)
    local sRoleID = i_oPlayer:GetRoleID()
    tWorld[sRoleID] = now(1) + 5
    local tMsg = self:GetMsgInfo(i_oPlayer, i_tMsgInfo)
    CPlayerManager:SendMsgToAllClient("C_SendChatMsg", ChatEnum.eWorld, tMsg)
    CDataReport:Reportchat(i_oPlayer, 4, tMsg[3])
end

-- 通过喇叭发消息给同一跨服组的所有服务器
function CChat:SendMsgToBridge(i_oPlayer, i_tMsgInfo)
    local tMsg = self:GetMsgInfo(i_oPlayer, i_tMsgInfo)
    tMsg[0] = ServerInfo.serverid
    i_oPlayer:SendToGS("G_DeleteTrumpet", tMsg)
    CDataReport:Reportchat(i_oPlayer, 2, tMsg[3])
end

-- 通过喇叭发消息给同一跨服组的所有服务器
function CChat:SendNoticeToBridge(i_oPlayer, i_tMsgInfo)
    local tMsg = self:GetMsgInfo(i_oPlayer, i_tMsgInfo)
    tMsg[0] = ServerInfo.serverid
    i_oPlayer:SendToGS("G_NoticeToBridge", tMsg)
    CDataReport:Reportchat(i_oPlayer, 2, tMsg[3])
end

-- 跨服喇叭
function CChat:SendTrumpetMsg(i_tMsg)
    CPlayerManager:SendMsgToAllClient("C_SendChatMsg", ChatEnum.eTrumpet, i_tMsg)
end

-- 跨服系统消息
function CChat:SendBridgeMsg(i_tMsg)
    CPlayerManager:SendMsgToAllClient("C_SendChatMsg", ChatEnum.eBridge, i_tMsg)
end

--发送系统消息/公告
function CChat:Notice(i_tMsg)
    CPlayerManager:SendMsgToAllClient("C_SendChatMsg", ChatEnum.eGlobal, {i_nPosition, i_tMsg})
end

-- 玩家下线清除聊天CD
function CChat:ClearChatSpaceInfo(i_sRoleID)
    if tWorld[i_sRoleID] then
        tWorld[i_sRoleID] = nil
    end
    if tNear[i_sRoleID] then
        tNear[i_sRoleID] = nil
    end
end
