
local tonumber = tonumber
local tostring = tostring
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")
local CCommonFunction = RequireSingleton("CCommonFunction")

local function guild_destory_duowan(req, method, query, reqbody)
	local resbody = {
		status = 200,
		message = "操作成功",
		data = {},
	}
    if not CCommonFunction.IsSecInRangeTime(reqbody.time, 5*60) then
        resbody.status = 300;
        resbody.message = "超时";
        return resbody;
    end
    if not reqbody.server or not reqbody.guildId then
        resbody.status = 302;
        resbody.message = "参数错误";
        return resbody;
    end

	local nNewIndex = CPlayerService:GetNewIndex()
	if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.server), {m_nIndex = nNewIndex, m_sOperName = "yy_guild_destory",
        m_sGuildId = tostring(reqbody.guildId)}) then
		CPlayerService:AddHttpReq(nNewIndex, req);
		return
	else
		resbody = {
			status = -1,
			message = "操作失败",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/guild_destory_duowan", guild_destory_duowan)


