
local type = type
local tonumber = tonumber
local now   = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CRechargeService = RequireSingleton("CRechargeService")

local function virtual_recharge(req, method, query, reqbody)
    local resbody
	local nServerID = tonumber(reqbody.target.server_id)
	local res = CDBService:SelectCharInfoByRoleId(nServerID, reqbody.target.role_id)
    if res then
		if res[1] then
			local nTime = now(1)
			res = res[1]
			local tInfo = {
				nServerID = nServerID,
				sRoleID = res.roleid,
				nMoney = tonumber(reqbody.cmd.money) * 100,	-- 单位元
				nTime = nTime,
				sRoleName = res.rolename,
				sPfid = res.pfid,
				sOper = reqbody.track.oper,
				nCoin = tonumber(reqbody.cmd.money) * 10,
				nOrderID = CRechargeService:GetNewIndex(),
			}
			local bRes = CRechargeService:AddVirtualCharge(tInfo)
			if bRes then
				resbody = {
					errno = 0,
					errmsg = "充值成功",
					data = {
							order = tInfo.nOrderID,
							account_id = res.pfid,
							role_id = tInfo.sRoleID,
							role_name = tInfo.sRoleName,
							money = reqbody.cmd.money,
							oper = reqbody.track.oper,
							oper_time = nTime,
						},
					}
			else
				resbody = {
					errno = -6,
					errmsg = "数据库插入失败",
					data = reqbody,
				}
			end
		else
			resbody = {
				errno = -3,
				errmsg = "用户不存在",
				data = reqbody,
			}
		end
	else
		resbody = {
			errno = -5,
			errmsg = "数据库查询失败",
			data = reqbody,
		}
    end
	
    return resbody
end

CHttpServer:RegisterHandler("/virtual_recharge", virtual_recharge)