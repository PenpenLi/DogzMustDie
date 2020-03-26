local table_insert = table.insert
local string_gmatch = string.gmatch
local string_match = string.match
local string_format = string.format
local math_ceil = math.ceil
local tonumber = tonumber
local now = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService = RequireSingleton("CDBService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function get_player(req, method, query, reqbody)
    local nType = tonumber(reqbody.type)
    
    -- get time
    local nStartTime, nOverTime
    if reqbody.date then
        local nYear, nMonth, nDay = string_match(reqbody.date, "(%d+)-(%d+)-(%d+)")
        if nYear then
            if nType == 1 then
                nStartTime = CCommonFunction.Calendar2Sec(tonumber(nYear), tonumber(nMonth), tonumber(nDay), 0, 0, 0)
            elseif nType == 2 then
                nStartTime = tonumber(nYear) * 10000 + tonumber(nMonth) * 100 + tonumber(nDay)
            end
        end
    end
	if nType == 1 then
        if not nStartTime then
            nStartTime = CCommonFunction.GetTodayStartSec()
        end
        nOverTime = nStartTime + 86400
    elseif nType == 2 then
        if not nStartTime then
            local nYear, nMonth, nDay = CCommonFunction.Sec2Calendar(now(1))
            nStartTime = nYear * 10000 + nMonth * 100 + nDay
        end
    end
    
    -- get page
    local nLimitStart
	local nLimitNum = tonumber(reqbody.limit)
	if nLimitNum then
        nLimitStart = ((tonumber(reqbody.page) or 1) - 1) * nLimitNum
	end
    
    local count
	local res
    local nServerId = reqbody.server_id
	if nType == 1 then
        local sqlstr = "select count(*) as cnt from `characters` where `serverid` = %d and `createts` >= %d and `createts` <= %d;"
        local res1, res2 = CDBService:Execute(string_format(sqlstr, nServerId, nStartTime, nOverTime))
        if res1 then
            count = res2[1].cnt
        end
		if nLimitStart then
			res = CDBService:SelectCharByServerIDAndCreatesLimit(nServerId, nStartTime, nOverTime, nLimitStart, nLimitNum)
		else
            res = CDBService:SelectCharByServerIDAndCreates(nServerId, nStartTime, nOverTime)
		end
	elseif nType == 2 then
        local sqlstr = "select count(*) as cnt from `login_record` where `serverid` = '%d' and `logindate` = '%d';"
        local res1, res2 = CDBService:Execute(string_format(sqlstr, nServerId, nStartTime))
        if res1 then
            count = res2[1].cnt
        end
		if nLimitStart then
			res = CDBService:SelectCharByServerIDAndLoginLimit(nServerId, nStartTime, nLimitStart, nLimitNum)
		else
            res = CDBService:SelectCharByServerIDAndLogin(nServerId, nStartTime)
		end
	end
    local totalPage = nLimitNum and math_ceil(count / nLimitNum) or 1
	local resbody = {
        success = true,
        data = {
            total = count,
            totalPage = totalPage,
            userList = {}
        },
        message = "成功",
    }
	if res and #res > 0 then
        local userList = resbody.data.userList
        if nType == 1 then
            for _, v in ipairs(res) do
                userList[v.pfid] = {
                    roleName =  v.rolename,
                    roleLevel = v.level,
                    createTime = CCommonFunction.Sec2Calendar(v.createts, true),
                }		
            end
        elseif nType == 2 then
            for _, v in ipairs(res) do
                userList[v.pfid] = {
                    roleName =  v.rolename,
                    roleLevel = v.level,
                    createTime = CCommonFunction.Sec2Calendar(v.ts, true),
                }		
            end
        end
	end

	return resbody
end


CHttpServer:RegisterHandler("/get_player", get_player)