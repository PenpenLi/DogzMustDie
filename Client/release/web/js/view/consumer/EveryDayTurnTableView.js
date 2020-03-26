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
/**
* 转盘
*/
var H52D_Framework;
(function (H52D_Framework) {
    var EveryDayTurntableView = /** @class */ (function (_super) {
        __extends(EveryDayTurntableView, _super);
        function EveryDayTurntableView(buf) {
            var _this = _super.call(this) || this;
            _this.angle = 0;
            //免费次数
            _this.freeNum = 0;
            //倒计时更新的时间
            _this.updataTimer = 0;
            _this._turnNumObjAll = [5, 10, 50, 70, 100];
            //每格需再抽次数
            _this._turnNumObj = [5, 5, 40, 20, 30];
            //每格长度
            _this._turnLengthObj = [41, 174, 117, 143, 121];
            _this.updataTimer = Math.ceil(H52D_Framework.EveryDayTurntable.Instance.EndTime - H52D_Framework.Time.serverSecodes);
            H52D_Framework.Tick.Loop(1000, _this, _this.UpdataTimer);
            _this.turnOneBtn.disabled = false;
            _this.turnTenBtn.disabled = false;
            _this.xuanxiangImg.visible = false;
            _this.titlestr.text = H52D_Framework.CStrValueConfig.Inst.GetText(7141, [H52D_Framework.EveryDayTurntable.Instance.Discount * 10]); //描述
            _this.AddEvent();
            _this.RefNum();
            _this.ShowData();
            _this.UpdataTimer();
            return _this;
        }
        /**
         * 添加事件
         */
        EveryDayTurntableView.prototype.AddEvent = function () {
            this.turnOneBtn.on(Laya.Event.CLICK, this, this.TurnOne);
            this.turnTenBtn.on(Laya.Event.CLICK, this, this.TurnTen);
            this.recordBtn.on(Laya.Event.CLICK, this, this.Record);
            H52D_Framework.Event.RegistEvent("RefTurnTable", Laya.Handler.create(this, this.RefNum));
            H52D_Framework.Event.RegistEvent("updataTurnTable", Laya.Handler.create(this, this.ShowData));
            H52D_Framework.Event.RegistEvent("TurnTableYAOYIYAO", Laya.Handler.create(this, this.TurnData));
        };
        EveryDayTurntableView.prototype.RefNum = function () {
            this.Init();
            this.ShowInit();
        };
        EveryDayTurntableView.prototype.Init = function () {
            this._oneMoney = H52D_Framework.EveryDayTurntable.Instance.OneCost;
            this._tenMoney = H52D_Framework.EveryDayTurntable.Instance.TenCost * H52D_Framework.EveryDayTurntable.Instance.Discount;
            this.freeNum = H52D_Framework.EveryDayTurntable.Instance.FreeNum;
        };
        EveryDayTurntableView.prototype.ShowInit = function () {
            this.oneNeedNum.text = this._oneMoney + "";
            this.tenNeedNum.text = this._tenMoney + "";
            this.turnOneLab.text = "抽一次";
            this.diamond1.visible = true;
            if (this.freeNum > 0) {
                this.turnOneLab.text = "免费抽取";
                this.diamond1.visible = false;
                this.oneNeedNum.text = "";
            }
        };
        /**
         * 转一次
         */
        EveryDayTurntableView.prototype.TurnOne = function () {
            if (this.freeNum > 0) {
                H52D_Framework.EveryDayTurntable.Instance.K_BuyChargeAward(1);
                return;
            }
            if (this._oneMoney <= H52D_Framework.BagManager.Instance.getItemNumber(2)) {
                H52D_Framework.EveryDayTurntable.Instance.K_BuyChargeAward(1);
            }
            else {
                if (H52D_Framework.IsShieldRecharge()) {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(H52D_Framework.CStrValueConfig.Inst.GetSysText(30059));
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(H52D_Framework.CStrValueConfig.Inst.GetSysText(10009), Laya.Handler.create(this, this.OpenRecharge), Laya.Handler.create(this, this.CloseMessage));
                }
            }
        };
        /**
         * 转十次
         */
        EveryDayTurntableView.prototype.TurnTen = function () {
            if (this.freeNum >= 10) {
                H52D_Framework.EveryDayTurntable.Instance.K_BuyChargeAward(1);
                return;
            }
            if (this._tenMoney <= H52D_Framework.BagManager.Instance.getItemNumber(2)) {
                H52D_Framework.EveryDayTurntable.Instance.K_BuyChargeAward(10);
            }
            else {
                if (H52D_Framework.IsShieldRecharge()) {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(H52D_Framework.CStrValueConfig.Inst.GetSysText(30059));
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(H52D_Framework.CStrValueConfig.Inst.GetSysText(10009), Laya.Handler.create(this, this.OpenRecharge), Laya.Handler.create(this, this.CloseMessage));
                }
            }
        };
        /**抽奖记录 */
        EveryDayTurntableView.prototype.Record = function () {
            H52D_Framework.UIManager.Instance.CreateUI("RecordListView", [H52D_Framework.ViewToppestRoot]);
        };
        /**
         * 领取额外奖励
         */
        EveryDayTurntableView.prototype.OnLingqv = function (id) {
            H52D_Framework.EveryDayTurntable.Instance.K_GetActivityAwardReq(id);
        };
        /**
         * 获取剩余时间
         */
        EveryDayTurntableView.prototype.UpdataTimer = function () {
            this.timeDelay.text = H52D_Framework.GetFormatTime(this.updataTimer);
            this.updataTimer--;
        };
        /**
         * 弹出充值界面(商城)
         */
        EveryDayTurntableView.prototype.OpenRecharge = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ActiveBgView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
        };
        /**
         * 关闭弹窗的方法
         */
        EveryDayTurntableView.prototype.CloseMessage = function () {
        };
        /**
         * 请求结果
         */
        EveryDayTurntableView.prototype.TurnData = function () {
            var _this = this;
            // 抽到的礼包
            this.turnData = H52D_Framework.EveryDayTurntable.Instance.GiftItemData;
            // 后台传过来 ，抽中第几个礼物
            var index = H52D_Framework.EveryDayTurntable.Instance.GetIndexGift();
            this.angle = H52D_Framework.EveryDayTurntable.Instance.TableAngle;
            //抽奖次数
            this._turnNum = H52D_Framework.EveryDayTurntable.Instance.GetTurnNum;
            if (index != 0) {
                // 计算出现在 要达到的点相对与0点的距离
                var indexAngle = (Number(this.turnData[1][1]) - 1) * 36 - Number(this.angle % 360);
                H52D_Framework.EveryDayTurntable.Instance.TableAngle = this.angle + 3600 + indexAngle;
                //选择框
                this.xuanxiangImg.visible = false;
                this.xuanxiangImg.rotation = (Number(this.turnData[1][1]) - 1) * 36;
                //按钮
                this.turnOneBtn.disabled = true;
                this.turnTenBtn.disabled = true;
                H52D_Framework.OneTimer(4000, function () {
                    if (_this.destroyed) {
                        return;
                    }
                    _this.turnOneBtn.disabled = false;
                    _this.turnTenBtn.disabled = false;
                });
                // 转盘缓动
                var _rotation = this.angle + 3600 + indexAngle;
                Laya.Tween.to(this.zhizhenImg, { rotation: _rotation }, 4000, Laya.Ease.expoInOut, Laya.Handler.create(this, function () {
                    // 记录并 储存转完以后的角度
                    _this.zhizhenImg.rotation %= 360;
                    _this.angle = _this.zhizhenImg.rotation;
                    H52D_Framework.EveryDayTurntable.Instance.TableAngle = _this.zhizhenImg.rotation;
                    _this.xuanxiangImg.visible = true;
                    // this.turnOneBtn.disabled = false;
                    // this.turnTenBtn.disabled = false;
                    if (index == 1) {
                        H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(H52D_Framework.EveryDayTurntable.Instance.ShowGift);
                    }
                    else if (index > 2) {
                        // 十连抽弹面板
                        H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(H52D_Framework.EveryDayTurntable.Instance.ShowGiftMore, true);
                    }
                }));
            }
        };
        /**
         * 面板信息
         */
        EveryDayTurntableView.prototype.ShowData = function () {
            // 同步现在的角度
            this.angle = H52D_Framework.EveryDayTurntable.Instance.TableAngle;
            this.zhizhenImg.rotation = H52D_Framework.EveryDayTurntable.Instance.TableAngle;
            var award = H52D_Framework.EveryDayTurntable.Instance.AwardData;
            var num = 0;
            for (var i in H52D_Framework.EveryDayTurntable.Instance.GiftData) {
                num++;
            }
            // 转盘奖励列表
            for (var i = 0; i < award.length; i++) {
                var _itemInfo = H52D_Framework.ItemConfig[award[i]["itemid"]];
                var _itemNum = award[i]["itemnum"];
                var _itemName = H52D_Framework.GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);
                ;
                var _itemIcon = "ui_icon/" + _itemInfo.strIconID_B;
                this["numLab" + String(i + 1)].text = _itemNum + " " + _itemName;
                this["Img" + String(i + 1)].skin = _itemIcon;
            }
        };
        EveryDayTurntableView.prototype.BoxGiftShow = function () {
            for (var i = 1; i <= 5; i++) {
                this['boxRed' + i].visible = false;
            }
        };
        /**抽奖次数奖励展示:length=600 */
        EveryDayTurntableView.prototype.TurnNumGiftShow = function () {
            //进度条状态
            var _length = 0;
            if (this._turnNum < 5) {
                _length = (this._turnLengthObj[0] / 5) * this._turnNum;
            }
            else if (this._turnNum >= 100) {
                _length = 600;
            }
            else {
                for (var i in this._turnNumObjAll) {
                    if (this._turnNum >= this._turnNumObjAll[i]) {
                        _length += this._turnLengthObj[i]; //后面的进度条
                        if (this._turnNum > this._turnNumObjAll[i] && this._turnNum < this._turnNumObjAll[i + 1]) {
                            var _spareNum = this._turnNum - this._turnNumObjAll[i]; //多出来几个
                            var _length0 = (this._turnLengthObj[i + 1] / this._turnNumObj[i + 1]) * _spareNum;
                            _length += _length0;
                        }
                    }
                }
            }
            this.progressBar.width = _length;
            //宝箱状态
            for (var i in this._turnNumObjAll) {
                if (this._turnNum >= this._turnNumObjAll[i]) {
                    this['box' + (Number(i) + 1)]; //可领
                }
            }
        };
        /**
         * 事件界面销毁
         */
        EveryDayTurntableView.prototype.Destroy = function () {
            this.offAll();
            Laya.Tween.clearAll(this);
            H52D_Framework.Event.RemoveEvent("RefTurnTable", Laya.Handler.create(this, this.RefNum));
            H52D_Framework.Event.RemoveEvent("updataTurnTable", Laya.Handler.create(this, this.ShowData));
            H52D_Framework.Event.RemoveEvent("TurnTableYAOYIYAO", Laya.Handler.create(this, this.TurnData));
        };
        return EveryDayTurntableView;
    }(ui.consumer.EveryDayTurnTableUI));
    H52D_Framework.EveryDayTurntableView = EveryDayTurntableView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EveryDayTurnTableView.js.map