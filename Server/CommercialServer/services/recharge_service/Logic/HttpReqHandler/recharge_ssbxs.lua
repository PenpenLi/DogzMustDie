
local type = type
local now = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CRechargeService = RequireSingleton("CRechargeService")
local CURL = RequireSingleton("CURL")
local CJSON = RequireSingleton("CJSON")


--[[参数	描述
orderNo	游戏订单号
gyOrderNo	光宇订单号
uid	支付用户
money	支付金额
payResult	支付结果
commonParam	透传参数
timestamp	时间戳
signType	签名方式
sign	签名--]]



-- 平台返回状态
local function RetStatus(msg)
	local resbody = {
		status= msg;
	}
	return resbody;
end

local function recharge(req, method, query, reqbody)
 
	if not reqbody  then
		reqbody = CURL.Decode(query);
	end
	
	---联运正常充值流程
	local params = reqbody;
	if not params then
		return RetStatus("params is error！！！");
	end

	if params["payResult"] ~= "success" then
		return RetStatus("not pay！！！");
	end

	-- 额外参数
	local commonParam = params['commonParam'];
	if not commonParam then
		return RetStatus("commonParam params is error！！！");
	else
		params['commonParam'] = CJSON.Decode(params['commonParam']);
	end

	-- 订单号
	local orderNo = params['orderNo'];
	if not orderNo then
		return RetStatus("orderNo params is error！！！");
	end

	-- uid
	local uid = params['uid'];
	if not uid then
		return RetStatus("uid params is error！！！");
	end

	-- 时间戳
	local payTime = params['timestamp'];
	if not payTime then
		return RetStatus("payTime params is error！！！");
	end

	-- 服务器id
	local serverid = params['commonParam']['serverid'];
	if not serverid then
		return RetStatus("serverid params is error！！！");
	end

	-- 角色Id
	local gameRoleId = params['commonParam']["gameRoleId"];
	if not gameRoleId then
		return RetStatus("gameRoleId params is error！！！");
	end

	-- 支付金额
	local money = params['money'];
	if not money then
		return RetStatus("money params is error！！！");
	end

	-- 角色名字
	local gameRoleName = params['commonParam']["gameRoleName"];
	if not gameRoleName then
		return RetStatus("gameRoleName params is error！！！");
	end

	local res = CDBService:SelectgameRoleIdByPfIDAndServerID(uid, serverid);
	if not res then
		return RetStatus("role is not exsit！！！");
	end

	if res[1] then
		local nTime = now(1)
		res = res[1]
		local res1 = CDBService:SelectgameRoleIdByOrderID(orderNo);
		if res1 and res1[1] then
			return RetStatus("repeat order!!!");
		else
			local tParams = {
				nServerID = serverid,
				sgameRoleId = gameRoleId,
				nCoin = money,
				sOrderID = orderNo,
				nMoney = money,
				nTime = payTime,
				sgameRoleName = gameRoleName,
				sUid = uid,
				tData = commonParam
			}
			-- 充值
			local bRes = CRechargeService:AddCharge(tParams);
			if bRes then
				return RetStatus("success！！！");
			else
				return RetStatus("failed！！！");
			end
		end
	else
		return RetStatus("role is not exsit！！！");
	end
end

CHttpServer:RegisterHandler("/recharge_ssbxs", recharge)