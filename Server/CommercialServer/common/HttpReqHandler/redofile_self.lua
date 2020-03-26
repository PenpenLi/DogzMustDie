
local CHttpServer = RequireSingleton("CHttpServer")

-- 自己热更代码
local function redofile_self(req, method, query, reqbody)
    if type(reqbody.filename) == "string" then
        print("LOG!!! redofile_self", pcall(function() dofile(reqbody.filename) end))
        return {
            ret = 0,
            msg = "OK.",
        }
    else
        return {
            ret = 11,
            msg = "ERROR.",
        }
    end
end

CHttpServer:RegisterHandler("/redofile_self", redofile_self)


