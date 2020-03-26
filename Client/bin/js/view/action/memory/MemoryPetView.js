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
/**副本神兽页面*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("MemoryPetView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
    ]);
    var MemoryPetView = /** @class */ (function (_super) {
        __extends(MemoryPetView, _super);
        function MemoryPetView(buf) {
            var _this = _super.call(this) || this;
            _this._type = buf[1];
            _this.UpdateList();
            _this.SetCurrentPetInfo();
            _this.SetTopPetHit();
            _this.AddEvent();
            return _this;
        }
        MemoryPetView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.CloseHander);
            H52D_Framework.Event.RegistEvent('UpdatePetView', Laya.Handler.create(this, this.UpdateList));
        };
        // 移除事件监听
        MemoryPetView.prototype.Destroy = function () {
            this.offAll();
            //Event.RemoveEvent('UpdatePetView', Laya.Handler.create(this, this.UpdateList));
        };
        MemoryPetView.prototype.CloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewToppestRoot]);
        };
        MemoryPetView.prototype.UpdatePetView = function () {
            this.UpdateList();
            H52D_Framework.PetManager.Instance.SendShowPet(H52D_Framework.MemoryLogic.Instance.GetPetID(this._type));
            this.SetTopPetHit();
        };
        /**设置神兽总伤害加成 */
        MemoryPetView.prototype.SetTopPetHit = function () {
            this.info.on(Laya.Event.CLICK, this, this.PetPlayMethod);
            var petId = H52D_Framework.MemoryLogic.Instance.GetPetID(this._type);
            if (petId == 0) {
                this.petHit.text = "0  神兽伤害";
                this.info.x = 0;
                this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
                return;
            }
            var OwnPetList = H52D_Framework.PetManager.Instance.OwnPetList;
            var pet = OwnPetList[petId];
            var hitValue = pet.GetDamage() * pet.ratio >> 0;
            if (hitValue >= 10000) {
                var str = (hitValue / 10000).toFixed(0);
                this.petHit.text = str + "W  神兽伤害";
            }
            else {
                this.petHit.text = hitValue.toFixed(0) + "  神兽伤害";
            }
            this.info.x = 0;
            this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
        };
        /**设置当前上阵神兽信息 */
        MemoryPetView.prototype.SetCurrentPetInfo = function () {
            var currentId = H52D_Framework.MemoryLogic.Instance.GetPetID(this._type);
            if (currentId == 0) {
                return;
            }
            var pet_tcfg = H52D_Framework.PetConfig[currentId];
            var pet = H52D_Framework.PetManager.Instance.GetPet_Instance(currentId);
            if (pet) {
                var pet_PrimeStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[1][1]].dwName);
                var pet_AuxiliaryStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[2][1]].dwName);
                var primeIsper = H52D_Framework.QualityValue[pet.currentAttribute[1][1]].isper;
                var auxiliaryIsper = H52D_Framework.QualityValue[pet.currentAttribute[2][1]].isper;
                var pet_PrimeValue = pet.currentAttribute[1][2];
                var pet_AuxiliaryValue = pet.currentAttribute[2][2];
                if (pet.currentAttribute[1][1] == 4 && pet_PrimeValue > 10000) {
                    pet_PrimeValue = 10000;
                }
                if (pet.currentAttribute[2][1] == 4 && pet_AuxiliaryValue > 10000) {
                    pet_AuxiliaryValue = 10000;
                }
                var addPethurt = pet_PrimeValue + pet.addCurrentAttribute_1;
                var addHerohurt = pet_AuxiliaryValue + pet.addCurrentAttribute_2;
            }
        };
        /**神兽List赋值 */
        MemoryPetView.prototype.UpdateList = function () {
            var arr = [];
            for (var id in H52D_Framework.PetManager.Instance.OwnPetList) {
                arr.push(Number(id));
            }
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    var qu = void 0;
                    if (H52D_Framework.PetManager.Instance.OwnPetList[arr[i]].petColor > H52D_Framework.PetManager.Instance.OwnPetList[arr[j]].petColor) {
                        qu = arr[i];
                        arr[i] = arr[j];
                        arr[j] = qu;
                    }
                }
            }
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    var lv = void 0;
                    if (H52D_Framework.PetManager.Instance.OwnPetList[arr[i]].Level < H52D_Framework.PetManager.Instance.OwnPetList[arr[j]].Level &&
                        H52D_Framework.PetManager.Instance.OwnPetList[arr[i]].petColor == H52D_Framework.PetManager.Instance.OwnPetList[arr[j]].petColor) {
                        lv = arr[i];
                        arr[i] = arr[j];
                        arr[j] = lv;
                    }
                }
            }
            this.Pet_list.array = arr;
            this.Pet_list.vScrollBarSkin = "";
            this.Pet_list.renderHandler = new Laya.Handler(this, this.Pethandle);
        };
        MemoryPetView.prototype.Pethandle = function (item, index) {
            var ID = Number(this.Pet_list.array[index]);
            var pet = H52D_Framework.PetManager.Instance.OwnPetList[ID];
            var pet_name = item.getChildByName("Pet_name");
            var pet_lv = item.getChildByName("Pet_lv");
            var pet_icon = item.getChildByName("Pet_icon");
            var pet_icon_bg = item.getChildByName("pet_icon_bg");
            var pet_info = pet_icon.getChildByName("Pet_info");
            var pet_hurt = item.getChildByName("pet_hurt");
            var hero_hurt = item.getChildByName("hero_hurt");
            var choice = item.getChildByName("choice");
            var click = item.getChildByName("click");
            var point = item.getChildByName("point");
            pet_name.text = pet.petName;
            pet_name.color = H52D_Framework.BaseDefine.PetColor_label[pet.petColor];
            pet_lv.text = pet.Level + "";
            pet_icon.skin = "ui_icon/" + pet.strPetIcon;
            pet_icon_bg.skin = H52D_Framework.BaseDefine.QualityList[pet.petColor];
            var pet_PrimeStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[1][1]].dwName);
            var pet_AuxiliaryStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[2][1]].dwName);
            var primeIsper = H52D_Framework.QualityValue[pet.currentAttribute[1][1]].isper;
            var auxiliaryIsper = H52D_Framework.QualityValue[pet.currentAttribute[2][1]].isper;
            var pet_PrimeValue = pet.currentAttribute[1][2];
            var pet_AuxiliaryValue = pet.currentAttribute[2][2];
            if (pet.currentAttribute[1][1] == 4 && pet_PrimeValue > 10000) {
                pet_PrimeValue = 10000;
            }
            if (pet.currentAttribute[2][1] == 4 && pet_AuxiliaryValue > 10000) {
                pet_AuxiliaryValue = 10000;
            }
            pet_hurt.text = primeIsper = 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
            hero_hurt.text = auxiliaryIsper = 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;
            choice.visible = H52D_Framework.MemoryLogic.Instance.GetPetID(this._type) == pet.ID;
            click.on(Laya.Event.CLICK, this, this.ChoiceCurrentPet, [ID]);
            point.visible = H52D_Framework.PetManager.Instance.IsNewPet(ID);
            pet_icon.on(Laya.Event.CLICK, this, this.OpenInfoView, [ID]);
        };
        MemoryPetView.prototype.ChoiceCurrentPet = function (id) {
            if (H52D_Framework.MemoryLogic.Instance.GetPetID(this._type) != 0)
                H52D_Framework.PetManager.Instance.OwnPetList[H52D_Framework.MemoryLogic.Instance.GetPetID(this._type)].CurrentState = 0;
            H52D_Framework.PetManager.Instance.OwnPetList[id].CurrentState = 1;
            if (H52D_Framework.MemoryLogic.Instance.GetPetID(this._type) != id) {
                this.SetCurrentPetInfo();
                H52D_Framework.MemoryLogic.Instance.K_ReqCopyUsePet(this._type, id);
            }
        };
        MemoryPetView.prototype.PetPlayMethod = function () {
            var title = "神兽";
            var content = H52D_Framework.GetInfoAttr.Instance.GetText(5000);
            H52D_Framework.UIManager.Instance.CreateUI("TipsActionView", [H52D_Framework.ViewToppestRoot, title, content]);
        };
        /**
         * 打开神兽tips
         */
        MemoryPetView.prototype.OpenInfoView = function (nID) {
            H52D_Framework.PetManager.Instance.SendShowPet(nID);
            H52D_Framework.UIManager.Instance.CreateUI("TipsTreasureView", [H52D_Framework.ViewToppestRoot, 0, nID, 0, 0, 0, "神兽详情", OpenType.ePet]);
        };
        MemoryPetView.prototype.ClickPetUp = function () {
            var len = this.Pet_list.array.length;
            if (len < 1)
                return;
            var pet_id = this.Pet_list.array[0];
            this.ChoiceCurrentPet(pet_id);
            H52D_Framework.PetManager.Instance.K_ReqUsePet(pet_id);
        };
        return MemoryPetView;
    }(ui.action.memory.MemoryPetViewUI));
    H52D_Framework.MemoryPetView = MemoryPetView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryPetView.js.map