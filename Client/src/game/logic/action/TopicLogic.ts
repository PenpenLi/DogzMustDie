module H52D_Framework {
    export enum ViewPoint {
        empty = 0,  //空
        support = 1,//支持
        against = 2,//反对
        draw = 3,   //平局
    };

    /**
     * @ 活动管理类
     * @author zhangyusong
     */
    export class TopicLogic {
        /** 活动说明ID */
        private readonly INSTRUCTION_ID: number = 6001;
        
        public list: Array<ActionVo>;
        private currVo: ActionVo;
        private type:ActionType;

        private static _inst: TopicLogic;
        public static get Instance() {
            if (TopicLogic._inst == null) {
                TopicLogic._inst = new TopicLogic();
            }
            return TopicLogic._inst;
        }

        public constructor() {
        }

        public get CurrVo(): ActionVo {
            return this.currVo;
        }

        public Initialize() {
            this.list = MainActionLogic.Instance.voList[ActionType.topic];
            this.InitEvent();
        }

        public ActivityInfo(id:number) {
            for (let i: number = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    this.currVo = this.list[i];
                    break;
                }
            }
            RemoteCall.Instance.Send("K_ReqAddTopic", this.currVo.id);
        }

        private InitEvent() {
            //****活动，话题先锋
            RemoteCall.Instance.RegistJXS2CProtocol("C_SyncTopicManager", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddTopic", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqTopicStarVote", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_TopicOver", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_TopicOverUpdate", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_TopicStart", this);
        }

        private C_SyncTopicManager(data: any) {
            let info = data[0];
            this.list.forEach(vo => {
                vo.viewPoint = ViewPoint.empty;
                if (info[vo.id]) {
                    let user: User = new User(info[vo.id]);
                    vo.contribution = user.contribution;
                    vo.viewPoint = user.viewPoint;
                    vo.stamp = user.stamp;
                }
            });
        }

        /**
         * 成功进入活动,活动面板初始化
         */
        private C_ReqAddTopic(data: any) {
            if (this.currVo.id != data[0]) return;
            this.currVo.monsterId = GameParamConfig["TalkBOSS"];
            this.currVo.countdown = Number(GameParamConfig["TalkhitTime"]);
            this.currVo.attackPoint = "话题点：" + data[1]["desc"];
            this.currVo.attackInstruction = GetInfoAttr.Instance.GetText(this.INSTRUCTION_ID);
            let user: User = new User(data[2]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
            this.currVo.win = ViewPoint.empty;
            UIManager.Instance.CreateUI("TopicView", [ViewToppestRoot,this.currVo.id]);
        }

        /**
         * 点击支持或反对后，返回的消息
         * 主要用于刷新红点儿
         */
        private C_ReqTopicStarVote(data:any){
            let user:User = new User(data[0]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
        }

        /**
         * 活动结束
         */
        private C_TopicOver(data: any) {
            if (this.Info(data)) {
                UIManager.Instance.CreateUI("ActionAttackView", [ViewToppestRoot]);
            }
        }

        private C_TopicOverUpdate(data: any) {
            if (this.Info(data)) {
                Event.DispatchEvent("TopicInit");
            }
        }

        private Info(data: any): boolean {
            if (this.currVo.id != data[0] || !this.currVo) return;
            let info = data[1];
            this.currVo.viewPoint = ViewPoint.empty;
            if (info[this.currVo.id]) {
                this.currVo.viewPoint = info[2];
            }
            if ((this.currVo.viewPoint == ViewPoint.empty) || (info[4] == null)) {
                return false;
            }
            this.currVo.monsterId = GameParamConfig["TalkBOSS"];
            this.currVo.countdown = Number(GameParamConfig["TalkhitTime"]);
            this.currVo.attackPoint = "话题点：" + info[1]["desc"];
            this.currVo.attackInstruction = GetInfoAttr.Instance.GetText(this.INSTRUCTION_ID);

            let user: User = new User(info[4]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
            this.currVo.win = info[2];
            this.currVo.supportNum = info[3][1];
            this.currVo.againstNum = info[3][2];
            return true;
        }

        /** 游戏开启刷新 */
        private C_TopicStart(buf: any) {
            let activityID = buf[0];
            Event.DispatchEvent("ActionListUpDate", activityID);
        }
    }

    // 玩家信息
    class User {
        /** 当前分数,贡献值*/
        public contribution = 0;
        /** 支持方 */
        public viewPoint: ViewPoint = ViewPoint.empty;
        /** 支持时间 */
        public stamp: number = 0;

        public constructor(buf: Object) {
            if (!buf) return;

            this.contribution = Number(buf[1]);
            this.viewPoint = buf[2] as ViewPoint;
            this.stamp = Number(buf[3]);
        }
    }
}