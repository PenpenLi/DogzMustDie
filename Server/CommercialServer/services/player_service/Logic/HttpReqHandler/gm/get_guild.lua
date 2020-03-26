
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local function get_guild(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {},
	}
	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.target.server_id), {m_nIndex = nNewIndex, m_sOperName = "get_guild", m_sGuildID = reqbody.cmd.guild_id}) then
		CPlayerService:AddHttpReq(nNewIndex, req);
		return
	else
		resbody = {
			errno = -1,
			errmsg = "操作失败",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/get_guild", get_guild)


