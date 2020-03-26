/**网络状态类型 */
var SocketState;
(function (SocketState) {
    SocketState[SocketState["NONE"] = 0] = "NONE";
    SocketState[SocketState["CONNECTING"] = 1] = "CONNECTING";
    SocketState[SocketState["CONNECTED"] = 2] = "CONNECTED";
    SocketState[SocketState["CLOSE"] = 3] = "CLOSE";
    SocketState[SocketState["CONNECT_FAIL"] = 4] = "CONNECT_FAIL";
})(SocketState || (SocketState = {}));
/**变量类型 */
var RemoteObjectType;
(function (RemoteObjectType) {
    RemoteObjectType[RemoteObjectType["Invalid"] = 0] = "Invalid";
    RemoteObjectType[RemoteObjectType["Bool"] = 1] = "Bool";
    RemoteObjectType[RemoteObjectType["Int8"] = 2] = "Int8";
    RemoteObjectType[RemoteObjectType["Int16"] = 3] = "Int16";
    RemoteObjectType[RemoteObjectType["Int32"] = 4] = "Int32";
    RemoteObjectType[RemoteObjectType["UInt8"] = 5] = "UInt8";
    RemoteObjectType[RemoteObjectType["UInt16"] = 6] = "UInt16";
    RemoteObjectType[RemoteObjectType["UInt32"] = 7] = "UInt32";
    RemoteObjectType[RemoteObjectType["Float"] = 8] = "Float";
    RemoteObjectType[RemoteObjectType["Double"] = 9] = "Double";
    RemoteObjectType[RemoteObjectType["String"] = 10] = "String";
    RemoteObjectType[RemoteObjectType["BigString"] = 11] = "BigString";
    RemoteObjectType[RemoteObjectType["UInt64"] = 12] = "UInt64";
    RemoteObjectType[RemoteObjectType["DataStream"] = 13] = "DataStream";
    RemoteObjectType[RemoteObjectType["Null"] = 14] = "Null";
})(RemoteObjectType || (RemoteObjectType = {}));
/**Log等级类型 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["eNone"] = 0] = "eNone";
    LogLevel[LogLevel["eError"] = 1] = "eError";
    LogLevel[LogLevel["eException"] = 2] = "eException";
    LogLevel[LogLevel["eWarning"] = 3] = "eWarning";
    LogLevel[LogLevel["eLog"] = 4] = "eLog";
})(LogLevel || (LogLevel = {}));
/**主角性别类型 */
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["None"] = 0] = "None";
    GenderEnum[GenderEnum["Male"] = 1] = "Male";
    GenderEnum[GenderEnum["Female"] = 2] = "Female";
})(GenderEnum || (GenderEnum = {}));
/**导航类型 */
var NavMeshType;
(function (NavMeshType) {
    NavMeshType[NavMeshType["NavMesh_None"] = 0] = "NavMesh_None";
    NavMeshType[NavMeshType["NavMesh_Empty"] = 1] = "NavMesh_Empty";
    NavMeshType[NavMeshType["NavMesh_Full"] = 2] = "NavMesh_Full";
    NavMeshType[NavMeshType["NavMesh_Part"] = 3] = "NavMesh_Part";
})(NavMeshType || (NavMeshType = {}));
/**UIManager命令类型 */
var CmdType;
(function (CmdType) {
    //创建ui
    CmdType[CmdType["Create"] = 0] = "Create";
    //显示ui
    CmdType[CmdType["Show"] = 1] = "Show";
    //隐藏ui
    CmdType[CmdType["Hide"] = 2] = "Hide";
    //删除ui
    CmdType[CmdType["Destroy"] = 3] = "Destroy";
    //实例多个
    CmdType[CmdType["InstanceCmd"] = 4] = "InstanceCmd";
})(CmdType || (CmdType = {}));
/**离线状态类型 */
var OffLineEnum;
(function (OffLineEnum) {
    OffLineEnum[OffLineEnum["eUnknow"] = 0] = "eUnknow";
    OffLineEnum[OffLineEnum["eBanPlay"] = 1] = "eBanPlay";
    OffLineEnum[OffLineEnum["eRepeatLogin"] = 2] = "eRepeatLogin";
    OffLineEnum[OffLineEnum["eGMKick"] = 3] = "eGMKick";
    OffLineEnum[OffLineEnum["eServerShutdown"] = 4] = "eServerShutdown";
    OffLineEnum[OffLineEnum["eLoginFailed"] = 5] = "eLoginFailed";
    OffLineEnum[OffLineEnum["eLoginServerError"] = 6] = "eLoginServerError";
    OffLineEnum[OffLineEnum["eLoginFull"] = 7] = "eLoginFull";
    OffLineEnum[OffLineEnum["eReName"] = 8] = "eReName";
    OffLineEnum[OffLineEnum["eShield"] = 9999] = "eShield";
})(OffLineEnum || (OffLineEnum = {}));
// 事件数据类型
var EventProEnum;
(function (EventProEnum) {
    EventProEnum[EventProEnum["AddGold"] = 1] = "AddGold";
    EventProEnum[EventProEnum["AddClick"] = 2] = "AddClick";
    EventProEnum[EventProEnum["Charm"] = 3] = "Charm";
    EventProEnum[EventProEnum["ChangeName"] = 4] = "ChangeName";
    EventProEnum[EventProEnum["HeroAttack"] = 5] = "HeroAttack";
    EventProEnum[EventProEnum["PetAttack"] = 6] = "PetAttack";
    EventProEnum[EventProEnum["AddEiamond"] = 7] = "AddEiamond";
    EventProEnum[EventProEnum["AddMinute"] = 8] = "AddMinute";
    EventProEnum[EventProEnum["KillBoss"] = 9] = "KillBoss";
    EventProEnum[EventProEnum["GetHeroNum"] = 10] = "GetHeroNum";
    EventProEnum[EventProEnum["HeroDPS"] = 11] = "HeroDPS";
    EventProEnum[EventProEnum["KillMonster"] = 12] = "KillMonster";
    EventProEnum[EventProEnum["GetClickCritNum"] = 13] = "GetClickCritNum";
    EventProEnum[EventProEnum["HeroAllLevel"] = 14] = "HeroAllLevel";
    EventProEnum[EventProEnum["LevelCrossing"] = 15] = "LevelCrossing";
    EventProEnum[EventProEnum["PetAllLevel"] = 16] = "PetAllLevel";
    EventProEnum[EventProEnum["UsePlayerSkill"] = 17] = "UsePlayerSkill";
    EventProEnum[EventProEnum["JoinTopicNum"] = 18] = "JoinTopicNum";
    EventProEnum[EventProEnum["UsePrivilege"] = 19] = "UsePrivilege";
    EventProEnum[EventProEnum["GangDonateTimes"] = 20] = "GangDonateTimes";
    EventProEnum[EventProEnum["CharmWeek"] = 21] = "CharmWeek";
    EventProEnum[EventProEnum["CharLastmWeek"] = 22] = "CharLastmWeek";
    EventProEnum[EventProEnum["WinCustoms"] = 23] = "WinCustoms";
    EventProEnum[EventProEnum["LotteryNum"] = 24] = "LotteryNum";
    EventProEnum[EventProEnum["NowBossRank"] = 25] = "NowBossRank";
    EventProEnum[EventProEnum["LastBossRank"] = 26] = "LastBossRank";
    EventProEnum[EventProEnum["ShareNum"] = 27] = "ShareNum";
    EventProEnum[EventProEnum["InvitationNum"] = 28] = "InvitationNum";
    EventProEnum[EventProEnum["OneLottery"] = 29] = "OneLottery";
    EventProEnum[EventProEnum["LadderTimes"] = 30] = "LadderTimes";
    EventProEnum[EventProEnum["BuyLadderTimes"] = 31] = "BuyLadderTimes";
    EventProEnum[EventProEnum["VipFlagTimes"] = 32] = "VipFlagTimes";
    EventProEnum[EventProEnum["AdDoneNum"] = 33] = "AdDoneNum";
})(EventProEnum || (EventProEnum = {}));
/** 缓存类型 */
var CacheTypeEnum;
(function (CacheTypeEnum) {
    CacheTypeEnum[CacheTypeEnum["derail"] = 0] = "derail";
    CacheTypeEnum[CacheTypeEnum["newGuid"] = 1] = "newGuid";
    CacheTypeEnum[CacheTypeEnum["story"] = 2] = "story";
    CacheTypeEnum[CacheTypeEnum["common"] = 3] = "common";
    CacheTypeEnum[CacheTypeEnum["hero"] = 4] = "hero";
})(CacheTypeEnum || (CacheTypeEnum = {}));
/***图鉴类型 */
var HandBookType;
(function (HandBookType) {
    HandBookType[HandBookType["eHeroType"] = 1] = "eHeroType";
    HandBookType[HandBookType["ePetType"] = 2] = "ePetType"; //宠物图鉴
})(HandBookType || (HandBookType = {}));
var CacheTypeCommon;
(function (CacheTypeCommon) {
    CacheTypeCommon[CacheTypeCommon["pvpSaveCombat"] = 0] = "pvpSaveCombat";
})(CacheTypeCommon || (CacheTypeCommon = {}));
/** 缓存开关数据 */
var CacheBooleanEnum;
(function (CacheBooleanEnum) {
    CacheBooleanEnum[CacheBooleanEnum["C_boolean"] = 0] = "C_boolean";
    CacheBooleanEnum[CacheBooleanEnum["sound"] = 1] = "sound";
    CacheBooleanEnum[CacheBooleanEnum["music"] = 2] = "music";
})(CacheBooleanEnum || (CacheBooleanEnum = {}));
/** 记录引导步骤是否触发 */
var GuidBooleanEnum;
(function (GuidBooleanEnum) {
    GuidBooleanEnum[GuidBooleanEnum["Guidance_1"] = 0] = "Guidance_1";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_2"] = 1] = "Guidance_2";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_3"] = 2] = "Guidance_3";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_4"] = 3] = "Guidance_4";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_5"] = 4] = "Guidance_5";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_6"] = 5] = "Guidance_6";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_7_1"] = 6] = "Guidance_7_1";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_7_2"] = 7] = "Guidance_7_2";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_7_3"] = 8] = "Guidance_7_3";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_8"] = 9] = "Guidance_8";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_9"] = 10] = "Guidance_9";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_10"] = 11] = "Guidance_10";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_11"] = 12] = "Guidance_11";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_12"] = 13] = "Guidance_12";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_13"] = 14] = "Guidance_13";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_14"] = 15] = "Guidance_14";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_war_1"] = 16] = "Guidance_war_1";
    GuidBooleanEnum[GuidBooleanEnum["Guidance_war_2"] = 17] = "Guidance_war_2";
    GuidBooleanEnum[GuidBooleanEnum["camp"] = 18] = "camp";
})(GuidBooleanEnum || (GuidBooleanEnum = {}));
var StoryEnum;
(function (StoryEnum) {
    StoryEnum[StoryEnum["story_1"] = 6] = "story_1";
    StoryEnum[StoryEnum["story_2"] = 11] = "story_2";
    StoryEnum[StoryEnum["story_3"] = 16] = "story_3";
    StoryEnum[StoryEnum["story_4"] = 21] = "story_4";
    StoryEnum[StoryEnum["story_5"] = 26] = "story_5";
    StoryEnum[StoryEnum["story_6"] = 31] = "story_6";
})(StoryEnum || (StoryEnum = {}));
/**基础物品类型 */
var ItemEnum;
(function (ItemEnum) {
    /** 元宝 */
    ItemEnum[ItemEnum["GoldIngot"] = 2] = "GoldIngot";
    /** 金币 */
    ItemEnum[ItemEnum["Gold"] = 5] = "Gold";
    /** 装备背包 */
    ItemEnum[ItemEnum["EquipPack"] = 9] = "EquipPack";
    /** 道具背包 */
    ItemEnum[ItemEnum["PropPack"] = 10] = "PropPack";
    /** 宝石背包 */
    ItemEnum[ItemEnum["GemstonePack"] = 11] = "GemstonePack";
    /** 特殊背包 */
    ItemEnum[ItemEnum["SpecialPack"] = 12] = "SpecialPack";
})(ItemEnum || (ItemEnum = {}));
var AvatarDirection;
(function (AvatarDirection) {
    AvatarDirection[AvatarDirection["right"] = 1] = "right";
    AvatarDirection[AvatarDirection["left"] = -1] = "left";
})(AvatarDirection || (AvatarDirection = {}));
var NewItemEnum;
(function (NewItemEnum) {
    NewItemEnum[NewItemEnum["eEquip"] = 0] = "eEquip";
    NewItemEnum[NewItemEnum["eProp"] = 1] = "eProp";
    NewItemEnum[NewItemEnum["eSpecial"] = 2] = "eSpecial";
    NewItemEnum[NewItemEnum["eGemstone"] = 3] = "eGemstone";
})(NewItemEnum || (NewItemEnum = {}));
var ItemPosEnum;
(function (ItemPosEnum) {
    ItemPosEnum[ItemPosEnum["ePacket"] = 0] = "ePacket";
    ItemPosEnum[ItemPosEnum["ePutOn"] = 1] = "ePutOn";
})(ItemPosEnum || (ItemPosEnum = {}));
var NewPackEnum;
(function (NewPackEnum) {
    NewPackEnum[NewPackEnum["eEquipPack"] = 0] = "eEquipPack";
    NewPackEnum[NewPackEnum["ePropPack"] = 1] = "ePropPack";
    NewPackEnum[NewPackEnum["eGemstonePack"] = 2] = "eGemstonePack";
    NewPackEnum[NewPackEnum["eSpecialPack"] = 3] = "eSpecialPack";
})(NewPackEnum || (NewPackEnum = {}));
var ItemSysOperEnum;
(function (ItemSysOperEnum) {
    ItemSysOperEnum[ItemSysOperEnum["AddItemOper"] = 0] = "AddItemOper";
    ItemSysOperEnum[ItemSysOperEnum["UpdateItemOper"] = 1] = "UpdateItemOper";
    ItemSysOperEnum[ItemSysOperEnum["DeleteItemOper"] = 2] = "DeleteItemOper";
})(ItemSysOperEnum || (ItemSysOperEnum = {}));
var ItemUpdateOper;
(function (ItemUpdateOper) {
    ItemUpdateOper[ItemUpdateOper["eAdd"] = 0] = "eAdd";
    ItemUpdateOper[ItemUpdateOper["eDel"] = 1] = "eDel";
    ItemUpdateOper[ItemUpdateOper["ePosn"] = 2] = "ePosn";
    ItemUpdateOper[ItemUpdateOper["eEquipGemid"] = 3] = "eEquipGemid";
    ItemUpdateOper[ItemUpdateOper["eEquipShengJi"] = 4] = "eEquipShengJi";
})(ItemUpdateOper || (ItemUpdateOper = {}));
var QulityColorEnum;
(function (QulityColorEnum) {
    // 1: '#E6E6E6',	//白
    // 2: '#17FF48',	//绿
    // 3: '#3EEBFF',	//蓝
    // 4: '#E83CE2',	//紫
    // 5: '#FFFF00',	//金
    // 6: '#FF9900',	//橙
    // 7: '#E41D1D',	//红
})(QulityColorEnum || (QulityColorEnum = {}));
var AstarNodeState;
(function (AstarNodeState) {
    AstarNodeState[AstarNodeState["NONE"] = 0] = "NONE";
    AstarNodeState[AstarNodeState["OPEN"] = 1] = "OPEN";
    AstarNodeState[AstarNodeState["CLOSE"] = 2] = "CLOSE";
})(AstarNodeState || (AstarNodeState = {}));
var STATE_TYPE;
(function (STATE_TYPE) {
    STATE_TYPE[STATE_TYPE["NONE"] = 0] = "NONE";
    STATE_TYPE[STATE_TYPE["IDLE"] = 1] = "IDLE";
    STATE_TYPE[STATE_TYPE["ATTACK"] = 2] = "ATTACK";
    STATE_TYPE[STATE_TYPE["HIT"] = 3] = "HIT";
    STATE_TYPE[STATE_TYPE["DIE"] = 4] = "DIE";
})(STATE_TYPE || (STATE_TYPE = {}));
var AI_COMMAND;
(function (AI_COMMAND) {
    AI_COMMAND[AI_COMMAND["NONE"] = 0] = "NONE";
})(AI_COMMAND || (AI_COMMAND = {}));
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
var SkinEnum;
(function (SkinEnum) {
    SkinEnum[SkinEnum["SkinNone"] = -1] = "SkinNone";
    /**点击伤害 */
    SkinEnum[SkinEnum["SkinTap"] = 0] = "SkinTap";
    /**神兽伤害 */
    SkinEnum[SkinEnum["SkinPet"] = 1] = "SkinPet";
    /**英雄伤害 */
    SkinEnum[SkinEnum["SkinHero"] = 2] = "SkinHero";
    /**阵营伤害 */
    SkinEnum[SkinEnum["SkinCamp"] = 3] = "SkinCamp";
    /**受击伤害 */
    SkinEnum[SkinEnum["SkinHits"] = 4] = "SkinHits";
    /**金币奖励 */
    SkinEnum[SkinEnum["RewardCoin"] = 5] = "RewardCoin";
    /**回血 */
    SkinEnum[SkinEnum["SkinHP"] = 6] = "SkinHP";
})(SkinEnum || (SkinEnum = {}));
var SPECIAL_TYPE;
(function (SPECIAL_TYPE) {
    /**活动 */
    SPECIAL_TYPE[SPECIAL_TYPE["ACTION"] = 0] = "ACTION";
    /**持续性BUff */
    SPECIAL_TYPE[SPECIAL_TYPE["SUSRAINED"] = 1] = "SUSRAINED";
})(SPECIAL_TYPE || (SPECIAL_TYPE = {}));
var eCharacter_TYPE;
(function (eCharacter_TYPE) {
    /**攻击型英雄*/
    eCharacter_TYPE[eCharacter_TYPE["AHERO"] = 0] = "AHERO";
    /**防御型英雄*/
    eCharacter_TYPE[eCharacter_TYPE["DHERO"] = 1] = "DHERO";
    eCharacter_TYPE[eCharacter_TYPE["MONSTER"] = 2] = "MONSTER";
    eCharacter_TYPE[eCharacter_TYPE["PLAYER"] = 3] = "PLAYER";
    eCharacter_TYPE[eCharacter_TYPE["PET"] = 4] = "PET";
    eCharacter_TYPE[eCharacter_TYPE["CAMP"] = 5] = "CAMP";
})(eCharacter_TYPE || (eCharacter_TYPE = {}));
var ATTRIBUTE_TYPE;
(function (ATTRIBUTE_TYPE) {
    ATTRIBUTE_TYPE[ATTRIBUTE_TYPE["HP"] = 1] = "HP";
    ATTRIBUTE_TYPE[ATTRIBUTE_TYPE["Damage"] = 2] = "Damage";
    ATTRIBUTE_TYPE[ATTRIBUTE_TYPE["ToSpeed"] = 3] = "ToSpeed";
    ATTRIBUTE_TYPE[ATTRIBUTE_TYPE["Crit"] = 4] = "Crit";
    ATTRIBUTE_TYPE[ATTRIBUTE_TYPE["CritOdds"] = 5] = "CritOdds";
})(ATTRIBUTE_TYPE || (ATTRIBUTE_TYPE = {}));
var eSKill_SHOW_TYPE;
(function (eSKill_SHOW_TYPE) {
    eSKill_SHOW_TYPE[eSKill_SHOW_TYPE["NONE"] = 0] = "NONE";
    /**有飞行物的技能 */
    eSKill_SHOW_TYPE[eSKill_SHOW_TYPE["BALLISTIC"] = 1] = "BALLISTIC";
    /**没有飞行物的技能 */
    eSKill_SHOW_TYPE[eSKill_SHOW_TYPE["NOTBALL"] = 2] = "NOTBALL";
})(eSKill_SHOW_TYPE || (eSKill_SHOW_TYPE = {}));
/**技能所属类型*/
var eBELONGS_TO;
(function (eBELONGS_TO) {
    /**普攻 */
    eBELONGS_TO[eBELONGS_TO["ATTACK"] = 0] = "ATTACK";
    /**队长技能 */
    eBELONGS_TO[eBELONGS_TO["BIG"] = 1] = "BIG";
    /**角色技能 */
    eBELONGS_TO[eBELONGS_TO["PLAYER"] = 2] = "PLAYER";
})(eBELONGS_TO || (eBELONGS_TO = {}));
/**关卡模式*/
var Customs_Mode;
(function (Customs_Mode) {
    Customs_Mode[Customs_Mode["Auto"] = 0] = "Auto";
    Customs_Mode[Customs_Mode["Loop"] = 1] = "Loop";
})(Customs_Mode || (Customs_Mode = {}));
/** 副本类型 */
var Customs_Type;
(function (Customs_Type) {
    /** 主线关卡 */
    Customs_Type[Customs_Type["Customs"] = 1] = "Customs";
    /** 王者约战 */
    Customs_Type[Customs_Type["Kicking"] = 2] = "Kicking";
    /** 世界boss */
    Customs_Type[Customs_Type["Boss"] = 3] = "Boss";
    /** 天梯竞技 */
    Customs_Type[Customs_Type["Ladder"] = 4] = "Ladder";
    /** 时段记忆 */
    Customs_Type[Customs_Type["Memory"] = 5] = "Memory";
    /** PK联赛海选 */
    Customs_Type[Customs_Type["MatchElection"] = 6] = "MatchElection";
    /**PK联赛决赛 */
    Customs_Type[Customs_Type["MatchChampion"] = 7] = "MatchChampion";
})(Customs_Type || (Customs_Type = {}));
var E_ChatChannel;
(function (E_ChatChannel) {
    E_ChatChannel[E_ChatChannel["C_WORLD"] = 0] = "C_WORLD";
    E_ChatChannel[E_ChatChannel["C_CAMP"] = 1] = "C_CAMP";
    E_ChatChannel[E_ChatChannel["C_SYSTEM"] = 2] = "C_SYSTEM";
    E_ChatChannel[E_ChatChannel["C_CNUM"] = 3] = "C_CNUM";
})(E_ChatChannel || (E_ChatChannel = {}));
//聊天频道名称
var ChateNameColor = {
    0: ["【世界】", "#8e1493"],
    1: ["【阵营】", "#0e6c6d"],
    2: ["【系统】", "#76381d"],
};
/** 功能开放列表*/
var E_OpenGrade;
(function (E_OpenGrade) {
    E_OpenGrade[E_OpenGrade["EMPTY"] = 0] = "EMPTY";
    E_OpenGrade[E_OpenGrade["ROLE"] = 1] = "ROLE";
    E_OpenGrade[E_OpenGrade["HERO"] = 2] = "HERO";
    E_OpenGrade[E_OpenGrade["PET"] = 3] = "PET";
    E_OpenGrade[E_OpenGrade["EQUIP"] = 4] = "EQUIP";
    E_OpenGrade[E_OpenGrade["RANK"] = 5] = "RANK";
    E_OpenGrade[E_OpenGrade["SHOP"] = 6] = "SHOP";
    E_OpenGrade[E_OpenGrade["MAIL"] = 7] = "MAIL";
    E_OpenGrade[E_OpenGrade["CHAT"] = 8] = "CHAT";
    E_OpenGrade[E_OpenGrade["CAMP"] = 9] = "CAMP";
    E_OpenGrade[E_OpenGrade["ACTION"] = 10] = "ACTION";
    E_OpenGrade[E_OpenGrade["TOPIC"] = 11] = "TOPIC";
    E_OpenGrade[E_OpenGrade["SEVEN"] = 12] = "SEVEN";
    E_OpenGrade[E_OpenGrade["KICKING"] = 13] = "KICKING";
    E_OpenGrade[E_OpenGrade["BOSS"] = 14] = "BOSS";
    E_OpenGrade[E_OpenGrade["HeroPeck"] = 16] = "HeroPeck";
    E_OpenGrade[E_OpenGrade["PKMATCH"] = 15] = "PKMATCH";
    E_OpenGrade[E_OpenGrade["FUND"] = 17] = "FUND";
    E_OpenGrade[E_OpenGrade["VIP"] = 18] = "VIP";
    E_OpenGrade[E_OpenGrade["SHARE"] = 19] = "SHARE";
    E_OpenGrade[E_OpenGrade["LADDER"] = 20] = "LADDER";
    E_OpenGrade[E_OpenGrade["ANGLE"] = 21] = "ANGLE";
    E_OpenGrade[E_OpenGrade["FREE"] = 22] = "FREE";
    E_OpenGrade[E_OpenGrade["MEMORY"] = 23] = "MEMORY";
    E_OpenGrade[E_OpenGrade["MoreGame"] = 28] = "MoreGame";
    E_OpenGrade[E_OpenGrade["FIRST"] = 101] = "FIRST";
    E_OpenGrade[E_OpenGrade["DEPLOY"] = 102] = "DEPLOY";
})(E_OpenGrade || (E_OpenGrade = {}));
/** 冒泡对话类型*/
var E_BubbleType;
(function (E_BubbleType) {
    E_BubbleType[E_BubbleType["eNone"] = -1] = "eNone";
    E_BubbleType[E_BubbleType["ePet"] = 0] = "ePet";
    E_BubbleType[E_BubbleType["eHero"] = 1] = "eHero";
    E_BubbleType[E_BubbleType["eMonster"] = 2] = "eMonster";
    E_BubbleType[E_BubbleType["eSkill"] = 3] = "eSkill";
})(E_BubbleType || (E_BubbleType = {}));
/** 法器类型*/
var E_EquipType;
(function (E_EquipType) {
    E_EquipType[E_EquipType["eNone"] = 0] = "eNone";
    E_EquipType[E_EquipType["eGlove"] = 1] = "eGlove";
    E_EquipType[E_EquipType["eRing"] = 2] = "eRing";
    E_EquipType[E_EquipType["eScroll"] = 3] = "eScroll";
    E_EquipType[E_EquipType["eContainer"] = 4] = "eContainer";
    E_EquipType[E_EquipType["eSoul"] = 5] = "eSoul"; //灵
})(E_EquipType || (E_EquipType = {}));
/** 成就页面类型*/
var E_AchievenType;
(function (E_AchievenType) {
    E_AchievenType[E_AchievenType["eNone"] = 0] = "eNone";
    E_AchievenType[E_AchievenType["eDay"] = 1] = "eDay";
    E_AchievenType[E_AchievenType["eAchieven"] = 2] = "eAchieven";
})(E_AchievenType || (E_AchievenType = {}));
/** 引导类型*/
var E_GuidanceStep;
(function (E_GuidanceStep) {
    E_GuidanceStep[E_GuidanceStep["E_Empty"] = 0] = "E_Empty";
    E_GuidanceStep[E_GuidanceStep["E_Aide"] = 1] = "E_Aide";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_1"] = 2] = "E_Guidance_1";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_2"] = 3] = "E_Guidance_2";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_3"] = 4] = "E_Guidance_3";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_4"] = 5] = "E_Guidance_4";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_5"] = 6] = "E_Guidance_5";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_6"] = 7] = "E_Guidance_6";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_7"] = 8] = "E_Guidance_7";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_8"] = 9] = "E_Guidance_8";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_9"] = 10] = "E_Guidance_9";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_10"] = 11] = "E_Guidance_10";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_11"] = 12] = "E_Guidance_11";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_12"] = 13] = "E_Guidance_12";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_13"] = 14] = "E_Guidance_13";
    E_GuidanceStep[E_GuidanceStep["E_Guidance_14"] = 15] = "E_Guidance_14";
})(E_GuidanceStep || (E_GuidanceStep = {}));
/** 广告类型 */
var AdvertisementType;
(function (AdvertisementType) {
    /** 小仙女广告 */
    AdvertisementType[AdvertisementType["angelBeats"] = 1] = "angelBeats";
    /** 钻石广告 */
    AdvertisementType[AdvertisementType["diamond"] = 2] = "diamond";
    /** 签到广告 */
    AdvertisementType[AdvertisementType["signIn"] = 3] = "signIn";
    /** 王者约战广告 */
    AdvertisementType[AdvertisementType["pvp"] = 4] = "pvp";
    /** 英雄进阶礼包广告 */
    AdvertisementType[AdvertisementType["heroPeck"] = 5] = "heroPeck";
    /** 天梯广告 */
    AdvertisementType[AdvertisementType["ladder"] = 6] = "ladder";
    /** MP恢复广告 */
    AdvertisementType[AdvertisementType["mpRecover"] = 7] = "mpRecover";
    /** 世界Boss广告 */
    AdvertisementType[AdvertisementType["wroldBoss"] = 8] = "wroldBoss";
    /** 商城免费抽奖 广告 */
    AdvertisementType[AdvertisementType["free_Luckdraw"] = 9] = "free_Luckdraw";
    /**  七日登陆广告版 */
    AdvertisementType[AdvertisementType["weekLogin"] = 10] = "weekLogin";
    /** 离线收益广告 */
    AdvertisementType[AdvertisementType["LeaveAward"] = 11] = "LeaveAward";
    /** 成就广告 */
    AdvertisementType[AdvertisementType["Achievement"] = 12] = "Achievement";
})(AdvertisementType || (AdvertisementType = {}));
var eBattleType;
(function (eBattleType) {
    eBattleType[eBattleType["Customs"] = 0] = "Customs";
    eBattleType[eBattleType["WorldBoss"] = 1] = "WorldBoss";
    eBattleType[eBattleType["Memory"] = 2] = "Memory";
})(eBattleType || (eBattleType = {}));
//# sourceMappingURL=GameDefine.js.map