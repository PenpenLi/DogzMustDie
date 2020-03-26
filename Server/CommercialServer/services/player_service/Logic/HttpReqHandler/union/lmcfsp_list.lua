
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")

local valid = { -- 后面的数字就是排行榜类型枚举
    ["level"] = 1,
    ["fighting"] = 2,
    ["steeds"] = 15,
    ["pets"] = 16,
}
local function lmcfsp_list(req, method, query, reqbody)
    if valid[reqbody.type] then
        local nNewIndex = CPlayerService:GetNewIndex()
        if CCenter:Send("CT_PlayerServiceCall", tonumber(reqbody.skey),
            {
                m_nIndex = nNewIndex,
                m_sOperName = "lmcfsp_list", 
                m_nType = valid[reqbody.type],
                m_nStart = tonumber(reqbody.start),
                m_nEnd = tonumber(reqbody["end"])
            } ) then
            CPlayerService:AddHttpReq(nNewIndex, req)
        else
            return {
                errno = -3,
                errmsg = "查询失败",
            }
        end
    else
        return {
            errno = -1,
            errmsg = "参数错误",
        }
    end
end

CHttpServer:RegisterHandler("/lmcfsp_list", lmcfsp_list)