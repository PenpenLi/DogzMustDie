
local type = type
local tonumber = tonumber
local string_match = string.match
local math_floor = math.floor
local now = _commonservice.now
local CHttpServer = RequireSingleton("CHttpServer")
local CCenter     = RequireSingleton("CCenter")
local CDBService  = RequireSingleton("CDBService")
local CJSON       = RequireSingleton("CJSON")
local Calendar2Msec = RequireSingleton("CCommonFunction").Calendar2Msec
-- 广播公告
local function get_ymdhms(str)
    local year, month, day, hour, minute, second = string_match(str, "(%d+)/(%d+)/(%d+) (%d+):(%d+):(%d+)")
    return tonumber(year), tonumber(month), tonumber(day), tonumber(hour), tonumber(minute), tonumber(second)
end
local function notice(req, method, query, reqbody)
    local resbody = {
        ret = 0,
        msg = "发送公告成功",
    } 
    repeat
        if type(reqbody.msg) ~= "string" then
            resbody.ret = 11
            resbody.msg = "广播请求的msg不是字符串"
            break
        end
        
        if type(reqbody.start_time) ~= "string" then
            resbody.ret = 12
            resbody.msg = "广播请求的start_time不是字符串"
            break
        end
        local year, month, day, hour, minute, second = get_ymdhms(reqbody.start_time)
        if not year or not month or not day or not hour or not minute or not second then
            resbody.ret = 13
            resbody.msg = "广播请求的start_time格式不对"
            break
        end
        local start_time_msec = Calendar2Msec(year, month, day, hour, minute, second)
        
        if type(reqbody.end_time) ~= "string" then
            resbody.ret = 14
            resbody.msg = "广播请求的end_time不是字符串"
            break
        end
        year, month, day, hour, minute, second = get_ymdhms(reqbody.end_time)
        if not year or not month or not day or not hour or not minute or not second then
            resbody.ret = 15
            resbody.msg = "广播请求的end_time格式不对"
            break
        end
        local end_time_msec = Calendar2Msec(year, month, day, hour, minute, second)
        if end_time_msec < now() then
            resbody.ret = 16
            resbody.msg = "广播请求的end_time已过"
            break
        end
        
        reqbody.interval = tonumber(reqbody.interval)
        if type(reqbody.interval) ~= "number" then
            resbody.ret = 17
            resbody.msg = "广播请求的interval不是数字"
            break
        end
        reqbody.interval = math_floor(reqbody.interval)
        if reqbody.interval <= 0 then
            resbody.ret = 18
            resbody.msg = "广播请求的interval <= 0"
            break
        end
        
        reqbody.number = tonumber(reqbody.number)
        if type(reqbody.number) ~= "number" then
            resbody.ret = 19
            resbody.msg = "广播请求的interval不是数字"
            break
        end
        reqbody.number = math_floor(reqbody.number)
        if reqbody.number < 0 then
            resbody.ret = 20
            resbody.msg = "广播请求的number < 0"
            break
        end
        
        reqbody.position = tonumber(reqbody.position)
        if type(reqbody.position) ~= "number" then
            resbody.ret = 21
            resbody.msg = "广播请求的interval不是数字"
            break
        end
        reqbody.position = math_floor(reqbody.position)
        if reqbody.position ~= 1 and reqbody.position ~= 2 and reqbody.position ~= 3 then
            resbody.ret = 22
            resbody.msg = "广播请求的position无效"
            break
        end
        CCenter:Send("CT_NoticeNew", reqbody.serverid, reqbody.msg, start_time_msec, end_time_msec,
            reqbody.interval, reqbody.number, reqbody.position)
        -- local taskid = CKSManager:Notice(reqbody.serverid, reqbody.msg, 
        --     start_time_msec, end_time_msec,
        --     reqbody.interval, reqbody.number, reqbody.position)
--[[        if not taskid then
            resbody.ret = 23
            resbody.msg = "广播请求定时器设置失败"
            break
        end--]]
        resbody.taskid = 1
    until true
    return resbody
end

CHttpServer:RegisterHandler("/notice", notice)


