/** 贴吧分享 */
Page({
    onLoad: function (options) {
        this.CallTieBaTest(options.roleid, options.calltype, options.param);
    },

    CallTieBaTest: function (roleid, calltype, param) {
        let data = {
            third_app_id: "M7zdalp8xon7s1LUm2HcQEH92EvKayHA",
            third_app_name: "绝世武神之贴吧英雄传",
            third_app_avatar: "https://b.bdstatic.com/searchbox/mappconsole/image/20180929/1538228036867640.jpg",
            third_app_pic: "https://b.bdstatic.com/searchbox/mappconsole/image/20180929/1538228036867640.jpg",
            third_app_link: "/pages/tiebatoserver/tiebatoserver?calltype=" + calltype + "&roleid=" + roleid
        }
        let tParam = {
            ["roleid"]: roleid,
            ["calltype"]: calltype,
        }
        param = JSON.parse(param)
        for (let key in param) {
            let val = param[key]
            data.third_app_link += "&" + key + "=" + val
            tParam[key] = val
        }
        let dataStr = JSON.stringify(data)
        dataStr = encodeURIComponent(dataStr)
        let sParam = JSON.stringify(tParam)
        swan.navigateToSmartProgram({
            appKey: "flFqXclepWs7RdugAszy9eERL7G5dS0I",
            path: `/pages/frshistory/frshistory?extradata=${dataStr}`,
            extraData: {
                from: "绝世武神之贴吧英雄传"
            },
            success(res) {
                swan.request({
                    url: 'https://tbyxz.gyyx.cn/tiebaToShare.php',
                    data: tParam,
                    success: res => {
                        swan.showToast({
                            title: '成功'
                        });
                    },
                    fail: res => {
                        swan.showToast({
                            title: '失败'
                        });
                    }
                });
                swan.navigateBack()
            }
        });
    }
});