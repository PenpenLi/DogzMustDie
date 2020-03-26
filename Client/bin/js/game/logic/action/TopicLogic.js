var H52D_Framework;
(function (H52D_Framework) {
    var ViewPoint;
    (function (ViewPoint) {
        ViewPoint[ViewPoint["empty"] = 0] = "empty";
        ViewPoint[ViewPoint["support"] = 1] = "support";
        ViewPoint[ViewPoint["against"] = 2] = "against";
        ViewPoint[ViewPoint["draw"] = 3] = "draw";
    })(ViewPoint = H52D_Framework.ViewPoint || (H52D_Framework.ViewPoint = {}));
    ;
    /**
     * @ 活动管理类
     * @author zhangyusong
     */
    var TopicLogic = /** @class */ (function () {
        function TopicLogic() {
            /** 活动说明ID */
            this.INSTRUCTION_ID = 6001;
        }
        Object.defineProperty(TopicLogic, "Instance", {
            get: function () {
                if (TopicLogic._inst == null) {
                    TopicLogic._inst = new TopicLogic();
                }
                return TopicLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TopicLogic.prototype, "CurrVo", {
            get: function () {
                return this.currVo;
            },
            enumerable: true,
            configurable: true
        });
        TopicLogic.prototype.Initialize = function () {
            this.list = H52D_Framework.MainActionLogic.Instance.voList[H52D_Framework.ActionType.topic];
            this.InitEvent();
        };
        TopicLogic.prototype.ActivityInfo = function (id) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    this.currVo = this.list[i];
                    break;
                }
            }
            H52D_Framework.RemoteCall.Instance.Send("K_ReqAddTopic", this.currVo.id);
        };
        TopicLogic.prototype.InitEvent = function () {
            //****活动，话题先锋
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SyncTopicManager", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddTopic", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqTopicStarVote", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_TopicOver", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_TopicOverUpdate", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_TopicStart", this);
        };
        TopicLogic.prototype.C_SyncTopicManager = function (data) {
            var info = data[0];
            this.list.forEach(function (vo) {
                vo.viewPoint = ViewPoint.empty;
                if (info[vo.id]) {
                    var user = new User(info[vo.id]);
                    vo.contribution = user.contribution;
                    vo.viewPoint = user.viewPoint;
                    vo.stamp = user.stamp;
                }
            });
        };
        /**
         * 成功进入活动,活动面板初始化
         */
        TopicLogic.prototype.C_ReqAddTopic = function (data) {
            if (this.currVo.id != data[0])
                return;
            this.currVo.monsterId = H52D_Framework.GameParamConfig["TalkBOSS"];
            this.currVo.countdown = Number(H52D_Framework.GameParamConfig["TalkhitTime"]);
            this.currVo.attackPoint = "话题点：" + data[1]["desc"];
            this.currVo.attackInstruction = H52D_Framework.GetInfoAttr.Instance.GetText(this.INSTRUCTION_ID);
            var user = new User(data[2]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
            this.currVo.win = ViewPoint.empty;
            H52D_Framework.UIManager.Instance.CreateUI("TopicView", [H52D_Framework.ViewToppestRoot, this.currVo.id]);
        };
        /**
         * 点击支持或反对后，返回的消息
         * 主要用于刷新红点儿
         */
        TopicLogic.prototype.C_ReqTopicStarVote = function (data) {
            var user = new User(data[0]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
        };
        /**
         * 活动结束
         */
        TopicLogic.prototype.C_TopicOver = function (data) {
            if (this.Info(data)) {
                H52D_Framework.UIManager.Instance.CreateUI("ActionAttackView", [H52D_Framework.ViewToppestRoot]);
            }
        };
        TopicLogic.prototype.C_TopicOverUpdate = function (data) {
            if (this.Info(data)) {
                H52D_Framework.Event.DispatchEvent("TopicInit");
            }
        };
        TopicLogic.prototype.Info = function (data) {
            if (this.currVo.id != data[0] || !this.currVo)
                return;
            var info = data[1];
            this.currVo.viewPoint = ViewPoint.empty;
            if (info[this.currVo.id]) {
                this.currVo.viewPoint = info[2];
            }
            if ((this.currVo.viewPoint == ViewPoint.empty) || (info[4] == null)) {
                return false;
            }
            this.currVo.monsterId = H52D_Framework.GameParamConfig["TalkBOSS"];
            this.currVo.countdown = Number(H52D_Framework.GameParamConfig["TalkhitTime"]);
            this.currVo.attackPoint = "话题点：" + info[1]["desc"];
            this.currVo.attackInstruction = H52D_Framework.GetInfoAttr.Instance.GetText(this.INSTRUCTION_ID);
            var user = new User(info[4]);
            this.currVo.contribution = user.contribution;
            this.currVo.viewPoint = user.viewPoint;
            this.currVo.stamp = user.stamp;
            this.currVo.win = info[2];
            this.currVo.supportNum = info[3][1];
            this.currVo.againstNum = info[3][2];
            return true;
        };
        /** 游戏开启刷新 */
        TopicLogic.prototype.C_TopicStart = function (buf) {
            var activityID = buf[0];
            H52D_Framework.Event.DispatchEvent("ActionListUpDate", activityID);
        };
        return TopicLogic;
    }());
    H52D_Framework.TopicLogic = TopicLogic;
    // 玩家信息
    var User = /** @class */ (function () {
        function User(buf) {
            /** 当前分数,贡献值*/
            this.contribution = 0;
            /** 支持方 */
            this.viewPoint = ViewPoint.empty;
            /** 支持时间 */
            this.stamp = 0;
            if (!buf)
                return;
            this.contribution = Number(buf[1]);
            this.viewPoint = buf[2];
            this.stamp = Number(buf[3]);
        }
        return User;
    }());
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TopicLogic.js.map