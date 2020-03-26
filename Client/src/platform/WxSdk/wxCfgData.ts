/**
* 微信SDK配置数据管理 
*/
module H52D_Framework {
	/**服务器DNS域名 */
	export let ResUrl;
	/**全局wx对象 */
	export let Wx;
	/**分享标题 */
	export let ShareTitle;
	/**分享图片资源路径 */
	export let ShareUrl;
	/**banner 的广告位ID*/
	export let adUnitId_Banner;
	/**激励广告的广告位ID */
	export let adUnitId_Excitation
	/**登陆时获取授权的按钮图片地址 */
	export let LoginIcon = "";
	/**登陆时获取授权的按钮top值 */
	export let LoginBtnTop = 0;
	/**登陆时获取授权的按钮width值,要显示授权按钮请务必传值 */
	export let LoginBtnWidth = 0;
	/**登陆时获取授权的按钮Hight值,要显示授权按钮请务必传值 */
	export let LoginBtnHight = 0;
	/**游戏标识,用于在php区分不同的appID等信息,接入时请务必配置此参数,并将标识告知给SDK方 */
	export let GameId;
	/**米大师支付ID,接入支付时务必传自己的米大师支付ID */
	export let OfferId;

	/**配置数据管理 */
	export class wxCfgData {
		constructor(cls: any) {
			this.Initialize(cls);
		}
		
		/**初始化配置数据 */
		private Initialize(cls: any) {
			let randomNum = Math.floor(Math.random() * 10 / 2) + 1;
        	let text = BaseDefine.ShareText[randomNum] ? BaseDefine.ShareText[randomNum] : "好玩有趣上手So Easy";

			ResUrl = cls['resUrl'] || 'https://ssjxzh5-cdn-test.gyyx.cn/PHP/qqSDK.php';
			Wx = Laya.Browser.window.wx;
			ShareTitle = cls['shareTitle'] || text;
			ShareUrl = cls['shareUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/tieba'+randomNum+'_share.jpg';
			adUnitId_Banner = cls['adUnitId_Banner'];
			adUnitId_Excitation = cls['adUnitId_Excitation'];
			LoginIcon = cls['LoginIcon'] || "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn_login.png";
			LoginBtnTop = cls['LoginBtnTop'] || 0;
			LoginBtnWidth = cls['LoginBtnWidth'] || 0;
			LoginBtnHight = cls['LoginBtnHight'] || 0;
			GameId = cls['GameId'] || 'ssjxz';
			OfferId = cls['OfferId'];
		}
	}
}