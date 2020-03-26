
local type = type
local now = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CRechargeService = RequireSingleton("CRechargeService")
local CURL = RequireSingleton("CURL")
local CJSON = RequireSingleton("CJSON")

-- 参数				参数名称		类型			说明
-- userId			用户ID			Long			百度用户ID
-- orderId			订单ID			Long			百度平台订单ID
-- unitPrice		单价			Integer			单位：分
-- count			数量			Integer			数量
-- totalMoney		总金额			Integer			订单的实际金额，单位：分
-- payMoney			实付金额		Integer			扣除各种优惠后用户还需要支付的金额，单位：分
-- promoMoney		营销金额		Integer			营销优惠金额
-- hbMoney			红包支付金额	Integer			红包支付金额
-- hbBalanceMoney	余额支付金额	Integer			余额支付金额
-- giftCardMoney	抵用券金额		Integer			抵用券金额
-- dealId			百度收银台凭证	Long			百度收银台的财务结算凭证
-- payTime			支付时间		Integer			支付完成时间，时间戳
-- promoDetail		促销详情		Object			订单参与的促销优惠的详细信息
-- payType			支付渠道		Integer			支付渠道值
-- partnerId		支付平台		Integer			支付平台标识值
-- status			订单支付状态	Integer			1：未支付；2：已支付；-1：订单取消
-- tpOrderId		业务方订单号	String			业务方唯一订单号
-- returnData		业务方透传数据	Object			业务方下单时传入的数据
-- rsaSign			rsa签名	String	rsa签名字符串	全部参数参与签名，详见签名与验签

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
	-----运营后台的模拟充值
	if reqbody.payType and reqbody.payType == "GM" then
		local commonParam = { }
		commonParam.goodsType = reqbody.goodsType
		commonParam.goodsId = reqbody.goodsId
		local tInfo = {
			nServerID = reqbody.serverid,
			sRoleID = reqbody.roleid,
			nCoin = reqbody.money * 10,
			sOrderID = "gm_operator",
			nMoney = reqbody.money,
			nTime = now(1),
			sRoleName = reqbody.rolename,
			sUid = reqbody.uid,
			tData = commonParam
		}
		-- 充值
		local bRes = CRechargeService:AddCharge(tInfo);
		local resbody
		if bRes then
			-- 充值成功
			resbody = {
				ret= 0;
			};
		else
			-- 充值失败
			resbody = {
				ret= 1;
			};
		end;
		return resbody
	end
	---正常充值流程
	local params = reqbody;
	if not params then
		return RetStatus("params is error！！！");
	end

	if params["status"] ~= "2" then
		return RetStatus("not pay！！！");
	end

	-- 额外参数
	local returnData = params['returnData'];
	if not returnData then
		return RetStatus("returnData params is error！！！");
	else
		params['returnData'] = CJSON.Decode(params['returnData']);
	end

	-- 订单号
	local tpOrderId = params['tpOrderId'];
	if not tpOrderId then
		return RetStatus("tpOrderId params is error！！！");
	end

	-- openid
	local openid = params['returnData']['openid'];
	if not openid then
		return RetStatus("openid params is error！！！");
	end

	-- 时间戳
	local payTime = params['payTime'];
	if not payTime then
		return RetStatus("payTime params is error！！！");
	end

	-- 服务器id
	local serverid = params['returnData']['serverid'];
	if not serverid then
		return RetStatus("serverid params is error！！！");
	end

	-- 角色Id
	local roleid = params['returnData']["roleid"];
	if not roleid then
		return RetStatus("roleid params is error！！！");
	end

	-- 支付金额
	local totalMoney = params['totalMoney'] / 100;
	if not totalMoney then
		return RetStatus("totalMoney params is error！！！");
	end

	-- 角色名字
	local rolename = params['returnData']["rolename"];
	if not rolename then
		return RetStatus("rolename params is error！！！");
	end

	local res = CDBService:SelectRoleIDByPfIDAndServerID(openid, serverid);
	if not res then
		return RetStatus("role is not exsit！！！");
	end

	if res[1] then
		local nTime = now(1)
		res = res[1]
		local res1 = CDBService:SelectRoleIDByOrderID(tpOrderId);
		if res1 and res1[1] then
			return RetStatus("repeat order!!!");
		else
			local tParams = {
				nServerID = serverid,
				sRoleID = roleid,
				nCoin = totalMoney * 10,
				sOrderID = tpOrderId,
				nMoney = totalMoney,
				nTime = payTime,
				sRoleName = rolename,
				sUid = openid,
				tData = returnData
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

CHttpServer:RegisterHandler("/recharge", recharge)