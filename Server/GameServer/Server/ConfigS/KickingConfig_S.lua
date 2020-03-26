--[[ W-王者约战.xlsm 房间类型
[n] : 房间类型
roomName : 房间名称
roomIcon : 房间背景图
roomScene : 关卡ID
comeInNeed : 进门货币最低要求
winAwardBase : 胜利奖励基数
]]
return {
[1] = {
  { roomName=25101, roomIcon=1, roomScene=20001, comeInNeed=100000, winAwardBase=10000, },
  { roomName=25102, roomIcon=2, roomScene=20001, comeInNeed=200000, winAwardBase=20000, },
},
[2] = {
  { roomName=25201, roomIcon=1, roomScene=20001, comeInNeed=100, winAwardBase=10, },
  { roomName=25202, roomIcon=2, roomScene=20001, comeInNeed=200, winAwardBase=20, },
},
}