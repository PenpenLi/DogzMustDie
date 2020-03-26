--global function
local type				= type
local pairs				= pairs
local ipairs			= ipairs
local print				= print
local pcall				= pcall
local table_insert		= table.insert
local now				= _commonservice.now

--local
local tName2Singleton	= {}
local tSingletonSet		= {}
local tUpdateSet		= {}


RegistSingleton = function(i_sSingletonName, i_bUpdate)
	if type(i_sSingletonName) == "string" then
		if tName2Singleton[i_sSingletonName] then
			print("ERROR!!! regist singleton repeat.", i_sSingletonName)
		else
			local singleton = {_name = i_sSingletonName}
			tName2Singleton[i_sSingletonName] = singleton
			table_insert(tSingletonSet, singleton)
			if i_bUpdate then
				table_insert(tUpdateSet, singleton)
			end
			return singleton
		end		
	else
		print("err!!! regist singleton type err!!!", i_sSingletonName)
		print(debug.traceback())
	end
end


RequireSingleton = function(i_sSingletonName, i_bIgnore)
	local oSingleton = tName2Singleton[i_sSingletonName]
	if not oSingleton and not i_bIgnore then
		print("err!!! require singleton err!!!", i_sSingletonName)
		print(debug.traceback())
	end
	return oSingleton
end


local nDestructIndex = nil
local nDestructOverIndex = nil
InitializeSingleton = function()
	math.randomseed(now(1))
	nDestructIndex = #tSingletonSet
	for k, v in ipairs(tSingletonSet) do
		local fInitialize = v.Initialize
		if fInitialize then
			-- print("InitializeSingleton", v._name)
			local res1, res2 = pcall(fInitialize, v)
			if res1 then
				if not res2 then
					print("InitializeSingleton Return False", v._name)
					return res2
				end
			else
				print("ERROR!!! InitializeSingleton", v._name, res2)
				return res1
			end
		end
	end
	return true
end


local lasttime = now()
local curtime = 0
UpdateSingleton = function()
	local curtime = now()
	local delta = curtime - lasttime
	lasttime = curtime
	for _, v in ipairs(tUpdateSet) do
		local res1, res2 = pcall(v.Update, v, delta)
		if not res1 then
			print("ERROR!!!", res2)
		end
	end
end


DayRefreshSingleton = function()
	for k, v in ipairs(tSingletonSet) do
		local OnDayRefresh = v.OnDayRefresh
		if OnDayRefresh then
			-- print("DayRefreshSingleton", v._name)
			local res1, res2 = pcall(OnDayRefresh, v)
			if not res1 then
				print("ERROR!!!", res2)
			end
		end
	end
end


DestructSingleton = function()
	-- print("------", nDestructIndex, nDestructOverIndex)
	if nDestructIndex then
		if nDestructIndex == 0 then return true end
		local singleton = tSingletonSet[nDestructIndex]
		local fDestruct = singleton.Destruct
		if fDestruct then
			print("DestructSingleton", singleton._name)
			local res1, res2 = pcall(fDestruct, singleton)
			if not res1 then
				print("ERROR!!!", res2)
			end
			nDestructOverIndex = nDestructIndex
			nDestructIndex = nil
		else
			nDestructIndex = nDestructIndex - 1
		end
	else
		local singleton = tSingletonSet[nDestructOverIndex]
		local fIsDestructOver = singleton.IsDestructOver
		local res = true
		if fIsDestructOver then
			local res1, res2 = pcall(fIsDestructOver, singleton)
			if res1 then
				res = res2
			else
				print("ERROR!!!", res2)
				res = true
			end
		end
		if res then
			nDestructIndex = nDestructOverIndex - 1
			nDestructOverIndex = nil
		end
	end
	return false
end



