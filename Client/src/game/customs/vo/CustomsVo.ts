module H52D_Framework {
    export class CustomsVo {
        /** 副本ID */
        private _customsId: number;
        /** 配置 */
        private _cfg = null;

        /** 记录第几波 */
        public waveOrder: number;

        /** 怪物位置-波-怪 */
        public monstorPosition: { [wave: number]: { [monster: number]: number } };

        public constructor(id: number, waveOrder: number) {
            this.customsId = id;
            this.waveOrder = waveOrder;
        }

        public set customsId(nCustomsID: number) {
            this._customsId = nCustomsID;

            this._cfg = CustomspassConfig[nCustomsID];
            let mpdata: Object = this._cfg["monstorPosition"];
            this.monstorPosition = {};
            for (let w in mpdata) {
                this.monstorPosition[w] = {};//这里放置1波怪
                for (let m in mpdata[w]) {
                    this.monstorPosition[w][Number(mpdata[w][m][1])] = Number(mpdata[w][m][2]);
                }
            }
            // Wx.aldSendEvent("玩家闯关", {
            //     "关卡": this._customsId + "关",
            //     "波数": this.waveOrder + "波"
            // })
        }

        /** 副本ID */
        public get customsId(): number {
            return this._customsId;
        }

        /** 共几波 */
        public get waveNum(): number {
            let num: number = 0;
            for (let i in this._cfg.monstorPosition) {
                num++;
            }
            return num;
        }

        /** 第几关 */
        public get customsOrder(): number {
            return this._cfg.customsOrder
        }

        /** 场景ID */
        public get sceneID(): number {
            return this._cfg.sceneID
        }

        /** 副本图标 */
        public get strCustomsIcon(): string {
            return this._cfg.strCustomsIcon
        }

        /** 副本类型 */
        public get customsType(): Customs_Type {
            return this._cfg.dunType;
        }

        /** 波次持续时间，大boss用 */
        public get waveTime(): number {
            return this._cfg.waveTime
        }

        /** 通关奖励，每波怪都有 */
        public get waveRewardID(): number {
            return this._cfg.waveRewardID
        }

        /** 通关额外奖励*/
        public get extraRewardID(): number {
            return this._cfg.extraRewardID
        }

        /**可合成装备等级 */
        public get composeEquipLevel(): number {
            return this._cfg.composeEquipLevel
        }

        /** 旁白ID */
        public get aside(): number {
            return this._cfg.aside
        }

        /** 旁白ID，场景前 */
        public get asideB(): number {
            return this._cfg.asideb
        }

        /** 百度小贴士 */
        public get tie() {
            return this._cfg.tips;
        }
    }

}