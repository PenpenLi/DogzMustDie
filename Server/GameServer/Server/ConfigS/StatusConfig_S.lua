--[[ J-技能表.xlsm 状态表
[n] : 状态ID
level : 状态等级
repeatType : 替换规则
isGoodStatus : 是否增益
continueType : 状态持续类型
periodEffect : 状态周期
inlayCd : 内置冷却时间
statusType : 状态类型
effectList : 状态效果
statusBirthTarget : 状态取值目标
statusActionTarget : 状态作用目标
isDieRemove : 死亡是否消失
offlineDispose : 离线处理
]]
return {
[1] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,30000}, inlayCd=0, statusType=1, effectList={17,2000}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=0, offlineDispose=1, },
[2] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,43200000}, inlayCd=0, statusType=1, effectList={53,20000}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=0, offlineDispose=1, },
[11] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={17,1000}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=0, offlineDispose=1, },
[12] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={37,1000}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=0, offlineDispose=1, },
[13] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={47,1000}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=0, offlineDispose=1, },
[200] = { level=1, repeatType=0, isGoodStatus=1, continueType=3, periodEffect={}, inlayCd=0, statusType=1, effectList={52,50}, statusBirthTarget=0, statusActionTarget=0, isDieRemove=1, offlineDispose=0, },
[201] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,800}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[202] = { level=2, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[203] = { level=3, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,1200}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[204] = { level=4, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,1400}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[205] = { level=5, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,1600}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[301] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={4,800}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[302] = { level=2, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={4,1000}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[303] = { level=3, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={4,1200}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[304] = { level=4, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={4,1400}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[305] = { level=5, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={4,1600}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[401] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,800}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[402] = { level=2, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1000}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[403] = { level=3, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1200}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[404] = { level=4, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1400}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[405] = { level=5, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1600}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[501] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,800}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[502] = { level=2, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1200}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[503] = { level=3, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,1600}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[504] = { level=4, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,2000}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[505] = { level=5, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={5,2400}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[601] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,600}, statusBirthTarget=8, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[602] = { level=2, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,700}, statusBirthTarget=8, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[603] = { level=3, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,800}, statusBirthTarget=8, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[604] = { level=4, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,900}, statusBirthTarget=8, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[605] = { level=5, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,10000}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=8, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[1008] = { level=1, repeatType=0, isGoodStatus=0, continueType=2, periodEffect={1000,1000,4000}, inlayCd=0, statusType=6, effectList={3000}, statusBirthTarget=1, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1009] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,2000}, inlayCd=0, statusType=5, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1011] = { level=1, repeatType=0, isGoodStatus=1, continueType=3, periodEffect={}, inlayCd=0, statusType=2, effectList={3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1012] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,2000}, inlayCd=0, statusType=5, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1014] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,4000}, inlayCd=0, statusType=1, effectList={4,5000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1015] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,4000}, inlayCd=0, statusType=1, effectList={10,5000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1016] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,2000}, inlayCd=0, statusType=5, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1019] = { level=1, repeatType=0, isGoodStatus=1, continueType=3, periodEffect={}, inlayCd=0, statusType=2, effectList={3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1020] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,2000}, inlayCd=0, statusType=5, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1021] = { level=1, repeatType=0, isGoodStatus=0, continueType=2, periodEffect={1000,1000,4000}, inlayCd=0, statusType=6, effectList={3000}, statusBirthTarget=1, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1022] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,2000}, inlayCd=0, statusType=5, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1023] = { level=1, repeatType=0, isGoodStatus=0, continueType=1, periodEffect={0,0,3000}, inlayCd=0, statusType=4, effectList={}, statusBirthTarget=0, statusActionTarget=2, isDieRemove=1, offlineDispose=0, },
[1010] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,3000}, inlayCd=0, statusType=1, effectList={24,8000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1024] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,4000}, inlayCd=0, statusType=1, effectList={24,4000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1025] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,4000}, inlayCd=0, statusType=1, effectList={24,5000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1026] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,4000}, inlayCd=0, statusType=1, effectList={24,5000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[1027] = { level=1, repeatType=0, isGoodStatus=1, continueType=2, periodEffect={1000,1000,4000}, inlayCd=0, statusType=3, effectList={500}, statusBirthTarget=0, statusActionTarget=9, isDieRemove=1, offlineDispose=0, },
[10291] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10292] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10301] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10302] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,3000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10311] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,2000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10312] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,2000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10321] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=5, isDieRemove=1, offlineDispose=0, },
[10322] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=5, isDieRemove=1, offlineDispose=0, },
[10331] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={24,1000}, statusBirthTarget=0, statusActionTarget=5, isDieRemove=1, offlineDispose=0, },
[10332] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={24,1000}, statusBirthTarget=0, statusActionTarget=5, isDieRemove=1, offlineDispose=0, },
[10341] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,1000}, statusBirthTarget=0, statusActionTarget=6, isDieRemove=1, offlineDispose=0, },
[10342] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,1000}, statusBirthTarget=0, statusActionTarget=6, isDieRemove=1, offlineDispose=0, },
[10351] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={27,1000}, statusBirthTarget=0, statusActionTarget=6, isDieRemove=1, offlineDispose=0, },
[10352] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={27,1000}, statusBirthTarget=0, statusActionTarget=6, isDieRemove=1, offlineDispose=0, },
[10361] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=7, isDieRemove=1, offlineDispose=0, },
[10362] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=7, isDieRemove=1, offlineDispose=0, },
[10371] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,2000}, statusBirthTarget=0, statusActionTarget=7, isDieRemove=1, offlineDispose=0, },
[10372] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={4,2000}, statusBirthTarget=0, statusActionTarget=7, isDieRemove=1, offlineDispose=0, },
[10381] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10382] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10383] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={10,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10391] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={8,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10392] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={8,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
[10393] = { level=1, repeatType=0, isGoodStatus=1, continueType=1, periodEffect={0,0,-1}, inlayCd=0, statusType=1, effectList={8,1000}, statusBirthTarget=0, statusActionTarget=1, isDieRemove=1, offlineDispose=0, },
}