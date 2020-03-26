
/**网络状态类型 */
enum SocketState {
	NONE,
	CONNECTING,
	CONNECTED,
	CLOSE,
	CONNECT_FAIL
}

/**变量类型 */
enum RemoteObjectType {
	Invalid = 0, //无效的类型
	Bool = 1, //bool类型
	Int8 = 2, //8位int
	Int16 = 3, //16位int
	Int32 = 4, //32位int
	UInt8 = 5, //8位uint
	UInt16 = 6, //16位uint
	UInt32 = 7, //32位uint
	Float = 8, //32位float
	Double = 9, //64位double
	String = 10, //8位描述长度的,变长string
	BigString = 11, //16位描述长度的,变长string(暂时没做)
	UInt64 = 12, //64位uint
	DataStream = 13, //嵌套stream类型
	Null = 14,//对应lua的nil
}

/**Log等级类型 */
enum LogLevel {
	eNone = 0,
	eError = 1,
	eException = 2,
	eWarning = 3,
	eLog = 4,
}

/**主角性别类型 */
enum GenderEnum {
	None = 0,
	Male = 1,
	Female = 2,
}

/**导航类型 */
enum NavMeshType {
	NavMesh_None = 0,		// 无效
	NavMesh_Empty,          // 没有导航网格
	NavMesh_Full,		    // 完全导航网格
	NavMesh_Part,           // 部分导航网格
}


/**UIManager命令类型 */
enum CmdType {
	//创建ui
	Create,
	//显示ui
	Show,
	//隐藏ui
	Hide,
	//删除ui
	Destroy,
	//实例多个
	InstanceCmd,
}

/**离线状态类型 */
enum OffLineEnum {
	eUnknow = 0,            //网络异常
	eBanPlay = 1,			//封号踢人
	eRepeatLogin = 2,		//顶号（重复登录）
	eGMKick = 3,			//GM踢人，不封号
	eServerShutdown = 4,	//服务器关闭
	eLoginFailed = 5,		//登陆失败
	eLoginServerError = 6,	//登陆服务器错误
	eLoginFull = 7,			//服务器高负载
	eReName = 8,			//改名成功后踢人
	eShield = 9999,			//使用外挂，恶意软件
}

// 事件数据类型
enum EventProEnum {
	AddGold = 1,	// 累计获得金币
	AddClick = 2,	// 累计点击怪物次数
	Charm = 3,	// 魅力值
	ChangeName = 4,	// 改名次数
	HeroAttack = 5, 	// 英雄攻击次数
	PetAttack = 6, 	// 神兽攻击次数
	AddEiamond = 7,	// 累计获得钻石
	AddMinute = 8,	// 累计在线分钟
	KillBoss = 9, 	// 击杀Boss数量
	GetHeroNum = 10,	// 解锁英雄数量
	HeroDPS = 11,	// 英雄DPS最大值
	KillMonster = 12,	// 累计消灭怪物
	GetClickCritNum = 13, 	// 点击暴击次数
	HeroAllLevel = 14,	// 英雄总等级
	LevelCrossing = 15,	// 关卡数
	PetAllLevel = 16,	// 神兽总等级
	UsePlayerSkill = 17,	// 使用技能数量
	JoinTopicNum = 18,	// 参加话题先锋次数
	UsePrivilege = 19,	// 使用特权次数
	GangDonateTimes = 20,	// 帮会捐献次数
	CharmWeek = 21,	// 魅力每周值
	CharLastmWeek = 22,	// 魅力上周周值
	WinCustoms = 23,	// 通关次数
	LotteryNum = 24,	// 今日抽奖次数
	NowBossRank = 25,	// 今日世界boss伤害
	LastBossRank = 26,	// 昨日世界boss伤害
	ShareNum = 27,	// 分享总次数
	InvitationNum = 28,	// 邀请总人数
	OneLottery = 29,	// 单抽累计次数
	LadderTimes = 30,	// 挑战天梯次数
	BuyLadderTimes = 31,	// 购买挑战天梯次数
	VipFlagTimes = 32,		// Vip奖励次数
	AdDoneNum = 33,			// 看广告次数
}

/** 缓存类型 */
enum CacheTypeEnum {
	derail,	//开关类型
	newGuid, //新手引导
	story, //剧情
	common,//通用
	hero,//英雄
}

/***图鉴类型 */
enum HandBookType {
	eHeroType = 1,	//英雄图鉴
	ePetType = 2    //宠物图鉴
}

enum CacheTypeCommon {
	pvpSaveCombat, // 是否保存过战斗
}

/** 缓存开关数据 */
enum CacheBooleanEnum {
	C_boolean,	//音效开关
	sound,		//音效开关
	music,		//音乐开关
}
/** 记录引导步骤是否触发 */
enum GuidBooleanEnum {
	Guidance_1,
	Guidance_2,
	Guidance_3,
	Guidance_4,
	Guidance_5,
	Guidance_6,
	Guidance_7_1,
	Guidance_7_2,
	Guidance_7_3,
	Guidance_8,
	Guidance_9,
	Guidance_10,
	Guidance_11,
	Guidance_12,
	Guidance_13,
	Guidance_14,
	Guidance_war_1,
	Guidance_war_2,
	camp,
}
enum StoryEnum {
	story_1 = 6,
	story_2 = 11,
	story_3 = 16,
	story_4 = 21,
	story_5 = 26,
	story_6 = 31,
}
/**基础物品类型 */
enum ItemEnum {
	/** 元宝 */
	GoldIngot = 2,
	/** 金币 */
	Gold = 5,
	/** 装备背包 */
	EquipPack = 9,
	/** 道具背包 */
	PropPack = 10,
	/** 宝石背包 */
	GemstonePack = 11,
	/** 特殊背包 */
	SpecialPack = 12,
}

enum AvatarDirection {
	right = 1,
	left = -1
}
enum NewItemEnum {
	eEquip,
	eProp,
	eSpecial,
	eGemstone
}

enum ItemPosEnum {
	ePacket,
	ePutOn
}

enum NewPackEnum {
	eEquipPack,
	ePropPack,
	eGemstonePack,
	eSpecialPack
}

enum ItemSysOperEnum {
	AddItemOper,
	UpdateItemOper,
	DeleteItemOper
}

enum ItemUpdateOper {
	eAdd,
	eDel,
	ePosn,
	eEquipGemid,
	eEquipShengJi
}

enum QulityColorEnum {
	// 1: '#E6E6E6',	//白
	// 2: '#17FF48',	//绿
	// 3: '#3EEBFF',	//蓝
	// 4: '#E83CE2',	//紫
	// 5: '#FFFF00',	//金
	// 6: '#FF9900',	//橙
	// 7: '#E41D1D',	//红
}

enum AstarNodeState {
	NONE,
	OPEN,
	CLOSE
}

enum STATE_TYPE {
	NONE,
	IDLE,
	ATTACK,
	HIT,
	DIE
}

enum AI_COMMAND {
	NONE,

}

// enum FORMATION_POSITION
// {
// 	ONE = 0,
// 	TWO = 1,
// 	THREE = 2,
// 	FOUR = 3,
// 	FIVE = 4,
// 	SIX = 5,
// 	SEVEN = 6,
// 	EIGHT = 7,
// 	NINE = 8
// }


/**飘字类型 */
enum SkinEnum {
	SkinNone = -1,
	/**点击伤害 */
	SkinTap = 0,
	/**神兽伤害 */
	SkinPet = 1,
	/**英雄伤害 */
	SkinHero = 2,
	/**阵营伤害 */
	SkinCamp = 3,
	/**受击伤害 */
	SkinHits = 4,
	/**金币奖励 */
	RewardCoin = 5,
	/**回血 */
	SkinHP = 6,
}

enum SPECIAL_TYPE {
	/**活动 */
	ACTION,
	/**持续性BUff */
	SUSRAINED,
}

enum eCharacter_TYPE {
	/**攻击型英雄*/
	AHERO = 0,
	/**防御型英雄*/
	DHERO = 1,
	MONSTER = 2,
	PLAYER = 3,
	PET = 4,
	CAMP = 5
}

enum ATTRIBUTE_TYPE {
	HP = 1,
	Damage,
	ToSpeed,
	Crit,
	CritOdds
}

enum eSKill_SHOW_TYPE {
	NONE = 0,
	/**有飞行物的技能 */
	BALLISTIC,
	/**没有飞行物的技能 */
	NOTBALL,
}


/**技能所属类型*/
enum eBELONGS_TO {
	/**普攻 */
	ATTACK = 0,
	/**队长技能 */
	BIG,
	/**角色技能 */
	PLAYER,
}

/**关卡模式*/
enum Customs_Mode {
	Auto = 0,
	Loop = 1
}

/** 副本类型 */
enum Customs_Type {
	/** 主线关卡 */
	Customs = 1,
	/** 王者约战 */
	Kicking = 2,
	/** 世界boss */
	Boss = 3,
	/** 天梯竞技 */
	Ladder = 4,
	/** 时段记忆 */
	Memory = 5,
	/** PK联赛海选 */
	MatchElection = 6,
	/**PK联赛决赛 */
	MatchChampion =7,
}

enum E_ChatChannel {
	C_WORLD,//世界频道
	C_CAMP,//阵营频道
	C_SYSTEM,//系统频道
	C_CNUM,//频道数量
}

//聊天频道名称
let ChateNameColor: Object = {
	0: ["【世界】", "#8e1493"],
	1: ["【阵营】", "#0e6c6d"],
	2: ["【系统】", "#76381d"],
}

/** 功能开放列表*/
enum E_OpenGrade {
	EMPTY = 0,		//空
	ROLE = 1,		//角色
	HERO = 2,		//英雄
	PET = 3,		//神兽
	EQUIP = 4,		//装备，时空法器
	RANK = 5,		//排行
	SHOP = 6,		//商城
	MAIL = 7,		//邮件
	CHAT = 8,		//聊天
	CAMP = 9,		//阵营
	ACTION = 10,	//活动
	TOPIC = 11,		//话题先锋
	SEVEN = 12,		//七日签到
	KICKING = 13,	//王者约战
	BOSS = 14,		//世界BOSS
	HeroPeck = 16,	//英雄礼包
	PKMATCH = 15,	//PK联赛
	FUND = 17,		//基金
	VIP = 18,		//vip
	SHARE = 19,		//分享
	LADDER = 20,	//天梯
	ANGLE = 21,		//小仙女
	FREE = 22,		//免费钻石
	MEMORY = 23,	//时段记忆
	MoreGame=28,    // 更多游戏  暂定28

	FIRST = 101,	//首充
	DEPLOY = 102,	//功能伸缩
}

/** 冒泡对话类型*/
enum E_BubbleType {
	eNone = -1,
	ePet,
	eHero,
	eMonster,
	eSkill
}

/** 法器类型*/
enum E_EquipType {
	eNone = 0,
	eGlove = 1, 	//手套
	eRing = 2, 		//星戒
	eScroll = 3,	//卷轴
	eContainer = 4,	//容器
	eSoul = 5		//灵
}

/** 成就页面类型*/
enum E_AchievenType {
	eNone = 0,
	eDay = 1,
	eAchieven = 2,
}
/** 引导类型*/
enum E_GuidanceStep {
	E_Empty = 0,	    //空
	E_Aide,		        //引导小助手 
	E_Guidance_1,		//点击屏幕攻击BOSS
	E_Guidance_2,		//升级英雄
	E_Guidance_3,		//激活英雄
	E_Guidance_4,		//英雄布阵
	E_Guidance_5,		//进阶英雄
	E_Guidance_6,		//解锁和释放角色主动技能
	E_Guidance_7,		//切换自动闯关模式
	E_Guidance_8,		//玩家上阵英雄
	E_Guidance_9,		//神兽上阵
	E_Guidance_10,		//引导单抽
	E_Guidance_11,		//引导玩家使用免费特权
	E_Guidance_12,		//引导天梯
	E_Guidance_13,		//升级第二个英雄
	E_Guidance_14,		//時段記憶引导布阵
}

/** 广告类型 */
enum AdvertisementType {
	/** 小仙女广告 */
	angelBeats = 1,
	/** 钻石广告 */
	diamond = 2,
	/** 签到广告 */
	signIn = 3,
	/** 王者约战广告 */
	pvp = 4,
	/** 英雄进阶礼包广告 */
	heroPeck = 5,
	/** 天梯广告 */
	ladder = 6,
	/** MP恢复广告 */
	mpRecover = 7,
	/** 世界Boss广告 */
	wroldBoss = 8,
	/** 商城免费抽奖 广告 */	
	free_Luckdraw=9,
	/**  七日登陆广告版 */
	weekLogin = 10,
	/** 离线收益广告 */
	LeaveAward=11 ,
	/** 成就广告 */
	Achievement = 12,
	
}

enum eBattleType {
	Customs,
	WorldBoss,
	Memory
}