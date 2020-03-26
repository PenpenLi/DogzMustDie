module H52D_Framework {

    export class InteractLogic {
        private static _inst: InteractLogic;
        //赠送配置表
        private _presentCfg: Array<any> = [];
        private _presentNum: number = 0;

        public static get Inst() { //单例模式
            if (InteractLogic._inst == null)
                InteractLogic._inst = new InteractLogic();
            return InteractLogic._inst;
        }

        public Initialize(): void {
            //接收服务器返回的好友信息            
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGiveGifts", this);

            let tempArr: any = [];
            for (var key in PresentConfig) {
                let object = PresentConfig[key];
                object["presentId"] = key;
                tempArr.push(object);
            }
            this._presentNum = tempArr.length;
            //礼物排序
            function tsort(a, b): number {
                return a.sequence < b.sequence ? -1 : 1;
            }
            tempArr.sort(tsort);

            let page: Object = {};
            for (var index = 0; index < tempArr.length; index++) {
                let obj = tempArr[index];
                if (index != 0 && index % 8 == 0) {
                    this._presentCfg.push(page);
                    page = {};
                }
                page[index % 8] = obj;
            }
            if (!ObjIsEmpty(page)) {
                this._presentCfg.push(page);
            }
        }

        private C_ReqGiveGifts(buf: any): void {
            let itemID: number = 0;
            let charm: number = 0;
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
                TipsLogic.Instance.OpenSystemTips(buf[1] + "魅力值+" + charm);
            } else {
                TipsLogic.Instance.OpenSystemTips(buf[1] + "魅力值" + charm);
            }
            
            let chatStr: string = "1~%" + GetInfoAttr.Instance.GetText(ItemConfig[itemID].dwItemName) + "~" + buf[1] + "~" + itemID;
            // if (MasterPlayer.Instance.player.CampID > 0) {
            //     RemoteCall.Instance.Send("K_SendChatInfoMsg", E_ChatChannel.C_CAMP, [0, chatStr, {}],
            //         GetSig(MasterPlayer.Instance.player.ID.toString(), chatStr));
            // } else {
                RemoteCall.Instance.Send("K_SendChatInfoMsg", E_ChatChannel.C_WORLD, [0, chatStr, {}],
                    GetSig(MasterPlayer.Instance.player.ID.toString(), chatStr));
            // }

            Event.DispatchEvent("RefreshInteractViewList");
        }


        public get presentCfg() {
            return this._presentCfg;
        }

        public get presentNum() {
            return this._presentNum;
        }

    }
}