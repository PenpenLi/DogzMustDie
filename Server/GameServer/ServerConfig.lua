--[[
	--游戏服配置
--]]
ServerInfo = 
{
	--游戏服信息
	self_ip				= "127.0.0.1",
	serverid			= 5345,
	clientport			= 8888,

	--跨服信息
	bridge_lan_ip		= "10.12.253.2";
	bridge_port			= 9998;

	--中心服信息
	--commercial_ip		= "10.12.253.2",
	commercial_ip		= "10.12.253.2",
	commercial_port		= 9900,
	commercial_wdport 	= 9901, 

	--数据库信息
	gamedb_host			= "10.12.253.2",
	gamedb_port			= 3306,
	gamedb_user			= "root",
	gamedb_pwd			= "yunge",
	gamedb_name			= "gamedb_2d",

	-- log库
	district_log_host 		= "10.12.253.2",
	district_log_port 		= 3306,
	district_log_user 		= "root",
	district_log_pwd  		= "yunge",
	district_log_name 		= "ssbxs_game_log",

	--其他配置
	ThreadNum			= 1,
	IsNotDataReport 	= true,
	bridge_group		= {},
	GM = true,
	Platform = "wan",
	IsQQ = true,
}