var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class 邀请管理类
     * @author zhangyusong
     **/
    var InvitationLogic = /** @class */ (function () {
        function InvitationLogic() {
        }
        Object.defineProperty(InvitationLogic.prototype, "Instance", {
            get: function () {
                if (InvitationLogic._instance == null) {
                    InvitationLogic._instance = new InvitationLogic();
                }
                return InvitationLogic._instance;
            },
            enumerable: true,
            configurable: true
        });
        return InvitationLogic;
    }());
    H52D_Framework.InvitationLogic = InvitationLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InvitationLogic.js.map