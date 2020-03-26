
local print = print
local ipairs = ipairs
local tonumber = tonumber
local table_insert = table.insert

local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")

local function FindOldId(i_nNewID, i_tRes, i_tList)
	local tOldList = i_tList[i_nNewID]
	if tOldList then
		for _,nOldid in ipairs(tOldList) do
			table_insert(i_tRes, nOldid)
			FindOldId(nOldid, i_tRes, i_tList)
		end
	end
end

local function role_list(req, method, query, content)
    local resbody = {
        errno = 0,
        errmsg = "操作成功",
        data = {}
    } 
    
	local res = {}
    
    local res1, res2 = CDBService:Execute("select * from `old2new`")
    local tNew2Old = {}
    if res1 then
        for _, v in ipairs(res2) do
            tNew2Old[v.newid] = tNew2Old[v.newid] or {}
            table_insert(tNew2Old[v.newid], v.oldid)  
        end
    else
        print("ERROR!!! select from old2new err.")
    end
    
    local nServerID = tonumber(content.target.server_id)
    local tAllOldServerID = {nServerID}
    FindOldId(nServerID, tAllOldServerID, tNew2Old)
    print("--all--", table.concat(tAllOldServerID, "&"))
    
    local sKeyType = content.cmd.key_type
	local sKeyWord = content.cmd.key_word
	if sKeyType == "role_name" or sKeyType == "role_id" then
    
        local sKey
		if sKeyType == "role_name" then sKey = "rolename" end
		if sKeyType == "role_id" then sKey = "roleid" end
        
        for _, nOldServerID in ipairs(tAllOldServerID) do
            local res3 = CDBService:SelectLikeCharByServerID(nOldServerID, sKey, sKeyWord);
            if res3 then
                for _, v in ipairs(res3) do
                    table_insert(res, v)
                end
            end
        end
	elseif sKeyType == "ip" then
		res = CDBService:SelectOnlineCharByServerIDAndIP(nServerID, sKeyWord);
	else
        for _, nOldServerID in ipairs(tAllOldServerID) do
            local res3 = CDBService:SelectCharByServerIDAndAccount(nOldServerID, sKeyWord);
            if res3 then
                for _, v in ipairs(res3) do
                    table_insert(res, v)
                end
            end
        end
	end
    
    if res and #res > 0 then
        for _, v in ipairs(res) do
            local data = {
                account_id = v.pfid,
                role_id = v.roleid,
                role_name = v.rolename,
            }
            table_insert(resbody.data, data)
        end
    end
    return resbody
end


CHttpServer:RegisterHandler("/role_list", role_list)


