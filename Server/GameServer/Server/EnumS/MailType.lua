-- ÓÊ¼þÀàÐÍ
local MailTypeEnum = {
	TopicOver = 1, -- 话题先锋
	TopicDraw = 2, -- 话题先锋
	GiveGifts = 3, -- 赠送礼物
	Achievement = 4, -- 每日成就
	Charge = 5, -- 充值
	PackMax = 6, -- 背包满了走邮件
	VipGift = 7, -- 背包满了走邮件
	EveryDayCharge = 9, -- 每日累计充值活动 第二天没有领取奖励的发邮件
	DayConsume = 10, -- 每日累计消耗活动 第二天没有领取奖励的发邮件
	ChallengeBoss = 11, -- 世界BOSS奖励发邮件
	PKLeagueHit = 12, -- PK联赛海选邮件
	PKLeagueFight = 13, -- 2-16强决赛邮件
	PKLeagueOver = 14, -- PK联赛冠军决赛
	OnInviteVip = 15, -- 邀请VIP
	--ContiCharge = 12, -- 每日转盘

}
RegistEnum("MailTypeEnum", MailTypeEnum)
