
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local function login_stat(req, method, query, reqbody)
	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.skey), {m_nIndex = nNewIndex, m_sOperName = "login_stat", m_nDate = tonumber(reqbody.date)}) then
		CPlayerService:AddHttpReq(nNewIndex, req);
    else
        return {
            errno = -1,
            errmsg = "参数错误",
        }
    end
end

CHttpServer:RegisterHandler("/login_stat", login_stat)