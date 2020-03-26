
-- global function
local type = type
local print = print
local ipairs = ipairs
local pairs = pairs
local tonumber = tonumber
local now   = _commonservice.now
local string_format = string.format;
local curl_post = _httpservice.curl_post;
local curl_get = _httpservice.curl_get;
local hmac_sha1     = _commonservice.hmac_sha1;

-- global singleton
local CCenter			= RequireSingleton("CCenter")
local CDBService 		= RequireSingleton("CDBService")
local CRechargeService  = RequireSingleton("CRechargeService")
local CURL 				= RequireSingleton("CURL");
local CJSON 			= RequireSingleton("CJSON");

-- 每3分钟推送充值
local interval_nextsend = 180
-- 每1分钟执行循环(毫秒)
local interval_update = 60000
function CRechargeService:Initialize()
	self.m_tRechargeList = {}
	-- 虚拟充值
	self.m_tVirtualRechargeList = {}
	self.m_nIndex = 0;
	self.m_nInterval = interval_update
	local tRes = CDBService:SelectRechargeInfoByState()
	local tRes1 = CDBService:SelectVirtualRechargeInfoByState()
	local tRes2 = CDBService:SelectFromGlobalinfo()
	if tRes and tRes1 and tRes2 then
		local nNow = now(1)
		for _, info in ipairs(tRes) do
			local tInfo = {
				nServerID = tonumber(info.serverid),
				sRoleID = info.roleid,
				nCoin = tonumber(info.coins),
				sOrderID = info.orderid,
				nMoney = tonumber(info.moneys),
				nTime = nNow,
			}
			self.m_tRechargeList[info.orderid] = tInfo
		end
		for _, info in ipairs(tRes1) do
			local tInfo = {
				nServerID = tonumber(info.serverid),
				sRoleID = info.roleid,
				nOrderID = tonumber(info.orderid),
				nCoin = tonumber(info.coins),
				nMoney = tonumber(info.money),
				nTime = nNow,
			}
			self.m_tVirtualRechargeList[info.orderid] = tInfo
		end
		if tRes2[1] then
			self.m_nIndex = tRes2[1].rechargeserviceindex
		end
		return true
	end
end

function CRechargeService:Update(i_nDeltaMsec)
	self.m_nInterval = self.m_nInterval - i_nDeltaMsec
	if self.m_nInterval < 0 then
		self.m_nInterval = interval_update
		local nNow = now(1)
		for _, info in pairs(self.m_tRechargeList) do
			if nNow > info.nTime then
				info.nTime = info.nTime + interval_nextsend
				CCenter:Send("CT_Recharge", info.nServerID, info.sRoleID, info.nCoin, info.sOrderID, info.nMoney, info.tData)
				print("WARNING!!! recharge send again and reason by center or ks server closed.", info.nServerID, info.sRoleID, info.nCoin, info.sOrderID, info.nMoney)
			end
		end
		for _, info in pairs(self.m_tVirtualRechargeList) do
			if nNow > info.nTime then
				info.nTime = info.nTime + interval_nextsend
				CCenter:Send("CT_Recharge", info.nServerID, info.sRoleID, info.nCoin, info.nOrderID, info.nMoney, info.tData)
				print("WARNING!!! virtual_recharge send again and reason by center or ks server closed.", info.nServerID, info.sRoleID, info.nCoin, info.nOrderID, info.nMoney)
			end
		end
	end
end

function CRechargeService:AddCharge(i_tInfo)
	local bRes = CDBService:InsertChargeByRoleID(i_tInfo.sRoleID, i_tInfo.sRoleName, i_tInfo.sUid, i_tInfo.nServerID, i_tInfo.sOrderID, i_tInfo.nCoin, i_tInfo.nMoney, i_tInfo.nTime)
	if bRes then
		i_tInfo.nTime = i_tInfo.nTime + interval_nextsend
		CCenter:Send("CT_Recharge", i_tInfo.nServerID, i_tInfo.sRoleID, i_tInfo.nCoin, i_tInfo.sOrderID, i_tInfo.nMoney, i_tInfo.tData)
		self.m_tRechargeList[i_tInfo.sOrderID] = i_tInfo
		return true
	else
		print("ERROR!!! Insert recharge fail.", i_tInfo.sRoleID, i_tInfo.sRoleName, i_tInfo.sUid, i_tInfo.nServerID, i_tInfo.sOrderID, i_tInfo.nCoin, i_tInfo.nMoney, i_tInfo.nTime)
		return
	end
end

function CRechargeService:RechargeRes(i_sOrderID)
	if type(i_sOrderID) == "string" then
		if self.m_tRechargeList[i_sOrderID] then
			self.m_tRechargeList[i_sOrderID] = nil
			local bRes = CDBService:UpdateChargeStateByOrderid(i_sOrderID)
			if not bRes then
				print("ERROR!!! update recharge fail.", i_sOrderID)
			end
		else
			print("ERROR!!! center go back again by recharge and player got double gold.", i_sOrderID)
		end
	else
		if self.m_tVirtualRechargeList[i_sOrderID] then
			self.m_tVirtualRechargeList[i_sOrderID] = nil
			local bRes = CDBService:UpdateVirtualChargeStateByOrderid(i_sOrderID)
			if not bRes then
				print("ERROR!!! update virtual_recharge fail.", i_sOrderID)
			end
		else
			print("ERROR!!! center go back again by virtual_recharge and player got double gold.", i_sOrderID)
		end
	end
end

defineS.S_RechargeRes = function(i_sOrderID)
	CRechargeService:RechargeRes(i_sOrderID)
end

-- 增加虚拟充值
function CRechargeService:AddVirtualCharge(i_tInfo)
	local bRes = CDBService:InsertVirtualCharge(i_tInfo.nServerID, i_tInfo.sRoleID, i_tInfo.sRoleName, i_tInfo.sPfid, i_tInfo.nOrderID, i_tInfo.nCoin, i_tInfo.nMoney, i_tInfo.sOper, i_tInfo.nTime)
	if bRes then
		i_tInfo.nTime = i_tInfo.nTime + interval_nextsend
		CCenter:Send("CT_Recharge", i_tInfo.nServerID, i_tInfo.sRoleID, i_tInfo.nCoin, i_tInfo.nOrderID, i_tInfo.nMoney, i_tInfo.tData)
		self.m_tVirtualRechargeList[i_tInfo.nOrderID] = i_tInfo
		return true
	else
		print("ERROR!!! Insert virtual_recharge fail.", i_tInfo.nServerID, i_tInfo.sRoleID, i_tInfo.sRoleName, i_tInfo.sPfid, i_tInfo.nOrderID, i_tInfo.nMoney, i_tInfo.sOper, i_tInfo.nTime)
		return 
	end
end

function CRechargeService:GetNewIndex()
	local nNewIndex = self.m_nIndex
	self.m_nIndex = self.m_nIndex + 1
	if not CDBService:UpdateGlobalinfoRechargeServiceIndex(self.m_nIndex) then
		print("ERROR!!! Update RechargeServiceindex to Globalinfo fail", self.m_nIndex)
	end
	return nNewIndex
end


