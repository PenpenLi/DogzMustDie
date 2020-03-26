-- global function
local type	= type;
local pairs	= pairs;
local ipairs= ipairs;
local print	= print;
local string_format = string.format;
local ProtectedCall = ProtectedCall;

--local
local tConfigS = {};

local function fDofileConfig(i_sModuleName, i_sFileName)
	local res1, res2 = ProtectedCall(function() return dofile(i_sFileName) end);
	if res1 then
		if type(res2) == "table" then
			-- hot update
			-- if tConfigS[i_sModuleName] then
				--clean
				-- for k, _ in pairs(tConfig) do
					-- tConfig[k] = nil;
				-- end;
				--update
				-- for k, v in pairs(tempConfig) do
					-- tConfig[k] = v;
				-- end;
			-- end
			
			tConfigS[i_sModuleName] = {
				m_sFileName	= i_sFileName;
				m_tConfig	= res2;
			};
		else
			print("ERROR!!! config not a table!!!");
		end
	end
end

RequireConfig = function(i_sModuleName, i_bIgnoreError)
	local t = tConfigS[i_sModuleName];
	if t then
		return t.m_tConfig;
	elseif (not i_bIgnoreError) then
		print("ERROR!!! config not exist!!!", i_sModuleName);
	end
end

HotUpdateConfig = function(i_sModuleName)
	local t = tConfigS[i_sModuleName];
	if t then
		fDofileConfig(i_sModuleName, t.m_sFileName);
	end
end

-------------------------------------------------------------

local tDofileTable = {
	"StringInfoConfig_S",
	"ItemConfig_S",
	"RewardConfig_S",
	"MarketConfig_S",
	"HeroConfig_S",
	"HeroUpgrateConfig_S",
	"HeroAdvanceConfig_S",
	"RoleLevelUpConfig_S",
	"SceneConfig_S",
	"MonstorConfig_S",
	"CustomspassConfig_S",
	"GameParamConfig_S",
	"ActiveSkillConfig_S",
	"ChargeConfig_S",
	"LotteryConfig_S",
	"RoleSkillUpConfig_S",
	"PassiveSkillConfig_S",
	"QualityValue_S",
	"GangConfig_S",
	"GangDonateConfig_S",
	"GangLevelUpConfig_S",
	"OpenGradeConfig_S",
	"PrivilegeConfig_S",
	"SignConfig_S",
	"ActivityConfig_S",
	"MailConfig_S",
	"PresentConfig_S",
	"petConfig_S",
	"AchieveConfig_S",
	"DayAchieveConfig_S",
	"PlayerInitConfig_S",
	"EquipConfig_S",
	"SuitConfig_S",
	"SevenConfig_S",
	"ChargeReturnConfig_S",
	"InvitationConfig_S",
	"KickingConfig_S",
	"FoundationConfig_S",
	"HeroPeckConfig_S",
	"LadderConfig_S",
	"StrongerConfig_S",
	"FairyConfig_S",
	"LadderRobotConfig_S",
	"RobotConfig_S",
	"CopyConfig_S",
	"RelationConfig_S",
	"HandbookTeamConfig_S",
	"HandbookUpConfig_S",
	"CastingConfig_S",
	
	
}


-------------------------------------------------------------


local sPath = "./Server/ConfigS/%s.lua";
for _, sModuleName in ipairs(tDofileTable) do
	local sFileName = string_format(sPath, sModuleName);
	fDofileConfig(sModuleName, sFileName);
end


