var H52D_Framework;
(function (H52D_Framework) {
    var ItemData = /** @class */ (function () {
        /**
         * @biref 构造函数
         * @param Param 物品数据或配置ID
         * 随机属性
         */
        function ItemData(Param, type, instId, num) {
            this._cfgId = 0; // 配置ID
            this._instId = ""; // 实例ID
            this._num = 0; // 数量
            this._holder = 0; // 容器类型
            this._slot = 0; // 物品位置
            this._cfgData = null; // 配置数据
            this._qulityValue = null; // 属性值配置表
            this._type = 0; // 类型
            /** 兼容机制 */
            if (typeof (Param) == "number") {
                this._instId = instId;
                this._num = num;
                this._type = type;
                this.cfgId = Param;
            }
            else {
                this.unpackData(Param);
            }
        }
        /** 解析服务器数据 */
        ItemData.prototype.unpackData = function (itemData) {
            // 接收数据
            this._instId = itemData[2]; // 实例ID
            this._num = itemData[3]; // 叠加个数
            this._holder = itemData[4]; // 容器类型
            this._slot = itemData[5]; // 容器类型
            this.cfgId = itemData[1]; // 配置ID
        };
        Object.defineProperty(ItemData.prototype, "cfgId", {
            /**
             * 获取配置ID
             */
            get: function () {
                return this._cfgId;
            },
            /** 设置配置ID */
            set: function (cfgId) {
                this._cfgId = cfgId;
                if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                    this._cfgData = H52D_Framework.ItemConfig[this._cfgId];
                }
                else if (this._type == H52D_Framework.BaseDefine.ItemTypeEquip) {
                    this._cfgData = H52D_Framework.EquipConfig[this._cfgId];
                }
                else if (this._type == H52D_Framework.BaseDefine.ItemTypePet) {
                    this._cfgData = H52D_Framework.PetConfig[this._cfgId];
                }
                // 获取配置信息
                if (!this._cfgData) {
                    H52D_Framework.Debugger.LogError("错误的配置ID-->" + String(this._cfgId));
                    return;
                }
                this._qulityValue = H52D_Framework.QualityValue;
                if (!this._qulityValue) {
                    H52D_Framework.Debugger.LogError("读取不到正确的属性配置表-->");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "instId", {
            /**
             * 获取实例ID
             */
            get: function () {
                return this._instId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "num", {
            /**
             * 获取数量
             */
            get: function () {
                return this._num;
            },
            set: function (val) {
                this._num = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "holder", {
            /** 获取容器类型 */
            get: function () {
                return this._holder;
            },
            enumerable: true,
            configurable: true
        });
        /** 设置位置 */
        ItemData.prototype.setPosInfo = function (holder, slot) {
            this._holder = holder; // 容器类型
            this._slot = slot; // 容器类型
        };
        Object.defineProperty(ItemData.prototype, "isProp", {
            /**
             * 是否是物品
             */
            get: function () {
                return this._cfgData.dwItemType == 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "name", {
            /**
             * 获取名称
             */
            get: function () {
                if (this._cfgData) {
                    if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                        return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemName) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemName) : '';
                    }
                    else if (this._type == H52D_Framework.BaseDefine.ItemTypeEquip) {
                        return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.equipName) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.equipName) : '';
                    }
                    else if (this._type == H52D_Framework.BaseDefine.ItemTypePet) {
                        return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.petName) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.petName) : '';
                    }
                }
                else {
                    return " ";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "icon", {
            /**
             * 获取图片资源路径
             */
            get: function () {
                if (this._cfgData) {
                    if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                        return this._cfgData.strIconID_B;
                    }
                    else if (this._type == H52D_Framework.BaseDefine.ItemTypeEquip) {
                        return this._cfgData.equipIcon;
                    }
                    else if (this._type == H52D_Framework.BaseDefine.ItemTypePet) {
                        return this._cfgData.strPetIcon;
                    }
                }
                else {
                    return "icon_shili.png";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "itemType", {
            /**
             * 获取类型
             */
            get: function () {
                if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                    return this._cfgData.dwItemType;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "itemTypes", {
            /**
             * 获取子类型
             */
            get: function () {
                return this._cfgData.dwItemTypes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "useLevel", {
            /**
             * 获取等级需求 bug
             */
            get: function () {
                if (this._cfgData)
                    return this._cfgData.dwUseCondition;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "itemState", {
            /**
             * 获取道具描述
             */
            get: function () {
                return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "color", {
            /**
             * 获取品质对应的颜色值
             */
            get: function () {
                if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                    return this._cfgData.dwItemQuality;
                }
                else if (this._type == H52D_Framework.BaseDefine.ItemTypeEquip) {
                    return this._cfgData.equipColor;
                }
                else if (this._type == H52D_Framework.BaseDefine.ItemTypePet) {
                    return this._cfgData.petColor;
                }
            },
            enumerable: true,
            configurable: true
        });
        ItemData.prototype.GetColorStr = function () {
            if (this._type == H52D_Framework.BaseDefine.ItemTypePro) {
                return H52D_Framework.BaseDefine.LabelColor1[this._cfgData.dwItemQuality];
            }
            else if (this._type == H52D_Framework.BaseDefine.ItemTypeEquip) {
                return H52D_Framework.BaseDefine.LabelColor1[this._cfgData.equipColor];
            }
            else if (this._type == H52D_Framework.BaseDefine.ItemTypePet) {
                return H52D_Framework.BaseDefine.LabelColor1[this._cfgData.petColor];
            }
        };
        Object.defineProperty(ItemData.prototype, "itemDesc", {
            /**
             * 获取道具描述
             */
            get: function () {
                if (H52D_Framework.GetInfoAttr.Instance.GetText) {
                    return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.dwItemAState) : '';
                }
                else {
                    return "";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemData.prototype, "tbQualPro", {
            /**基础属性 */
            get: function () {
                return this._cfgData.dwUseEffect;
            },
            enumerable: true,
            configurable: true
        });
        return ItemData;
    }());
    H52D_Framework.ItemData = ItemData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ItemData.js.map