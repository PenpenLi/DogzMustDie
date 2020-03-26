/**
* 微信SDK配置数据管理
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**登陆时获取授权的按钮图片地址 */
    H52D_Framework.LoginIcon = "";
    /**登陆时获取授权的按钮top值 */
    H52D_Framework.LoginBtnTop = 0;
    /**登陆时获取授权的按钮width值,要显示授权按钮请务必传值 */
    H52D_Framework.LoginBtnWidth = 0;
    /**登陆时获取授权的按钮Hight值,要显示授权按钮请务必传值 */
    H52D_Framework.LoginBtnHight = 0;
    /**配置数据管理 */
    var wxCfgData = /** @class */ (function () {
        function wxCfgData(cls) {
            this.Initialize(cls);
        }
        /**初始化配置数据 */
        wxCfgData.prototype.Initialize = function (cls) {
            var randomNum = Math.floor(Math.random() * 10 / 2) + 1;
            var text = H52D_Framework.BaseDefine.ShareText[randomNum] ? H52D_Framework.BaseDefine.ShareText[randomNum] : "好玩有趣上手So Easy";
            H52D_Framework.ResUrl = cls['resUrl'] || 'https://ssjxzh5-cdn-test.gyyx.cn/PHP/qqSDK.php';
            H52D_Framework.Wx = Laya.Browser.window.wx;
            H52D_Framework.ShareTitle = cls['shareTitle'] || text;
            H52D_Framework.ShareUrl = cls['shareUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/tieba' + randomNum + '_share.jpg';
            H52D_Framework.adUnitId_Banner = cls['adUnitId_Banner'];
            H52D_Framework.adUnitId_Excitation = cls['adUnitId_Excitation'];
            H52D_Framework.LoginIcon = cls['LoginIcon'] || "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn_login.png";
            H52D_Framework.LoginBtnTop = cls['LoginBtnTop'] || 0;
            H52D_Framework.LoginBtnWidth = cls['LoginBtnWidth'] || 0;
            H52D_Framework.LoginBtnHight = cls['LoginBtnHight'] || 0;
            H52D_Framework.GameId = cls['GameId'] || 'ssjxz';
            H52D_Framework.OfferId = cls['OfferId'];
        };
        return wxCfgData;
    }());
    H52D_Framework.wxCfgData = wxCfgData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=wxCfgData.js.map