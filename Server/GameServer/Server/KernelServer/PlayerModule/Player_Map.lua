-- global enum
local KSPlayerStateEnum = RequireEnum("KSPlayerStateEnum")
local CPlayer = RequireClass("CPlayer")

function CPlayer:GetMapCfgID()
    return 0
end

function CPlayer:IsInGame()
    return self:GetState() == KSPlayerStateEnum.eInGame
end

-- 玩家进入游戏
function CPlayer:EnterGame(i_bLogin, i_bIsNew)
    self:SetState(KSPlayerStateEnum.eInGame)
    -- 进入地图
    self:SendToClient("C_EnterMap")
end

-- 玩家离开游戏
function CPlayer:LeaveGame()
    delog("CPlayer:LeaveGame")
    self:LeaveGameComplete();
end

-- 玩家销毁、下线
function CPlayer:LeaveGameComplete()
	self:Destroy()
end