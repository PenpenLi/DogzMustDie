
local table_insert = table.insert
local tonumber = tonumber
local now   = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CRechargeService = RequireSingleton("CRechargeService")

local function virtual_recharge_list(req, method, query, reqbody)
    local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	local nServerID = tonumber(reqbody.target.server_id)
	local res = CDBService:SelectVirtualRechargeInfoByTime(nServerID, tonumber(reqbody.cmd.start_time), tonumber(reqbody.cmd.end_time))
    if res then
		for _, v in ipairs(res) do
            local tData = {
                order = v.orderid,
                account_id = v.pfid,
				role_id = v.roleid,
				role_name = v.rolename,
				money = v.money / 100,
				oper = v.oper,
				oper_time = v.ts
            }
            table_insert(resbody.data, tData)
        end
	else
		resbody = {
			errno = -1,
			errmsg = "数据库查询失败",
			data = reqbody,
		}
    end
	
    return resbody
end

CHttpServer:RegisterHandler("/virtual_recharge_list", virtual_recharge_list)