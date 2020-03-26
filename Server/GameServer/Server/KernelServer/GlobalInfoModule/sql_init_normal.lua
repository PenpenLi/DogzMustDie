
return {
  [[   
  SET FOREIGN_KEY_CHECKS=0;
  ]],


  [[
  CREATE TABLE `dbinfo` (
    `dbversion` int(10) unsigned NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `globalinfo` (
    `serverid` int(11) NOT NULL,
    `opentime` bigint(20) NOT NULL DEFAULT '0',
    `realopentime` bigint(20) unsigned NOT NULL DEFAULT '0',
    `mailnum` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '邮件id最大值',
    `roleindex` int(11) NOT NULL DEFAULT '0',
    `guildindex` int(11) NOT NULL DEFAULT '0' COMMENT '帮派id最大值',
    `refreshtime` bigint(20) NOT NULL DEFAULT '0',
    `marrynum` bigint(20) NOT NULL DEFAULT '0',
    `marryindex` int(11) NOT NULL DEFAULT '0' COMMENT '情缘的总量',
    `friendindex` int(11) NOT NULL DEFAULT '0' COMMENT '好友的总量',
    `shuttime` bigint(20) NOT NULL DEFAULT '0' COMMENT '关服时间',
    `rank1v1ver` int(11) NOT NULL DEFAULT '0' COMMENT '1v1榜版本号',
    `rank3v3ver` int(11) NOT NULL DEFAULT '0' COMMENT '3v3榜版本号',
    `hefu` bigint(20) NOT NULL DEFAULT '0' COMMENT '合服时间戳',
    `hefutimes` smallint(6) NOT NULL DEFAULT '0' COMMENT '次数',
    PRIMARY KEY (`serverid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `item_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `itemid` int(11) NOT NULL DEFAULT '0' COMMENT '物品ID',
    `count` int(11) NOT NULL DEFAULT '0' COMMENT '叠加数量'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `role` (
    `accountid` varchar(128) NOT NULL,
    `roleid` char(32) NOT NULL,
    `rolename` char(32) NOT NULL COMMENT '角色名',
    `camp` tinyint(4) NOT NULL DEFAULT '0' COMMENT '阵营',
    `mapid` int(11) NOT NULL COMMENT '地图id',
    `roleprof` tinyint(4) NOT NULL COMMENT '职业',
    `rolehead` tinyint(4) NOT NULL COMMENT '头像',
    `newflag` tinyint(4) NOT NULL DEFAULT '1',
    `level` int(11) unsigned NOT NULL DEFAULT '1' COMMENT '等级',
    `exp` bigint(11) unsigned NOT NULL DEFAULT '0' COMMENT '经验',
    `viplv` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'vip等级',
    `createtime` bigint(20) NOT NULL DEFAULT '0' COMMENT '创建时间',
    `totaltime` bigint(20) NOT NULL DEFAULT '0',
    `channel` varchar(255) NOT NULL DEFAULT '',
    `refreshtime` bigint(20) NOT NULL COMMENT '每日刷新时间',
    `loginnum` smallint(6) NOT NULL DEFAULT '1',
    `todaytime` int(11) NOT NULL DEFAULT '0' COMMENT '今日在线总时间',
    `logouttime` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '登出时间',
    `combatpower` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '战力',
    PRIMARY KEY (`roleid`),
    KEY `role_accountid_index` (`accountid`) USING BTREE,
    KEY `role_rolename_index` (`rolename`) USING BTREE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `role_info` (
    `roleid` char(32) NOT NULL,
    `dungeons` int(11) unsigned NOT NULL DEFAULT '10001' COMMENT '副本',
    `duneonsidx` int(11) unsigned NOT NULL DEFAULT '1' COMMENT '副本波数',
    `battlearray` varchar(512) NOT NULL DEFAULT '' COMMENT '阵容信息',
    `circulation` tinyint(4) NOT NULL COMMENT '是否循环关卡',
    `mp` int(11) unsigned NOT NULL DEFAULT '50' COMMENT '能量值',
    `guildid` int(11) NOT NULL DEFAULT '0' COMMENT '帮派id',
    `clientinfo` varchar(1024) NOT NULL DEFAULT '' COMMENT '客户端临时变量',
    `contribution` varchar(128) NOT NULL DEFAULT '' COMMENT '捐献次数',
    `chargetimes` varchar(256) NOT NULL DEFAULT '' COMMENT '充值次数',
    `chargefeedback` varchar(128) NOT NULL DEFAULT '' COMMENT '充值反馈',
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `hero_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `heroid` int(11) NOT NULL DEFAULT '0' COMMENT '物品ID',
    `level` int(11) NOT NULL DEFAULT '0' COMMENT '等级',
    `star` int(11) NOT NULL DEFAULT '0' COMMENT '星级'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `pet_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `petinfo` varchar(1024) NOT NULL DEFAULT '' COMMENT '宠物信息',
    `hastimes` int(11) NOT NULL DEFAULT '0' COMMENT '剩余次数',
    `nexttime` bigint(20) NOT NULL DEFAULT '0' COMMENT '下次刷新时间',
    `usepet` int(11) NOT NULL DEFAULT '0' COMMENT '当前佩戴宠物',
    `newlist` varchar(1024) NOT NULL DEFAULT '' COMMENT '红点记录'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],


  [[
  CREATE TABLE `equip_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `equipinfo` varchar(4096) NOT NULL DEFAULT '' COMMENT '装备信息'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `role_skill` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `skilllist` varchar(512) NOT NULL DEFAULT '' COMMENT '技能等级',
    `skillcdlist` varchar(512) NOT NULL DEFAULT '' COMMENT '技能CD'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `rank_level` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '玩家等级',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='等级榜';
  ]],

  [[
  CREATE TABLE `rank_gold` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '累计获取金币数量',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='财富榜';
  ]],

  [[
  CREATE TABLE `rank_click` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '累计点击',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='点击榜';
  ]],

  [[
  CREATE TABLE `rank_charge` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '累计充值',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='充值榜';
  ]],

  [[
  CREATE TABLE `rank_hero` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '英雄数量',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='英雄榜';
  ]],

  [[
  CREATE TABLE `rank_charmall` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '魅力值',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='魅力总榜';
  ]],

  [[
  CREATE TABLE `rank_charmweek` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '魅力值',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='魅力周榜';
  ]],

  [[
  CREATE TABLE `rank_charmlastweek` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `mainvalue` bigint(20) NOT NULL COMMENT '魅力值',
    `vicevalue` bigint(20) NOT NULL COMMENT '达到时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='魅力上周榜';
  ]],

  [[
  CREATE TABLE `event` (
    `roleid` char(50) NOT NULL,
    `event` text NOT NULL,
    `dayevent` text NOT NULL,
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `guild` (
    `id` int(11) NOT NULL DEFAULT '1' COMMENT '帮派id',
    `level` int(11) NOT NULL DEFAULT '1' COMMENT '帮派等级',
    `contribution` int(11) NOT NULL DEFAULT '0' COMMENT '贡献值',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `guild_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `rolename` char(32) NOT NULL COMMENT '成员名',
    `guildid` int(11) NOT NULL DEFAULT '0' COMMENT '帮派id',
    `dungeons` int(11) unsigned NOT NULL DEFAULT '1' COMMENT '副本',
    `contribution` int(11) NOT NULL DEFAULT '0' COMMENT '贡献值',
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `mail_system` (
    `id` char(32) NOT NULL COMMENT '邮件id',
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `type` int(10) unsigned NOT NULL COMMENT '类型',
    `duetime` bigint(20) unsigned NOT NULL COMMENT '过期时间',
    `affix` varchar(1024) NOT NULL DEFAULT '' COMMENT '附件',
    `readstate` smallint(2) unsigned NOT NULL DEFAULT '0' COMMENT '读状态',
    `affixstate` smallint(2) unsigned NOT NULL DEFAULT '0' COMMENT '附件领取状态',
    `append` varchar(255) NOT NULL DEFAULT '' COMMENT '附加信息',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `signin` (
    `roleid` char(32) NOT NULL,
    `day` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '签到的天数',
    `signininfo` varchar(512) NOT NULL DEFAULT '' COMMENT '签到记录',
    `sevenday` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '七日累计的天数',
    `sevenflag` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '是否领取七日奖励',
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `vip` (
    `roleid` char(32) NOT NULL,
    `expirationtime` bigint(20) NOT NULL DEFAULT '0' COMMENT 'vip',
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `privilege_role` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `privilegeid` int(11) NOT NULL DEFAULT '0' COMMENT '特权ID',
    `deltime` int(11) NOT NULL DEFAULT '0' COMMENT '删除日期'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `topic_activity` (
    `activiid` int(11) NOT NULL COMMENT '活动ID',
    `cfg` varchar(2048) NOT NULL DEFAULT '' COMMENT '活动配置',
    `num` varchar(128) NOT NULL DEFAULT '' COMMENT '双方的人数',
    `win` int(11) NOT NULL DEFAULT '0' COMMENT '胜利方'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `topic_playerinfo` (
    `roleid` char(32) NOT NULL COMMENT '角色id',
    `activiid` int(11) NOT NULL COMMENT '活动ID',
    `info` varchar(128) NOT NULL DEFAULT '' COMMENT '玩家信息'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
  CREATE TABLE `nearachieve` (
    `roleid` char(32) NOT NULL,
    `awardrecord` varchar(4096) NOT NULL DEFAULT '' COMMENT '奖励进度',
    `dayawardrecord` varchar(4096) NOT NULL DEFAULT '' COMMENT '每日奖励进度',
    PRIMARY KEY (`roleid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ]],

  [[
    CREATE TABLE `activity_partin` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `actyinfo` varchar(2048) NOT NULL COMMENT '活动信息'
    )   
    COMMENT='已参与的运营活动';
  ]],

  [[
  CREATE TABLE `daytotalcharge` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `chargenum` int(11) NOT NULL DEFAULT '0' COMMENT '当日充值数量',
    `awardstate` varchar(256) NOT NULL DEFAULT '' COMMENT '当日累充领取状态'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='每日累冲';
  ]],
  
  [[
  CREATE TABLE `dayconsume` (
    `roleid` char(50) NOT NULL COMMENT '角色id',
    `consumenum` int(11) NOT NULL DEFAULT '0' COMMENT '消耗数量',
    `awardstate` varchar(512) NOT NULL DEFAULT '' COMMENT '领取状态'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='每日消耗';
  ]],

  [[
  INSERT INTO `dbinfo` set `dbversion` = 0;
  ]],
}

