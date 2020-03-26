return {
    -- 例子 从1 开始
    -- [0] = [[
    -- CREATE TABLE `xx` (
    -- `xx` int(10) unsigned NOT NULL
    -- )  ;
    -- ]],
	-- 2018.11.28 运营活动
	[1] = [[
		CREATE TABLE `pvpmember` (
		`roleid` char(50) NOT NULL COMMENT '角色id',
		`combatinfo` varchar(10240) NOT NULL COMMENT '活动信息'
		)   
		COMMENT='pvp玩家数据';
	]],

	-- 2018.11.28 运营活动
	[2] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `pvptimes` varchar(128) NOT NULL DEFAULT '' COMMENT  '每日pvp次数' AFTER `chargefeedback`;
	]],
	
	-- 2018.12.05 世界Boss伤害排行
	[3] = [[
		CREATE TABLE `rank_bosstoday` (
    	`roleid` char(50) NOT NULL COMMENT '角色id',
   	 	`mainvalue` bigint(20) NOT NULL COMMENT '挑战Boss伤害',
   		`vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  		) 
  		ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='挑战Boss榜';
  	]],

  	-- 2018.12.05 昨日世界Boss伤害排行
	[4] = [[
		CREATE TABLE `rank_bossyesterday` (
    	`roleid` char(50) NOT NULL COMMENT '角色id',
   	 	`mainvalue` bigint(20) NOT NULL COMMENT '挑战Boss伤害',
   		`vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  		) 
  		ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='挑战Boss榜';
  	]],

  	-- 2018.12.05 挑战世界Boss次数
	[5] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `challengebosstimes` varchar(128) NOT NULL DEFAULT '' COMMENT  '挑战世界Boss次数' AFTER `pvptimes`;
	]],

	-- 2018.12.13 特权免费使用次数
	[6] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `freeusenum` varchar(128) NOT NULL DEFAULT '' COMMENT  '特权免费使用次数' AFTER `challengebosstimes`;
	]],

	-- 2018.12.13 添加邀请奖励人数
	[7] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `invitation` varchar(512) NOT NULL DEFAULT '' COMMENT  '邀请奖励领取记录' AFTER `freeusenum`,
		ADD COLUMN `invitadunflag` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '是否领取助力通关' AFTER `invitation`,
		ADD COLUMN `invitavipflag` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '邀请vip领取记录' AFTER `invitadunflag`,
		ADD COLUMN `invitaviptimes` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '邀请vip领取次数' AFTER `invitavipflag`;
	]],

	-- 2018.12.13 闯关领取记录
	[8] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `sharecustomsflag` varchar(128) NOT NULL DEFAULT '' COMMENT  '闯关领取记录' AFTER `invitaviptimes`;
	]],

	-- 2018.12.17 是否购买了基金
	[9] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `busefund` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '是否购买基金' AFTER `sharecustomsflag`;
	]],

	-- 2018.12.18 特权优惠和宝箱优惠  基金 次数
	[10] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `privilegediscount` varchar(128) NOT NULL DEFAULT '' COMMENT  '特权优惠次数' AFTER `busefund`,
		ADD COLUMN `boxdiscount` varchar(128) NOT NULL DEFAULT '' COMMENT  '宝箱优惠次数' AFTER `privilegediscount`,
		ADD COLUMN `busefundtims` varchar(128) NOT NULL DEFAULT '' COMMENT  '领取基金奖励次数' AFTER `boxdiscount`;
	]],

	-- 2018.12.19 英雄礼包
	[11] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `heroawardlist` varchar(1024) NOT NULL DEFAULT '' COMMENT  '英雄礼包' AFTER `busefundtims`;
	]],

	-- 2018.12.22 商城购买次数
	[12] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `marketnumlist` varchar(1024) NOT NULL DEFAULT '' COMMENT  '商城购买次数' AFTER `heroawardlist`;
	]],

	-- 2018.12.23 玩家pvp隐藏积分 
	[13] = [[
		CREATE TABLE `pvprank_score` (
    	`roleid` char(50) NOT NULL COMMENT '角色id',
   	 	`score` bigint(20) NOT NULL COMMENT '隐藏积分'
  		) 
  		ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='玩家pvp隐藏积分';
  	]],

  	-- 2018.12.28 玩家pvp连续战斗结果
	[14] = [[
		ALTER TABLE `pvprank_score`
		ADD COLUMN `continuous` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '连续战斗结果' AFTER `score`;
	]],

	-- 2019.1.2 玩家天梯数据 
	[15] = [[
		CREATE TABLE `ladderdata` (
   	 	`roleid` char(50) NOT NULL COMMENT '角色id',
   	 	`score` bigint(20) NOT NULL COMMENT '天梯积分',
   	 	`challengetime` bigint(20) NOT NULL COMMENT '挑战天梯次数',
   	 	`wintime` bigint(20) NOT NULL COMMENT '胜利次数'
  		) 
  		ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='玩家天梯数据';
  	]],

	-- 2018.12.22 小仙女功能
	[16] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `angelbeats` int(11) NOT NULL DEFAULT '0' COMMENT  '小仙女奖励领取时间' AFTER `marketnumlist`;
	]],

	-- 2019.01.17 广告功能
	[17] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `advertisingtime` int(11) NOT NULL DEFAULT '0' COMMENT  '广告奖励领取时间' AFTER `angelbeats`,
		ADD COLUMN `advertisingtimes` int(11) NOT NULL DEFAULT '0' COMMENT  '广告奖励领取次数' AFTER `advertisingtime`;
	]],

	-- 2019.01.18 运营活动物品兑换
	[18] = [[
		CREATE TABLE `conversion` (
	  	`roleid` char(50) NOT NULL COMMENT '角色id',
	  	`awardstate` varchar(128) NOT NULL COMMENT '兑换道具状态'
	 	) 
	 	ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='运营活动物品兑换';
	]],

	-- 2019.01.22 掉落活动次数记录
	[19] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `dropaward` varchar(1024) NOT NULL DEFAULT '' COMMENT  '掉落活动次数记录' AFTER `advertisingtimes`;
	]],

	-- 2019.01.23 图鉴数据
	[20] = [[
		CREATE TABLE `handbook_role` (
	  	`roleid` char(50) NOT NULL COMMENT '角色id',
	  	`handbooklist` varchar(1024) NOT NULL COMMENT '图鉴等级列表',
	  	`suithandbooklist` varchar(1024) NOT NULL COMMENT '套装图鉴等级列表'
	 	) 
	 	ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='图鉴数据';
	]],
		
	-- 2019.01.22 运营活动物品兑换
	[21] = [[
		CREATE TABLE `daydial` (
	  	`roleid` char(50) NOT NULL COMMENT '角色id',
		`freenum` int(11) NOT NULL DEFAULT '0' COMMENT '已使用免费次数',
		`totalnum` int(11) NOT NULL DEFAULT '0' COMMENT '累计次数',
		`awardstate` varchar(128) NOT NULL DEFAULT '' COMMENT '礼包状态',
		`awardhistory` varchar(256) NOT NULL DEFAULT '' COMMENT '中奖历史'
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='充值转盘';
	]],
	-- 2019.01.22 全服邮件
	[22] = [[
		CREATE TABLE `worldmail` (
	 	`id` char(32) NOT NULL COMMENT '邮件id',
	 	`roleid` char(50) NOT NULL COMMENT '全服邮件则为空，若为某人发则为角色ID',
	 	`title` char(32) NOT NULL DEFAULT '' COMMENT '邮件标题',
	  	`content` varchar(256) NOT NULL DEFAULT '' COMMENT '邮件正文',
	  	`duetime` bigint(20) NOT NULL COMMENT '邮件过期时间',
	  	`affix` varchar(255) NOT NULL DEFAULT '' COMMENT '附件',
	  	PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='全服邮件表';
	]],
	-- 2019.01.22 全服邮件
	[23] = [[
		  CREATE TABLE `worldmail_oper` (
		  `mailid` char(32) NOT NULL COMMENT '邮件id',
		  `roleid` char(50) NOT NULL COMMENT '角色id',
		  `affixstate` smallint(2) unsigned NOT NULL DEFAULT '0' COMMENT '附件领取状态',
		  `deletestate` smallint(2) unsigned NOT NULL DEFAULT '0' COMMENT '删除状态'
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='记录全服邮件被玩家删除的列表';
	]],

	-- 2019.01.24 材料副本
	[24] = [[
		CREATE TABLE `materialsdungeon` (	
	  	`roleid` char(50) NOT NULL COMMENT '角色id',
	  	`curdungeonidx` varchar(5120) NOT NULL COMMENT '记录当前已经通到哪关',
	  	`dungeonstar` text NOT NULL COMMENT '记录副本的星星',
	  	`dungeonclearedtimes` varchar(5120) NOT NULL COMMENT '记录通关次数',
	  	`buydungeontimes` varchar(5120) NOT NULL COMMENT '记录当天已购买的次数'
	 	) 
	 	ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='材料副本';
	]],

	-- 2019.01.25 副本体力
	[25] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `power` int(11) NOT NULL DEFAULT '-1' COMMENT '体力' AFTER `dropaward`,
		ADD COLUMN `recovertime` int(11) NOT NULL DEFAULT '0' COMMENT '恢复体力时间' AFTER `power`,
		ADD COLUMN `buypowertimes` int(11) NOT NULL DEFAULT '0' COMMENT '购买体力次数' AFTER `recovertime`;
	]],
	-- 2019.01.28 副本布阵
	[26] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `copybattlearray` varchar(1024) NOT NULL DEFAULT '' COMMENT '副本布阵' AFTER `buypowertimes`;
	]],

	-- 2019.01.29 副本神兽
	[27] = [[
		ALTER TABLE `role_info`
		ADD COLUMN `copyusepet` varchar(512) NOT NULL DEFAULT '' COMMENT '副本神兽' AFTER `copybattlearray`;
	]],

	-- 2019.01.30 更新长度
	[28] =[[
		ALTER TABLE `daydial`
		CHANGE COLUMN `awardhistory` `awardhistory` varchar(1024) NOT NULL DEFAULT '' COMMENT '中奖历史' AFTER `awardstate`;
	]],
	-- 2019.2.19 玩家天梯战斗连胜结果
	[29] = [[
		ALTER TABLE `ladderdata`
		ADD COLUMN `continuous` tinyint(4) NOT NULL DEFAULT '0' COMMENT  '连续战斗结果' AFTER `wintime`;
	]],

	-- 2019.2.21 更新长度
	[30] =[[
		ALTER TABLE `role_info`
		CHANGE COLUMN `advertisingtimes` `advertisingtimes` varchar(256) NOT NULL DEFAULT '' COMMENT '广告奖励领取次数' AFTER `advertisingtime`;
	]],
	-- 2019.2.22 英雄礼包看广告标识
	[31] =[[
		ALTER TABLE `role_info`
		ADD COLUMN `heropeckadflag` varchar(256) NOT NULL DEFAULT '' COMMENT  '英雄礼包看广告标识' AFTER `copyusepet`;
	]],
	-- 2019.2.27 时段记忆记录购买次数(不清除的)
	[32] =[[
		ALTER TABLE `materialsdungeon`
		ADD COLUMN `additiondungeontimes` varchar(256) NOT NULL DEFAULT '' COMMENT  '记录购买次数' AFTER `buydungeontimes`;
	]],
	-- 2019.02.28 PK联赛
	[33] = [[
		CREATE TABLE `pkleague` (
	  	`roleid` char(50) NOT NULL COMMENT '角色id',
	  	`hit` bigint(40) NOT NULL COMMENT '海选伤害',
	  	`hitrank` bigint(20) NOT NULL COMMENT '海选伤害排名',
	  	`betinfo` varchar(512) NOT NULL COMMENT '押注信息',
	  	`bettimes` varchar(512) NOT NULL COMMENT '玩家本周押注次数',
	  	`capacity` varchar(512) NOT NULL COMMENT '玩家战斗力计算数据',
	  	`fightplayer` varchar(256) NOT NULL COMMENT '阶段对战人员组'
	 	)
	 	ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PK联赛';
	]],
	-- 2019.2.28 PK联赛
	[34] =[[
		ALTER TABLE `pkleague`
		ADD COLUMN `playerInfo` varchar(512) NOT NULL DEFAULT '' COMMENT  '角色基本信息' AFTER `fightplayer`;
	]],
	-- 2019.03.09 更新长度
	[35] =[[
		ALTER TABLE `mail_system`
		CHANGE COLUMN `append` `append` varchar(1024) NOT NULL DEFAULT '' COMMENT '附加信息' AFTER `affixstate`;
	]],
	-- 2019.03.09 PK联赛报名记录
	[36] =[[
		ALTER TABLE `role_info`
		ADD COLUMN `pkleagueflag` int(11) NOT NULL DEFAULT '0' COMMENT  'PK联赛报名记录' AFTER `heropeckadflag`;
	]],
	-- 2019.03.11 PK联赛伤害排行榜
	[37] = [[
		CREATE TABLE `rank_pkLeaguehit` (
    	`roleid` char(50) NOT NULL COMMENT '角色id',
   	 	`mainvalue` bigint(20) NOT NULL COMMENT 'PK联赛海选伤害',
   		`vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  		) 
  		ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PK联赛伤害排行榜';
		]],
			--2019.07.02  增加QQ版 商城免费观看广告 次数 时间戳
		[38]=[[
				ALTER TABLE `role_info`
				ADD COLUMN `m_nlookaddrawtimes` int(11) NOT NULL DEFAULT '-1' COMMENT '商城看广告次数' AFTER `pkleagueflag`,
				ADD COLUMN `m_ncoolingtime` int(11) NOT NULL DEFAULT '0' COMMENT '商城广告时间戳' AFTER `m_nlookaddrawtimes`;
		]],
}
