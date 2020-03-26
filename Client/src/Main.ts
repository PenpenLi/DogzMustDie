const G_LogLevel: LogLevel = 4;
const G_IsDebug: boolean = true;
let G_StageWidth = 750;
let G_StageHeight = 1200;
let G_StageWidthScale: number = 1;
let G_StageHeightScale: number = 1;
let G_CurrentMemoryMaxSize = 100;
let Debugger = H52D_Framework.Debugger;
let GameApplication = H52D_Framework.GameApplication;
let G_ClientVersionFlag = 2;    //如果等于2，则启用提审服数据，否则启用正式服数据
/** 微信适配胶囊按钮 */
let wxsclae = 0
// 程序入口
class Main {
    //初始化引擎
    constructor() {
        // 初始化微信適配
        Laya.MiniAdpter.init();
        
        // 检测PHP
        this.PHPCheck();
        
        //舞台初始化
        Laya.init(G_StageWidth, G_StageHeight, Laya.WebGL);
        if (window['wx']) {
            Laya.loader.maxLoader = 10;
            Laya.URL.basePath = "https://tbyxz-ts.gyyx.cn/";
        }else{
            this.InitGame()
        }
    }

    public InitGame(){
        //手机适配
        this.MobileFit();
        //关闭多点触控
        laya.events.MouseManager.multiTouchEnabled = false;
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        //不更改屏幕
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //画布水平居中对齐
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        //画布垂直居中对齐
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        //帧率模式
        Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
        // 设置版本控制类型为使用文件名映射的方式
        Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        //加载版本信息文件
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.CompleteHandler));

        //添加鼠标抬起事件
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.MouseUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MOUSE);
    }

    /**  */
    private MOUSE(a, b, c) {
        let ac = 1
    }

    //先到php去请求数据，检测当前是提审版本还是正式版本；
    private PHPCheck() {
        if (Laya.Browser.window.wx) {
            let that = this;
            let php_url = 'https://ssjxzh5-serverlist.gyyx.cn/wxselserver/wxCheckStatus_tbyxz.php';
            let chkData = { version: "1.0.0.1" };
            Laya.Browser.window.wx.request({
                url: php_url,
                method: "Get",
                data: chkData,
                fail: function (res) {
                },
                success: function (res) {
                    console.log("php版本号检测回调", res);
                    G_ClientVersionFlag = res.data["status"];
                    that.InitGame()
                }
            });
        }
    }

    /**手机适配 */
    private MobileFit() {
        if (!Laya.Browser.onMobile) return;
        let widthRatio: number = G_StageWidth / Laya.Browser.clientWidth;
        let heightRatio: number = G_StageHeight / Laya.Browser.clientHeight;
        if (widthRatio > heightRatio) {
            let nScale = Laya.Browser.clientWidth / Laya.Browser.clientHeight
            let height = Math.ceil(Laya.Browser.clientHeight * widthRatio * (nScale < 0.5 ? 0.95 : 1));
            G_StageHeightScale = height / G_StageHeight
            G_StageHeight = height;
        }
        else {
            let width = Math.ceil(Laya.Browser.clientWidth * heightRatio);
            G_StageWidthScale = width / G_StageWidth
            G_StageWidth = width
        }
    }

    private CompleteHandler(): void {
        //开启统计信息
        //Laya.Stat.show();
        H52D_Framework.PfLog.Inst.SendClientLog(600, 1);
        //关闭内存自动管理
        Laya.ResourceManager.systemResourceManager.autoRelease = false;

        //管理打印信息
        if (G_IsDebug) {
            Debugger._logLevel = G_LogLevel;
            Debugger._onLog = Laya.Handler.create(this, this.OnLog);
            Debugger._onLogError = Laya.Handler.create(this, this.OnError);
            Debugger._onLogWarning = Laya.Handler.create(this, this.OnWarning);
            Debugger._onLogException = Laya.Handler.create(this, this.OnException);
            Debugger._onAssert = Laya.Handler.create(this, this.OnAssert);
        }

        //启动游戏
        GameApplication.Inst.Startup();
    }

    // 全局鼠标抬起事件
    private MouseUp() {
        H52D_Framework.Event.DispatchEvent("OnMouseUp")
    }


    private OnLog(msg: string): void {
        console.log(msg);
    }

    private OnWarning(msg: string): void {
        console.warn(msg);
    }

    private OnError(msg: string): void {
        console.error(msg);
    }

    private OnException(e): void {
        console.exception(e);
    }

    private OnAssert(condition: boolean, msg: string): void {
        console.assert(condition, msg);
    }
}

/**启动游戏 */
new Main();