
local print = print
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CDBService	  = RequireSingleton("CDBService")

local function set_welfare(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	local nServerID = tonumber(reqbody.target.server_id)
	local nType = tonumber(reqbody.cmd.type)
	local sRoleID = reqbody.target.role_id
	local nOper = reqbody.track.oper
	local nTs = reqbody.track.ts
	local res = CDBService:SelectCharByRoleID(sRoleID)
    if res and res[1] then
        local res = res[1]
		if nType == 2 then
			local resWelfare = CDBService:SelectWelfareByRoleID(sRoleID)
			if resWelfare and resWelfare[1] then
				if not CDBService:DeleteWelfare(sRoleID) then
					print("ERROR!!! Delete Welfare fail.", nServerID, sRoleID)
				end
			else
				resbody = {
					errno = -2,
					errmsg = "不是福利账号",
					data = {},
				}
			end
		else
			local resWelfare = CDBService:SelectWelfareByRoleID(sRoleID)
			if resWelfare and resWelfare[1] then
			else
				local nLimit = 3
				if nType == 3 then
					nLimit = 100000;
				end
				local resCount = CDBService:SelectWelfareCountByPfID(nServerID)
				if resCount and resCount[1] and resCount[1].count < nLimit then
					local tData = {
						serverid = nServerID,
						pfid = res.pfid,
						roleid = res.roleid,
						rolename = res.rolename,
						oper = nOper,
						ts = nTs,
					}
					if not CDBService:InsertWelfare(tData) then
						print("ERROR!!! Insert Welfare fail.", nServerID, tData.roleid, tData.rolename)
					end
				else
					resbody = {
						errno = -3,
						errmsg = "账号数量到达上限",
						data = {},
					}
				end
			end
		end
	else
		resbody = {
			errno = -1,
			errmsg = "角色不存在",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/set_welfare", set_welfare)


