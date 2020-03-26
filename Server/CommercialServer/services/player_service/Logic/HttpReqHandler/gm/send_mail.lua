
local ipairs = ipairs
local pairs = pairs
local tonumber = tonumber
local string_gmatch = string.gmatch
local table_insert = table.insert
local CCenter	  = RequireSingleton("CCenter")
local CHttpServer = RequireSingleton("CHttpServer")
local CDBService  = RequireSingleton("CDBService")
local CJSON	      = RequireSingleton("CJSON")
local CCommonFunction = RequireSingleton("CCommonFunction");

local function send_mail(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "发送运营邮件成功",
    }
    -- items结构拦截
    local bErr = false
    local tbItems = { }
    for _, item in ipairs(reqbody.items) do
        item.itemid = item.itemid
        item.itemnum = tonumber(item.itemnum)
        table.insert(tbItems,{item.itemid,item.itemnum})
        if not item.itemid or not item.itemnum then
            bErr = true
            break
        end
    end

    if bErr then
        resbody.ret = 16
        resbody.msg = "发送运营邮件请求items结构不对"
    else
        if #reqbody.roleids == 0 or reqbody.roleids[1] == "" then
            CCenter:Send("CT_SendMail", 
					"", 
					reqbody.title, 
					reqbody.content, 
					tbItems, 
					false,
					reqbody.serverid
					)
        else
            for _, v in ipairs(reqbody.roleids) do
            	CCenter:Send("CT_SendMail", 
					v, 
					reqbody.title, 
					reqbody.content, 
					tbItems, 
					false)                
            end
        end
    end
    -- CDBService:InsertAdminLog(reqbody.track.oper, reqbody.target.server_id, reqbody.cmd.name, reqbody.track.ts, CJSON.Encode(reqbody, true), resbody.errno, resbody.errmsg)
    return resbody
end

CHttpServer:RegisterHandler("/send_mail", send_mail)
CHttpServer:RegisterHandler("/rebate_mail", send_mail)


