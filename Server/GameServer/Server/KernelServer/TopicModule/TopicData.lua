
local now = _commonservice.now
local CDBCommand		= RequireSingleton("CDBCommand")

local CActionManager = RequireSingleton("CActionManager")
local CTopicManager = RequireSingleton("CTopicManager")

local TopicList = {
	[1] = {
			desc = "2018新版税收政策无疑给大众群体减少了个人所得税压力，这种造福全人类的优待政策应该多多益善。",		-- 描述
	},

	[2] = {
		desc = "中国十大邪术之一——易容术（化妆术）无疑是现今网红风暴的始作俑者。",		-- 描述	
	},
}

-- 获取随机活动信息想
function CTopicManager:GetRandomInfo( )
	local tInfo = CActionManager:RandomTopicDesc( )
	if not tInfo then
		local nRandom = math.random( 1, #TopicList )
		tInfo = TopicList[nRandom]
	end
	return tInfo
end



