ServerCfg = {
    common_path     = "../../common/";
    HttpServerIP      = "127.0.0.1";
	HttpServerPort  = 10004;
    
    DBHost			= "10.12.253.2";
	DBUser			= "root";
	DBPassword		= "yunge";
	DBName			= "commercialdb_lichenglin";
	DBPort			= 3306;
    
    ServiceType     = "pfcode_service";
    
    CenterIP    = "127.0.0.1";
    CenterPort  = 9996;
}

dofile(ServerCfg.common_path .. "include.lua");


