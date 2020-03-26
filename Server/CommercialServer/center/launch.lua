
ServerCfg = {
    common_path  = "../common/";

    HttpServerIP    = "127.0.0.1";
    HttpServerPort  = 10000;
    
    YWHttpServerPort= 11111;

    DBHost			= "10.12.253.2";
    DBUser			= "root";
    DBPassword		= "yunge";
    DBName			= "commercialdb_lichenglin";
    DBPort			= 3306;

    ServiceMgrIP    = "127.0.0.1";
    ServiceMgrPort  = 9996;
    
    KSWDMgrIP       = "127.0.0.1";
    WDManagerPort   = 9901;
    KSManagerPort   = 9900;
}

dofile(ServerCfg.common_path .. "include.lua")


