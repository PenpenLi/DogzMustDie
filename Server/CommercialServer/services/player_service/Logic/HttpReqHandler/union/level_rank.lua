
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local function level_rank(req, method, query, reqbody)
    local num = tonumber(reqbody.total)
    if num == 0 then
        num = 10
    end
	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.skey), 
        {
            m_nIndex = nNewIndex,
            m_sOperName = "level_rank",
            m_nNum = num
        } ) then
		CPlayerService:AddHttpReq(nNewIndex, req)
    else
        return {
            errno = -3,
            errmsg = "查询失败",
        }
    end
end

CHttpServer:RegisterHandler("/level_rank", level_rank)