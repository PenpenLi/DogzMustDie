
-- global function
local string_format	= string.format
local string_find	= string.find
local string_match	= string.match
local now 			= _commonservice.now

-- global singleton
local CCommonFunction	= RequireSingleton("CCommonFunction");
local IsSecInToday      = CCommonFunction.IsSecInToday
local CDBService = RequireSingleton("CDBService")
local CCenter 	 = RequireSingleton("CCenter")


--[[
    返回值
    0 没问题
    1 激活码无效
    2 激活码已被领取
    3 未到开始使用时间（尚未启用）
    4 已过期
    5 已经领取过相同主类型的激活码 互斥 不能再领取了
    6 tgp激活码只能在tgp登陆客户端领取
    7 激活码领取次数已达上限
]]
local function get_login_pf(pf)
    local rgpf, lgpf = string_match(pf, "([^%*]+)%*([^%*]+)")
    if rgpf then
        return lgpf
    else
        return pf
    end
end

-- 使用次数限制
local type2times = {
    [1] = 1,
}

-- 每日只能使用该类型礼包一次
local typedayonce = {
}
local type2pf = {
}
local select_pfcode_str = "select maintype, subtype, starttime, overtime, used from pfcode where code = '%s' limit 1";
function CDBService:VerifyPFCode(i_sCode, i_tUsed, i_sPF)
    local res1, res2 = self:Execute(string_format(select_pfcode_str, i_sCode))
    if not res1 then return 1 end
    if not res2[1] then return 1 end
    local res = res2[1]
    if res.used == 1 then return 2 end
    local nowtime = now(1)
    if nowtime < res.starttime then return 3 end
    if nowtime > res.overtime then return 4 end
    local maintype = res.maintype
    if i_tUsed[maintype] then
        if type2times[maintype] then
            if i_tUsed[maintype] >= type2times[maintype] then
                return 7
            end
		elseif typedayonce[maintype] then
			if IsSecInToday(i_tUsed[maintype]) then
                return 8
            end
        else
            return 5
        end
    end
    if type2pf[maintype] then
        local login_pf = get_login_pf(i_sPF)
        if not string_find(login_pf, type2pf[maintype]) then
            return 6
        end
    end
    
    self:MarkPFCode(i_sCode)
    return 0, res.maintype, res.subtype
end

local update_pfcode_str = "update `pfcode` set `used` = 1 where `code` = '%s' limit 1";
function CDBService:MarkPFCode(i_sCode)
    self:Execute(string_format(update_pfcode_str, i_sCode))
end

defineS.S_GetPFGift = function(i_nServerID, i_sRoleID, i_sCode, i_tUsed, i_sPF)
	local nErrCode, nMainType, nSubType = CDBService:VerifyPFCode(i_sCode, i_tUsed, i_sPF)
	CCenter:Send("CT_PFGift", i_nServerID, i_sRoleID, nErrCode, nMainType, nSubType)
end