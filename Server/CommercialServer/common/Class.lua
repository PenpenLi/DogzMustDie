-- global function
local type	= type
local print	= print
local pairs	= pairs
local ipairs= ipairs
local setmetatable		= setmetatable
local table_insert		= table.insert

--local
local fEmpty = function() end
local tClassS = {}

local registclass = function(i_sClassName)
	if type(i_sClassName) == "string" then
		if tClassS[i_sClassName] then
			print("err!!! class already exist!!!", i_sClassName)
			print(debug.traceback())
			return
		end
		local objClass = {}
		objClass._constructor	= fEmpty
		objClass.__index		= objClass
		tClassS[i_sClassName] = objClass
		return objClass
	else
		print("err!!! regist class name type err!!!", i_sClassName)
		print(debug.traceback())
	end
end

local requireclass = function(i_sClassName)
	local oClass = tClassS[i_sClassName]
	if not oClass then
		print("err!!! require class not exist!!!", i_sClassName)
		print(debug.traceback())
	end
	return oClass
end

local newclass = function(i_sClassName, ...)
	local oClass = requireclass(i_sClassName)
	if oClass then
		local object = {}
		setmetatable(object, oClass)
		object:_constructor(...)
		return object
	end
end

local inheritclass = function(i_sClassNameDerive, i_sClassNameBase)
	local object = registclass(i_sClassNameDerive)
	if object then
		local oClass = requireclass(i_sClassNameBase)
		if oClass then
			object._super = oClass
			setmetatable(object, oClass)
		end
		return object
	end
end

local findkey = function(object, key)
	local superlist = object._superlist
	return superlist[1][key] or superlist[2][key] or superlist[3][key] or superlist[4][key]
 	-- for _, super in ipairs(object._superlist) do
 	-- 	if super[key] then
 	-- 		return super[key]
 	-- 	end
 	-- end
end
local t = {__index = findkey}
local inheritclasses = function(i_sClassNameDerive, i_tClassNameBase)
	if #i_tClassNameBase == 0 then
		print("err!!! inheritclasses bases table is empty!!!")
		print(debug.traceback())
		return
	end
	local object = registclass(i_sClassNameDerive)
	if object then
		local superlist = {}
		for _, sClassNameBase in ipairs(i_tClassNameBase) do
			local oClass = requireclass(sClassNameBase)
			if oClass then
				table_insert(superlist, oClass)
			end
		end
		object._superlist = superlist
		setmetatable(object, t)
		return object
	end
end

RegistClass		= registclass
RequireClass	= requireclass
NewClass		= newclass
InheritClass	= inheritclass
InheritClasses	= inheritclasses


