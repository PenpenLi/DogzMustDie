const DEFAULT_LAYER: number = 0;
const FLOOR_LAYER: number = 25;

//适用Utf-8格式 byte[] 转 string
function Uint8ArrayToString(array: Uint8Array): string {
    let i, len, c;
    let char2, char3;

    let out: string = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}



//生成函数名hash值
function GetBKDRHash(str: string): number {
    let seed: number = 131;
    let hash: number = 0;
    let strlen: number = str.length;

    for (let i: number = 0; i < strlen; ++i) {
        hash = (hash * seed + str.charCodeAt(i)) & 0x7FFFFFFF;
    }
    return hash;
}

function CreateUUID(): string {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++)
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    let uuid = s.join("");
    return uuid;
}

//根据向量计算角度（带正负）
function AngleSigned(from: Laya.Vector3, to: Laya.Vector3) {
    //计算角度
    let a = from.x * to.x + from.y * to.y + from.z * to.z;
    let b = Math.sqrt(from.x * from.x + from.y * from.y + from.z * from.z) * Math.sqrt(to.x * to.x + to.y * to.y + to.z * to.z);
    //计算方向
    let out: Laya.Vector3 = new Laya.Vector3();
    Laya.Vector3.cross(from, to, out);
    let dir = (Laya.Vector3.dot(Laya.Vector3.Up, out) < 0 ? -1 : 1);
    return Math.acos(a / b) * 180.0 / Math.PI * dir;
}

/**
* 求pOut在pLine以及pLine2所连直线上的投影点
* @param pLine
* @param pLine2
* @param pOut
*/
function GetProjectivePoint(pLine: Laya.Vector3, pLine2: Laya.Vector3, pOut: Laya.Vector3) {
    let k: number = GetSlope(pLine.x, pLine.z, pLine2.x, pLine2.z);
    let pProject: Laya.Vector3 = GetProjectivePoint1(pLine, k, pOut);
    let coefficient = (pProject.x - pLine.x) / (pLine2.x - pLine.x);
    if (coefficient < 0)
        coefficient = 0;
    if (coefficient > 1)
        coefficient = 1;
    return coefficient;
}

/**
* 求直线外一点到直线上的投影点
* @param pLine 线上一点
* @param k 斜率
* @param pOut 线外一点
*/
function GetProjectivePoint1(pLine: Laya.Vector3, k: number, pOut: Laya.Vector3): Laya.Vector3 {
    let x;
    let z;
    if (k == 0) {//垂线斜率不存在情况
        x = pOut.x;
        z = pLine.z;
    }
    else {
        x = (k * pLine.x + pOut.x / k + pOut.z - pLine.z) / (1 / k + k);
        z = -1 / k * (x - pOut.x) + pOut.z;
    }
    return new Laya.Vector3(x, 0, z);
}

/**
* 通过两个点坐标计算斜率
* 已知A(x1,y1),B(x2,y2)
* 1、若x1=x2,则斜率不存在
* 2、若x1≠x2,则斜率k=[y2－y1]/[x2－x1]
* @param x1
* @param y1
* @param x2
* @param y2
* @Error 如果x1==x2,则抛出该异常
*/
function GetSlope(x1: number, y1: number, x2: number, y2: number): number {
    if (x1 == x2) {
        H52D_Framework.Debugger.LogError("Slope is not existence,and div by zero!");
        return 0;
    }
    else {
        return (y2 - y1) / (x2 - x1);
    }
}

//聊天信息加密
function GetSig(roleid: string, msg: string) {
    function GetStrSum(str: string) {
        let sum = 0
        for (let i: number = 0; i < str.length; i++) {
            sum += Number(H52D_Framework.BitService.StringToBytes(str[i]));
        }
        return sum
    }

    function GetLength(str) {
        let realLength = 0, len = str.length, charCode = -1;
        for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 3;
        }
        return realLength;
    };

    let data = H52D_Framework.GameLink.Instance.urlParams;
    let strID = '0000' + data['serverid'];
    let serverid = strID.substr(strID.length - 4);
    let openid = String(data['openid']).toLowerCase() + serverid;
    let a = Math.pow((GetStrSum(openid) * GetLength(msg)), 2);
    let b = Math.pow(GetStrSum(roleid) * GetStrSum(hex_md5(msg)), 2);
    let c = Math.floor(Math.sqrt(a + b)) % 10000;
    return Math.floor(Math.sqrt(a + b)) % 10000;


}

/**
    * @brief 返回运营活动格式化时间字符串 A天B小时C分钟D秒
    * @param secs 时间戳(s)
    */
function GetActivityLastTime(secs: number): string {
    secs = Number(secs.toString().split(".")[0]);
    let day: number = Math.floor(secs / 86400);
    let hour: number = Math.floor((secs - day * 86400) / 3600);
    let min: number = Math.floor((secs - day * 86400 - hour * 3600) / 60);
    let sec: number = secs - day * 86400 - hour * 3600 - min * 60;
    let str: string = '';
    if (day > 0) {
        str = (day >= 10 ? day : '0' + day) + '天' + (hour >= 10 ? hour : '0' + hour) + '时';
    }
    else if (hour > 0) {
        str = (hour >= 10 ? hour : '0' + hour) + '时' + (min >= 10 ? min : '0' + min) + '分';
    }
    else {
        str = (min >= 10 ? min : '0' + min) + '分' + (sec >= 10 ? sec : '0' + sec) + '秒';
    }
    return str;
}

//生成md5
declare function hex_md5(str: string): string