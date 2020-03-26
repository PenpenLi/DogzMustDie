
local tonumber = tonumber
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CDBService	  = RequireSingleton("CDBService")

local function get_always_notice(req, method, query, reqbody)
	local resbody = {
		errno = 0,
		errmsg = "操作成功",
		data = {
			["content"] = "",
			["link"] = "",
			["link_name"] = "",
		}
	}
	local nServerID = tonumber(reqbody.target.server_id)
	local tRes = CDBService:SelectAlwaysNoticeByServerID(nServerID);
	if tRes then
		if tRes[1] then
			tRes = tRes[1]
			resbody.data = {
				["content"] = tRes.content,
				["link"] = tRes.link,
				["link_name"] = tRes.linkname,
			}
		end
	else
		resbody = {
			errno = -1,
			errmsg = "操作失败",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/get_always_notice", get_always_notice)


