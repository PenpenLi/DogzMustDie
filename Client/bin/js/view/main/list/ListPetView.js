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
/**神兽页面*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ListPetView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ListPetView = /** @class */ (function (_super) {
        __extends(ListPetView, _super);
        function ListPetView() {
            var _this = _super.call(this) || this;
            //private pet: { [id: number]: BPetVo } = {};
            /**当前神兽ID */
            _this._currentPetID = 0;
            _this.time = 0;
            _this.bGuidanceButton = true;
            _this.Init();
            _this.AddEvent();
            _this.ChangeListHigth();
            return _this;
        }
        ListPetView.prototype.Init = function () {
            this.UpdateList();
            this.SetAgeTime();
            this.SetCurrentPetInfo();
            this.SetTopPetHit();
        };
        ListPetView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent('SetAgeTime', Laya.Handler.create(this, this.SetAgeTime));
            H52D_Framework.Event.RegistEvent('PetInit', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RegistEvent('ClickPetUp', Laya.Handler.create(this, this.ClickPetUp));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
        };
        // 移除事件监听
        ListPetView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('SetAgeTime', Laya.Handler.create(this, this.SetAgeTime));
            H52D_Framework.Event.RemoveEvent('PetInit', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RemoveEvent('ClickPetUp', Laya.Handler.create(this, this.ClickPetUp));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
        };
        ListPetView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                this.Pet_list.height = 170 * G_StageHeightScale;
            }
            else {
                this.Pet_list.height = (932 - wxsclae) * G_StageHeightScale;
            }
        };
        /**设置神兽总伤害加成 */
        ListPetView.prototype.SetTopPetHit = function () {
            this.info.on(Laya.Event.CLICK, this, this.PetPlayMethod);
            if (H52D_Framework.PetManager.Instance.CurrentpetID == 0) {
                this.petHit.text = "神兽伤害  0";
                this.info.x = 0;
                this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
                return;
            }
            var OwnPetList = H52D_Framework.PetManager.Instance.OwnPetList;
            var pet = OwnPetList[H52D_Framework.PetManager.Instance.CurrentpetID];
            var hitValue = pet.attr.GetAttributeValue(2) * pet.ratio >> 0;
            if (hitValue >= 10000) {
                var str = (hitValue / 10000).toFixed(0);
                this.petHit.text = "神兽伤害  " + str + "W";
            }
            else {
                this.petHit.text = "神兽伤害  " + hitValue.toFixed(0);
            }
            this.info.x = this.petHit.textWidth + 30;
        };
        /**设置孵化 时间及次数 */
        ListPetView.prototype.SetAgeTime = function () {
            this.time = H52D_Framework.PetManager.Instance.NextUpdateTime - H52D_Framework.Time.serverSecodes;
            var tims = H52D_Framework.PetManager.Instance.HasTimes;
            var maxTims = H52D_Framework.GameParamConfig['HatchMaxNum'];
            H52D_Framework.Tick.Clear(this, this.SetTime);
            if (this.time <= 0) {
                this.time = 0;
            }
            this.Has_num.text = "X" + tims;
            this.UpdateTime.text = "孵化时间：" + H52D_Framework.GetFormatNumTime(this.time);
            H52D_Framework.Tick.Loop(1000, this, this.SetTime);
            if (tims == maxTims) {
                H52D_Framework.Tick.Clear(this, this.SetTime);
                this.UpdateTime.text = "次数已上限";
                return;
            }
        };
        ListPetView.prototype.SetTime = function () {
            this.time--;
            if (this.time <= 0) {
                this.time = 0;
                H52D_Framework.Tick.Clear(this, this.SetTime);
            }
            this.UpdateTime.text = "孵化时间：" + H52D_Framework.GetFormatNumTime(this.time);
        };
        /**设置当前上阵神兽信息 */
        ListPetView.prototype.SetCurrentPetInfo = function () {
            var currentId = H52D_Framework.PetManager.Instance.CurrentpetID;
            if (currentId == 0) {
                this.Pet_iconbg.visible = false;
                return;
            }
            this.Pet_iconbg.visible = true;
            var pet_tcfg = H52D_Framework.PetConfig[currentId];
            var pet = H52D_Framework.PetManager.Instance.GetPet_Instance(currentId);
            if (pet) {
                this.Pet_name.text = pet.petName;
                this.Pet_name.color = H52D_Framework.BaseDefine.PetColor_label[pet.petColor];
                this.Pet_lv.text = pet.Level + "";
                this.Pet_icon.skin = "ui_icon/" + pet.strPetIcon;
                this.Pet_iconbg.skin = H52D_Framework.BaseDefine.QualityList[pet.petColor];
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
                this.add_pethurt.text = primeIsper == 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
                this.add_herohurt.text = auxiliaryIsper == 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;
                this.add_nexthurt_pet.text = primeIsper == 0 ? "+" + addPethurt + pet_PrimeStr : "x" + addPethurt / 100 + "%" + pet_PrimeStr;
                this.add_nexthurt_hero.text = auxiliaryIsper == 0 ? "+" + addHerohurt + pet_AuxiliaryStr : "x" + addHerohurt / 100 + "%" + pet_AuxiliaryStr;
            }
        };
        /**神兽List赋值 */
        ListPetView.prototype.UpdateList = function () {
            //this.pet = PetManager.Instance.OwnPetList;
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
        ListPetView.prototype.Pethandle = function (item, index) {
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
            pet_hurt.text = primeIsper == 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
            hero_hurt.text = auxiliaryIsper == 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;
            choice.visible = H52D_Framework.PetManager.Instance.CurrentpetID == pet.ID;
            click.on(Laya.Event.CLICK, this, this.ChoiceCurrentPet, [ID]);
            point.visible = H52D_Framework.PetManager.Instance.IsNewPet(ID);
            pet_icon.on(Laya.Event.CLICK, this, this.OpenInfoView, [ID]);
            //引导按钮
            if (index == 0 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_9, click);
                this.bGuidanceButton = false;
            }
        };
        ListPetView.prototype.Close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("MainPetView", [H52D_Framework.ViewUpRoot]);
        };
        ListPetView.prototype.ChoiceCurrentPet = function (id) {
            if (H52D_Framework.PetManager.Instance.CurrentpetID != 0)
                H52D_Framework.PetManager.Instance.OwnPetList[H52D_Framework.PetManager.Instance.CurrentpetID].CurrentState = 0;
            H52D_Framework.PetManager.Instance.OwnPetList[id].CurrentState = 1;
            if (H52D_Framework.PetManager.Instance.CurrentpetID != id) {
                this.SetCurrentPetInfo();
                H52D_Framework.PetManager.Instance.K_ReqUsePet(id);
            }
            H52D_Framework.PetManager.Instance.CurrentpetID = id;
            this.UpdateList();
            H52D_Framework.PetManager.Instance.SendShowPet(id);
        };
        ListPetView.prototype.PetPlayMethod = function () {
            var title = "神兽";
            var content = H52D_Framework.GetInfoAttr.Instance.GetText(5000);
            H52D_Framework.UIManager.Instance.CreateUI("TipsActionView", [H52D_Framework.ViewToppestRoot, title, content]);
            //点击按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /**
         * 打开神兽tips
         */
        ListPetView.prototype.OpenInfoView = function (nID) {
            H52D_Framework.PetManager.Instance.SendShowPet(nID);
            H52D_Framework.UIManager.Instance.CreateUI("TipsTreasureView", [H52D_Framework.ViewToppestRoot, 0, nID, 0, 0, 0, "神兽详情", OpenType.ePet]);
        };
        ListPetView.prototype.ClickPetUp = function () {
            var len = this.Pet_list.array.length;
            if (len < 1)
                return;
            var pet_id = this.Pet_list.array[0];
            this.ChoiceCurrentPet(pet_id);
            H52D_Framework.PetManager.Instance.K_ReqUsePet(pet_id);
        };
        return ListPetView;
    }(ui.main.list.ListPetViewUI));
    H52D_Framework.ListPetView = ListPetView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListPetView.js.map