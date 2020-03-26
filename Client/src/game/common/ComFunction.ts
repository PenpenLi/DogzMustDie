module H52D_Framework {

    /**
     * 格式化字符串（替换%s）
     * @param value 字符串
     * @param args 替换的参数
     */
    export function Format(str: string, ...args): string {
        let params: Array<string> = [...args];
        let index = 0;
        while (str.search("%S") != -1) {
            str = str.replace('%S', "%s");
        }
        while (str.search("%s") != -1) {
            str = str.replace('%s', params[index]);
            ++index;
        }
        return str;
    }

    /**Object Array Map 类型判断长度用
     * 
     */
    export function GetTabLength(tab: any): number {
        let leght = 0;
        for (let o in tab) {
            if (o)
            { leght++; }
        }
        return leght;
    }


    /**
     * 判断对象是否为空
     * @param object 对象
     */
    export function ObjIsEmpty(object: Object): boolean {
        let ret: boolean = true;
        for (let key in object) {
            ret = false;
            break;
        }
        return ret;
    }

    /**对象的长度 */
    export function ObjLength(object: Object): number {
        let length: number = 0;
        for (let key in object) {
            length++;
        }
        return length;
    }

    /**
     * 判断字符串是否为空           
     * @param str 字符串
     */
    export function StringIsEmpty(str: string): boolean {
        let ret: boolean = true;
        if (str && str.trim() != "") {
            ret = false;
        }
        return ret;
    }

    /**
     * 十进制转成二进制
     * @param num 
     */
    export function TenToTwo(num: number): string {
        return num.toString(2);
    }

    /**
     * 二进制转成十进制
     * @param str 
     */
    export function TwoToTen(str: string): number {
        return parseInt(str, 2)
    }

    /**
     * 获取本地变量
     * @param key 键值
     */
    export function GetLocalStorage(key: string, bOnly?: boolean): string {
        if (bOnly) {
            return Laya.LocalStorage.getItem(key + MasterPlayer.Instance.player.ID);
        }
        else {
            return Laya.LocalStorage.getItem(key);
        }
    }

    /**
     * 设置本地变量
     * @param key 键值
     * @param value 值
     * @param bOnly 唯一性
     */
    export function SetLocalStorage(key: string, value: string, bOnly?: boolean) {
        if (bOnly) {
            Laya.LocalStorage.setItem(key + MasterPlayer.Instance.player.ID, value);
        }
        else {
            Laya.LocalStorage.setItem(key, value);
        }
    }

    /**
     * 获取姓氏和名字的个数
     */
    export function GetNameNum(): Array<number> {
        let n1: number = 0;
        let n2: number = 0;
        let n3: number = 0;
        let n4: number = 0;
        for (let i in RandomNameConfig) {
            let v = RandomNameConfig[i];
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

    /**
     * 随机姓名
     * @param gender 性别
     */
    export function GetRandName(gender: number): string {
        //随机取名        
        let tLength = GetNameNum();
        let lNum: number = 0;
        let fNum: number = 0;
        let lStr: string = "";
        let fStr: string = "";
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
        let fNameIndex = Math.ceil(fNum * Math.random());
        let lNameIndex = Math.ceil(lNum * Math.random());
        let strName = RandomNameConfig[fNameIndex][fStr] + RandomNameConfig[lNameIndex][lStr];
        return strName;
    }

    /**
     * 创建一个html富文本框
     * @param width 宽度
     * @param height 长度
     * @param x 位置x
     * @param y 位置y
     */
    export function CreateHTMLDivElement(width: number, height: number, x: number, y: number): Laya.HTMLDivElement {
        let html: Laya.HTMLDivElement = new Laya.HTMLDivElement();
        html.width = width || 0;
        html.height = height || 0;
        html.x = x || 0;
        html.y = y || 0;
        return html;
    }

    /**
     * 设置html样式(未经允许不能擅自扩展此接口)
     * @param html 控件
     * @param fontSize 字体大小
     * @param color 颜色
     * @param align 水平对齐方式
     * @param bold 是否加粗
     */
    export function SetHtmlStyle(html: Laya.HTMLDivElement, fontSize: number, color: string, align: string, bold?: boolean, line?: number) {
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

    /**
     * 返回带有颜色的html文本
     * @param str 文本
     * @param color 颜色
     */
    export function GetHtmlStrByColor(str: string, color: string, font?: number): string {
        if (font) {
            return "<span style='color:" + color + " ; fontSize:" + font + "'>" + str + "</span>";
        } else {
            return "<span style='color:" + color + ";'>" + str + "</span>";
        }
    }

    /**
     * 根据秒返回时间字符串（XX天YY小时、XX小时YY分钟、XX分钟YY秒）
     * @param secs 秒
     */
    export function GetFormatTime(secs: number): string {
        secs = Number(secs.toString().split(".")[0]);
        let day: number = Math.floor(secs / 86400);
        let hour: number = Math.floor((secs - day * 86400) / 3600);
        let min: number = Math.floor((secs - hour * 3600) / 60);
        let sec: number = secs - hour * 3600 - min * 60;
        let str: string = '';
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

    /**
		* 根据秒返回时间字符串（00:00:00）
		* @param secs 秒
		*/
    export function GetFormatNumTime(secs: number, ntype?: number): string {
        if (!secs) {
            secs = 0;
        }
        secs = Number(secs.toString().split(".")[0]);
        let day: number = Math.floor(secs / 86400);
        let hour: number = Math.floor(secs / 3600) % 24;
        let min: number = Math.floor(secs / 60) % 60;
        let sec: number = secs % 60;
        let date: string = day > 0 ? day + "天" : "";
        if (ntype) {
            return "" + (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
        }
        return date + (hour >= 10 ? hour : '0' + hour) + ':' + (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
    }

    export function TimeYMDHMS(i_nSecs: number): Array<any> {
        let arr: Array<any> = [];
        let aa: Date = new Date(i_nSecs);
        let n: number = aa.getFullYear();
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

    /**
     * 获取属性对应战斗力
     * @param attrId 属性id
     * @param attrNum 属性值
     */
    export function GetCombatPower(attrId: any, attrNum: number): number {
        // return Math.floor(attrNum * QualityValue[attrId].dwValue);
        return 0;
    }

    /**
     * 获取随机属性倍数
     * @param attrNum 属性值
     * @param randQul 随机系数
     */
    export function GetRandAttrVal(attrNum: number, randQul: number): number {
        if (randQul == 0) return 0;
        return Number((attrNum * (randQul / 1000)).toFixed(0));
    }

    let TimeMapping = {}
    /**
     * 延迟调用
     * @param time 
     * @param oneFunc 
     * @param name 
     */
    export function OneTimer(time: number, oneFunc: Function, sname?: string) {
        if (sname && TimeMapping[sname] == true) {
            return
        }
        TimeMapping[sname] = true
        Tick.Once(time, this, () => {
            if (oneFunc) {
                oneFunc();
            }
            if (sname) {
                TimeMapping[sname] = false
            }
        })
    }

    export function GetIcon(icon: string): string {
        return "ui_icon/" + icon;
    }

    export function GetHeadIcon(headID: number): string {
        if (headID == 1) {
            return "ui_head/icon-tou-lydd.png";
        } else {
            return "ui_head/icon-tou-zrt.png";
        }
    }

    export function FormatTime(): string {
        let nowDate: Date = new Date();
        let hour: string = nowDate.getHours() + "";
        if (hour.length < 2) hour = "0" + hour;
        let min: string = nowDate.getMinutes() + "";
        if (min.length < 2) min = "0" + min;
        let sec: string = nowDate.getSeconds() + "";
        if (sec.length < 2) sec = "0" + sec;
        let timeStr: string = hour + ":" + min + ":" + sec;
        return timeStr;
    }

    /**
     * 缩写单位(百万)
     */
    export function Abbreviation(value: number): string {
        if (!value) {
            value = 0;
        }
        if (value >= 1000000) {
            let num = Math.round(value / 10000);
            return num + 'w';
        }
        else {
            return value.toString();
        }
    }

    /**
     * 添加场景动画
     */
    export function InitSceneAnim(SceneClass, sName) {
        if (SceneAnimConfig == null) {
            return
        }
        let tCfgInfo = SceneAnimConfig[sName]
        if (tCfgInfo != null) {
            for (let idx in tCfgInfo) {
                let tCfg = tCfgInfo[idx]
                let animation = new Avatar(SceneClass)
                animation.Load(tCfg.resName, 1, tCfg.scale, 0, 0, Laya.Handler.create(SceneClass, (animations) => {
                    animations.PosX = tCfg.pos[1];
                    animations.PosY = tCfg.pos[2];
                    animations.Play(tCfg.animName, true);
                    SceneClass.setChildIndex(animations.Armature, tCfg.idx);
                }));
            }
        }
    }

    /** 是否屏蔽充值 */
    export function IsShieldRecharge() {
        return Laya.Browser.onIOS || IsNotBaiDuSdk()
    }

    /** 判断是否不是百度平台 */
    export function IsNotBaiDuSdk() {
        return window["swan"] ? false : true
    }

    /** 是否是广告版本 */
    export function IsAD() {
        //return IsShieldRecharge() && IsNotBaiDuSdk()
        return true
    }
    /**是不是微信 */
    export function IsWx() {
        if (IsAD() && IsNotBaiDuSdk() && IsShieldRecharge()) {
            return true
        } else {
            return false
        }
    }

    /** 看广告 */
    export function WatchAD(adUnitId: string) {
        if (window['wx']) {
            wxSDKMgr.Inst.WxExcitation_Qq(adUnitId);
        } else if (lySDKBase.Inst.oSDK()) {
            let adData = {
                adType: "1",
                cunstomParam: {}
            }
            lySDKBase.Inst.Advert(adData, () => {

            })
        }
    }



    export let ShareInfo = null
    /** 判断是否不是百度平台 */
    export function CallShare(nType, tParam?) {
        if (window['wx']) {
            let tInfo = {
                ["calltype"]: nType,
                ["roleid"]: MasterPlayer.Instance.player.ID,
            }
            if (tParam) {
                for (let k in tParam) {
                    tInfo[k] = tParam[k]
                }
            }
            ShareInfo = tInfo
            let randomNum = Math.floor(Math.random() * 10 / 2) + 1;
            let text = BaseDefine.ShareText[randomNum] ? BaseDefine.ShareText[randomNum] : "好玩有趣上手So Easy";
            wxSDKMgr.Inst.Share({
                title: text,
                imageUrl: 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/tieba'+randomNum+'_share.jpg',
                query: 'inviter=' + MasterPlayer.Instance.player.ID
            })
        } else if (SDKManager.Instance.isPfLy) {
            let tInfo = {
                ["calltype"]: nType,
                ["roleid"]: MasterPlayer.Instance.player.ID,
            }
            if (tParam) {
                for (let k in tParam) {
                    tInfo[k] = tParam[k]
                }
            }
            ShareInfo = tInfo
            if (lySDKBase.Inst.GetSupportShare()) {
                lySDKMgr.Inst.share()
            } else {
                RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
            }
            if (!lySDKBase.Inst.GetSupportShareNotice()) {
                RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
            }
        }
        else if (window['swan']) {
            BaiDuSDK.Instance.CallTieBa(nType, tParam);
        } else {
            let tInfo = {
                ["calltype"]: nType,
                ["roleid"]: MasterPlayer.Instance.player.ID,
            }
            if (tParam) {
                for (let k in tParam) {
                    tInfo[k] = tParam[k]
                }
            }
            RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
        }
        PfLog.Inst.SendClientLog(3001, 0);
    }
}