
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local function get_consume(req, method, query, reqbody)
	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.skey), 
        {
            m_nIndex = nNewIndex,
            m_sOperName = "get_consume",
            m_nStart = tonumber(reqbody.start_time),
            m_nEnd = tonumber(reqbody.end_time),
            m_nMin = tonumber(reqbody.min_coins)
        } ) then
		CPlayerService:AddHttpReq(nNewIndex, req)
    else
        return {
            errno = -1,
            errmsg = "参数错误",
        }
    end
end

CHttpServer:RegisterHandler("/get_consume", get_consume)