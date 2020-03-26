var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("KickingChooseView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class：pvp选择房间
     * @author：zhangyusong
     */
    var KickingChooseView = /** @class */ (function (_super) {
        __extends(KickingChooseView, _super);
        function KickingChooseView() {
            var _this = _super.call(this) || this;
            _this.skin_1_up = "ui_rank/img-lan-xuan.png";
            _this.skin_1_down = "ui_rank/img-zi-xuan.png";
            _this.skin_2_up = "ui_rank/img-lan-weixuan.png";
            _this.skin_2_down = "ui_rank/img-zi-weixuan.png";
            _this.TX_CHALLENGE = "x/y";
            _this.MARTCH_TIME = "匹配中：xS";
            /** 匹配房间当前耗时 */
            _this.martchCurrTime = 0;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        KickingChooseView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("KickingChooseUpdate", Laya.Handler.create(this, this.OnChoosePage));
            H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
        };
        KickingChooseView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_gold.on(Laya.Event.CLICK, this, this.OnGoldPage);
            this.btn_diamond.on(Laya.Event.CLICK, this, this.OnDiamondsPage);
            this.btn_pvp.on(Laya.Event.CLICK, this, this.OnOpenPvp);
            this.btn_pet.on(Laya.Event.CLICK, this, this.OnOpenPet);
            this.btn_matching.on(Laya.Event.CLICK, this, this.OnMatching);
            this.btn_add.on(Laya.Event.CLICK, this, this.OnAddNumber);
            H52D_Framework.Event.RegistEvent("KickingChooseUpdate", Laya.Handler.create(this, this.OnChoosePage));
        };
        KickingChooseView.prototype.ViewInit = function () {
            var _this = this;
            this.listGold = this.GetData(H52D_Framework.BaseDefine.ItemIdGold);
            this.listDiamonds = this.GetData(H52D_Framework.BaseDefine.ItemIdDiamonds);
            this.currentGold = 0;
            this.currentDiamonds = 0;
            this.SelectInit(H52D_Framework.BaseDefine.ItemIdGold);
            this.SelectInit(H52D_Framework.BaseDefine.ItemIdDiamonds);
            this.challengeGold = H52D_Framework.GameParamConfig["ParticipationMaxNum"][1];
            this.challengeDiamonds = H52D_Framework.GameParamConfig["ParticipationMaxNum"][2];
            this.room_list.array = this.listGold;
            this.room_list.renderHandler = new Laya.Handler(this, function (item, index) {
                var vo = _this.room_list.array[index];
                item.getChildByName("icon_money").skin = vo.type == H52D_Framework.BaseDefine.ItemIdGold ?
                    "ui_common/icon-jinbi.png" : "ui_icon/icon_prop_013.png";
                item.getChildByName("img_sign").skin = vo.roomIcon;
                item.getChildByName("room_name").text = H52D_Framework.GetInfoAttr.Instance.GetText(vo.rname);
                item.getChildByName("box_select").visible = vo.select;
                item.getChildByName("img_hook").visible = vo.select;
                var bg = item.getChildByName("img_bg");
                var icon = item.getChildByName("icon_money");
                var money = item.getChildByName("money");
                if (vo.type == H52D_Framework.BaseDefine.ItemIdGold) {
                    bg.skin = "ui_camp/btn-junaxuan-zhenying.png";
                    icon.skin = "ui_common/icon-jinbi.png";
                    money.text = _this.ShowMoney(vo.money, "金币");
                }
                else if (vo.type == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                    bg.skin = "ui_camp/btn-zuanshi-pvp.png";
                    icon.skin = "ui_icon/icon_prop_013.png";
                    money.text = _this.ShowMoney(vo.money, "钻石");
                }
                icon.x = 148 - icon.width - money.textWidth * 0.5;
                item.on(Laya.Event.CLICK, _this, _this.ChoosRoom, [index]);
            });
            this.OnChoosePage();
            this._canmatching = true;
            //广告版,广告次数够不够
            this.btn_add.visible = H52D_Framework.IsAD() && H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes;
        };
        KickingChooseView.prototype.ShowMoney = function (num, name) {
            if (num > 1000000) {
                return (num / 10000 >> 0) + "万%n及以上".replace("%n", name);
            }
            else {
                return num + "%n及以上".replace("%n", name);
            }
        };
        KickingChooseView.prototype.SelectInit = function (itemID) {
            if (itemID == H52D_Framework.BaseDefine.ItemIdGold) {
                for (var i = 0; i < this.listGold.length; i++) {
                    if (this.listGold[i].money < H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold) &&
                        this.listGold[i].money > this.listGold[this.currentGold].money) {
                        this.currentGold = i;
                    }
                }
                this.listGold[this.currentGold].select = true;
            }
            if (itemID == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                for (var i = 0; i < this.listDiamonds.length; i++) {
                    if (this.listDiamonds[i].money <= H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds) &&
                        this.listDiamonds[i].money > this.listDiamonds[this.currentDiamonds].money) {
                        this.currentDiamonds = i;
                    }
                }
                this.listDiamonds[this.currentDiamonds].select = true;
            }
        };
        /** 获取数据列表 */
        KickingChooseView.prototype.GetData = function (type) {
            var list = H52D_Framework.KickingConfig[type];
            var dataList = [];
            for (var i in list) {
                var vo = new H52D_Framework.PvpRoomVo();
                vo.type = type;
                vo.id = Number(i);
                vo.rname = list[i].roomName;
                vo.roomIcon = "ui_kicking/img-" + list[i].roomIcon + "-pvp.png";
                vo.money = list[i].comeInNeed;
                vo.customsId = list[i].roomScene;
                vo.select = false;
                dataList.push(vo);
            }
            return dataList;
        };
        KickingChooseView.prototype.OnCloseHander = function () {
            H52D_Framework.KickingLogic.Instance.roomType = H52D_Framework.BaseDefine.ItemIdGold;
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        KickingChooseView.prototype.OnGoldPage = function () {
            H52D_Framework.KickingLogic.Instance.roomType = H52D_Framework.BaseDefine.ItemIdGold;
            this.OnChoosePage();
        };
        KickingChooseView.prototype.OnDiamondsPage = function (cost) {
            H52D_Framework.KickingLogic.Instance.roomType = H52D_Framework.BaseDefine.ItemIdDiamonds;
            this.OnChoosePage();
        };
        KickingChooseView.prototype.OnChoosePage = function () {
            var surplus;
            var challengeNum;
            var item_num = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.KickingLogic.Instance.roomType);
            var item_str = "" + item_num;
            if (item_num > 1000000) {
                item_str = Math.floor(item_num / 10000) + "W";
            }
            var list;
            H52D_Framework.SetHtmlStyle(this.My_money, 22, "#dde2f2", "center");
            if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                this.btn_gold.skin = this.skin_1_down;
                this.btn_diamond.skin = this.skin_2_up;
                this.btn_gold.labelColors = "#eff8bb";
                this.btn_diamond.labelColors = "#bebbf8";
                surplus = H52D_Framework.KickingLogic.Instance.surplusGold;
                challengeNum = this.challengeGold;
                list = this.listGold;
                this.My_money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='24px' height='24px'></img>" + item_str;
            }
            else if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                this.btn_gold.skin = this.skin_1_up;
                this.btn_diamond.skin = this.skin_2_down;
                this.btn_gold.labelColors = "#bebbf8";
                this.btn_diamond.labelColors = "#eff8bb";
                surplus = H52D_Framework.KickingLogic.Instance.surplusDiamonds;
                challengeNum = this.challengeDiamonds;
                list = this.listDiamonds;
                this.My_money.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>" + item_str;
            }
            this.txt_challenge.text = this.TX_CHALLENGE.replace("x", String(surplus)).replace("y", String(challengeNum));
            this.txt_challenge.color = surplus > 0 ? "#9be589" : "#ffc58b";
            this.room_list.array = list;
        };
        /**
         * 选择房间
         * @param 房间id
         */
        KickingChooseView.prototype.ChoosRoom = function (index) {
            if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                this.listGold[this.currentGold].select = false;
                this.currentGold = index;
                this.listGold[this.currentGold].select = true;
                this.room_list.array = this.listGold;
            }
            else if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                this.listDiamonds[this.currentDiamonds].select = false;
                this.currentDiamonds = index;
                this.listDiamonds[this.currentDiamonds].select = true;
                this.room_list.array = this.listDiamonds;
            }
        };
        /** 匹配房间 */
        KickingChooseView.prototype.OnMatching = function () {
            var _this = this;
            if (this.canmatching) { //匹配
                this.btn_matching.mouseEnabled = false;
                H52D_Framework.Tick.Once(100, this, function () {
                    _this.btn_matching.mouseEnabled = true;
                });
                this.currentVo = null;
                if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                    if (H52D_Framework.KickingLogic.Instance.surplusGold > 0 || this.challengeGold == -1) {
                        this.currentVo = this.listGold[this.currentGold];
                    }
                }
                else if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                    if (H52D_Framework.KickingLogic.Instance.surplusDiamonds > 0 || this.challengeDiamonds == -1) {
                        this.currentVo = this.listDiamonds[this.currentDiamonds];
                    }
                }
                if (this.currentVo == null) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30042);
                }
                else if (H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.KickingLogic.Instance.roomType) < this.currentVo.money) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30028, H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdGold ? "金币" : "钻石");
                }
                else {
                    this.canmatching = false;
                    this.martchCurrTime = 1;
                    this.tx_martch_time.text = this.MARTCH_TIME.replace("x", String(this.martchCurrTime));
                    var matchTime = H52D_Framework.GameParamConfig["MatchTime"];
                    this.martchTotleTime = matchTime[1] + ((matchTime[2] - matchTime[1] + 1) * Math.random() >> 0);
                    //播放计时音效
                    H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/colck.mp3", 0);
                    H52D_Framework.Tick.Loop(1000, this, this.MatchCountdwon);
                }
            }
            else { //退出匹配
                H52D_Framework.Tick.Clear(this, this.MatchCountdwon);
                this.canmatching = true;
                this.tx_martch_time.text = "";
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
            }
        };
        Object.defineProperty(KickingChooseView.prototype, "canmatching", {
            get: function () {
                return this._canmatching;
            },
            set: function (value) {
                this._canmatching = value;
                this.room_list.mouseEnabled = value;
                this.btn_gold.mouseEnabled = value;
                this.btn_diamond.mouseEnabled = value;
                this.btn_add.mouseEnabled = value;
                this.btn_pvp.mouseEnabled = value;
                this.btn_pet.mouseEnabled = value;
                this.btn_matching.label = value ? "匹配" : "取消匹配";
            },
            enumerable: true,
            configurable: true
        });
        /** 匹配房间计时 */
        KickingChooseView.prototype.MatchCountdwon = function () {
            if (++this.martchCurrTime > this.martchTotleTime) {
                this.btn_matching.label = "匹配";
                this.tx_martch_time.text = "";
                this.room_list.mouseEnabled = true;
                this.btn_gold.mouseEnabled = true;
                this.btn_diamond.mouseEnabled = true;
                H52D_Framework.UIManager.Instance.DestroyUI("KickingWarView", [H52D_Framework.ViewToppestRoot]);
                H52D_Framework.UIManager.Instance.DestroyUI("KickingPetView", [H52D_Framework.ViewToppestRoot]);
                H52D_Framework.Tick.Clear(this, this.MatchCountdwon);
                var roomId = 0;
                if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdGold) {
                    roomId = this.listGold[this.currentGold].id;
                }
                else if (H52D_Framework.KickingLogic.Instance.roomType == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                    roomId = this.listDiamonds[this.currentDiamonds].id;
                }
                this.canmatching = true;
                H52D_Framework.KickingLogic.Instance.PvpMatching(H52D_Framework.KickingLogic.Instance.roomType, roomId, this.currentVo);
                //停止播放匹配音效
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/match_succese.mp3");
                //播放匹配成功音效
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/colck.mp3");
            }
            else {
                this.tx_martch_time.text = this.MARTCH_TIME.replace("x", String(this.martchCurrTime));
            }
        };
        /** PVP阵型 */
        KickingChooseView.prototype.OnOpenPvp = function () {
            H52D_Framework.UIManager.Instance.CreateUI("KickingWarView", [H52D_Framework.ViewToppestRoot, H52D_Framework.ActionType.kicking]);
        };
        /** 上阵神兽 */
        KickingChooseView.prototype.OnOpenPet = function () {
            H52D_Framework.UIManager.Instance.CreateUI("KickingPetView", [H52D_Framework.ViewToppestRoot]);
        };
        /** 打开广告 */
        KickingChooseView.prototype.OnAddNumber = function (itemId) {
            if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.pvp, H52D_Framework.KickingLogic.Instance.roomType]);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(30071);
                this.btn_add.visible = false;
            }
        };
        return KickingChooseView;
    }(ui.action.kicking.KickingChooseViewUI));
    H52D_Framework.KickingChooseView = KickingChooseView;
    var RoomModel = /** @class */ (function () {
        function RoomModel(item) {
            this.roomName = item.getChildByName("room_name");
            this.money = item.getChildByName("money");
            this.imgSelect = item.getChildByName("img_select");
        }
        Object.defineProperty(RoomModel.prototype, "select", {
            set: function (value) {
                this.imgSelect.visible = value;
            },
            enumerable: true,
            configurable: true
        });
        return RoomModel;
    }());
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=KickingChooseView.js.map