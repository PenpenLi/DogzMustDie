//ui管理类
module H52D_Framework {
    // 加载UI资源
    let _viewResArray: Object = {};
    export function AddViewResource(viewname: string, resArray: Array<any>) {
        _viewResArray[viewname] = resArray;
    }

    /**
     * 清除图集资源
     */
    export function ClearViewResource(viewName?: string) {
        for (let i in _viewResArray) {
            if (!viewName || i == viewName) {
                for (let j: number = 0; j < _viewResArray[i].length; j++) {
                    let url = _viewResArray[i][j];
                    if (typeof (url) == 'string') {
                        Laya.loader.clearTextureRes(url);
                    }
                    else {
                        Laya.loader.clearTextureRes(url.url);
                        
                    }
                }
            }
        }
    }

    //手机屏幕适配
    export function Adaptation(view: any) {
        if (Laya.Browser.onMobile) {
            view.width = G_StageWidth
            view.height = G_StageHeight
            view.centerY = 0;
            view.centerX = 0;
        }
    }

    export class UIManager {
        //所有命令集合
        public cmdList: Array<Command> = [];
        private static _inst: UIManager;
        public static get Instance() {
            if (UIManager._inst == null)
                UIManager._inst = new UIManager();
            return UIManager._inst;
        }

        //构造函数
        constructor() {
            Tick.FrameLoop(1, this, this.Update);
        }

        //注册命令->创建唯一ui
        public CreateUI(uiName: string, params: Array<any>, callBack?: Laya.Handler, bImmediately?: boolean): void {
            if (bImmediately) {
                this._Create(Command.CreateCmd(uiName, params, callBack));
            }
            else {
                this.cmdList.push(Command.CreateCmd(uiName, params, callBack));
            }
        }

        //注册命令->实例化多个ui
        public InstanceUI(uiName: string, params: Array<any>, callBack?: Laya.Handler): void {
            if( !params[0] ){
                return
            }
            this.cmdList.push(Command.InstanceCmd(uiName, params, callBack));
        }

        //注册命令->显示ui
        public ShowUI(ui: any, params: Array<any>, callBack?: Laya.Handler): void {
            this.cmdList.push(Command.ShowCmd(ui, params, callBack));
        }

        //注册命令->隐藏ui
        public HideUI(ui: any, params: Array<any>, callBack?: Laya.Handler): void {
            this.cmdList.push(Command.HideCmd(ui, params, callBack));
        }

        //注册命令->删除ui
        public DestroyUI(ui: any, params: Array<any>, callBack?: Laya.Handler, bImmediately?: boolean): void {
            if (bImmediately) {
                if(!params[0]){
                    return
                }
                this._Destroy(Command.DestroyCmd(ui, params, callBack));
            }
            else {
                if(!params[0]){
                    return
                }
                this.cmdList.push(Command.DestroyCmd(ui, params, callBack));
            }
        }


        //每帧调用
        public Update(): void {
            if (this.cmdList.length <= 0) return;
            let tempCmd = this.cmdList[0];
            if (tempCmd == null) {
                this.cmdList.splice(0, 1);
                return;
            }
            if (tempCmd._cmdType == CmdType.Create) {
                this._Create(tempCmd);
            }
            else if (tempCmd._cmdType == CmdType.InstanceCmd) {
                this._Instance(tempCmd);
            }
            else if (tempCmd._cmdType == CmdType.Destroy) {
                this._Destroy(tempCmd);
            }
            else if (tempCmd._cmdType == CmdType.Hide) {
                this._Hide(tempCmd);
            }
            else if (tempCmd._cmdType == CmdType.Show) {
                this._Show(tempCmd);
            }
            this.cmdList.splice(0, 1);
        }

        //创建Loading
        private _CreateLoading(cmd: Command): void {
            function _loaded() {
                let view = new LoadingView();
                view.name = String(cmd._ui);
                Adaptation(view);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }

            let view = cmd._params[0].getChildByName(String(cmd._ui)) as View;
            if (view == null) {
                let res: any = _viewResArray["LoadingView"];
                if (res != null) {
                    Laya.loader.load(res, Laya.Handler.create(this, () => {
                        _loaded();
                    }));
                }
                else {
                    _loaded();
                }
            }
        }

        //创建ui
        private _Create(cmd: Command): void {
            function _loaded(uiClass: any) {
                view = new uiClass(cmd._params);
                view.name = String(cmd._ui);
                Adaptation(view);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }
            let view = cmd._params[0].getChildByName(String(cmd._ui)) as View;
            if (view == null) {
                let uiClass = H52D_Framework[String(cmd._ui)];
                if (uiClass != null) {
                    let res: any = _viewResArray[String(cmd._ui)];
                    if (res != null) {
                        Laya.loader.load(res, Laya.Handler.create(this, () => {
                            _loaded(uiClass);
                        }));
                    }
                    else {
                        _loaded(uiClass);
                    }
                }
                else {
                    Debugger.LogError(String(cmd._ui) + "对应的类不存在，UI加载失败！");
                }
            }
        }

        //创建实例ui
        private _Instance(cmd: Command): void {
            function _loaded(uiClass: any) {
                let view = new uiClass(cmd._params);
                view.name = String(cmd._ui);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }

            let uiClass = H52D_Framework[String(cmd._ui)];
            if (uiClass != null) {
                let res: any = _viewResArray[String(cmd._ui)];
                if (res != null) {
                    Laya.loader.load(res, Laya.Handler.create(this, () => {
                        _loaded(uiClass);
                    }));
                }
                else {
                    _loaded(uiClass);
                }
            }
            else {
                Debugger.LogError(String(cmd._ui) + "对应的类不存在，UI加载失败！");
            }
        }

        //显示ui
        private _Show(cmd: Command): void {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    let ui = cmd._params[0].getChildByName(String(cmd._ui)) as View;
                    if (ui != null) {
                        ui.visible = true;
                        if (cmd._callBack != null) {
                            cmd._callBack.run();
                        }
                    }
                }
                else {
                    if (cmd._ui != null) {
                        cmd._ui.visible = true;
                        if (cmd._callBack != null) {
                            cmd._callBack.run();
                        }
                    }
                }
            }
            else {
                Debugger.LogError("UI不存在，UI显示失败！");
            }
        }

        //隐藏ui
        private _Hide(cmd: Command): void {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    let ui = cmd._params[0].getChildByName(String(cmd._ui)) as View;
                    if (ui != null) {
                        ui.visible = false;
                        if (cmd._callBack != null) {
                            cmd._callBack.run();
                        }
                    }
                }
                else {
                    if (cmd._ui != null) {
                        cmd._ui.visible = false;
                        if (cmd._callBack != null) {
                            cmd._callBack.run();
                        }
                    }
                }
            }
            else {
                Debugger.LogError("UI不存在，UI隐藏失败！");
            }
        }

        //销毁ui
        private _Destroy(cmd: Command): void {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    let ui = cmd._params[0].getChildByName(cmd._ui) as View;
                    if (ui != null) {
                        ui.destroy(true);
                    }
                }
                else {
                    if (cmd._ui != null) {
                        cmd._ui.destroy(true);
                    }
                }
                if (cmd._callBack != null)
                    cmd._callBack.run();
            }
            else {
                Debugger.LogError("UI不存在，UI销毁失败！");
            }
        }

        /**
         * 是否存在此ui
         * @param uiName ui名字
         * @param root 界面层级
         */
        public IsHave(uiName: string, root: Laya.Sprite): boolean {
            return (root.getChildByName(uiName) as View) != null;
        }
    }

    export class Command {
        //命令类型
        public _cmdType: CmdType;
        //UI名称或实例
        public _ui: any;
        //参数
        public _params: Array<any> = [];
        //回调
        public _callBack: Laya.Handler;

        //构造函数
        constructor(cmdType: CmdType, ui: any, params?: Array<any>, callBack?: Laya.Handler) {
            this._cmdType = cmdType;
            this._ui = ui;
            this._params = params;
            this._callBack = callBack;
        }

        //获取创建的命令
        public static CreateCmd(uiName: string, params: Array<any>, callBack?: Laya.Handler): Command {
            return new Command(CmdType.Create, uiName, params, callBack);
        }

        //获取实例化多个的命令
        public static InstanceCmd(uiName: string, params: Array<any>, callBack?: Laya.Handler): Command {
            return new Command(CmdType.InstanceCmd, uiName, params, callBack);
        }

        //获取显示的命令
        public static ShowCmd(ui: any, params: Array<any>, callBack?: Laya.Handler): Command {
            return new Command(CmdType.Show, ui, params, callBack);
        }

        //获取隐藏命令
        public static HideCmd(ui: any, params: Array<any>, callBack?: Laya.Handler): Command {
            return new Command(CmdType.Hide, ui, params, callBack);
        }

        //获取删除的命令
        public static DestroyCmd(ui: any, params: Array<any>, callBack?: Laya.Handler): Command {
            return new Command(CmdType.Destroy, ui, params, callBack);
        }
    }
}
