module H52D_Framework {
    export class ItemData {
        private _cfgId: number = 0          // 配置ID
        private _instId: string = ""        // 实例ID
        private _num: number = 0            // 数量
        private _holder: number = 0         // 容器类型
        private _slot: number = 0           // 物品位置
        private _cfgData: any = null        // 配置数据
        private _qulityValue: any = null    // 属性值配置表
        private _type: number = 0           // 类型
        /**
         * @biref 构造函数
         * @param Param 物品数据或配置ID
         * 随机属性
         */
        constructor(Param, type?: number, instId?: string, num?: number) {
            /** 兼容机制 */
            if (typeof (Param) == "number") {
                this._instId = instId;
                this._num = num;
                this._type = type;
                this.cfgId = Param;
            } else {
                this.unpackData(Param)
            }

        }

        /** 解析服务器数据 */
        public unpackData(itemData) {
            // 接收数据
            this._instId = itemData[2]  // 实例ID
            this._num = itemData[3]  // 叠加个数
            this._holder = itemData[4]  // 容器类型
            this._slot = itemData[5]  // 容器类型
            this.cfgId = itemData[1]  // 配置ID

        }

        /**
         * 获取配置ID
         */
        public get cfgId(): number {
            return this._cfgId;
        }


        /** 设置配置ID */
        public set cfgId(cfgId: number) {
            this._cfgId = cfgId

            if (this._type == BaseDefine.ItemTypePro) {
                this._cfgData = ItemConfig[this._cfgId]
            } else if (this._type == BaseDefine.ItemTypeEquip) {
                this._cfgData = EquipConfig[this._cfgId];
            } else if (this._type == BaseDefine.ItemTypePet) {
                this._cfgData = PetConfig[this._cfgId];
            }
            // 获取配置信息
            if (!this._cfgData) {
                Debugger.LogError("错误的配置ID-->" + String(this._cfgId));
                return;
            }

            this._qulityValue = QualityValue;
            if (!this._qulityValue) {
                Debugger.LogError("读取不到正确的属性配置表-->");
            }
        }

        /**
         * 获取实例ID
         */
        public get instId(): string {
            return this._instId;
        }
        public get type() {
            return this._type;
        }

        public set num(val: number) {
            this._num = val;
        }

        /** 获取容器类型 */
        public get holder() {
            return this._holder
        }

        /**
         * 获取数量
         */
        public get num(): number {
            return this._num;
        }

        /** 设置位置 */
        public setPosInfo(holder, slot) {
            this._holder = holder  // 容器类型
            this._slot = slot  // 容器类型
        }
        /**
         * 是否是物品
         */
        public get isProp(): boolean {
            return this._cfgData.dwItemType == 1;
        }
        /**
         * 获取名称
         */
        public get name(): string {
            if (this._cfgData) {
                if (this._type == BaseDefine.ItemTypePro) {
                    return GetInfoAttr.Instance.GetText(this._cfgData.dwItemName) ? GetInfoAttr.Instance.GetText(this._cfgData.dwItemName) : '';
                } else if (this._type == BaseDefine.ItemTypeEquip) {
                    return GetInfoAttr.Instance.GetText(this._cfgData.equipName) ? GetInfoAttr.Instance.GetText(this._cfgData.equipName) : '';
                } else if (this._type == BaseDefine.ItemTypePet) {
                    return GetInfoAttr.Instance.GetText(this._cfgData.petName) ? GetInfoAttr.Instance.GetText(this._cfgData.petName) : '';
                }


            } else {
                return " ";
            }
        }

        /**
         * 获取图片资源路径
         */
        public get icon(): string {
            if (this._cfgData) {
                if (this._type == BaseDefine.ItemTypePro) {
                    return this._cfgData.strIconID_B;
                } else if (this._type == BaseDefine.ItemTypeEquip) {
                    return this._cfgData.equipIcon;
                } else if (this._type == BaseDefine.ItemTypePet) {
                    return this._cfgData.strPetIcon;
                }

            } else {
                return "icon_shili.png";
            }
        }

        /**
         * 获取类型
         */
        public get itemType(): number {
            if (this._type == BaseDefine.ItemTypePro) {
                return this._cfgData.dwItemType;
            }
        }

        /**
         * 获取子类型
         */
        public get itemTypes(): number {
            return this._cfgData.dwItemTypes;
        }

        /**
         * 获取等级需求 bug
         */
        public get useLevel(): number {
            if (this._cfgData)
                return this._cfgData.dwUseCondition;
            else
                return 0;
        }

        /**
         * 获取道具描述
         */
        public get itemState(): string {

            return GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) ? GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) : '';
        }

        /**
         * 获取品质对应的颜色值
         */
        public get color(): string {
            if (this._type == BaseDefine.ItemTypePro) {
                return this._cfgData.dwItemQuality;
            } else if (this._type == BaseDefine.ItemTypeEquip) {
                return this._cfgData.equipColor;
            } else if (this._type == BaseDefine.ItemTypePet) {
                return this._cfgData.petColor;
            }
        }

        public GetColorStr():string
        {
             if (this._type == BaseDefine.ItemTypePro) {
                return BaseDefine.LabelColor1[this._cfgData.dwItemQuality];
            } else if (this._type == BaseDefine.ItemTypeEquip) {
                 return BaseDefine.LabelColor1[this._cfgData.equipColor];
            } else if (this._type == BaseDefine.ItemTypePet) {
                return BaseDefine.LabelColor1[this._cfgData.petColor];
            }
        }

        /**
         * 获取道具描述
         */
        public get itemDesc()//道具描述
        {
            if (GetInfoAttr.Instance.GetText) {
                return GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) ? GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) : '';
            }
            else {
                return "";
            }
        }

        /**基础属性 */
        public get tbQualPro() {
            return this._cfgData.dwUseEffect;
        }
    }
}