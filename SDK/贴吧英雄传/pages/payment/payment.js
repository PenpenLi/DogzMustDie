/**充值数据 */
export let payData;

Page({
    data: {
        title: '钻石充值',
        desc: '',
    },

    onLoad: function (options) {
        payData = options;
        //this.setData('desc', '购买' + payData.price * 10 + '钻石');
        this.setData('desc', payData.dealTitle);
    },

    requestPolymerPayment(e) {
        swan.request({
            url: 'https://tbyxz.gyyx.cn/getRsaSign.php',
            data: payData,
            success: res => {
                let data = res.data;
                if (data.status != 0) {
                    console.log('create order err', data);
                    return;
                };
                let orderInfo = data.data;
                swan.requestPolymerPayment({
                    orderInfo: orderInfo,
                    bannedChannels: ["WeChat"],
                    success(res) {
                        swan.showToast({
                            title: '支付成功',
                            icon: 'success'
                        });
                    },
                    fail(err) {
                        swan.showToast({
                            title: err.errMsg
                        });
                        console.log('pay fail', err);
                    },
                    complete() {
                        swan.navigateBack({});
                    }
                });
            },
            fail: err => {
                swan.showToast({
                    title: '订单创建失败'
                });
                console.log('create order fail', err);
            }
        });
    }
});