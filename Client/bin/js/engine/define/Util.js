var DEFAULT_LAYER = 0;
var FLOOR_LAYER = 25;
//适用Utf-8格式 byte[] 转 string
function Uint8ArrayToString(array) {
    var i, len, c;
    var char2, char3;
    var out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
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
function GetBKDRHash(str) {
    var seed = 131;
    var hash = 0;
    var strlen = str.length;
    for (var i = 0; i < strlen; ++i) {
        hash = (hash * seed + str.charCodeAt(i)) & 0x7FFFFFFF;
    }
    return hash;
}
function CreateUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++)
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
//根据向量计算角度（带正负）
function AngleSigned(from, to) {
    //计算角度
    var a = from.x * to.x + from.y * to.y + from.z * to.z;
    var b = Math.sqrt(from.x * from.x + from.y * from.y + from.z * from.z) * Math.sqrt(to.x * to.x + to.y * to.y + to.z * to.z);
    //计算方向
    var out = new Laya.Vector3();
    Laya.Vector3.cross(from, to, out);
    var dir = (Laya.Vector3.dot(Laya.Vector3.Up, out) < 0 ? -1 : 1);
    return Math.acos(a / b) * 180.0 / Math.PI * dir;
}
/**
* 求pOut在pLine以及pLine2所连直线上的投影点
* @param pLine
* @param pLine2
* @param pOut
*/
function GetProjectivePoint(pLine, pLine2, pOut) {
    var k = GetSlope(pLine.x, pLine.z, pLine2.x, pLine2.z);
    var pProject = GetProjectivePoint1(pLine, k, pOut);
    var coefficient = (pProject.x - pLine.x) / (pLine2.x - pLine.x);
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
function GetProjectivePoint1(pLine, k, pOut) {
    var x;
    var z;
    if (k == 0) { //垂线斜率不存在情况
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
function GetSlope(x1, y1, x2, y2) {
    if (x1 == x2) {
        H52D_Framework.Debugger.LogError("Slope is not existence,and div by zero!");
        return 0;
    }
    else {
        return (y2 - y1) / (x2 - x1);
    }
}
//聊天信息加密
function GetSig(roleid, msg) {
    function GetStrSum(str) {
        var sum = 0;
        for (var i = 0; i < str.length; i++) {
            sum += Number(H52D_Framework.BitService.StringToBytes(str[i]));
        }
        return sum;
    }
    function GetLength(str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 3;
        }
        return realLength;
    }
    ;
    var data = H52D_Framework.GameLink.Instance.urlParams;
    var strID = '0000' + data['serverid'];
    var serverid = strID.substr(strID.length - 4);
    var openid = String(data['openid']).toLowerCase() + serverid;
    var a = Math.pow((GetStrSum(openid) * GetLength(msg)), 2);
    var b = Math.pow(GetStrSum(roleid) * GetStrSum(hex_md5(msg)), 2);
    var c = Math.floor(Math.sqrt(a + b)) % 10000;
    return Math.floor(Math.sqrt(a + b)) % 10000;
}
/**
    * @brief 返回运营活动格式化时间字符串 A天B小时C分钟D秒
    * @param secs 时间戳(s)
    */
function GetActivityLastTime(secs) {
    secs = Number(secs.toString().split(".")[0]);
    var day = Math.floor(secs / 86400);
    var hour = Math.floor((secs - day * 86400) / 3600);
    var min = Math.floor((secs - day * 86400 - hour * 3600) / 60);
    var sec = secs - day * 86400 - hour * 3600 - min * 60;
    var str = '';
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
//# sourceMappingURL=Util.js.map