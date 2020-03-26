/**Created by the LayaAirIDE*/
module H52D_Framework {
    AddViewResource("ListActionView",
        [
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
        ]);

    /**
     * @class 活动主界面
     * @param zhangyusong
     */
    export class ListActionView extends ui.main.list.ListActionViewUI implements IViewPanel {
        /** 任务列表 */
        private voList: { [type: string]: Array<ActionVo> };
        /** 当前活动 */
        private currVo: { [type: string]: ActionVo };
        /** 下一个活动 */
        private nextVo: { [type: string]: ActionVo };
        /** 活动数据列表 */
        private actionVoList: Array<ActionVo>;
        /** 活动模型列表 */
        private modelList: Array<ActionModel>;
        /** 活动结束表示 */
        private voend: { [type: string]: boolean };
        /** 活动开启表示 */
        private vostart: { [type: string]: boolean };

        public constructor() {
            super();
            this.ViewInit();
            this.EventInit();
        }

        private ViewInit(): void {
            this.currVo = {};
            this.nextVo = {};
            this.voend = {};
            this.vostart = {};
            this.modelList = [];
            this.voList = MainActionLogic.Instance.voList;
            for (let type in this.voList) {
                this.CheckOverdueAction(type);
                this.voend[type] = true;
                this.vostart[type] = true;
            }
            this.actionList.vScrollBarSkin = "";
            this.FrushActionList();
            this.actionList.renderHandler = new Laya.Handler(this, (item: Laya.Box, index: number) => {
                if (this.modelList[index].ItemName) {
                    let sItemName = this.modelList[index].ItemName
                    this.modelList.forEach((model) => {
                        if (model.ItemName == sItemName) {
                            model.ItemName = null;
                        }
                    });
                }
                this.modelList[index].Destroy();
                this.modelList[index].ItemName = item.name;
                this.modelList[index].item = item;
                this.modelList[index].Init();
            });
            this.ChangeListHigth();
        }

        private EventInit() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            Event.RegistEvent("ActionListUpDate", Laya.Handler.create(this, this.ActionListUpDate));
            Event.RegistEvent("ActionCheck", Laya.Handler.create(this, this.ActionCheck));
            Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            Event.RegistEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            Tick.Loop(1000, this, this.FrameAction);
        }

        private ChangeListHigth(): void {
            if (ViewUILogic.Instance.halfPanel) {
                this.actionList.height = 280 * G_StageHeightScale;
            } else {
                this.actionList.height = (1020 - wxsclae) * G_StageHeightScale;
            }
        }

        /** 每秒检测任务是否切换 */
        private FrameAction() {
            this.modelList.forEach((model) => {
                model.FrameAction();
            });
            for (let type in this.currVo) {
                if (!this.currVo[type]) {
                    break;
                }
                //当前活动结束之前，是活动状态
                if (this.voend[type] && this.currVo[type].timeEnd < Time.serverTime) {
                    this.voend[type] = false;
                    this.vostart[type] = true;
                    this.ActionListUpDate(this.currVo[type].id);
                }
                //下个活动开始之前，是休息状态
                else if (this.vostart[type] && !!this.nextVo[type] && this.nextVo[type].timeStart < Time.serverTime) {
                    this.vostart[type] = false;
                    this.voend[type] = true;
                    this.CheckOverdueAction(type);
                    this.FrushActionList();
                }
            }
        }

        /** 零点刷新 */
        private ZeroRefresh() {
            MainActionLogic.Instance.FrushTime();
            this.FrushActionList();
        }

        /** 显示列表刷新 */
        private FrushActionList() {
            this.modelList = [];
            for (let type in this.currVo) {
                let model: ActionModel = new ActionModel();
                model.vo = this.currVo[type];
                this.modelList.push(model);
            }
            //新开服，没活动
            if (this.modelList.length == 0) {
                for (let type in this.nextVo) {
                    this.currVo[type] = this.nextVo[type];
                    let model: ActionModel = new ActionModel();
                    model.vo = this.currVo[type];
                    this.modelList.push(model);
                }
            }
            Tick.Once(10,this,()=>{
                this.actionList.repeatY = this.modelList.length;
                this.actionList.array = this.modelList;
            });
        }

        /**
         * 检查特定类型活动列表
         * 当前时间在活动列表空白期
         * 查找上一个活动赋给当前列表
         * 记录下一个活动
         */
        private CheckOverdueAction(type: string) {
            let into: boolean = false;
            let befor: boolean = false;
            for (let i = 0; i < this.voList[type].length; i++) {
                let listVo: ActionVo = this.voList[type][i];
                //现在时刻在时间范围内，设为显示活动
                if (!into && MainActionLogic.Instance.Period(listVo)) {
                    this.currVo[type] = listVo;
                    into = befor = true;
                }
                //若无范围内活动，将现在时刻之前的活动最近的一个设为显示活动
                if (!into) {
                    if (listVo.timeEnd < Time.serverTime) {
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
                    if (listVo.timeStart > Time.serverTime) {
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
                if (listVo.timeStart > Time.serverTime) {
                    if (this.nextVo[type] == null) {
                        this.nextVo[type] = listVo;
                    }
                    //列表vo的开始时间比当前vo的开始时间更接近当前时刻，则替换
                    if (listVo.timeStart.getTime() < this.nextVo[type].timeStart.getTime()) {
                        this.nextVo[type] = listVo;
                    }
                }
            }
        }

        private ActionListUpDate(activityID: number) {
            for (let key in this.modelList) {
                let model: ActionModel = this.modelList[key];
                if (model.vo.id == activityID) {
                    model.UpDate();
                }
            }
        }

        /**
         * 设置按钮字为查看
         * @param data
         **/
        private ActionCheck(data: any) {
            this.modelList.forEach(model => {
                if (data && model.vo.id == data[1]) {
                    model.btnWord = "查看";
                    return;
                }
            });
        }

        /** 移除事件监听 */
        public Destroy(): void {
            Event.RemoveEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            Event.RemoveEvent("ActionListUpDate", Laya.Handler.create(this, this.ActionListUpDate));
            Event.RemoveEvent("ActionCheck", Laya.Handler.create(this, this.ActionCheck));
            Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            Tick.ClearAll(this);
        }
    }
}