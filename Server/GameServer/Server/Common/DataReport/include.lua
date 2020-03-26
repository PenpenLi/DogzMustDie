local Platform = ServerInfo.Platform or "youxi"

dofile("./Server/Common/DataReport/DataReport.lua");

if Platform == "duowanclouds" then
	dofile("./Server/Common/DataReport/DataReport_duowan.lua");
elseif Platform == "swjoy" then
	dofile("./Server/Common/DataReport/DataReport_sw.lua");
elseif Platform == "37wan" then
	dofile("./Server/Common/DataReport/DataReport_37wan.lua");
elseif Platform == "youxi" then
	dofile("./Server/Common/DataReport/DataReport_youxi.lua");
elseif Platform == "wan" then
	dofile("./Server/Common/DataReport/DataReport_wan.lua");
elseif Platform == "feihuo" then
	dofile("./Server/Common/DataReport/DataReport_feihuo.lua");
elseif Platform == "602" then
	dofile("./Server/Common/DataReport/DataReport_602.lua");
elseif Platform == "2144" then
	dofile("./Server/Common/DataReport/DataReport_2144.lua");
elseif Platform == "game2" then
	dofile("./Server/Common/DataReport/DataReport_G2.lua");
elseif Platform == "51" then
	dofile("./Server/Common/DataReport/DataReport_51.lua");
elseif Platform == "xunlei" then
	dofile("./Server/Common/DataReport/DataReport_xunlei.lua");
end

