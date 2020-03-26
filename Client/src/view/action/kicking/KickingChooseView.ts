module H52D_Framework {
    AddViewResource("KickingChooseView",
        [
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        ]);
    /**
     * @class：pvp选择房间
     * @author：zhangyusong
     */
    export class KickingChooseView extends ui.action.kicking.KickingChooseViewUI {
        private readonly skin_1_up: string = "ui_rank/img-lan-xuan.png";
        private readonly skin_1_down: string = "ui_rank/img-zi-xuan.png";
        private readonly skin_2_up: string = "ui_rank/img-lan-weixuan.png";
        private readonly skin_2_down: string = "ui_rank/img-zi-weixuan.png";
        private readonly TX_CHALLENGE: string = "x/y";
        private readonly MARTCH_TIME: string = "匹配中：xS";

        /** 金币房间 */
        private listGold: Array<PvpRoomVo>;
        /** 钻石房间 */
        private listDiamonds: Array<PvpRoomVo>;
        private currentGold: number;
        private currentDiamonds: number;
        /** 最大挑战次数 */
        private challengeGold: number;
        private challengeDiamonds: number;
        private currentVo: PvpRoomVo;
        /** 匹配房间总耗时 */
        private martchTotleTime: number;
        /** 匹配房间当前耗时 */
        private martchCurrTime: number = 0;
        /** 可以匹配 */
        private _canmatching: boolean;

        public constructor() {
            super();
            this.ViewInit();
            this.EventInit();
        }

        private Destroy() {
            this.offAll();
            Event.RemoveEvent("KickingChooseUpdate", Laya.Handler.create(this, this.OnChoosePage));
            SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
        }

        private EventInit() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_gold.on(Laya.Event.CLICK, this, this.OnGoldPage);
            this.btn_diamond.on(Laya.Event.CLICK, this, this.OnDiamondsPage);
            this.btn_pvp.on(Laya.Event.CLICK, this, this.OnOpenPvp);
            this.btn_pet.on(Laya.Event.CLICK, this, this.OnOpenPet);
            this.btn_matching.on(Laya.Event.CLICK, this, this.OnMatching);
            this.btn_add.on(Laya.Event.CLICK, this, this.OnAddNumber);
            Event.RegistEvent("KickingChooseUpdate", Laya.Handler.create(this, this.OnChoosePage));
        }

        private ViewInit() {
            this.listGold = this.GetData(BaseDefine.ItemIdGold);
            this.listDiamonds = this.GetData(BaseDefine.ItemIdDiamonds);
            this.currentGold = 0;
            this.currentDiamonds = 0;
            this.SelectInit(BaseDefine.ItemIdGold);
            this.SelectInit(BaseDefine.ItemIdDiamonds);

            this.challengeGold = GameParamConfig["ParticipationMaxNum"][1];
            this.challengeDiamonds = GameParamConfig["ParticipationMaxNum"][2];
            this.room_list.array = this.listGold;
            this.room_list.renderHandler = new Laya.Handler(this, (item: Laya.Box, index: number) => {
                let vo: PvpRoomVo = this.room_list.array[index];
                (item.getChildByName("icon_money") as Laya.Image).skin = vo.type == BaseDefine.ItemIdGold ?
                    "ui_common/icon-jinbi.png" : "ui_icon/icon_prop_013.png";
                (item.getChildByName("img_sign") as Laya.Image).skin = vo.roomIcon;
                (item.getChildByName("room_name") as Laya.Text).text = GetInfoAttr.Instance.GetText(vo.rname);
                (item.getChildByName("box_select") as Laya.Image).visible = vo.select;
                (item.getChildByName("img_hook") as Laya.Image).visible = vo.select;

                let bg: Laya.Image = (item.getChildByName("img_bg") as Laya.Image);
                let icon: Laya.Image = item.getChildByName("icon_money") as Laya.Image;
                let money: Laya.Text = item.getChildByName("money") as Laya.Text;
                if (vo.type == BaseDefine.ItemIdGold) {
                    bg.skin = "ui_camp/btn-junaxuan-zhenying.png";
                    icon.skin = "ui_common/icon-jinbi.png";
                    money.text = this.ShowMoney(vo.money, "金币");
                }
                else if (vo.type == BaseDefine.ItemIdDiamonds) {
                    bg.skin = "ui_camp/btn-zuanshi-pvp.png";
                    icon.skin = "ui_icon/icon_prop_013.png";
                    money.text = this.ShowMoney(vo.money, "钻石");
                }
                icon.x = 148 - icon.width - money.textWidth * 0.5;

                item.on(Laya.Event.CLICK, this, this.ChoosRoom, [index]);
            });
            this.OnChoosePage();
            this._canmatching = true;
            //广告版,广告次数够不够
            this.btn_add.visible = IsAD() && AdvertisingManager.Instance.bnWXAdertisingTimes;
        }

        private ShowMoney(num: number, name: string): string {
            if (num > 1000000) {
                return (num / 10000 >> 0) + "万%n及以上".replace("%n", name);
            }
            else {
                return num + "%n及以上".replace("%n", name);
            }
        }

        private SelectInit(itemID: number) {
            if (itemID == BaseDefine.ItemIdGold) {
                for (let i: number = 0; i < this.listGold.length; i++) {
                    if (this.listGold[i].money < BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold) &&
                        this.listGold[i].money > this.listGold[this.currentGold].money) {
                        this.currentGold = i;
                    }
                }
                this.listGold[this.currentGold].select = true;
            }
            if (itemID == BaseDefine.ItemIdDiamonds) {
                for (let i: number = 0; i < this.listDiamonds.length; i++) {
                    if (this.listDiamonds[i].money <= BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds) &&
                        this.listDiamonds[i].money > this.listDiamonds[this.currentDiamonds].money) {
                        this.currentDiamonds = i;
                    }
                }
                this.listDiamonds[this.currentDiamonds].select = true;
            }
        }

        /** 获取数据列表 */
        private GetData(type): PvpRoomVo[] {
            let list = KickingConfig[type];
            let dataList: Array<PvpRoomVo> = [];
            for (let i in list) {
                let vo: PvpRoomVo = new PvpRoomVo();
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
        }

        private OnCloseHander() {
            KickingLogic.Instance.roomType = BaseDefine.ItemIdGold;
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }

        private OnGoldPage() {
            KickingLogic.Instance.roomType = BaseDefine.ItemIdGold;
            this.OnChoosePage();
        }

        private OnDiamondsPage(cost: number) {
            KickingLogic.Instance.roomType = BaseDefine.ItemIdDiamonds;
            this.OnChoosePage();
        }

        private OnChoosePage() {
            let surplus: number;
            let challengeNum: number;
            let item_num: number = BagManager.Instance.getItemNumber(KickingLogic.Instance.roomType);
            let item_str: string = "" + item_num;
            if (item_num > 1000000) {
                item_str = Math.floor(item_num / 10000) + "W";
            }
            let list: Array<PvpRoomVo>;
            SetHtmlStyle(this.My_money, 22, "#dde2f2", "center");
            if (KickingLogic.Instance.roomType == BaseDefine.ItemIdGold) {
                this.btn_gold.skin = this.skin_1_down;
                this.btn_diamond.skin = this.skin_2_up;
                this.btn_gold.labelColors = "#eff8bb";
                this.btn_diamond.labelColors = "#bebbf8";
                surplus = KickingLogic.Instance.surplusGold;
                challengeNum = this.challengeGold;
                list = this.listGold;
                this.My_money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='24px' height='24px'></img>" + item_str;
            }
            else if (KickingLogic.Instance.roomType == BaseDefine.ItemIdDiamonds) {
                this.btn_gold.skin = this.skin_1_up;
                this.btn_diamond.skin = this.skin_2_down;
                this.btn_gold.labelColors = "#bebbf8";
                this.btn_diamond.labelColors = "#eff8bb";
                surplus = KickingLogic.Instance.surplusDiamonds;
                challengeNum = this.challengeDiamonds;
                list = this.listDiamonds;
                this.My_money.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>" + item_str;
            }
            this.txt_challenge.text = this.TX_CHALLENGE.replace("x", String(surplus)).replace("y", String(challengeNum));
            this.txt_challenge.color = surplus > 0 ? "#9be589" : "#ffc58b";
            this.room_list.array = list;
        }

        /**
         * 选择房间
         * @param 房间id
         */
        private ChoosRoom(index: number) {
            if (KickingLogic.Instance.roomType == BaseDefine.ItemIdGold) {
                this.listGold[this.currentGold].select = false;
                this.currentGold = index;
                this.listGold[this.currentGold].select = true;
                this.room_list.array = this.listGold;
            }
            else if (KickingLogic.Instance.roomType == BaseDefine.ItemIdDiamonds) {
                this.listDiamonds[this.currentDiamonds].select = false;
                this.currentDiamonds = index;
                this.listDiamonds[this.currentDiamonds].select = true;
                this.room_list.array = this.listDiamonds;
            }
        }

        /** 匹配房间 */
        private OnMatching() {
            if (this.canmatching) {//匹配
                this.btn_matching.mouseEnabled = false;
                Tick.Once(100, this, () => {
                    this.btn_matching.mouseEnabled = true;
                });
                this.currentVo = null;
                if (KickingLogic.Instance.roomType == BaseDefine.ItemIdGold) {
                    if (KickingLogic.Instance.surplusGold > 0 || this.challengeGold == -1) {
                        this.currentVo = this.listGold[this.currentGold];
                    }
                }
                else if (KickingLogic.Instance.roomType == BaseDefine.ItemIdDiamonds) {
                    if (KickingLogic.Instance.surplusDiamonds > 0 || this.challengeDiamonds == -1) {
                        this.currentVo = this.listDiamonds[this.currentDiamonds];
                    }
                }
                if (this.currentVo == null) {
                    TipsLogic.Instance.OpenSystemTips(30042);
                }
                else if (BagManager.Instance.getItemNumber(KickingLogic.Instance.roomType) < this.currentVo.money) {
                    TipsLogic.Instance.OpenSystemTips(30028, KickingLogic.Instance.roomType == BaseDefine.ItemIdGold ? "金币" : "钻石");
                }
                else {
                    this.canmatching = false;
                    this.martchCurrTime = 1;
                    this.tx_martch_time.text = this.MARTCH_TIME.replace("x", String(this.martchCurrTime));
                    let matchTime = GameParamConfig["MatchTime"];
                    this.martchTotleTime = matchTime[1] + ((matchTime[2] - matchTime[1] + 1) * Math.random() >> 0);
                    //播放计时音效
                    SoundManager.Instance.OnPlaySound("res/sound/colck.mp3", 0)
                    Tick.Loop(1000, this, this.MatchCountdwon);
                }
            }
            else {   //退出匹配
                Tick.Clear(this, this.MatchCountdwon);
                this.canmatching = true;
                this.tx_martch_time.text = "";
                SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
            }
        }

        private set canmatching(value: boolean) {
            this._canmatching = value;
            this.room_list.mouseEnabled = value;
            this.btn_gold.mouseEnabled = value;
            this.btn_diamond.mouseEnabled = value;
            this.btn_add.mouseEnabled = value;
            this.btn_pvp.mouseEnabled = value;
            this.btn_pet.mouseEnabled = value;
            this.btn_matching.label = value ? "匹配" : "取消匹配";
        }

        private get canmatching(): boolean {
            return this._canmatching;
        }

        /** 匹配房间计时 */
        private MatchCountdwon() {
            if (++this.martchCurrTime > this.martchTotleTime) {
                this.btn_matching.label = "匹配";
                this.tx_martch_time.text = "";
                this.room_list.mouseEnabled = true;
                this.btn_gold.mouseEnabled = true;
                this.btn_diamond.mouseEnabled = true;
                UIManager.Instance.DestroyUI("KickingWarView", [ViewToppestRoot]);
                UIManager.Instance.DestroyUI("KickingPetView", [ViewToppestRoot]);
                Tick.Clear(this, this.MatchCountdwon);
                let roomId: number = 0;
                if (KickingLogic.Instance.roomType == BaseDefine.ItemIdGold) {
                    roomId = this.listGold[this.currentGold].id;
                }
                else if (KickingLogic.Instance.roomType == BaseDefine.ItemIdDiamonds) {
                    roomId = this.listDiamonds[this.currentDiamonds].id
                }
                this.canmatching = true;
                KickingLogic.Instance.PvpMatching(KickingLogic.Instance.roomType, roomId, this.currentVo);
                //停止播放匹配音效
                SoundManager.Instance.OnStopSound("res/sound/match_succese.mp3");
                //播放匹配成功音效
                SoundManager.Instance.OnPlaySound("res/sound/colck.mp3");
            }
            else {
                this.tx_martch_time.text = this.MARTCH_TIME.replace("x", String(this.martchCurrTime));
            }
        }

        /** PVP阵型 */
        private OnOpenPvp() {
            UIManager.Instance.CreateUI("KickingWarView", [ViewToppestRoot, ActionType.kicking]);
        }

        /** 上阵神兽 */
        private OnOpenPet() {
            UIManager.Instance.CreateUI("KickingPetView", [ViewToppestRoot]);
        }

        /** 打开广告 */
        private OnAddNumber(itemId: BaseDefine) {
            if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
                UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.pvp, KickingLogic.Instance.roomType]);
            }
            else {
                TipsLogic.Instance.OpenSystemTips(30071);
                this.btn_add.visible = false;
            }
        }
    }

    class RoomModel {
        public roomName: Laya.Text;
        public money: Laya.Text;
        public imgSelect: Laya.Image;

        constructor(item: Laya.Box) {
            this.roomName = item.getChildByName("room_name") as Laya.Text;
            this.money = item.getChildByName("money") as Laya.Text;
            this.imgSelect = item.getChildByName("img_select") as Laya.Image;
        }

        public set select(value: boolean) {
            this.imgSelect.visible = value;
        }
    }
}