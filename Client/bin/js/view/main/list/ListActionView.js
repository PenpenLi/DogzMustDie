var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ListActionView", [
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
    ]);
    /**
     * @class 活动主界面
     * @param zhangyusong
     */
    var ListActionView = /** @class */ (function (_super) {
        __extends(ListActionView, _super);
        function ListActionView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        ListActionView.prototype.ViewInit = function () {
            var _this = this;
            this.currVo = {};
            this.nextVo = {};
            this.voend = {};
            this.vostart = {};
            this.modelList = [];
            this.voList = H52D_Framework.MainActionLogic.Instance.voList;
            for (var type in this.voList) {
                this.CheckOverdueAction(type);
                this.voend[type] = true;
                this.vostart[type] = true;
            }
            this.actionList.vScrollBarSkin = "";
            this.FrushActionList();
            this.actionList.renderHandler = new Laya.Handler(this, function (item, index) {
                if (_this.modelList[index].ItemName) {
                    var sItemName_1 = _this.modelList[index].ItemName;
                    _this.modelList.forEach(function (model) {
                        if (model.ItemName == sItemName_1) {
                            model.ItemName = null;
                        }
                    });
                }
                _this.modelList[index].Destroy();
                _this.modelList[index].ItemName = item.name;
                _this.modelList[index].item = item;
                _this.modelList[index].Init();
            });
            this.ChangeListHigth();
        };
        ListActionView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("ActionListUpDate", Laya.Handler.create(this, this.ActionListUpDate));
            H52D_Framework.Event.RegistEvent("ActionCheck", Laya.Handler.create(this, this.ActionCheck));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            H52D_Framework.Tick.Loop(1000, this, this.FrameAction);
        };
        ListActionView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                this.actionList.height = 280 * G_StageHeightScale;
            }
            else {
                this.actionList.height = (1020 - wxsclae) * G_StageHeightScale;
            }
        };
        /** 每秒检测任务是否切换 */
        ListActionView.prototype.FrameAction = function () {
            this.modelList.forEach(function (model) {
                model.FrameAction();
            });
            for (var type in this.currVo) {
                if (!this.currVo[type]) {
                    break;
                }
                //当前活动结束之前，是活动状态
                if (this.voend[type] && this.currVo[type].timeEnd < H52D_Framework.Time.serverTime) {
                    this.voend[type] = false;
                    this.vostart[type] = true;
                    this.ActionListUpDate(this.currVo[type].id);
                }
                //下个活动开始之前，是休息状态
                else if (this.vostart[type] && !!this.nextVo[type] && this.nextVo[type].timeStart < H52D_Framework.Time.serverTime) {
                    this.vostart[type] = false;
                    this.voend[type] = true;
                    this.CheckOverdueAction(type);
                    this.FrushActionList();
                }
            }
        };
        /** 零点刷新 */
        ListActionView.prototype.ZeroRefresh = function () {
            H52D_Framework.MainActionLogic.Instance.FrushTime();
            this.FrushActionList();
        };
        /** 显示列表刷新 */
        ListActionView.prototype.FrushActionList = function () {
            var _this = this;
            this.modelList = [];
            for (var type in this.currVo) {
                var model = new H52D_Framework.ActionModel();
                model.vo = this.currVo[type];
                this.modelList.push(model);
            }
            //新开服，没活动
            if (this.modelList.length == 0) {
                for (var type in this.nextVo) {
                    this.currVo[type] = this.nextVo[type];
                    var model = new H52D_Framework.ActionModel();
                    model.vo = this.currVo[type];
                    this.modelList.push(model);
                }
            }
            H52D_Framework.Tick.Once(10, this, function () {
                _this.actionList.repeatY = _this.modelList.length;
                _this.actionList.array = _this.modelList;
            });
        };
        /**
         * 检查特定类型活动列表
         * 当前时间在活动列表空白期
         * 查找上一个活动赋给当前列表
         * 记录下一个活动
         */
        ListActionView.prototype.CheckOverdueAction = function (type) {
            var into = false;
            var befor = false;
            for (var i = 0; i < this.voList[type].length; i++) {
                var listVo = this.voList[type][i];
                //现在时刻在时间范围内，设为显示活动
                if (!into && H52D_Framework.MainActionLogic.Instance.Period(listVo)) {
                    this.currVo[type] = listVo;
                    into = befor = true;
                }
                //若无范围内活动，将现在时刻之前的活动最近的一个设为显示活动
                if (!into) {
                    if (listVo.timeEnd < H52D_Framework.Time.serverTime) {
                        if (this.currVo[type] == null) {
                            this.currVo[type] = listVo;
                        }
                        //列表中vo的结束时间比当前vo的结束时间更接近当前时刻，则替换
                        if (listVo.timeEnd.getTime() > this.currVo[type].timeEnd.getTime()) {
                            this.currVo[type] = listVo;
                        }
                        befor = true;
                    }
                }
                //若无范围前活动，将现在时刻之后的活动最近的一个，设为显示活动
                if (!befor) {
                    if (listVo.timeStart > H52D_Framework.Time.serverTime) {
                        if (this.currVo[type] == null) {
                            this.currVo[type] = listVo;
                        }
                        //列表vo的开始时间比当前vo的开始时间更接近当前时刻，则替换
                        if (listVo.timeStart.getTime() < this.currVo[type].timeStart.getTime()) {
                            this.currVo[type] = listVo;
                        }
                    }
                }
                //寻找下一个活动
                if (listVo.timeStart > H52D_Framework.Time.serverTime) {
                    if (this.nextVo[type] == null) {
                        this.nextVo[type] = listVo;
                    }
                    //列表vo的开始时间比当前vo的开始时间更接近当前时刻，则替换
                    if (listVo.timeStart.getTime() < this.nextVo[type].timeStart.getTime()) {
                        this.nextVo[type] = listVo;
                    }
                }
            }
        };
        ListActionView.prototype.ActionListUpDate = function (activityID) {
            for (var key in this.modelList) {
                var model = this.modelList[key];
                if (model.vo.id == activityID) {
                    model.UpDate();
                }
            }
        };
        /**
         * 设置按钮字为查看
         * @param data
         **/
        ListActionView.prototype.ActionCheck = function (data) {
            this.modelList.forEach(function (model) {
                if (data && model.vo.id == data[1]) {
                    model.btnWord = "查看";
                    return;
                }
            });
        };
        /** 移除事件监听 */
        ListActionView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            H52D_Framework.Event.RemoveEvent("ActionListUpDate", Laya.Handler.create(this, this.ActionListUpDate));
            H52D_Framework.Event.RemoveEvent("ActionCheck", Laya.Handler.create(this, this.ActionCheck));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Tick.ClearAll(this);
        };
        return ListActionView;
    }(ui.main.list.ListActionViewUI));
    H52D_Framework.ListActionView = ListActionView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListActionView.js.map