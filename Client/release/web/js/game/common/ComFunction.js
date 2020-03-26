var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 格式化字符串（替换%s）
     * @param value 字符串
     * @param args 替换的参数
     */
    function Format(str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var params = args.slice();
        var index = 0;
        while (str.search("%S") != -1) {
            str = str.replace('%S', "%s");
        }
        while (str.search("%s") != -1) {
            str = str.replace('%s', params[index]);
            ++index;
        }
        return str;
    }
    H52D_Framework.Format = Format;
    /**Object Array Map 类型判断长度用
     *
     */
    function GetTabLength(tab) {
        var leght = 0;
        for (var o in tab) {
            if (o) {
                leght++;
            }
        }
        return leght;
    }
    H52D_Framework.GetTabLength = GetTabLength;
    /**
     * 判断对象是否为空
     * @param object 对象
     */
    function ObjIsEmpty(object) {
        var ret = true;
        for (var key in object) {
            ret = false;
            break;
        }
        return ret;
    }
    H52D_Framework.ObjIsEmpty = ObjIsEmpty;
    /**对象的长度 */
    function ObjLength(object) {
        var length = 0;
        for (var key in object) {
            length++;
        }
        return length;
    }
    H52D_Framework.ObjLength = ObjLength;
    /**
     * 判断字符串是否为空
     * @param str 字符串
     */
    function StringIsEmpty(str) {
        var ret = true;
        if (str && str.trim() != "") {
            ret = false;
        }
        return ret;
    }
    H52D_Framework.StringIsEmpty = StringIsEmpty;
    /**
     * 十进制转成二进制
     * @param num
     */
    function TenToTwo(num) {
        return num.toString(2);
    }
    H52D_Framework.TenToTwo = TenToTwo;
    /**
     * 二进制转成十进制
     * @param str
     */
    function TwoToTen(str) {
        return parseInt(str, 2);
    }
    H52D_Framework.TwoToTen = TwoToTen;
    /**
     * 获取本地变量
     * @param key 键值
     */
    function GetLocalStorage(key, bOnly) {
        if (bOnly) {
            return Laya.LocalStorage.getItem(key + H52D_Framework.MasterPlayer.Instance.player.ID);
        }
        else {
            return Laya.LocalStorage.getItem(key);
        }
    }
    H52D_Framework.GetLocalStorage = GetLocalStorage;
    /**
     * 设置本地变量
     * @param key 键值
     * @param value 值
     * @param bOnly 唯一性
     */
    function SetLocalStorage(key, value, bOnly) {
        if (bOnly) {
            Laya.LocalStorage.setItem(key + H52D_Framework.MasterPlayer.Instance.player.ID, value);
        }
        else {
            Laya.LocalStorage.setItem(key, value);
        }
    }
    H52D_Framework.SetLocalStorage = SetLocalStorage;
    /**
     * 获取姓氏和名字的个数
     */
    function GetNameNum() {
        var n1 = 0;
        var n2 = 0;
        var n3 = 0;
        var n4 = 0;
        for (var i in H52D_Framework.RandomNameConfig) {
            var v = H52D_Framework.RandomNameConfig[i];
            if (v.strSurnameBoy != "") {
                ++n1;
            }
            if (v.strSurnameGirl != "") {
                ++n2;
            }
            if (v.strGirl != "") {
                ++n3;
            }
            if (v.strBoy != "") {
                ++n4;
            }
        }
        return [n1, n2, n3, n4];
    }
    H52D_Framework.GetNameNum = GetNameNum;
    /**
     * 随机姓名
     * @param gender 性别
     */
    function GetRandName(gender) {
        //随机取名        
        var tLength = GetNameNum();
        var lNum = 0;
        var fNum = 0;
        var lStr = "";
        var fStr = "";
        if (gender == GenderEnum.Female) {
            lNum = tLength[2];
            fNum = tLength[0];
            lStr = "strGirl";
            fStr = "strSurnameGirl";
        }
        else if (gender == GenderEnum.Male) {
            lNum = tLength[3];
            fNum = tLength[1];
            lStr = "strBoy";
            fStr = "strSurnameBoy";
        }
        var fNameIndex = Math.ceil(fNum * Math.random());
        var lNameIndex = Math.ceil(lNum * Math.random());
        var strName = H52D_Framework.RandomNameConfig[fNameIndex][fStr] + H52D_Framework.RandomNameConfig[lNameIndex][lStr];
        return strName;
    }
    H52D_Framework.GetRandName = GetRandName;
    /**
     * 创建一个html富文本框
     * @param width 宽度
     * @param height 长度
     * @param x 位置x
     * @param y 位置y
     */
    function CreateHTMLDivElement(width, height, x, y) {
        var html = new Laya.HTMLDivElement();
        html.width = width || 0;
        html.height = height || 0;
        html.x = x || 0;
        html.y = y || 0;
        return html;
    }
    H52D_Framework.CreateHTMLDivElement = CreateHTMLDivElement;
    /**
     * 设置html样式(未经允许不能擅自扩展此接口)
     * @param html 控件
     * @param fontSize 字体大小
     * @param color 颜色
     * @param align 水平对齐方式
     * @param bold 是否加粗
     */
    function SetHtmlStyle(html, fontSize, color, align, bold, line) {
        //字体样式
        html.style.font = "SimHei";
        //字体大小
        html.style.fontSize = fontSize;
        //字体颜色
        html.style.color = color;
        //加粗
        html.style.bold = bold || false;
        //垂直对齐方式
        html.style.valign = "top";
        //水平对齐方式
        html.style.align = align;
        //字体间距
        html.style.letterSpacing = 1.5;
        //自动换行
        html.style.wordWrap = true;
        //行间距
        html.style.leading = 6;
        //下划线(可用到text)
        html.style.underLine = line;
    }
    H52D_Framework.SetHtmlStyle = SetHtmlStyle;
    /**
     * 返回带有颜色的html文本
     * @param str 文本
     * @param color 颜色
     */
    function GetHtmlStrByColor(str, color, font) {
        if (font) {
            return "<span style='color:" + color + " ; fontSize:" + font + "'>" + str + "</span>";
        }
        else {
            return "<span style='color:" + color + ";'>" + str + "</span>";
        }
    }
    H52D_Framework.GetHtmlStrByColor = GetHtmlStrByColor;
    /**
     * 根据秒返回时间字符串（XX天YY小时、XX小时YY分钟、XX分钟YY秒）
     * @param secs 秒
     */
    function GetFormatTime(secs) {
        secs = Number(secs.toString().split(".")[0]);
        var day = Math.floor(secs / 86400);
        var hour = Math.floor((secs - day * 86400) / 3600);
        var min = Math.floor((secs - hour * 3600) / 60);
        var sec = secs - hour * 3600 - min * 60;
        var str = '';
        if (day > 0) {
            str = (day >= 10 ? day : '0' + day) + '天' + (hour >= 10 ? hour : '0' + hour) + '小时';
        }
        else if (hour > 0) {
            str = (hour >= 10 ? hour : '0' + hour) + '小时' + (min >= 10 ? min : '0' + min) + '分钟';
        }
        else if (min > 0) {
            str = (min >= 10 ? min : '0' + min) + '分钟' + (sec >= 10 ? sec : '0' + sec) + '秒';
        }
        else {
            str = (min >= 10 ? min : '0' + min) + '分钟' + (sec >= 10 ? sec : '0' + sec) + '秒';
        }
        if (secs <= 0)
            return "";
        return str;
    }
    H52D_Framework.GetFormatTime = GetFormatTime;
    /**
        * 根据秒返回时间字符串（00:00:00）
        * @param secs 秒
        */
    function GetFormatNumTime(secs, ntype) {
        if (!secs) {
            secs = 0;
        }
        secs = Number(secs.toString().split(".")[0]);
        var day = Math.floor(secs / 86400);
        var hour = Math.floor(secs / 3600) % 24;
        var min = Math.floor(secs / 60) % 60;
        var sec = secs % 60;
        var date = day > 0 ? day + "天" : "";
        if (ntype) {
            return "" + (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
        }
        return date + (hour >= 10 ? hour : '0' + hour) + ':' + (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
    }
    H52D_Framework.GetFormatNumTime = GetFormatNumTime;
    function TimeYMDHMS(i_nSecs) {
        var arr = [];
        var aa = new Date(i_nSecs);
        var n = aa.getFullYear();
        arr.push(n);
        n = aa.getMonth() + 1;
        arr.push(n);
        n = aa.getDate();
        arr.push(n);
        n = aa.getHours();
        arr.push(n);
        n = aa.getMinutes();
        arr.push(n);
        n = aa.getSeconds();
        arr.push(n);
        return arr;
    }
    H52D_Framework.TimeYMDHMS = TimeYMDHMS;
    /**
     * 获取属性对应战斗力
     * @param attrId 属性id
     * @param attrNum 属性值
     */
    function GetCombatPower(attrId, attrNum) {
        // return Math.floor(attrNum * QualityValue[attrId].dwValue);
        return 0;
    }
    H52D_Framework.GetCombatPower = GetCombatPower;
    /**
     * 获取随机属性倍数
     * @param attrNum 属性值
     * @param randQul 随机系数
     */
    function GetRandAttrVal(attrNum, randQul) {
        if (randQul == 0)
            return 0;
        return Number((attrNum * (randQul / 1000)).toFixed(0));
    }
    H52D_Framework.GetRandAttrVal = GetRandAttrVal;
    var TimeMapping = {};
    /**
     * 延迟调用
     * @param time
     * @param oneFunc
     * @param name
     */
    function OneTimer(time, oneFunc, sname) {
        if (sname && TimeMapping[sname] == true) {
            return;
        }
        TimeMapping[sname] = true;
        H52D_Framework.Tick.Once(time, this, function () {
            if (oneFunc) {
                oneFunc();
            }
            if (sname) {
                TimeMapping[sname] = false;
            }
        });
    }
    H52D_Framework.OneTimer = OneTimer;
    function GetIcon(icon) {
        return "ui_icon/" + icon;
    }
    H52D_Framework.GetIcon = GetIcon;
    function GetHeadIcon(headID) {
        if (headID == 1) {
            return "ui_head/icon-tou-lydd.png";
        }
        else {
            return "ui_head/icon-tou-zrt.png";
        }
    }
    H52D_Framework.GetHeadIcon = GetHeadIcon;
    function FormatTime() {
        var nowDate = new Date();
        var hour = nowDate.getHours() + "";
        if (hour.length < 2)
            hour = "0" + hour;
        var min = nowDate.getMinutes() + "";
        if (min.length < 2)
            min = "0" + min;
        var sec = nowDate.getSeconds() + "";
        if (sec.length < 2)
            sec = "0" + sec;
        var timeStr = hour + ":" + min + ":" + sec;
        return timeStr;
    }
    H52D_Framework.FormatTime = FormatTime;
    /**
     * 缩写单位(百万)
     */
    function Abbreviation(value) {
        if (!value) {
            value = 0;
        }
        if (value >= 1000000) {
            var num = Math.round(value / 10000);
            return num + 'w';
        }
        else {
            return value.toString();
        }
    }
    H52D_Framework.Abbreviation = Abbreviation;
    /**
     * 添加场景动画
     */
    function InitSceneAnim(SceneClass, sName) {
        if (H52D_Framework.SceneAnimConfig == null) {
            return;
        }
        var tCfgInfo = H52D_Framework.SceneAnimConfig[sName];
        if (tCfgInfo != null) {
            var _loop_1 = function (idx) {
                var tCfg = tCfgInfo[idx];
                var animation = new H52D_Framework.Avatar(SceneClass);
                animation.Load(tCfg.resName, 1, tCfg.scale, 0, 0, Laya.Handler.create(SceneClass, function (animations) {
                    animations.PosX = tCfg.pos[1];
                    animations.PosY = tCfg.pos[2];
                    animations.Play(tCfg.animName, true);
                    SceneClass.setChildIndex(animations.Armature, tCfg.idx);
                }));
            };
            for (var idx in tCfgInfo) {
                _loop_1(idx);
            }
        }
    }
    H52D_Framework.InitSceneAnim = InitSceneAnim;
    /** 是否屏蔽充值 */
    function IsShieldRecharge() {
        return Laya.Browser.onIOS || IsNotBaiDuSdk();
    }
    H52D_Framework.IsShieldRecharge = IsShieldRecharge;
    /** 判断是否不是百度平台 */
    function IsNotBaiDuSdk() {
        return window["swan"] ? false : true;
    }
    H52D_Framework.IsNotBaiDuSdk = IsNotBaiDuSdk;
    /** 是否是广告版本 */
    function IsAD() {
        //return IsShieldRecharge() && IsNotBaiDuSdk()
        return true;
    }
    H52D_Framework.IsAD = IsAD;
    /**是不是微信 */
    function IsWx() {
        if (IsAD() && IsNotBaiDuSdk() && IsShieldRecharge()) {
            return true;
        }
        else {
            return false;
        }
    }
    H52D_Framework.IsWx = IsWx;
    /** 看广告 */
    function WatchAD(adUnitId) {
        if (window['wx']) {
            H52D_Framework.wxSDKMgr.Inst.WxExcitation_Qq(adUnitId);
        }
        else if (H52D_Framework.lySDKBase.Inst.oSDK()) {
            var adData = {
                adType: "1",
                cunstomParam: {}
            };
            H52D_Framework.lySDKBase.Inst.Advert(adData, function () {
            });
        }
    }
    H52D_Framework.WatchAD = WatchAD;
    H52D_Framework.ShareInfo = null;
    /** 判断是否不是百度平台 */
    function CallShare(nType, tParam) {
        var _a, _b, _c;
        if (window['wx']) {
            var tInfo = (_a = {},
                _a["calltype"] = nType,
                _a["roleid"] = H52D_Framework.MasterPlayer.Instance.player.ID,
                _a);
            if (tParam) {
                for (var k in tParam) {
                    tInfo[k] = tParam[k];
                }
            }
            H52D_Framework.ShareInfo = tInfo;
            var randomNum = Math.floor(Math.random() * 10 / 2) + 1;
            var text = H52D_Framework.BaseDefine.ShareText[randomNum] ? H52D_Framework.BaseDefine.ShareText[randomNum] : "好玩有趣上手So Easy";
            H52D_Framework.wxSDKMgr.Inst.Share({
                title: text,
                imageUrl: 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/tieba' + randomNum + '_share.jpg',
                query: 'inviter=' + H52D_Framework.MasterPlayer.Instance.player.ID
            });
        }
        else if (H52D_Framework.SDKManager.Instance.isPfLy) {
            var tInfo = (_b = {},
                _b["calltype"] = nType,
                _b["roleid"] = H52D_Framework.MasterPlayer.Instance.player.ID,
                _b);
            if (tParam) {
                for (var k in tParam) {
                    tInfo[k] = tParam[k];
                }
            }
            H52D_Framework.ShareInfo = tInfo;
            if (H52D_Framework.lySDKBase.Inst.GetSupportShare()) {
                H52D_Framework.lySDKMgr.Inst.share();
            }
            else {
                H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
            }
            if (!H52D_Framework.lySDKBase.Inst.GetSupportShareNotice()) {
                H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
            }
        }
        else if (window['swan']) {
            H52D_Framework.BaiDuSDK.Instance.CallTieBa(nType, tParam);
        }
        else {
            var tInfo = (_c = {},
                _c["calltype"] = nType,
                _c["roleid"] = H52D_Framework.MasterPlayer.Instance.player.ID,
                _c);
            if (tParam) {
                for (var k in tParam) {
                    tInfo[k] = tParam[k];
                }
            }
            H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
        }
        H52D_Framework.PfLog.Inst.SendClientLog(3001, 0);
    }
    H52D_Framework.CallShare = CallShare;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ComFunction.js.map