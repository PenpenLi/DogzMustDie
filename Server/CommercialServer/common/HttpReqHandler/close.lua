
local CHttpServer   = RequireSingleton("CHttpServer")
local CSchedule     = RequireSingleton("CSchedule")

-- 关闭服务器
local function close(req, method, query, reqbody)
    local function f()
        _shutdown()
    end
    CSchedule:AddTask({}, nil, nil, 1, f, {})
    return {
        ret = 0,
        msg = "OK.",
    }
end

CHttpServer:RegisterHandler("/close", close)


