
local tonumber = tonumber
local table_insert = table.insert;
local CHttpServer 	  = RequireSingleton("CHttpServer")
local CCenter		  = RequireSingleton("CCenter")
local CPlayerService  = RequireSingleton("CPlayerService")
local CCommonFunction = RequireSingleton("CCommonFunction")
local CDBService = RequireSingleton("CDBService")
local CJSON = RequireSingleton("CJSON")

local function guild_getchargeinfo_duowan(req, method, query, reqbody)
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
    if not reqbody.page or not reqbody.start or not reqbody.End then
        resbody.status = 302;
        resbody.message = "参数错误";
        return resbody;
    end

    local res = CDBService:SelectChargeInfoByTime(reqbody.start, reqbody.End);
	if res then
        resbody.data = {
            ["total"] = #res,
            ["pageSize"] = math.ceil(#res / 10),
            ["curPage"] = reqbody.page,
            ["content"] = {};
        }
        for i=(reqbody.page-1)*10+1, reqbody.page*10 do
            if not res[i] then break; end;
            local t = {
                ["server"] = res[i].serverid,
                ["account"] = res[i].pfid,
                ["rmb"] = res[i].moneys / 100,
                ["roleId"] = res[i].roleid,
                ["roleName"] = res[i].rolename,
                ["guildId"] = "",
                ["guildName"] = "",
            }
            table_insert(resbody.data.content, t)
        end
        return CJSON.Encode(resbody, true);
	else
		resbody = {
			status = -1,
			message = "操作失败",
			data = {},
		}
	end
    return resbody
end

CHttpServer:RegisterHandler("/guild_getchargeinfo_duowan", guild_getchargeinfo_duowan)


