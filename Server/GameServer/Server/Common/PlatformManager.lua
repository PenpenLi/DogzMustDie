-- 平台管理器
local Platform = ServerInfo.Platform
local CPlatformManager = RequireSingleton("CPlatformManager")
-- 平台枚举
local PlatformEnum = {
	["duowanclouds"] = 1,	-- 多玩
	["swjoy"]       = 2,	-- 顺网
	["sogou"] 		= 3,	-- 搜狗
	["feihuo"] 		= 4,	-- 飞火
	["xunlei"] 		= 5,	-- 迅雷
	["youzu"] 		= 6,	-- 游族
	["37wan"] 	    = 7,	-- 37wan
	["51"] 		    = 8,	-- 51
	["9377"] 		= 9,	-- 9377
	["game2"] 		= 10,	-- G2
	["2217"] 		= 11,	-- 2217
	["2144"] 		= 12,	-- 2144
	["pps"] 		= 13,	-- PPS
	["youxi"] 		= 14,	-- 360游戏
	["wan"]		    = 15,	-- 360wan
	["602"]			= 16,	-- 602
	["yilewan"]		= 17,	-- yilewan
	["17kxgame"]		= 18,	-- 酷狗
}
local PfIndex = PlatformEnum[ServerInfo.Platform] or 0
-- 获取平台枚举
CPlatformManager.GetIndex = function ()
	return PfIndex
end
-- 是否多玩平台
CPlatformManager.IsDuowan = function ()
	return PfIndex == PlatformEnum["duowanclouds"]
end

--	是否游戏平台
CPlatformManager.IsYouXi = function ()
	return PfIndex == PlatformEnum["youxi"]
end

--	是否wan平台
CPlatformManager.IsWan = function ()
	return PfIndex == PlatformEnum["wan"]
end

--	是否顺网平台
CPlatformManager.IsSW = function ()
	return PfIndex == PlatformEnum["swjoy"]
end

--	是否37wan平台
CPlatformManager.Is37wan = function ()
	return PfIndex == PlatformEnum["37wan"]
end

--	是否搜狗平台
CPlatformManager.IsSougou = function ()
	return PfIndex == PlatformEnum["sogou"]
end

--	是否飞火平台
CPlatformManager.IsFeihuo = function ()
	return PfIndex == PlatformEnum["feihuo"]
end

--	是否2144平台
CPlatformManager.Is2144 = function ()
	return PfIndex == PlatformEnum["2144"]
end

--	是否PPS平台
CPlatformManager.IsPPS = function ()
	return PfIndex == PlatformEnum["pps"]
end

--	是否迅雷平台
CPlatformManager.IsXunlei = function ()
	return PfIndex == PlatformEnum["xunlei"]
end

--	是否602平台
CPlatformManager.Is602 = function ()
	return PfIndex == PlatformEnum["602"]
end

--	是否2217平台
CPlatformManager.Is2217 = function ()
	return PfIndex == PlatformEnum["2217"]
end

--	是否易乐玩平台
CPlatformManager.IsYilewan = function ()
	return PfIndex == PlatformEnum["yilewan"]
end

--	是否酷狗平台
CPlatformManager.IsKugou = function ()
	return PfIndex == PlatformEnum["17kxgame"]
end