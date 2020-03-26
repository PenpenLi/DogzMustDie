
local CChatManager = RequireSingleton("CChatManager");
local now           = _commonservice.now
local string_len    = string.len
local string_find   = string.find
local CCommonFunction = RequireSingleton("CCommonFunction")
local GetCharNum = CCommonFunction.GetCharNum

function CChatManager:Initialize()
	self.m_tChat = {}
	return true
end

function CChatManager:CheckChat(i_oPlayer)
	local sRoleID = i_oPlayer:GetRoleID();
	local nNow = now(1)
	if not self.m_tChat[sRoleID] then self.m_tChat[sRoleID] = {nNow, 0}; end
	if nNow - self.m_tChat[sRoleID][1] < 1 then
		self.m_tChat[sRoleID][1] = nNow
		self.m_tChat[sRoleID][2] = self.m_tChat[sRoleID][2] + 1
		if self.m_tChat[sRoleID][2] >= 5 then
			i_oPlayer:BeKick(1, nNow);
		end
	else
		self.m_tChat[sRoleID][1] = nNow
		self.m_tChat[sRoleID][2] = 0;
	end
end

local t = {
    "$JiangHuSearch",
	"$fight3v3",
	"$teamFuBen",
	"$rewardTask",
	"$groupTeamFuBen",
	"$lation",
	"$CrossSTeam",
    "flyshoes_icon.png",
}
function CChatManager:FilterContent(i_oPlayer, i_sContent)
    local bFind = false
    for _, v in ipairs(t) do
        if string_find(i_sContent, v, 1, true) then
            bFind = true
            break
        end
    end
    if bFind then
        return true
    else
        if GetCharNum(i_sContent) > 40 then
            print("Warning!!! content too long.", i_oPlayer:GetRoleID())
            return false
        end
        if string_find(i_sContent, "\r", 1, true) then
            print("Warning!!! content contain \\r.", i_oPlayer:GetRoleID())
            return false
        end
        if string_find(i_sContent, "\n", 1, true) then
            print("Warning!!! content contain \\n.", i_oPlayer:GetRoleID())
            return false
        end
        if string_find(i_sContent, "\t", 1, true) then
            print("Warning!!! content contain \\t.", i_oPlayer:GetRoleID())
            return false
        end
        return true
    end
end


