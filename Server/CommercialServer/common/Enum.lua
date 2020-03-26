
-- global function
local type	= type
local print	= print
local debug_traceback = debug.traceback
-- local
local tEnumS = {}

local registenum =  function(i_sEnumName, i_tEnum)
	if type(i_sEnumName) == "string" then
		if tEnumS[i_sEnumName] then
			print("err!!! enum already exist!!!", i_sEnumName)
			print(debug_traceback())
			return
		end
		tEnumS[i_sEnumName] = i_tEnum
	else
		print("err!!! regist enum name type err!!!", i_sEnumName)
		print(debug_traceback())
	end
end


local requireenum = function(i_sEnumName)
	local tEnum = tEnumS[i_sEnumName]
	if not tEnum then
		print("err!!! require enum not exist!!!", i_sEnumName)
		print(debug_traceback())
	end
	return tEnum
end

RegistEnum	= registenum
RequireEnum	= requireenum


