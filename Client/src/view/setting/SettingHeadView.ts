module H52D_Framework {
    AddViewResource("SettingHeadView",
        [
            { url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
        ]);
	/**
	 * @class 设置页面
	 * @author zhangyusong 
	 **/
    export class SettingHeadView extends ui.setting.SettingHeadViewUI {

        private defaultId: number;
        private defaultIndex: number;
        private voList: Array<HeadVo>;

        constructor(defaultVo: any) {
            super();
            this.defaultId = defaultVo[1];
            this.ViewInit();
            this.EventInit();
        }

        private ViewInit() {
            this.InitHeadList();
            this.warehouse.vScrollBarSkin = "";

            for(let i in this.voList){
                if (this.voList[i].headSelect) {
                    this.defaultIndex = Number(i);
                }
            }
            this.warehouse.renderHandler = new Laya.Handler(this, this.WarehouseHandler);
            this.warehouse.array = this.voList;
        }

        private EventInit() {
            this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_close"]);
            this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_ok"]);
        }

        private OnBtnClick(btnName: string) {
            switch (btnName) {
                case "btn_ok":      //确认
                    if (this.defaultId != this.voList[this.defaultIndex].headId) {
                        RemoteCall.Instance.Send("K_ChgHeadID", this.voList[this.defaultIndex].headId);
                        break;
                    }
                case "btn_close":   //关闭
                    UIManager.Instance.DestroyUI("SettingHeadView", [ViewUpRoot]);
                    break;
            }
        }

        /** 头像信息列表初始化 */
        private InitHeadList() {
            this.voList = new Array<HeadVo>();
            let hvo: HeadVo = new HeadVo();
            hvo.headId = 0;
            hvo.headRes = "ui_head/icon_ui_01.png";
            hvo.headSelect = hvo.headId == this.defaultId;
            hvo.headUse = hvo.headId == this.defaultId;
            this.voList.push(hvo);

            let heroHead: Array<number> = HeroManager.Instance.GetCfgHeroList();
            for (let i: number = 0; i < heroHead.length; i++) {
                let nHeroID = heroHead[i];
                let bActive = HeroManager.Instance.IsActive(nHeroID);
                if (bActive) {
                    let hvo: HeadVo = new HeadVo();
                    hvo.headId = nHeroID;
                    hvo.headRes = "ui_icon/" + HeroConfig[nHeroID].strIcon;
                    hvo.headSelect = nHeroID == this.defaultId;
                    hvo.headSelect = hvo.headId == this.defaultId;
                    hvo.headUse = hvo.headId == this.defaultId;
                    this.voList.push(hvo);
                }
            }
        }

        /** 头像库初始化 */
        private WarehouseHandler(item: Laya.Box, index: number) {
            (item.getChildByName("img_select") as Laya.Image).visible = this.voList[index].headSelect;
            (item.getChildByName("img_head") as Laya.Image).skin = this.voList[index].headRes;
            (item.getChildByName("img_use") as Laya.Image).visible = this.voList[index].headUse;
            item.offAll();
            item.on(Laya.Event.CLICK, this, this.OnSelect, [item,index]);
        }

        private OnSelect(item: Laya.Box, index: number) {
            //播放选择音效
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this.defaultIndex != index) {
                for(let i in this.voList){
                    if (Number(i) == this.defaultIndex) {
                        this.voList[i].headSelect = false;
                    }
                    if(Number(i) == index){
                        this.voList[i].headSelect = true;
                    }
                }
                this.defaultIndex = index;

                this.warehouse.array = this.voList;
            }
        }

    }
}