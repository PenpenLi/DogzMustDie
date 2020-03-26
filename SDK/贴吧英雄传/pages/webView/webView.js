Page({
    data: {
        src: ''
    },

    onLoad: function (options) {
        let openid = options.openid;
        let nickname = options.nickname;
        let headimgUrl = options.headimgUrl;
        let sex = options.sex;
        let inviteRoleID = options.inviteRoleID
        //let url = encodeURI('http://192.168.253.79:8901/bin/index.html?openid=' + openid + '&nickname=' + nickname + '&headimgUrl=' + headimgUrl + '&sex=' + sex);
        //let url = encodeURI('https://tbyxz.gyyx.cn/lichenglin/index.html?openid=' + openid + '&nickname=' + nickname + '&headimgUrl=' + headimgUrl + '&sex=' + sex + '&inviteRoleID=' + inviteRoleID);
        //let url = encodeURI('https://tbyxz.gyyx.cn/web/index.html?openid=' + openid + '&nickname=' + nickname + '&headimgUrl=' + headimgUrl + '&sex=' + sex);
        let url = encodeURI('https://ssjxzh5-wb.gyyx.cn/tbyxz/index.html?openid=' + openid + '&nickname=' + nickname + '&headimgUrl=' + headimgUrl + '&sex=' + sex + '&inviteRoleID=' + inviteRoleID);
        this.setData('src', url);
    },

    onReady: function () {
        // do something when page ready
    },

    onShow: function () {
        // do something when page show
    },

    onHide: function () {
        // do something when page hide
    },

    onUnload: function () {
        // do something when page unload
    },

    onPullDownRefresh: function () {
        // do something when pull down
    },

    onReachBottom: function () {
        // do something when page reach bottom
    },

    onShareAppMessage: function () {
        // return custom share data
    },

    onPageScroll: function () {
        // do something when page scroll
    }
});