local CRoleQualityCfgMgr = RequireSingleton("CRoleQualityCfgMgr");

-- ȡ���������辭��
CRoleQualityCfgMgr.GetLvUpExp = function (i_nLevel)
	if not tRQCfg[i_nLevel] then
		return nil;
	end
	return tRQCfg[i_nLevel].dwLevelUpExp;
end

-- ȡ�û�������
CRoleQualityCfgMgr.GetBattleUnit = function (i_nLevel)
	local cfg = tRQCfg[i_nLevel];
	return cfg.dwHP,
		cfg.dwMP,
		cfg.dwAttack,
		cfg.dwDefence,
		cfg.dwHit,
		cfg.dwDodge,
		cfg.dwCrit,
		cfg.dwUnCrit,
		cfg.dwExact,
		cfg.dwResist,
		cfg.dwRecoverHP,
		cfg.dwRecoverMP;
end

CRoleQualityCfgMgr.GetRecoverHP = function (i_nLevel)
	return tRQCfg[i_nLevel].dwRecoverHP;
end

