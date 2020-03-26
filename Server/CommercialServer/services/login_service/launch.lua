ServerCfg = {
    common_path     = "../../common/";
    HttpServerIP    = "127.0.0.1";
	HttpServerPort  = 10010;
    
    DBHost			= "10.12.253.2";
	DBUser			= "root";
	DBPassword		= "yunge";
	DBName			= "commercialdb_lichenglin";
	DBPort			= 3306;
    
    ServiceType = "login_service";
    
    CenterIP    = "127.0.0.1";
    CenterPort  = 9996;
    IsDebug = true;
	-- 默认 "youxi"
    Platform = "wan";
}

dofile(ServerCfg.common_path .. "include.lua");