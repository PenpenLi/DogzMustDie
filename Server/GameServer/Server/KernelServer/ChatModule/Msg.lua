
local CChat = RequireSingleton("CChat")
local CChatManager = RequireSingleton("CChatManager")
--客户端发送聊天消息
defineC.K_SendChatInfoMsg = function(player, channelid, tmsg, sig)
    if player:IsBanSpeak() then return end
	CChatManager:CheckChat(player) 
    if CChatManager:FilterContent(player, tmsg[2]) then
        CChat:SendChatInfo(player, channelid, tmsg, sig)
    end
end

local CBridgeListener = RequireSingleton("CBridgeListener", true)
local CBridgeConnector= RequireSingleton("CBridgeConnector", true)

-- 向跨服服务器发送喇叭聊天数据
defineS.K_SendToBridgeChat = function(player, msg)
    if CBridgeListener then
        CBridgeListener:Chat(msg)
    else
        CBridgeConnector:Send("K_Chat", msg)
    end
end

-- 向跨服服务器发送跨服提示数据
defineS.K_SendNoticeToBridgeChat = function(player, msg)
    if CBridgeListener then

        CBridgeListener:ChatNotice(msg)
    else
        CBridgeConnector:Send("K_ChatNotice", msg)
    end
end

--gm指令
defineC.K_GMCommondMsg = function(player, targ)
    if ServerInfo.GM then
        CChat:GmOperate(player, targ)
    end
end

-- 设置聊天导致的禁言
defineC.K_SetForbidSpeak = function(player)   
	player:SetForbidSpeak();
end



