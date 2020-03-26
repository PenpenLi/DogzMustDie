
-- global function
local print = print
local exec	= _dbservice.execute
local now   = _commonservice.now
local string_format	= string.format
local string_gsub   = string.gsub

-- global singleton
local CDBService = RequireSingleton("CDBService")

function CDBService:Initialize()
	self:Connect()
        
	if self.m_pDBConn then
        return true
    else
        print("ERROR!!! db can not connect.")
        return false
    end
end

function CDBService:Connect()
	self.m_pDBConn = _dbservice.connect(ServerCfg.DBHost, ServerCfg.DBUser,
		ServerCfg.DBPassword, ServerCfg.DBName, ServerCfg.DBPort)
end

function CDBService:ConnectAndExecute(i_sSql)
    self:Connect()
    if self.m_pDBConn then
        local res1, res2 = exec(self.m_pDBConn, i_sSql)
        return res1, res2
    else
        print("ERROR!!! commercialdb mysql has gone away.", i_sSql)
    end
end

function CDBService:Execute(i_sSql)
    i_sSql = string_gsub(i_sSql, "\\", "\\\\")
    if self.m_pDBConn then
        local res1, res2 = exec(self.m_pDBConn, i_sSql)
        if not res1 and res2 == 2 then
            return self:ConnectAndExecute(i_sSql)
        else
            return res1, res2
        end
    else
        return self:ConnectAndExecute(i_sSql)
    end
end

local log_operation_str = "insert into `operation` set `ip` = '%s', `method` = '%s', `path` = '%s', `query` = '%s', `body` = '%s', `ts` = '%s'"
function CDBService:LogOperation(i_sIP, i_sMethod, i_sPath, i_sQuery, i_sBody)
	local strSql = string_format(log_operation_str, i_sIP, i_sMethod, i_sPath, i_sQuery, i_sBody, now(1))
	return self:Execute(strSql)
end

