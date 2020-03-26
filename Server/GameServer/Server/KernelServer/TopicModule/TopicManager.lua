-- 话题先锋
local now = _commonservice.now
local MailTypeEnum		= RequireEnum("MailTypeEnum")
local CDBCommand		= RequireSingleton("CDBCommand")
local ActivityConfig_S = RequireConfig("ActivityConfig_S")
local GameParamConfig_S = RequireConfig( "GameParamConfig_S" )
local CCommonFunction = RequireSingleton("CCommonFunction")
local ScheduleTaskCycleTypeEnum = RequireEnum("ScheduleTaskCycleTypeEnum")
local CSchedule = RequireSingleton("CSchedule")
local CMailManager = RequireSingleton("CMailManager")
local CPlayerManager        = RequireSingleton("CPlayerManager")
local GameEventEnum = RequireEnum("GameEventEnum")
local PlayerLogEnum = RequireEnum("PlayerLogEnum")


local CTopicManager = RequireSingleton("CTopicManager")
function CTopicManager:Initialize()
	-- 活动是否开启
	self.m_nActivityID = nil
	self.m_tTioicCfg = nil
	self.m_PlayerInfo = { }
    -- 初始化分数
    self.m_tAllGrade = {
    	[1] = 0,
    	[2] = 0,
	}

	-- 缓存上一次信息
	self.n_tLastInfo = { }
    self:LoadData()

    local nCurTime = now(1)
	for id, v in pairs(ActivityConfig_S) do
        if v.activiType == 1 then
            local sStartTime, sOverTime = string.match(v.time, "(.+)-(.+)")
            local nStartHour, nStartMin = string.match(sStartTime, "(%d+):(%d+)")
            local nOverHour, nOverMin = string.match(sOverTime, "(%d+):(%d+)")
            self.m_nLastTime = (nOverHour * 60 + nOverMin) * 60 - (nStartHour * 60 + nStartMin) * 60 -- 持续时间（sec）
            local tWeek = v.OpenDay
            if #tWeek > 0 then -- 每周指定天
                -- 开服检测活动是否开启中
                local nCurWeek = CCommonFunction.Sec2Week(nCurTime)
                for _, week in ipairs(tWeek) do
                    if week == nCurWeek then
                        local nShutSec = CCommonFunction.GetTodayThisTimeSec(tonumber(nOverHour), tonumber(nOverMin), 0)
                        if nCurTime >= CCommonFunction.GetTodayThisTimeSec(tonumber(nStartHour), tonumber(nStartMin), 0) and nCurTime < nShutSec then
                            self:Start(id)
                            break
                        end
                    end
                end
                -- 定时开关
                for _, week in ipairs(tWeek) do
                    CSchedule:AddTask(
                        {m_sWeek = tostring(week), m_sTime = sStartTime},
                        ScheduleTaskCycleTypeEnum.eWeek,
                        1,
                        0,
                        function()
                            self:Start(id)
                        end,
                        {}
                    )
                    CSchedule:AddTask(
                        {m_sWeek = tostring(week), m_sTime = sOverTime},
                        ScheduleTaskCycleTypeEnum.eWeek,
                        1,
                        0,
                        function()
                            self:Over()
                        end,
                        {}
                    )
                end
            else -- 天天都有
                -- 开服检测活动是否开启中
                local nShutSec = CCommonFunction.GetTodayThisTimeSec(tonumber(nOverHour), tonumber(nOverMin), 0)
                if nCurTime >= CCommonFunction.GetTodayThisTimeSec(tonumber(nStartHour), tonumber(nStartMin), 0) and nCurTime < nShutSec then
                    self:Start(id)
                end
                -- 定时开关
                CSchedule:AddTask(
                    {m_sTime = sStartTime},
                    ScheduleTaskCycleTypeEnum.eDay,
                    1,
                    0,
                    function()
                        self:Start(id)
                    end,
                    {}
                )
                CSchedule:AddTask(
                    {m_sTime = sOverTime},
                    ScheduleTaskCycleTypeEnum.eDay,
                    1,
                    0,
                    function()
                        self:Over()
                    end,
                    {}
                )
            end
        end
    end
	return true
end

function CTopicManager:LoadData()
    local oCmd = CDBCommand:CreateSelectCmd("topic_activity")
    oCmd:SetFields("activiid")
    oCmd:SetFields("cfg")
    oCmd:SetFields("win")
    oCmd:SetFields("num")
    local tRes = oCmd:Execute()
    if tRes and #tRes > 0 then
        for _, res in ipairs(tRes) do
            local info = {
                cfg = StrToTable( res.cfg ),
                win = res.win,
                num = StrToTable( res.num ),
                playerinfo = {},
            }
            self.n_tLastInfo[res.activiid] = info
        end 
    end 


    oCmd = CDBCommand:CreateSelectCmd("topic_playerinfo")
    oCmd:SetFields("roleid")
    oCmd:SetFields("activiid")
    oCmd:SetFields("info")
    local tRes = oCmd:Execute()
    if tRes and #tRes > 0 then
        for _, res in ipairs(tRes) do
            local tLastInfo = self.n_tLastInfo[res.activiid]
            if tLastInfo then
                if not tLastInfo.playerinfo then
                    tLastInfo.playerinfo = { }
                end 
                tLastInfo.playerinfo[res.roleid] = StrToTable( res.info )
            end 
        end 
    end 

end 

function CTopicManager:SaveData()
    local oCmd = CDBCommand:CreateDeleteCmd("topic_activity")
    oCmd:SetNoWhere()
    oCmd:Execute(true)
    local oCmd = CDBCommand:CreateDeleteCmd("topic_playerinfo")
    oCmd:SetNoWhere()
    oCmd:Execute(true)

    for nActivityID, info in pairs( self.n_tLastInfo ) do 
        local cmd = CDBCommand:CreateInsertCmd("topic_activity")
        cmd:SetFields("activiid", nActivityID)
        cmd:SetFields("cfg", TableToStr(info.cfg))
        cmd:SetFields("win", info.win)
        cmd:SetFields("num", TableToStr(info.num))
        cmd:Execute()
    end 
    for nActivityID, info in pairs( self.n_tLastInfo ) do 
        for nRoleID, playerinfo in pairs( info.playerinfo ) do 
            local cmd = CDBCommand:CreateInsertCmd("topic_playerinfo")
            cmd:SetFields("roleid", nRoleID)
            cmd:SetFields("activiid", nActivityID)
            cmd:SetFields("info", TableToStr(playerinfo))
            cmd:Execute()
        end 
    end 
end

function CTopicManager:Destruct()
    self:SaveData()
end

-- 获取玩家信息
function CTopicManager:GetPlayerInfo( oPlayer )
    local nRoleID = oPlayer:GetRoleID( )
    local tInfo = { }
    if self.m_nActivityID then
        tInfo[self.m_nActivityID] = self.m_PlayerInfo[nRoleID]
    end
    return tInfo
end


function CTopicManager:Update(i_nDeltaMsec)
end

-- 开始活动
function CTopicManager:Start(id)
    if self.m_nActivityID then
        return
    end
    delog( "CTopicManager:Start", id )
    self.m_nActivityID = id
    self.m_PlayerInfo = { }
    self.m_tTioicCfg = self:GetRandomInfo( )
    -- 初始化分数
    self.m_tAllGrade = {
    	[1] = 0,
    	[2] = 0,
	}
	-- 初始化玩家分数
	self.m_PlayerInfo = { }
end

-- 结束活动
function CTopicManager:Over()
    delog( "CTopicManager:Over Done ******************"  )
    if not self.m_nActivityID then
        return
    end

    -- 判断哪方获胜
    local nWin = 3
    if self.m_tAllGrade[1] > self.m_tAllGrade[2] then
    	nWin = 1
    elseif self.m_tAllGrade[1] < self.m_tAllGrade[2] then
    	nWin = 2
    end 
    delog( "nWin = ", nWin )

    -- 记录信息
    self.n_tLastInfo[self.m_nActivityID] = { }
    local tLastInfo = self.n_tLastInfo[self.m_nActivityID]
    tLastInfo.cfg = self.m_tTioicCfg
    tLastInfo.win = nWin
    tLastInfo.num = self.m_tAllGrade
    tLastInfo.playerinfo = { }

    local tAward = ActivityConfig_S[self.m_nActivityID].activeAward

    -- 发邮件
    for nRoleID, tPlayerInfo in pairs(self.m_PlayerInfo) do 
    	if nWin == 3 then
    		CMailManager:SendMail(nRoleID, MailTypeEnum.TopicDraw, tAward[3],{})
    	else
    		if tPlayerInfo[2] == nWin then
    			CMailManager:SendMail(nRoleID, MailTypeEnum.TopicOver, tAward[1], {nWin})
    		else
    			CMailManager:SendMail(nRoleID, MailTypeEnum.TopicOver, tAward[2], {nWin})
    		end 
    	end 
    	tLastInfo.playerinfo[nRoleID] = tPlayerInfo
		local oPlayer = CPlayerManager:GetPlayerByRoleID(nRoleID)
		if oPlayer then
			oPlayer:SendToClient( "C_TopicOverUpdate",self.m_nActivityID, self:GetPlayerLastInfo( oPlayer, self.m_nActivityID ) )
            oPlayer:DistPlaylog( PlayerLogEnum.Topic, self.m_nActivityID, 2)
		end 
    end 

    self.m_nActivityID = nil
    self.m_tTioicCfg = nil
    self.m_PlayerInfo = { }
    -- 保存活动信息
    self:SaveData()
end

function CTopicManager:GetPlayerLastInfo( oPlayer, nActivityID )
    local nRoleID = oPlayer:GetRoleID( )
    local tLastInfo = self.n_tLastInfo[nActivityID]
    if not self.n_tLastInfo[nActivityID] then
    	return { }
    end 
    local tInfo = {
    	tLastInfo.cfg,
    	tLastInfo.win,
        tLastInfo.num,
    	tLastInfo.playerinfo[nRoleID],
	}
    delog( tInfo )
    return tInfo
end

 -- 请求参加活动
function CTopicManager:ReqAddTopic(oPlayer, nActivityID)

	-- 想进入的活动没有开启
	if nActivityID ~= self.m_nActivityID then
		oPlayer:SendToClient( "C_TopicOver", nActivityID, self:GetPlayerLastInfo( oPlayer, nActivityID ) )
		return
	end 

    if not self.m_nActivityID then
    	delog( "not self.m_bRunning" )
        return
    end

    local nRoleID = oPlayer:GetRoleID( )
    if not self.m_PlayerInfo[nRoleID] then
    	self.m_PlayerInfo[nRoleID] = {
    		0, -- 分数
    		0, -- 支持方
    		0, -- 支持时间
    	}
        oPlayer:OnEvent( GameEventEnum.JoinTopicNum, 1 )
        oPlayer:DistPlaylog( PlayerLogEnum.Topic, self.m_nActivityID, 1)
    end 

	oPlayer:SendToClient( "C_ReqAddTopic",
		nActivityID, 
		self.m_tTioicCfg, 
		self.m_PlayerInfo[nRoleID] 
	)
end

 -- 请求投票 并且开始计时
function CTopicManager:ReqTopicStarVote(oPlayer, nVote)
    local nRoleID = oPlayer:GetRoleID( )
    local tPlayerInfo = self.m_PlayerInfo[nRoleID]
    if not tPlayerInfo then
    	delog( "not tPlayerInfo" )
    end 

    if tPlayerInfo[2] ~= 0 then
    	delog( "tPlayerInfo[2] ~= 0" )
    	return
    end 

    if not ( ( nVote == 1 ) or ( nVote == 2 ) ) then
    	delog( "not ( ( nVote == 1 ) or ( nVote == 2 ) )" )
    	return
    end 

    tPlayerInfo[2] = nVote
    tPlayerInfo[3] = now(1)

    oPlayer:SendToClient( "C_ReqTopicStarVote", tPlayerInfo )
end

 -- 请求投票
function CTopicManager:ReqTopicVote(oPlayer, nVote)
    delog( "CTopicManager:ReqTopicVote Done", nVote )
    local nRoleID = oPlayer:GetRoleID( )
    local tPlayerInfo = self.m_PlayerInfo[nRoleID]
    if not tPlayerInfo then
    	delog( "not tPlayerInfo" )
        return
    end 
    local nType = tPlayerInfo[2]
    if nType == 0 then
    	delog( "nType == 0" )
    	return
    end

    -- 检测是否超时
    if ( now(1) - tPlayerInfo[3] ) > ( GameParamConfig_S.TalkhitTime + 10 ) then
    	delog( "( now(1) - tPlayerInfo[3] ) > ( GameParamConfig_S.TalkhitTime + 10 )" )
    	return
    end 

    -- 添加分数
    tPlayerInfo[1] = tPlayerInfo[1] + nVote
    self.m_tAllGrade[nType] = self.m_tAllGrade[nType] + nVote
    delog( "CTopicManager:ReqTopicVote Done", tPlayerInfo[1], self.m_tAllGrade[nType] )
    oPlayer:SendToClient( "C_ReqTopicVote", tPlayerInfo[1] )
end

 -- 请求参加活动
defineC.K_ReqAddTopic = function (oPlayer, nActivityID)
	CTopicManager:ReqAddTopic(oPlayer, nActivityID)
end

 -- 请求投票 并且开始计时
defineC.K_ReqTopicStarVote = function (oPlayer, nVote)
	CTopicManager:ReqTopicStarVote(oPlayer, nVote)
end

 -- 请求投票
defineC.K_ReqTopicVote = function (oPlayer, nVoteCount)
	CTopicManager:ReqTopicVote(oPlayer, nVoteCount)
end