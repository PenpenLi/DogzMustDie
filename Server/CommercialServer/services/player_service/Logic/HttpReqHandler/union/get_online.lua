
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local function get_online(req, method, query, reqbody)
	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.skey), {m_nIndex = nNewIndex, m_sOperName = "get_online"}) then
		CPlayerService:AddHttpReq(nNewIndex, req);
    else
        return {
            errno = -1,
            errmsg = "参数错误",
        }
    end
end

CHttpServer:RegisterHandler("/get_online", get_online)