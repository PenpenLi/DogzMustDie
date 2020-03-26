-- 排行榜类型枚举
local RankTypeEnum = {
    LevelRank		= 1,	--等级榜
    GoldRank		= 2,	--财富榜
    ClickRank		= 3,	--点击榜
    ChargeRank		= 4,	--充值榜
    HeroRank		= 5,	--英雄榜

    CharmAll		= 6,	--魅力总榜
    CharmWeek		= 7,	--魅力周榜
    CharmLastWeek	= 8,	--魅力上周榜

    BossToDay       = 9,	--世界BOSS今日榜
    BossYesTerDay	= 10,	--世界BOSS昨日榜

    PKLeagueHit     = 11,   --PK联赛伤害排行榜
}
RegistEnum("RankTypeEnum", RankTypeEnum)