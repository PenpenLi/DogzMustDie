/*
Navicat MySQL Data Transfer

Source Server         : 140.143.155.252
Source Server Version : 50173
Source Host           : 140.143.155.252:3306
Source Database       : commercialdb

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2018-06-05 14:12:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `serverid` int(11) unsigned NOT NULL,
  `version` int(11) unsigned NOT NULL DEFAULT '1',
  `data` mediumtext NOT NULL,
  PRIMARY KEY (`idx`),
  UNIQUE KEY `serverid_index` (`serverid`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for activity_record
-- ----------------------------
DROP TABLE IF EXISTS `activity_record`;
CREATE TABLE `activity_record` (
  `serverid` int(11) NOT NULL COMMENT '服务器id',
  `roleid` char(255) NOT NULL COMMENT '参与活动roleid',
  `actionid` char(255) NOT NULL COMMENT '活动id',
  `actiontype` char(255) NOT NULL COMMENT '活动类型',
  `index` int(11) NOT NULL,
  `info` char(255) NOT NULL COMMENT '附加信息',
  `gold` int(11) NOT NULL COMMENT '消耗元宝',
  `time` bigint(20) NOT NULL COMMENT '记录时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for admin_log
-- ----------------------------
DROP TABLE IF EXISTS `admin_log`;
CREATE TABLE `admin_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `oper` char(16) NOT NULL,
  `serverid` int(10) unsigned NOT NULL,
  `type` char(32) NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  `post_data` text NOT NULL,
  `errno` int(11) NOT NULL,
  `errmsg` char(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for always_notice
-- ----------------------------
DROP TABLE IF EXISTS `always_notice`;
CREATE TABLE `always_notice` (
  `serverid` int(11) unsigned NOT NULL DEFAULT '0',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '常驻公告内容',
  `link` varchar(255) NOT NULL DEFAULT '',
  `linkname` char(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`serverid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for characters
-- ----------------------------
DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pfid` char(32) NOT NULL,
  `serverid` int(11) unsigned NOT NULL,
  `roleid` char(32) NOT NULL,
  `rolename` char(32) NOT NULL,
  `createts` bigint(20) NOT NULL,
  `occupation` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `marry` char(32) NOT NULL DEFAULT '',
  `banspeaktime` bigint(20) NOT NULL DEFAULT '0' COMMENT '禁言时间',
  `banplaytime` bigint(20) NOT NULL DEFAULT '0' COMMENT '封号时间',
  `last_login` bigint(20) NOT NULL DEFAULT '0',
  `loginlong` bigint(20) NOT NULL COMMENT '累计在线时间',
  `ip` char(255) NOT NULL,
  `online` smallint(6) NOT NULL DEFAULT '0' COMMENT '玩家是否在线',
  `combat` int(11) NOT NULL COMMENT '战斗力',
  `mapid` int(11) NOT NULL COMMENT '所在地图id',
  `vip` int(11) NOT NULL COMMENT 'vip等级',
  `gold` int(11) NOT NULL DEFAULT '0' COMMENT '元宝',
  `coin` int(11) NOT NULL DEFAULT '0' COMMENT '金币',
  `bindgold` int(11) NOT NULL DEFAULT '0' COMMENT '绑定元宝',
  `last_logout` bigint(20) NOT NULL COMMENT '最近离线时间',
  `needexp` int(11) NOT NULL DEFAULT '0' COMMENT '升级所需经验',
  `charge` int(11) NOT NULL DEFAULT '0' COMMENT '充值',
  `onserver` int(11) NOT NULL DEFAULT '0' COMMENT '玩家当前所在服务器id',
  `mac` char(255) NOT NULL DEFAULT '' COMMENT '玩家mac地址',
  `todaytime` bigint(20) NOT NULL DEFAULT '0' COMMENT '当天在线时长',
  `translevel` int(11) NOT NULL DEFAULT '0' COMMENT '转生等级',
  `winnum` int(11) NOT NULL DEFAULT '0' COMMENT '主线关卡',
  `guildname` char(32) NOT NULL COMMENT '公会名字',
  PRIMARY KEY (`idx`),
  KEY `character_roleid` (`roleid`),
  KEY `character_rolename` (`rolename`),
  KEY `character_pfid` (`pfid`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=1948 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for globalinfo
-- ----------------------------
DROP TABLE IF EXISTS `globalinfo`;
CREATE TABLE `globalinfo` (
  `playerserviceindex` int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'playerservice唯一id',
  `rechargeserviceindex` bigint(20) NOT NULL DEFAULT '0' COMMENT '用于生成虚拟充值订单号'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lock_mac
-- ----------------------------
DROP TABLE IF EXISTS `lock_mac`;
CREATE TABLE `lock_mac` (
  `mac` char(255) NOT NULL DEFAULT '',
  `roleid` char(32) NOT NULL DEFAULT '',
  `lockdate` bigint(20) NOT NULL,
  `reason` varchar(4096) NOT NULL,
  `serverid` int(11) NOT NULL,
  PRIMARY KEY (`mac`,`roleid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for login_record
-- ----------------------------
DROP TABLE IF EXISTS `login_record`;
CREATE TABLE `login_record` (
  `pfid` char(32) NOT NULL,
  `serverid` int(11) NOT NULL,
  `logindate` int(11) NOT NULL,
  `roleid` char(16) NOT NULL,
  `rolename` char(16) NOT NULL,
  `level` int(11) NOT NULL,
  `ts` bigint(20) NOT NULL,
  PRIMARY KEY (`pfid`,`serverid`,`logindate`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lotto
-- ----------------------------
DROP TABLE IF EXISTS `lotto`;
CREATE TABLE `lotto` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `actid` char(32) NOT NULL,
  `index` int(10) unsigned NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  `number` int(10) unsigned NOT NULL,
  `serverid` int(10) unsigned NOT NULL,
  `roleid` char(32) NOT NULL,
  `name` char(32) NOT NULL,
  `viplv` int(11) NOT NULL,
  `ts` bigint(20) NOT NULL,
  `lucky` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`idx`),
  KEY `index_lotto` (`actid`,`index`,`time`)
) ENGINE=MyISAM AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for old2new
-- ----------------------------
DROP TABLE IF EXISTS `old2new`;
CREATE TABLE `old2new` (
  `oldid` int(11) NOT NULL,
  `newid` int(11) NOT NULL,
  PRIMARY KEY (`oldid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for operation
-- ----------------------------
DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ip` char(16) NOT NULL,
  `ts` bigint(20) NOT NULL,
  `method` char(32) NOT NULL,
  `path` char(32) NOT NULL,
  `query` text NOT NULL,
  `body` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4477 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for pfcode
-- ----------------------------
DROP TABLE IF EXISTS `pfcode`;
CREATE TABLE `pfcode` (
  `code` char(32) NOT NULL DEFAULT '' COMMENT '激活码',
  `maintype` smallint(10) unsigned NOT NULL COMMENT '主类型',
  `subtype` tinyint(4) unsigned NOT NULL COMMENT '子类型',
  `starttime` bigint(20) unsigned NOT NULL COMMENT '开始时间戳',
  `overtime` bigint(20) unsigned NOT NULL COMMENT '结束时间戳',
  `used` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '是否使用',
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for recharge
-- ----------------------------
DROP TABLE IF EXISTS `recharge`;
CREATE TABLE `recharge` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `roleid` char(32) NOT NULL,
  `rolename` char(32) NOT NULL,
  `pfid` char(32) NOT NULL,
  `serverid` int(11) unsigned NOT NULL DEFAULT '0',
  `orderid` char(50) NOT NULL,
  `coins` bigint(20) NOT NULL DEFAULT '0' COMMENT '游戏币数量',
  `moneys` bigint(20) NOT NULL DEFAULT '0' COMMENT '人民币数量（单位：分）',
  `ts` bigint(20) NOT NULL DEFAULT '0' COMMENT '充值时间',
  `state` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0为充值失败1，为充值成功',
  PRIMARY KEY (`idx`),
  KEY `character_roleid` (`roleid`) USING BTREE,
  KEY `character_orderid` (`orderid`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for server_crash_log
-- ----------------------------
DROP TABLE IF EXISTS `server_crash_log`;
CREATE TABLE `server_crash_log` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `serverid` int(10) unsigned NOT NULL,
  `time` char(32) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for virtual_recharge
-- ----------------------------
DROP TABLE IF EXISTS `virtual_recharge`;
CREATE TABLE `virtual_recharge` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `serverid` int(11) NOT NULL DEFAULT '0',
  `roleid` char(32) NOT NULL,
  `rolename` char(32) NOT NULL,
  `pfid` char(32) NOT NULL,
  `orderid` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '订单号',
  `coins` bigint(20) NOT NULL DEFAULT '0' COMMENT '游戏币数',
  `money` bigint(20) NOT NULL DEFAULT '0' COMMENT '单位（元）',
  `oper` char(16) NOT NULL,
  `ts` bigint(20) NOT NULL COMMENT '操作时间',
  `state` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0为充值失败1为充值成功',
  PRIMARY KEY (`idx`),
  KEY `character_roleid` (`roleid`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for welfare
-- ----------------------------
DROP TABLE IF EXISTS `welfare`;
CREATE TABLE `welfare` (
  `idx` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `serverid` int(11) NOT NULL DEFAULT '0',
  `pfid` char(32) NOT NULL,
  `roleid` char(32) NOT NULL,
  `rolename` char(32) NOT NULL,
  `oper` char(16) NOT NULL,
  `ts` bigint(20) NOT NULL,
  PRIMARY KEY (`idx`),
  KEY `character_roleid` (`roleid`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `invite_relation`;
CREATE TABLE `invite_relation` (
  `inviterid` char(32) NOT NULL,
  `inviteeid` char(32) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;