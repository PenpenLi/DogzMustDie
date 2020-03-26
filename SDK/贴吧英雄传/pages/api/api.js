// 授权信息
export let SessionKey = null;
// 邀请人信息
export let InviteRoleID = "";
Page({
    data: {
        desc: '正在登陆',
        canvasShow: false,
    },
    onShow: function (options) {
        //是否有用户信息
        if (SessionKey != null) {
            this.getUserInfo(SessionKey);
        }
    },
    onLoad: function (options) {
        SendClientLog(100, 1)
        if ((options != null) && (options.roleid != null)) {
            InviteRoleID = options.roleid
        }
        this.login()
        // this.setData("desc", "点击授权")
        // this.setData("canvasShow", true)
    },

    onClickLogin() {
        SendClientLog(201, 1)
        let sDasc = this.getData("desc")
        if (sDasc == "点击登录") {
            SendClientLog(202, 1)
            this.login()
        }
        else if (sDasc == "点击授权") {
            SendClientLog(203, 1)
            swan.openSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                    }
                },
            });
        }
    },

    // 跳转到webView
    redirectTo(data) {
        SendClientLog(300, 0, data.openid)
        swan.redirectTo({
            url: '/pages/webView/webView?' +
                'openid=' + data.openid +
                '&nickname=' + data.nickname +
                '&headimgUrl=' + data.headimgurl +
                '&inviteRoleID=' + InviteRoleID +
                '&sex=' + data.sex,
            fail: err => {
                swan.showToast({
                    title: '请尝试重新进入'
                });
            }
        });
    },

    // 授权
    authorize(data) {
        let scope = "scope.userInfo";
        swan.authorize({
            scope,
            success: res => {
                this.redirectTo(data);
            },
            fail: err => {
                // swan.showToast({
                //     title: '请允许获取授权'
                // });
                SendClientLog(400, 0, data.openid)
                this.setData("desc", "点击授权")
                this.setData("canvasShow", true)
            }
        });
    },

    // 登陆
    login() {
        swan.login({
            success: res => {
                this.setData("desc", "正在登陆")
                swan.request({
                    // 开发者服务器地址，用 code 换取 session_key
                    url: 'https://tbyxz.gyyx.cn/getSessionKey.php',
                    data: {
                        code: res.code
                    },
                    success: res => {
                        SendClientLog(200, 0, res.data.openid)
                        SessionKey = res.data.session_key
                        this.getUserInfo(res.data.session_key);
                    },
                    fail: res => {
                        swan.showToast({
                            title: '请尝试重新进入'
                        });
                    }
                });
            },
            fail: err => {
                this.setData("desc", "点击登录")
                this.setData("canvasShow", true)
            }
        });
    },

    // 获取用户信息
    getUserInfo(session_key) {
        swan.getUserInfo({
            success: res => {
                swan.request({
                    // 开发者服务器地址，对 data 进行解密
                    url: "https://tbyxz.gyyx.cn/getUserInfo.php",
                    data: {
                        data: res.data,
                        iv: res.iv,
                        session_key: session_key
                    },
                    success: res => {
                        this.authorize(res.data)
                    },
                    fail: res => {
                        swan.showToast({
                            title: '请尝试重新进入'
                        });
                    }
                });
            },
            fail: err => {
                // swan.showToast({
                //     title: '请允许获取授权'
                // });
                this.setData("desc", "点击授权")
                this.setData("canvasShow", true)
            }
        });
    },
});

/** 上报客户端log */
export function SendClientLog(i_eventid, i_typ, openid) {
    let strPostURL = "https://ssjxzh5-log.gyyx.cn/php/playeractionlog_tieba.php?";
    if (openid == "" || openid == null) {
        i_typ = 1;
    }
    strPostURL += "userid=";
    strPostURL += openid || "test02";
    strPostURL += "&pf=";
    strPostURL += "1";
    strPostURL += "&serverid=";
    strPostURL += "1";
    strPostURL += "&eventid=";
    strPostURL += i_eventid;
    strPostURL += "&type=";
    strPostURL += i_typ;
    swan.request({
        url: strPostURL,
        success: res => {
            // swan.showToast({
            //     title: '成功'
            // });
        },
        fail: res => {
            // swan.showToast({
            //     title: '失败'
            // });
        }
    });
}
