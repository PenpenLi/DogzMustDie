module H52D_Framework {
    export enum ActionType {
        topic = 1,
        kicking = 2,
        boss = 3,
        ladder = 4,
        memory = 5,
        match = 6,
    };
    /**
     * @ 活动管理类
     * @author zhangyusong
     */
    export class MainActionLogic {
        /** PK联赛，是否已经参赛 */
        public hasMatch:boolean = false;
        /** PK联赛，星期六的比赛时间 */
        public MatchTimeList:Date[];
        /** PK联赛当前时间点 */
        private timePoint:number;
        /** PK联赛活动周期 */
        private matchVo:ActionVo;

        public voList: { [key: number]: Array<ActionVo> };
        public redPointList: { [key: number]: boolean };
        private redPoint: boolean;

        private static _inst: MainActionLogic;
        public static get Instance() {
            if (MainActionLogic._inst == null) {
                MainActionLogic._inst = new MainActionLogic();
            }
            return MainActionLogic._inst;
        }

        public constructor() {
            this.voList = {};

            this.GetMatchTimeList();

            for (let id in ActivityConfig) {
                let activity = ActivityConfig[id];

                //临时屏蔽材料副本
                // if (activity["activiType"] == 6) continue;

                if (Number(activity["IsOneLine"]) == 0) {
                    continue;
                }
                //活动条信息
                let vo: ActionVo = new ActionVo();
                vo.id = Number(id);
                vo.type = activity["activiType"];
                vo.name = GetInfoAttr.Instance.GetText(activity["activiName"]);
                vo.detailsId = activity["Details"];
                vo.actionTime = activity["time"];
                //PK联赛，时间段特殊处理
                if (activity["activiType"] == 6){
                    vo.actionTime = this.MatchTimeShow(this.MatchCurrentTime()["point"]);
                }
                // vo.ledTime = activity["LedTime"];
                //奖励列表
                vo.reward = new Array<ItemModel>();
                let reward = activity["awardShow"];
                for (let r in reward) {
                    let rid: number = Number(reward[r][2]);
                    let rnum: number = Number(reward[r][3]);
                    let item: ItemModel = new ItemModel(rid);
                    item.itemNumber = rnum;
                    vo.reward.push(item);
                }
                if (this.voList[vo.type] == null) {
                    this.voList[vo.type] = new Array<ActionVo>();
                }
                this.voList[vo.type].push(vo);
            }

            this.FrushTime();
            for (let type in this.voList) {
                let actionTimeShow: string = "";
                this.voList[type].forEach(vo => {
                    actionTimeShow += (vo.actionTime + ",");
                });
                actionTimeShow = actionTimeShow.substring(0, actionTimeShow.lastIndexOf(","));
                this.voList[type].forEach(vo => {
                    vo.actionTimeShow = actionTimeShow;
                });
            }
            this.redPointList = {};
            for (let i in ActionType) {
                if (!!Number(i)) {
                    this.redPointList[i] = false;
                }
            }
            this.redPointList;
        }

        public Initialize() {
            TopicLogic.Instance.Initialize();
            KickingLogic.Instance.Initialize();
            MemoryLogic.Instance.Initialize();
            this.InitEvent();
        }

        private InitEvent() {
            Event.RegistEvent("ActionOpen", Laya.Handler.create(this, this.ActionOpen));
        }
        
        /** PK联赛获取当前时间点所处的时间段 */
        public MatchCurrentTime():Object{
            let currentDate:Date = new Date(Time.serverTime.getTime()+500);
            //不在活动时间
            let timePoint:number = MacthType.eUnopened;
            let timeStart:Date;
            let timeEnd:Date;
            //当前时间超出本次活动范围时，跳转到下一个时间段
            if( !this.Period(this.matchVo) ){
                this.GetMatchTimeList();
            }
            for(let i:number=0; i<=this.MatchTimeList.length-2; i++){
                if(currentDate >= this.MatchTimeList[i] && currentDate < this.MatchTimeList[i+1]){
                    //报名海选阶段
                    if(i==0){
                        timePoint = MacthType.eApply;
                    }
                    //海选到32强押注间歇，此时间断目前为0
                    else if(i==1){
                    }
                    //活动押注阶段，一直到冠军赛
                    else if(i==this.MatchTimeList.length-2){
                        timePoint = MacthType.eUnopened;
                    }
                    //活动押注阶段，一直到冠军赛
                    else{
                        timePoint = i;
                    }
                    timeStart = this.MatchTimeList[i];
                    timeEnd = this.MatchTimeList[i+1];
                    break;
                }
            }
            return {"start":timeStart, "end":timeEnd, "point":timePoint};
        }

        /** PK联赛指定时间点显示 */
        public MatchTimeShow(timePoint:MacthType){
            let matchTime:string = "";
            let timeStart:Date = null;
            let timeEnd:Date = null;

            if(timePoint == MacthType.eUnopened){
                timeStart = this.MatchTimeList[this.MatchTimeList.length-2];
                timeEnd = this.MatchTimeList[this.MatchTimeList.length-1];
            }
            else if(timePoint == MacthType.eApply){
                timeStart = this.MatchTimeList[0];
                timeEnd = this.MatchTimeList[1];
            }
            else{
                timeStart = this.MatchTimeList[timePoint];
                timeEnd = this.MatchTimeList[timePoint+1];
            }

            if(timePoint == MacthType.eApply || timePoint == MacthType.eUnopened){
                matchTime = this.Week(timeStart.getDay()) +
                (timeStart.getHours() < 10 ? "0" + timeStart.getHours() : timeStart.getHours()) +":"+
                (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes()) +"-"+
                this.Week(timeEnd.getDay()) +
                (timeEnd.getHours()<10 ? "0" + timeEnd.getHours() : timeEnd.getHours()) +":"+
                (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes())
            }
            else{
                matchTime = (timeStart.getHours() < 10 ? "0" + timeStart.getHours() : timeStart.getHours()) + ":" +
                (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes()) + "-" +
                (timeEnd.getHours() < 10 ? "0" + timeEnd.getHours() : timeEnd.getHours()) +":"+
                (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes());
            }
            return matchTime;
        }

        private Week(w:number){
            switch(Number(w)){
                case 1: return "星期一";
                case 2: return "星期二";
                case 3: return "星期三";
                case 4: return "星期四";
                case 5: return "星期五";
                case 6: return "星期六";
                case 7: return "星期日";
            }
        }

        /** 给定时间字符串，获取日期 */
        private GetDate(time:string, week:number=0):Date{
            if(!time){
                return null;
            }
            let today:number = Time.serverTime.getDay();
            if(today == 0){
                today = 7;
            }
            let days:number = week > 0 ? today - week : 0;
            let date:Date = new Date(Time.serverTime.getTime() - days * 24 * 60 * 60 * 1000);
            date.setHours(Number(time.split(":")[0]));
            date.setMinutes(Number(time.split(":")[1]));
            date.setSeconds(0);
            return date;
        }

        /** 获取PK联赛时间段列表 */
        private GetMatchTimeList(){
            //PK联赛时间段初始化
            let eLeagueArray = GameParamConfig["ELeagueTotalTime"].split("-");
            let sday = eLeagueArray[0].split("$");
            let eday = eLeagueArray[1].split("$");
            this.MatchTimeList = [this.GetDate(sday[1], sday[0]), this.GetDate(eday[1], eday[0])];
            let timeTab = GameParamConfig["ELeagueTime"];
            //最后一个
            let tail:number=0;
            for(let i in timeTab){
                if(tail<Number(i)){
                    tail = Number(i);
                }
            }
            this.MatchTimeList.push(this.GetDate(timeTab[1], 6));
            this.MatchTimeList.push(this.GetDate(timeTab[tail], 6));
            //结束到下周开始的时间（下周一0点）
            this.MatchTimeList.push(this.GetDate(sday[1], Number(sday[0])+7));
            if(this.matchVo == null){
                this.matchVo = new ActionVo();
            }
            this.matchVo.timeStart = this.GetDate(sday[1], Number(sday[0]));
            this.matchVo.timeEnd = this.GetDate(sday[1], Number(sday[0])+7);
        }

        /** 刷新 */
        public FrushTime() {
            for (let type in this.voList) {
                this.voList[type].forEach(vo => {
                    let cfg = ActivityConfig;
                    for (let id in ActivityConfig) {
                        if (vo.id == Number(id)) {
                            if(vo.type==6){
                                let matchTime:any = this.MatchCurrentTime();
                                vo.timeStart = matchTime.start;
                                vo.timeEnd = matchTime.end;
                            }
                            else{
                                let timeArr: Array<string> = String(ActivityConfig[id]["time"]).split("-");
                                if(timeArr[0]==""){
                                    continue;
                                }
                                vo.timeStart = this.GetDate(timeArr[0]);
                                vo.timeEnd = this.GetDate(timeArr[1]);
                            }
                        }
                    }
                });
            }
        }

        /** 活动列表显示红点 */
        public GetRedPoint(type: ActionType, vo: ActionVo): boolean {
            let redPoint: boolean = false;
            //判断开放等级够不够
            let grade: E_OpenGrade;
            switch (type) {
                case ActionType.topic: grade = E_OpenGrade.TOPIC; break;
                case ActionType.kicking: grade = E_OpenGrade.KICKING; break;
                case ActionType.boss: grade = E_OpenGrade.BOSS; break;
                case ActionType.ladder: grade = E_OpenGrade.LADDER; break;
                case ActionType.memory: grade = E_OpenGrade.MEMORY; break;
                case ActionType.match: grade = E_OpenGrade.PKMATCH; break;
            }
            redPoint = OpenCondition(grade, false);
            //判断在活动时间内
            if (redPoint) {
                redPoint = MainActionLogic.Instance.Period(vo);
            }
            if (redPoint) {
                switch (type) {
                    case ActionType.topic:
                        redPoint = vo.stamp == 0;
                        break;
                    case ActionType.kicking:
                        redPoint = KickingLogic.Instance.surplusGold > 0;
                        break;
                    case ActionType.boss:
                        redPoint = WroldBossLogic.Instance.ShowPrint();
                        break;
                    case ActionType.ladder:
                        let c_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
                        let b_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
                        let times = MasterPlayer.Instance.player.Laddertimes - c_num + b_num;
                        redPoint = times > 0;
                        break;
                    case ActionType.memory:
                        redPoint = MemoryLogic.Instance.hasNextCustoms();
                        break;
                    case ActionType.match:
                        redPoint = MatchLogic.Instance.hasTime();
                        break;
                    default:
                        redPoint = false;
                        break;
                }
            }
            return redPoint;
        }

        /** 活动列表同意显示红点 */
        public ShowRedPoint() {
            this.RedPointFrush();
        }
        private RedPointFrush() {
            let redPoint: boolean = false;
            for (let i in this.voList) {
                let list: Array<ActionVo> = this.voList[i];
                MainActionLogic.Instance.redPointList[i] = false;
                list.forEach(vo => {
                    redPoint = this.GetRedPoint(Number(i), vo);
                    if (redPoint) {
                        MainActionLogic.Instance.redPointList[i] = redPoint;
                    }
                });
            }
            redPoint = false;
            for (let i in MainActionLogic.Instance.redPointList) {
                if (MainActionLogic.Instance.redPointList[i]) {
                    redPoint = true;
                    break;
                }
            }
            if (MainActionLogic.Instance.redPoint != redPoint) {
                MainActionLogic.Instance.redPoint = redPoint;
                Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ACTION, redPoint]);
            }
        }

        /** 当前时间在时间范围内 */
        public Period(vo: ActionVo): boolean {
            if(vo.type != ActionType.match && Time.serverTime.getDay() != vo.timeStart.getDay()){
                vo.actionTime
            }
            //增加500毫秒误差
            let currTime:number = Time.serverTime.getTime() + 500;
            let into: boolean = currTime >= vo.timeStart.getTime() && currTime < vo.timeEnd.getTime();
            return into;
        }

        /**
         * 活动开启
         * @param type活动类型
         * @param id活动ID
         **/
        private ActionOpen(type: ActionType, id: number): void {
            switch (type) {
                //话题先锋
                case ActionType.topic:
                    if (OpenCondition(E_OpenGrade.TOPIC)) {
                        TopicLogic.Instance.ActivityInfo(id);
                    }
                    break;
                //pvp战斗
                case ActionType.kicking:
                    if (OpenCondition(E_OpenGrade.KICKING)) {
                        KickingLogic.Instance.ActivityInfo();
                    }
                    break;
                case ActionType.boss:
                    if (OpenCondition(E_OpenGrade.BOSS)) {
                        WroldBossLogic.Instance.OpenView();
                    }
                    break;
                case ActionType.ladder:
                    if (OpenCondition(E_OpenGrade.LADDER)) {
                        LadderManager.Instance.GetPlayData();
                    }
                    break;
                case ActionType.memory:
                    if (OpenCondition(E_OpenGrade.MEMORY)) {
                        MemoryLogic.Instance.ActivityInfo();
                    }
                    break;
                case ActionType.match:
                    if (OpenCondition(E_OpenGrade.PKMATCH)) {
                        MatchLogic.Instance.OpenMatchUI();
                    }
                    break;
            }
        }

    }
}