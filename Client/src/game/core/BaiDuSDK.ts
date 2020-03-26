/*
* 百度sdk;
*/
module H52D_Framework {
    export class BaiDuSDK {
        private static _inst: BaiDuSDK;
        public static get Instance() {
            if (BaiDuSDK._inst == null) {
                BaiDuSDK._inst = new BaiDuSDK();
            }
            return BaiDuSDK._inst;
        }

        /**是否是百度平台 */
        private _isBaiDu: boolean = false;
        public get isBaiDu(): boolean {
            return this._isBaiDu;
        }

        /**百度用户唯一id */
        private _openid: string = "";
        public get openid(): string {
            return this._openid;
        }

        /**获取百度昵称 */
        private _nickname: string = "";
        public get nickname(): string {
            return this._nickname;
        }

        /**获取百度账号头像地址(https://......) */
        private _headimgUrl: string = "";
        public get headimgUrl(): string {
            return this._headimgUrl;
        }

        /**获取百度用户性别(女:0,男:1) */
        private _sex: number = -1;
        public get sex(): number {
            return this._sex;
        }

        /**初始化 */
        public Initialize() {
            this.GetEnv();
        }

        /**接收小程序发来的消息 */
        public GetEnv() {
            if (!window["swan"]) {
                UIManager.Instance.CreateUI("LoginView", [ViewDownRoot]);
                return;
            }
            window["swan"].webView.getEnv(function (res) {
                BaiDuSDK.Instance._isBaiDu = res.smartprogram;
                if (BaiDuSDK.Instance._isBaiDu) {
                    let url = window.location.search;
                    let params = BaiDuSDK.Instance.ParseQueryString(url);
                    BaiDuSDK.Instance._openid = params["openid"] || "";
                    BaiDuSDK.Instance._nickname = params["nickname"] || "";
                    BaiDuSDK.Instance._headimgUrl = params["headimgUrl"] || "";
                    BaiDuSDK.Instance._sex = params["sex"] || -1;
                    let InviteRoleID = params["inviteRoleID"] || "";
                    LoginLogic.Instance.Login(BaiDuSDK.Instance.openid, InviteRoleID);
                }else{
                    UIManager.Instance.CreateUI("LoginView", [ViewDownRoot]);
                }
            })
        }

        /**
         * 解析网页参数
         * @param url 网页地址
         */
        private ParseQueryString(url): Object {
            let params = {};
            if (url == "") {
                return params;
            }
            let arr = url.split("?");
            let arr1 = arr[1].split("&");
            for (let i = 0; i < arr1.length; i++) {
                let arr2 = arr1[i].split('=');
                if (!arr2[1]) {
                    params[arr2[0]] = 'true';
                }
                else if (params[arr2[0]]) {
                    let arr3 = [params[arr2[0]]];
                    arr3.push(arr2[1]); params[arr2[0]] = arr3;
                }
                else {
                    params[arr2[0]] = decodeURI(arr2[1]);
                }
            }
            return params;
        }

        /**
         * 前往充值
		 * @param goodsType 商品类型
		 * @param goodsId 商品id
		 * @param goodsDesc 商品描述
         */
        public ToRecharge(goodsType: number, goodsId: number, goodsDesc: string) {
            if (!this._isBaiDu) {
                RemoteCall.Instance.Send('K_ChgCharge', goodsType, goodsId);
                return;
            }
            if (Laya.Browser.onIOS) {
                TipsLogic.Instance.OpenMessageBox("受苹果政策影响，IOS充值暂未开放。请用户到安卓系统上充值。");
                return;
            }
            let price = ChargeConfig[goodsType][goodsId].Price;
            if (!price) {
                return;
            }
            window["swan"].webView.navigateTo({
                url: '/pages/payment/payment?' +
                'openid=' + GameLink.Instance.urlParams["openid"] + '&' +
                'payTime=' + Time.serverMilliSecodes + '&' +
                'price=' + price + '&' +
                'dealTitle=' + goodsDesc + '&' +
                'serverid=' + GameLink.Instance.urlParams["serverid"] + '&' +
                'roleid=' + MasterPlayer.Instance.player.ID + '&' +
                'rolename=' + MasterPlayer.Instance.player.Name + '&' +
                'goodsType=' + goodsType + '&' +
                'goodsId=' + goodsId
            });
        }

        /**
         * 分享
         */
        public CallTieBa(nType, tParam?) {
            if (!window["swan"]) {
                let tInfo = {
                    ["calltype"]:nType,
                    ["roleid"]:MasterPlayer.Instance.player.ID,
                }
                if(tParam){
                    for( let k in tParam ){
                        tInfo[k] = tParam[k]
                    }
                }
                RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
                return;
            }
            window["swan"].webView.navigateTo({
                url: '/pages/calltieba/calltieba?' +
                'calltype=' + nType + '&' +
                'roleid=' + MasterPlayer.Instance.player.ID + '&' +
                'param=' + JSON.stringify(tParam||null)
            });
        }
    }
}
