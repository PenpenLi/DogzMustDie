

local CHero = RequireClass("CHero")
function CHero:_constructor(nEnumID, tData)
	self.nEnumID = nEnumID
	if tData then
		self.nLevel = tData.level
		self.nStar = tData.star
	else
		self.nLevel = 1
		self.nStar = 0
	end 
end 

--获取配置ID
function CHero:GetEnumID()
	return self.nEnumID
end

--获取等级
function CHero:GetLevel()
	return self.nLevel
end

--设置等级
function CHero:SetLevel(nLevel)
	self.nLevel = nLevel
end

--设置星级
function CHero:SetStar(nStar)
	self.nStar = nStar
end

--获取星级
function CHero:GetStar()
	return self.nStar
end

-- 获取同步客户端信息
function CHero:GetSyncClientData( )
	local tData = {
		self:GetEnumID( ),
		self:GetLevel( ),
		self:GetStar( ),
	}
	return tData
end
