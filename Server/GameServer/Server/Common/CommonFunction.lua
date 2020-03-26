
-- global function
local print			= print;
local logfile		= logfile
local type          = type
local pairs         = pairs
local tostring      = tostring
local table_insert  = table.insert
local table_concat  = table.concat
local math_floor	= math.floor;
local string_format	= string.format;
local string_gsub   = string.gsub
local string_len    = string.len
local string_sub    = string.sub
local string_byte   = string.byte
local string_gmatch	= string.gmatch

local now			= _commonservice.now;
local localtime		= _commonservice.localtime;
local mktime		= _commonservice.mktime;

-- local function
local oneminutesecs	= 60;
local onehoursecs	= 3600;
local onedaysecs	= 86400;
local oneweeksecs	= 604800;
-- local leapyeardays		= {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
-- local nonleapyeardays	= {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};


----------------
-- isleapyear --
----------------
local function isleapyear(year)
	return (year % 400 == 0) or ((year % 4 == 0) and (year % 100 ~= 0));
end;
------------------
-- sec2calendar --
------------------
local function sec2calendar(sec)
	local year, month, day, hour, minute, sec, week = localtime(sec);
	return year, month, day, hour, minute, sec;
end;
------------------
-- sec2week --
------------------
local function sec2week(sec)
	local year, month, day, hour, minute, sec, week = localtime(sec);
	if week == 0 then
		week = 7;
	end;
	return week;
end;
-------------------
-- calendar2week --
-------------------
local function calendar2week(y, m, d)
	if (m == 1) then
		m = 13;
		y = y - 1;
	end
	if (m == 2) then
		m = 14;
		y = y - 1;
	end
	return (( d + (2 * m) + math_floor(3 * (m + 1) / 5) + y + math_floor(y / 4) - math_floor(y / 100) + math_floor(y / 400) ) % 7) + 1;
end;
------------------
-- calendar2sec --
------------------
local function calendar2sec(year, month, day, hour, minute, sec)
	return mktime(year, month, day, hour, minute, sec);
end;
-------------------
-- todaystartsec --
-------------------
local todaystartsec = 0;
local function gettodaystartsec()
	local cursec = now(1);
	if (cursec - todaystartsec) < onedaysecs then
		return todaystartsec;
	else
		local year, month, day = sec2calendar(cursec);
		todaystartsec = calendar2sec(year, month, day, 0, 0, 0);
		return todaystartsec;
	end;
end;
local function gettodaythistimesec(hour, minute, second)
	return gettodaystartsec() + hour * onehoursecs + minute * oneminutesecs + second;
end;

local function getstartsec(cursec)
    local year, month, day = sec2calendar(cursec)
    return calendar2sec(year, month, day, 0, 0, 0)
end;

-------------------
-- thisweekstartsec --
-------------------
local thisweekstartsec = 0;
local function getthisweekstartsec()
	local cursec = now(1);
	if (cursec - thisweekstartsec) < oneweeksecs then
		return thisweekstartsec;
	else
		thisweekstartsec = gettodaystartsec();
		local week = sec2week(thisweekstartsec);
		thisweekstartsec = thisweekstartsec - onedaysecs * (week - 1);
		return thisweekstartsec;
	end;
end;

------------------------------------------------------------------------------

-- local
local CCommonFunction = RequireSingleton("CCommonFunction");

-- 时间戳转星期几
CCommonFunction.Sec2Week = function(i_nSec)
	return sec2week(i_nSec);
end;
-- 时间戳毫秒数转星期几
CCommonFunction.Msec2Week = function(i_nMsec)
	return sec2week(math_floor(i_nMsec / 1000));
end;
-- 时间戳转日历日
CCommonFunction.Sec2Calendar = function(i_nSec, i_bStr)
	if i_bStr then
		return string_format("%04d-%02d-%02d %02d:%02d:%02d", sec2calendar(i_nSec));
	else
		return sec2calendar(i_nSec);
	end;
end;
-- 时间戳毫秒数转日历日
CCommonFunction.Msec2Calendar = function(i_nMsec, i_bStr)
	return CCommonFunction.Sec2Calendar(math_floor(i_nMsec / 1000), i_bStr);
end;
-- 日历日转星期几
CCommonFunction.Calendar2Week = function(i_nYear, i_nMonth, i_nDay)
	return calendar2week(i_nYear, i_nMonth, i_nDay);
end;
-- 日历日转时间戳
CCommonFunction.Calendar2Sec = function(i_nYear, i_nMonth, i_nDay, i_nHour, i_nMinute, i_nSecond)
	return calendar2sec(i_nYear, i_nMonth, i_nDay, i_nHour, i_nMinute, i_nSecond);
end;
-- 日历日转时间戳毫秒数
CCommonFunction.Calendar2Msec = function(i_nYear, i_nMonth, i_nDay, i_nHour, i_nMinute, i_nSecond)
	return calendar2sec(i_nYear, i_nMonth, i_nDay, i_nHour, i_nMinute, i_nSecond) * 1000;
end;
-- 获取今天开始时间戳
CCommonFunction.GetTodayStartSec = function()
	return gettodaystartsec();
end;
-- 获取今天开始时间戳毫秒数
CCommonFunction.GetTodayStartMsec = function()
	return gettodaystartsec() * 1000;
end;
-- 获取指定时间的那天开始时间戳
CCommonFunction.GetStartsec = function(cursec)
    return getstartsec(cursec);
end;
-- 获取今天指定时间的时间戳
CCommonFunction.GetTodayThisTimeSec = function(i_nHour, i_nMinute, i_nSecond)
	return gettodaythistimesec(i_nHour, i_nMinute, i_nSecond);
end;
-- 获取今天指定时间的时间戳毫秒数
CCommonFunction.GetTodayThisTimeMsec = function(i_nHour, i_nMinute, i_nSecond)
	return gettodaythistimesec(i_nHour, i_nMinute, i_nSecond) * 1000;
end;
-- 时间戳是否是在今天
CCommonFunction.IsSecInToday = function(i_nSec)
	local sec = gettodaystartsec();
	return (i_nSec >= sec) and (i_nSec < sec + onedaysecs)
end;
-- 时间戳毫秒数是否是在今天
CCommonFunction.IsMsecInToday = function(i_nMsec)
	return CCommonFunction.IsSecInToday(math_floor(i_nMsec / 1000));
end;
-- 指定时间戳是否在本周
CCommonFunction.IsSecInThisWeek = function(i_nSec)
	local sec = getthisweekstartsec();
	return (i_nSec >= sec) and (i_nSec < sec + oneweeksecs);
end
-- 指定时间戳毫秒数是否在本周
CCommonFunction.IsMsecInThisWeek = function(i_nMsec)
	return CCommonFunction.IsSecInThisWeek(math_floor(i_nMsec/ 1000));
end

-- 保护SQL防止SQL注入
CCommonFunction.ProtectSql = function(i_sSql)
	return string_gsub(i_sSql, "'", "’")
end

-- 获取字符串字符个数 汉字算一个
CCommonFunction.GetCharNum = function(i_sStr)
    local i = 1
    local num = 0
    local nLen = string_len(i_sStr)
    while (i <= nLen) do
        local s1 = string_sub(i_sStr, i, i)
        local byte1 = string_byte(s1)
        if byte1 > 0xF0 then  -- [1111 0xxx] [10xx xxxx] [10xx xxxx] [10xx xxxx]
            i = i + 4
        elseif byte1 > 0xE0 then  -- [1110 xxxx] [10xx xxxx] [10xx xxxx]
            i = i + 3
        elseif byte1 > 0xC0 then -- [110x xxxx] [10xx xxxx]
            i = i + 2
        else
            i = i + 1
        end
        num = num + 1
    end
    return num
end

-- 打印表
local tRecursion = {}
local function print_table(tab, depth, f)
    local t = {}
    for i = 1, depth do
        table_insert(t, "  ")
    end
    local str = table_concat(t)
	for k, v in pairs(tab) do
		if type(v) == "table" then
        	f(str .. "[".. k .. "](" .. type(k) .. ") = " .. tostring(v))
        else
        	f(str .."[".. k .. "](" .. type(k) .. ") = " .. tostring(v) .. "(" .. type(v) .. ")")
        end
        if type(v) == "table" and not tRecursion[v] then
            tRecursion[v] = true
            print_table(v, depth + 1, f)
        end
    end
end

CCommonFunction.PrintTable = function(i_tTable, i_bStdOut)
    if type(i_tTable) ~= "table" then
        print("WARNING!!! PrintTable param not a table.")
        return
    end
    local f = i_bStdOut and print or logfile
    f("----- table print begin -----")
    print_table(i_tTable, 0, f)
    f("----- table print end ------")
    tRecursion = {}
end

function CCommonFunction.Get_db_str(i_tTokenInfo)
	local tTemp = {};
	for nPos, nValue in pairs(i_tTokenInfo) do
		table_insert(tTemp, string_format("%d,%d", tonumber(nPos), tonumber(nValue)));
	end
	return table_concat(tTemp, ";");
end

function CCommonFunction.Parse_db_str(i_sTokenInfo)
	local tTokenInfo = {};
	for nPos, nValue in string_gmatch(i_sTokenInfo, "(%d+),(%d+)") do
		tTokenInfo[tonumber(nPos)] = tonumber(nValue);
	end
	return tTokenInfo;
end

local bdelog = true 
-- 打log
function delog( sLog, ... )
	if bdelog then 
		if not sLog then
			print( "=====error====",nil )
			return
		end
		if type(sLog) == "table" then
		    print("************ table print begin **********")
			print_table(sLog, 3, print)
			print("************ table print end ***********")
			tRecursion = {}
		else
			print( sLog, ... )
		end
	end 
end

--[[
    --@brief 字符串分割函数
    --@param srcstr
    --@param delimiter
    --@return 返回一个table
--]]
function string.split(srcstr, delimiter)
    if type(srcstr) ~= "string" then
        assert(false, "srcstr need string");
        print(debug.traceback());
    end
    local len = string.len(srcstr);
    local itr, index = 1, 1;
    local array = {};
    while true do
        local beginpos, endpos = string.find(srcstr, delimiter, itr);
        if not beginpos then
            array[index] = string.sub(srcstr, itr, len);
            break;
        end
        array[index] = string.sub(srcstr, itr, beginpos - 1);
        itr = endpos + 1;
        index = index + 1;
    end
    return array;
end

-- 计算utf8字符长度
function string.utf8len(input)  
    local len  = string.len(input)  
    local left = len  
    local cnt  = 0  
    local arr  = {0, 0xc0, 0xe0, 0xf0, 0xf8, 0xfc}  
    while left ~= 0 do  
        local tmp = string.byte(input, -left)  
        local i   = #arr  
        while arr[i] do  
            if tmp >= arr[i] then  
                left = left - i  
                break  
            end  
            i = i - 1  
        end  
        cnt = cnt + 1  
    end  
    return cnt  
end

--[[
	table与字符串转化	
--]]

local function ToStringEx(value)
    if type(value)=='table' then
       return TableToStr(value)
    elseif type(value)=='string' then
        return "\""..value.."\""
    else
       return tostring(value)
    end
end

function TableToStr(t, bArry)
    if t == nil then return "" end
    local retstr= "{"

    local i = 1
    for key,value in pairs(t) do
        local signal = ","
        if i==1 then
          signal = ""
        end

        if bArry then
            retstr = retstr..signal..ToStringEx(value)
        else
            if type(key)=='number' or type(key) == 'string' then
                retstr = retstr..signal..'['..ToStringEx(key).."]="..ToStringEx(value)
            else
                if type(key)=='userdata' then
                    retstr = retstr..signal.."*s"..TableToStr(getmetatable(key)).."*e".."="..ToStringEx(value)
                else
                    retstr = retstr..signal..key.."="..ToStringEx(value)
                end
            end
        end

        i = i+1
    end

	retstr = retstr.."}"
	return retstr
end

function StrToTable(str)
    if str == nil or type(str) ~= "string" or str == "" then
        return {}
    end
    return loadstring("return " .. str)()
end