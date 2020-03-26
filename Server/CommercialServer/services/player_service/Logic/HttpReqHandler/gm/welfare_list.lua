
local print = print
local ipairs = ipairs
local tonumber = tonumber
local now = _commonservice.now
local table_insert = table.insert
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CDBService	  = RequireSingleton("CDBService")

local function FindOldId(i_nNewID, i_tRes, i_tList)
	local tOldList = i_tList[i_nNewID]
	if tOldList then
		for _,nOldid in ipairs(tOldList) do
			table_insert(i_tRes, nOldid)
			FindOldId(nOldid, i_tRes, i_tList)
		end
	end
end

local function welfare_list(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	local nServerID = tonumber(reqbody.target.server_id)
	local tDBList = {}
	local res
	local res1, res2 = CDBService:Execute("select * from `old2new`")	
    if res1 then
        for _, v in ipairs(res2) do
            tDBList[v.oldid] = v.newid
        end
    else
        print("ERROR!!! select from old2new err.")
		resbody = {
			errno = -1,
			errmsg = "操作失败",
			data = {},
		}
		return resbody
    end
	local tAllOldServerID = {nServerID}
	local tNew2old = {}
	for nOldID, nNewId in pairs(tDBList) do
		tNew2old[nNewId] = tNew2old[nNewId] or {}
		table_insert(tNew2old[nNewId], nOldID)
	end
	FindOldId(nServerID, tAllOldServerID, tNew2old)
	
	for _, nOldServerID in ipairs(tAllOldServerID) do
		local res = CDBService:SelectWelfareByServerID(nOldServerID)
		if res then
			for _, info in pairs(res) do
				local res1 = CDBService:SelectCharByRoleID(info.roleid)
				if res1 and res1[1] then
					res1 = res1[1]
					table_insert(resbody.data, {
						account_id = info.pfid,
						role_id = info.roleid,
						role_name = info.rolename,
						login_time = res1.last_login,
						lock_player = (res1.banplaytime > now(1)) and 1 or 0,
						oper = info.oper,
						oper_time = info.ts,
					})
				end
			end
		end
	end
    return resbody
end

CHttpServer:RegisterHandler("/welfare_list", welfare_list)


