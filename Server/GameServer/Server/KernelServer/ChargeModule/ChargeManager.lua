--[[
	@brief	充值管理
	@author	LCL
]]

local CDBCommand = RequireSingleton("CDBCommand");
local CPlayerManager = RequireSingleton("CPlayerManager");
local CChargeManager = RequireSingleton("CChargeManager");
local ChargeConfig_S     = RequireConfig("ChargeConfig_S")
local MailTypeEnum      = RequireEnum("MailTypeEnum")
local CMailManager = RequireSingleton("CMailManager")
local CJSON = RequireSingleton("CJSON")
local CDataLog          = RequireSingleton("CDataLog")

local ChargeTypeStr = {
    [1] = "钻石充值",
    [3] = "一元购",
    [4] = "VIP购买",
    [5] = "英雄礼包购买",
}

-- 充值
function CChargeManager:Charge(i_sRoleId, i_nGold, i_sOrderID, i_nMoney, i_tData)
    print("===========i_sRoleId=============",i_sRoleId)
    print("===========i_nMoney=============",i_nMoney)
    print("===========i_nGold=============",i_nGold)
    print("===========i_sOrderID=============",i_sOrderID)
    i_sRoleId = tostring(i_sRoleId)
    i_nGold = tonumber(i_nGold)
    local data = { }
    if type(i_tData) == "table" then
        data = i_tData
    else
        data = CJSON.Decode(i_tData)
    end
    delog(data)
    if not data.goodsType then
        print( "Erro: CChargeManager:Charge not data.goodsType" )
        return
    end 
    if not data.goodsId then
        print( "Erro: CChargeManager:Charge not data.goodsId" )
        return
    end 
    -- 充值类型
    local goodsType = tonumber(data.goodsType)
    -- 充值ID
    local goodsId = tonumber(data.goodsId)
    -- 获取充值配置
    local tCfg = ChargeConfig_S[goodsType][goodsId]
    if not tCfg then
        print( "Erro: CChargeManager:Charge not tCfg", goodsType, goodsId )
        return
    end
    local sChargeTypeStr = ChargeTypeStr[goodsType] or ""
    local gyyx_lf, account_id, role_id, role_lv, money, source, order_no = "测试指纹", "", i_sRoleId, 0, i_nMoney, sChargeTypeStr, i_sOrderID
    local oPlayer = CPlayerManager:GetPlayerByRoleID(i_sRoleId)
    if oPlayer then -- 在线
        account_id = oPlayer:GetOpenID( )
        print( "oPlayer oline" )
        local tAllGift = { }
        local nGiftID = nil
        local nChargeTimes = oPlayer:GetChargeTimes( goodsType, goodsId )
        if (nChargeTimes == 0) and (tCfg.FirstChargeReward > 0) then
            nGiftID = tCfg.FirstChargeReward
        else
            nGiftID = tCfg.chargeReward
        end 
        oPlayer:AddGiftByID( nGiftID, tAllGift )
        oPlayer:SendToClient( "C_Charge", goodsType, goodsId )
        if oPlayer:GetSystem("CActivitySystem") then
            oPlayer:GetSystem("CActivitySystem"):OnCharge(tCfg.Price)
        end
        oPlayer:ModChargeTime( goodsType, goodsId )
        oPlayer:SendToClient( "C_OnCharge", goodsType, goodsId, tAllGift )
        role_lv = oPlayer:GetLevel( )
    else
        print( "oPlayer not oline" )
        local oSelectCmd = CDBCommand:CreateSelectCmd("role_info")
        oSelectCmd:SetFields("chargetimes")
        oSelectCmd:SetWheres("roleid", i_sRoleId, "=")
        oSelectCmd:SetLimit(1)
        local res = oSelectCmd:Execute()
        local data = res and res[1]
        if not data then
            print( "not oline charge defeated" )
            return
        end 
        if data then
            oSelectCmd = CDBCommand:CreateSelectCmd("role")
            oSelectCmd:SetFields("accountid")
            oSelectCmd:SetFields("level")
            oSelectCmd:SetWheres("roleid", i_sRoleId, "=")
            oSelectCmd:SetLimit(1)
            local roleRes = oSelectCmd:Execute()
            roleRes = roleRes[1]
            if roleRes then
                account_id = roleRes.accountid
                role_lv = roleRes.level
            end
            -- 获取玩家充值次数
            local tChargeTimes = StrToTable( data.chargetimes )
            local nChargeTimes = nil
            if not tChargeTimes[goodsType] then
                nChargeTimes = 0
                tChargeTimes[goodsType] = { }
            elseif not tChargeTimes[goodsType][goodsId] then
                nChargeTimes = 0
            else
                nChargeTimes = tChargeTimes[goodsType][goodsId]
            end
            tChargeTimes[goodsType][goodsId] = nChargeTimes + 1
            local oSelectCmd = CDBCommand:CreateUpdateCmd("role_info")
            oSelectCmd:SetWheres("roleid", i_sRoleId, "=")
            oSelectCmd:SetFields("chargetimes", TableToStr(tChargeTimes))
            oSelectCmd:Execute()

            local nGiftID = nil
            if (nChargeTimes == 0) and (tCfg.FirstChargeReward > 0) then
                nGiftID = tCfg.FirstChargeReward
            else
                nGiftID = tCfg.chargeReward
            end 
            CMailManager:SendMail(i_sRoleId, MailTypeEnum.Charge, nGiftID,{nGiftID})
        end
    end
    CDataLog:LogDistCredit_log( 
        gyyx_lf, 
        account_id, 
        role_id, 
        role_lv, 
        money, 
        source,
        order_no
    )
end

-- 测试充值
defineC.K_ChgCharge = function (oPlayer, goodsType, goodsId )
    if ServerInfo.GM then
        local data = CJSON.Encode({goodsType = goodsType, goodsId = goodsId})
        CChargeManager:Charge(oPlayer:GetRoleID(), 0, "test", 0, data)
    end
end