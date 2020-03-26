

local CItem = RequireClass("CItem")
function CItem:_constructor(nEnumID, tData)
	self.nEnumID = nEnumID
	if tData then
		self.nCount = tData.count
	else
		self.nCount = 0
	end 
end 

--获取配置ID
function CItem:GetEnumID()
	return self.nEnumID
end

--设置叠加数量
function CItem:SetCount( nCount )
	self.nCount = nCount
end

--获取叠加数量
function CItem:GetCount()
	return self.nCount
end

-- 获取同步客户端信息
function CItem:GetSyncClientData( )
	local tData = {
		self:GetEnumID( ),
		self:GetCount( ),
	}
	return tData
end
