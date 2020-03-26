
local table_insert = table.insert
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")
local now = _commonservice.now

local function role_info(req, method, query, content)
    local resbody
	local nServerId = content.target.server_id
	local roleid = content.target.role_id
	local sType = content.cmd.type
    local res = CDBService:SelectCharInfoByRoleId(roleid, sType)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {}
	}
	for sKeyType, tInfo in pairs(res) do
		if not resbody.data[sKeyType] then
			resbody.data[sKeyType] = {};
		end
		if #tInfo > 0 then
			local v = tInfo[1]
			local macres = CDBService:SelectLockMac(v.mac)
			local data = {
				["账号"] = v.pfid,
				["角色ID"] = v.roleid,
				["角色名"] = v.rolename,
				["等级"] = v.level,
				["职业"] = v.occupation,
				["战斗力"] = v.combat,
				["当前经验"] = v.exp,
				["升级所需经验"]= v.needexp,
				["绑定钻石"] = v.bindgold,
				["钻石"] = v.gold,
				["金币"] = v.coin,
				["充值金额"] = v.charge / 100,
				["VIP"] = v.vip,
				["封号"] = (now(1) >= v.banplaytime) and "否" or "是",
				["禁言"] = (now(1) >= v.banspeaktime) and "否" or "是",
				["所在地图"] = v.mapid,
				["角色创建时间"] = CCommonFunction.Sec2Calendar(v.createts, true),
				["在线总时长"] = v.loginlong,
				["是否在线"] = (v.online ==0) and "否" or "是",
				["登录IP"] = v.ip,
				["最后登录时间"] = CCommonFunction.Sec2Calendar(v.last_login, true),
				["最后离线时间"] = CCommonFunction.Sec2Calendar(v.last_logout, true),
				["上次登录MAC地址"] = v.mac,
				["当前MAC地址是否被封禁"] = (macres[1].count == 0) and "否" or "是",
			}
			resbody.data[sKeyType] = data;
		end
	end
    return resbody
end

CHttpServer:RegisterHandler("/role_info", role_info)


