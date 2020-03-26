
-- global function
local print = print
local now   = _commonservice.now
local string_format	= string.format

-- global singleton
local CCommonFunction = RequireSingleton("CCommonFunction")
local CDBService = RequireSingleton("CDBService")

local select_old2new_str = "select * from `old2new`"
function CDBService:SelectOld2New()
    local res1, res2 = self:Execute(select_old2new_str)
    if res1 then
        return res2
    else
        return nil
    end
end

local insert_old2new_str = "insert into `old2new` values(%d, %d)"
function CDBService:InsertOld2New(i_nOldID, i_nNewID)
    local res1, res2 = self:Execute(string_format(insert_old2new_str, i_nOldID, i_nNewID))
    return res1
end

local log_server_crash_str = "insert into `server_crash_log` set `serverid` = '%s', `time` = '%s'"
function CDBService:LogServerCrash(i_nServerID)
    self:Execute(string_format(log_server_crash_str, i_nServerID, CCommonFunction.Sec2Calendar(now(1), true)))
end


