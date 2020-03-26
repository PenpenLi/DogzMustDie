//ui管理类
var H52D_Framework;
(function (H52D_Framework) {
    // 加载UI资源
    var _viewResArray = {};
    function AddViewResource(viewname, resArray) {
        _viewResArray[viewname] = resArray;
    }
    H52D_Framework.AddViewResource = AddViewResource;
    /**
     * 清除图集资源
     */
    function ClearViewResource(viewName) {
        for (var i in _viewResArray) {
            if (!viewName || i == viewName) {
                for (var j = 0; j < _viewResArray[i].length; j++) {
                    var url = _viewResArray[i][j];
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
    H52D_Framework.ClearViewResource = ClearViewResource;
    //手机屏幕适配
    function Adaptation(view) {
        if (Laya.Browser.onMobile) {
            view.width = G_StageWidth;
            view.height = G_StageHeight;
            view.centerY = 0;
            view.centerX = 0;
        }
    }
    H52D_Framework.Adaptation = Adaptation;
    var UIManager = /** @class */ (function () {
        //构造函数
        function UIManager() {
            //所有命令集合
            this.cmdList = [];
            H52D_Framework.Tick.FrameLoop(1, this, this.Update);
        }
        Object.defineProperty(UIManager, "Instance", {
            get: function () {
                if (UIManager._inst == null)
                    UIManager._inst = new UIManager();
                return UIManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        //注册命令->创建唯一ui
        UIManager.prototype.CreateUI = function (uiName, params, callBack, bImmediately) {
            if (bImmediately) {
                this._Create(Command.CreateCmd(uiName, params, callBack));
            }
            else {
                this.cmdList.push(Command.CreateCmd(uiName, params, callBack));
            }
        };
        //注册命令->实例化多个ui
        UIManager.prototype.InstanceUI = function (uiName, params, callBack) {
            if (!params[0]) {
                return;
            }
            this.cmdList.push(Command.InstanceCmd(uiName, params, callBack));
        };
        //注册命令->显示ui
        UIManager.prototype.ShowUI = function (ui, params, callBack) {
            this.cmdList.push(Command.ShowCmd(ui, params, callBack));
        };
        //注册命令->隐藏ui
        UIManager.prototype.HideUI = function (ui, params, callBack) {
            this.cmdList.push(Command.HideCmd(ui, params, callBack));
        };
        //注册命令->删除ui
        UIManager.prototype.DestroyUI = function (ui, params, callBack, bImmediately) {
            if (bImmediately) {
                if (!params[0]) {
                    return;
                }
                this._Destroy(Command.DestroyCmd(ui, params, callBack));
            }
            else {
                if (!params[0]) {
                    return;
                }
                this.cmdList.push(Command.DestroyCmd(ui, params, callBack));
            }
        };
        //每帧调用
        UIManager.prototype.Update = function () {
            if (this.cmdList.length <= 0)
                return;
            var tempCmd = this.cmdList[0];
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
        };
        //创建Loading
        UIManager.prototype._CreateLoading = function (cmd) {
            function _loaded() {
                var view = new H52D_Framework.LoadingView();
                view.name = String(cmd._ui);
                Adaptation(view);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }
            var view = cmd._params[0].getChildByName(String(cmd._ui));
            if (view == null) {
                var res = _viewResArray["LoadingView"];
                if (res != null) {
                    Laya.loader.load(res, Laya.Handler.create(this, function () {
                        _loaded();
                    }));
                }
                else {
                    _loaded();
                }
            }
        };
        //创建ui
        UIManager.prototype._Create = function (cmd) {
            function _loaded(uiClass) {
                view = new uiClass(cmd._params);
                view.name = String(cmd._ui);
                Adaptation(view);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }
            var view = cmd._params[0].getChildByName(String(cmd._ui));
            if (view == null) {
                var uiClass_1 = H52D_Framework[String(cmd._ui)];
                if (uiClass_1 != null) {
                    var res = _viewResArray[String(cmd._ui)];
                    if (res != null) {
                        Laya.loader.load(res, Laya.Handler.create(this, function () {
                            _loaded(uiClass_1);
                        }));
                    }
                    else {
                        _loaded(uiClass_1);
                    }
                }
                else {
                    H52D_Framework.Debugger.LogError(String(cmd._ui) + "对应的类不存在，UI加载失败！");
                }
            }
        };
        //创建实例ui
        UIManager.prototype._Instance = function (cmd) {
            function _loaded(uiClass) {
                var view = new uiClass(cmd._params);
                view.name = String(cmd._ui);
                cmd._params[0].addChild(view);
                if (cmd._callBack != null)
                    cmd._callBack.runWith(view);
            }
            var uiClass = H52D_Framework[String(cmd._ui)];
            if (uiClass != null) {
                var res = _viewResArray[String(cmd._ui)];
                if (res != null) {
                    Laya.loader.load(res, Laya.Handler.create(this, function () {
                        _loaded(uiClass);
                    }));
                }
                else {
                    _loaded(uiClass);
                }
            }
            else {
                H52D_Framework.Debugger.LogError(String(cmd._ui) + "对应的类不存在，UI加载失败！");
            }
        };
        //显示ui
        UIManager.prototype._Show = function (cmd) {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    var ui_1 = cmd._params[0].getChildByName(String(cmd._ui));
                    if (ui_1 != null) {
                        ui_1.visible = true;
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
                H52D_Framework.Debugger.LogError("UI不存在，UI显示失败！");
            }
        };
        //隐藏ui
        UIManager.prototype._Hide = function (cmd) {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    var ui_2 = cmd._params[0].getChildByName(String(cmd._ui));
                    if (ui_2 != null) {
                        ui_2.visible = false;
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
                H52D_Framework.Debugger.LogError("UI不存在，UI隐藏失败！");
            }
        };
        //销毁ui
        UIManager.prototype._Destroy = function (cmd) {
            if (cmd._ui) {
                if (typeof (cmd._ui) == 'string') {
                    var ui_3 = cmd._params[0].getChildByName(cmd._ui);
                    if (ui_3 != null) {
                        ui_3.destroy(true);
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
                H52D_Framework.Debugger.LogError("UI不存在，UI销毁失败！");
            }
        };
        /**
         * 是否存在此ui
         * @param uiName ui名字
         * @param root 界面层级
         */
        UIManager.prototype.IsHave = function (uiName, root) {
            return root.getChildByName(uiName) != null;
        };
        return UIManager;
    }());
    H52D_Framework.UIManager = UIManager;
    var Command = /** @class */ (function () {
        //构造函数
        function Command(cmdType, ui, params, callBack) {
            //参数
            this._params = [];
            this._cmdType = cmdType;
            this._ui = ui;
            this._params = params;
            this._callBack = callBack;
        }
        //获取创建的命令
        Command.CreateCmd = function (uiName, params, callBack) {
            return new Command(CmdType.Create, uiName, params, callBack);
        };
        //获取实例化多个的命令
        Command.InstanceCmd = function (uiName, params, callBack) {
            return new Command(CmdType.InstanceCmd, uiName, params, callBack);
        };
        //获取显示的命令
        Command.ShowCmd = function (ui, params, callBack) {
            return new Command(CmdType.Show, ui, params, callBack);
        };
        //获取隐藏命令
        Command.HideCmd = function (ui, params, callBack) {
            return new Command(CmdType.Hide, ui, params, callBack);
        };
        //获取删除的命令
        Command.DestroyCmd = function (ui, params, callBack) {
            return new Command(CmdType.Destroy, ui, params, callBack);
        };
        return Command;
    }());
    H52D_Framework.Command = Command;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=UIManager.js.map