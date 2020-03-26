var H52D_Framework;
(function (H52D_Framework) {
    var InteractLogic = /** @class */ (function () {
        function InteractLogic() {
            //赠送配置表
            this._presentCfg = [];
            this._presentNum = 0;
        }
        Object.defineProperty(InteractLogic, "Inst", {
            get: function () {
                if (InteractLogic._inst == null)
                    InteractLogic._inst = new InteractLogic();
                return InteractLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        InteractLogic.prototype.Initialize = function () {
            //接收服务器返回的好友信息            
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGiveGifts", this);
            var tempArr = [];
            for (var key in H52D_Framework.PresentConfig) {
                var object = H52D_Framework.PresentConfig[key];
                object["presentId"] = key;
                tempArr.push(object);
            }
            this._presentNum = tempArr.length;
            //礼物排序
            function tsort(a, b) {
                return a.sequence < b.sequence ? -1 : 1;
            }
            tempArr.sort(tsort);
            var page = {};
            for (var index = 0; index < tempArr.length; index++) {
                var obj = tempArr[index];
                if (index != 0 && index % 8 == 0) {
                    this._presentCfg.push(page);
                    page = {};
                }
                page[index % 8] = obj;
            }
            if (!H52D_Framework.ObjIsEmpty(page)) {
                this._presentCfg.push(page);
            }
        };
        InteractLogic.prototype.C_ReqGiveGifts = function (buf) {
            var itemID = 0;
            var charm = 0;
            for (var index = 0; index < this._presentCfg.length; index++) {
                if (itemID != 0) {
                    break;
                }
                var page = this._presentCfg[index];
                for (var key in page) {
                    var object = page[key];
                    if (object["presentId"] == buf[0]) {
                        itemID = object["itemId"];
                        charm = object["charm"];
                        break;
                    }
                }
            }
            if (charm >= 0) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(buf[1] + "魅力值+" + charm);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(buf[1] + "魅力值" + charm);
            }
            var chatStr = "1~%" + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[itemID].dwItemName) + "~" + buf[1] + "~" + itemID;
            // if (MasterPlayer.Instance.player.CampID > 0) {
            //     RemoteCall.Instance.Send("K_SendChatInfoMsg", E_ChatChannel.C_CAMP, [0, chatStr, {}],
            //         GetSig(MasterPlayer.Instance.player.ID.toString(), chatStr));
            // } else {
            H52D_Framework.RemoteCall.Instance.Send("K_SendChatInfoMsg", E_ChatChannel.C_WORLD, [0, chatStr, {}], GetSig(H52D_Framework.MasterPlayer.Instance.player.ID.toString(), chatStr));
            // }
            H52D_Framework.Event.DispatchEvent("RefreshInteractViewList");
        };
        Object.defineProperty(InteractLogic.prototype, "presentCfg", {
            get: function () {
                return this._presentCfg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InteractLogic.prototype, "presentNum", {
            get: function () {
                return this._presentNum;
            },
            enumerable: true,
            configurable: true
        });
        return InteractLogic;
    }());
    H52D_Framework.InteractLogic = InteractLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InteractLogic.js.map