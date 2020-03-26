
-- AI动作类型
local AIActionEnum = {
	eCastSkill	= 1;	-- 释放技能
	eInstantMove= 2;	-- 瞬移
	eCallAI		= 3;	-- 召唤小弟
	eCastTrap	= 4;	-- 释放陷阱
	eDisappear	= 5;	-- 消失
	eCast8Trap	= 6;
	eCast4Trap	= 7;
};
RegistEnum("AIActionEnum", AIActionEnum);

-- AI状态类型
local AIStateEnum = {
	eBorn		= 1;	-- 出生状态
	eIdle		= 2;	-- 空闲状态
	eFight		= 3;	-- 战斗状态
	eReturn		= 4;	-- 返回状态
	eDied		= 5;	-- 死亡状态
};
RegistEnum("AIStateEnum", AIStateEnum);


