
dofile("./Logic/include.lua")

-- rpc
-- function OnRpc(i_nFromID, i_pDataPtr, i_nDataLen, i_pAppendDataPtr, i_nAppendDataLen)
-- end

-- start
function OnStart()
	print("Master Start...")
	return InitializeSingleton()
end
-- loop
local UpdateSingleton = UpdateSingleton
function OnLoop()
	UpdateSingleton()
end
-- shutdown
local DestructSingleton = DestructSingleton
local bPrint
function OnShutdown()
	if not bPrint then
		bPrint = true
		print("Master shutdown...")
	end
	return DestructSingleton()
end

setmetatable(_G, {__newindex = function(t, k, v)
				assert(false, "ERROR!!!, Write to _G." .. k)
				end})

                
                