/** 贴吧分享如果进入 */
Page({
    onLoad: function (options) {
        swan.request({
            url: 'https://tbyxz.gyyx.cn/tiebaToInvite.php',
            data: options,
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

        swan.redirectTo({
            url: '/pages/api/api?roleid=' + options.roleid,
            fail: err => {
                swan.showToast({
                    title: '请尝试重新进入'
                });
            }
        });
    },
});